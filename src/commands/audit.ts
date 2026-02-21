import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { HexCodes, ActionItem, convertHexColorToStatus, convertHexColorToStatusEmoji, authenticate } from '../util';

const COLORS = [HexCodes.Blue, HexCodes.Blurple, HexCodes.DarkBlue];

function generateOverdueButton(messageIds: string[]) {
	return new ButtonBuilder()
		.setCustomId(`auditoverdue|${Buffer.concat(messageIds.map(id => { const buf = Buffer.alloc(8); buf.writeBigUInt64BE(BigInt(id)); return buf; })).toString('base64url')}`)
		.setLabel('Send Overdue Reminders')
		.setStyle(ButtonStyle.Danger)
		.setEmoji('⛔')
}

function generateDoneButton(messageIds: string[]) {
	return new ButtonBuilder()
		.setCustomId(`auditpurge|${Buffer.concat(messageIds.map(id => { const buf = Buffer.alloc(8); buf.writeBigUInt64BE(BigInt(id)); return buf; })).toString('base64url') }`)
		.setLabel('Delete Done Items')
		.setStyle(ButtonStyle.Danger)
		.setEmoji('🗑️');
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('audit')
		.setDescription('Audit the actions items in this channel')
		.addStringOption(option =>
			option
				.setName('type')
				.setDescription('The type of audit')
				.setRequired(true)
				.addChoices(
					{ name: 'By Member', value: 'member' },
					{ name: 'By Status', value: 'status' },
			))
		.addIntegerOption(option =>
			option
				.setName('limit')
				.setDescription('The number of messages to check for action items (default 50)')
				.setRequired(false)
				.setMinValue(1)
				.setMaxValue(500)
				.addChoices(
					{ name: "1", value: 1 },
					{ name: "5", value: 5 },
					{ name: "10", value: 10 },
					{ name: "25", value: 25 },
					{ name: "50", value: 50 },
					{ name: "75", value: 75 },
					{ name: "100", value: 100 },
					{ name: "250", value: 250 },
					{ name: "500", value: 500 },
					// { name: "1000", value: 1000 },
			))
		.addBooleanOption(option =>
			option
				.setName('ephemeral')
				.setDescription('Whether or not to make the response private to you')),

	async execute(interaction: ChatInputCommandInteraction) {
		const ephemeral = interaction.options.get('ephemeral')?.value as boolean || false;
		const type = interaction.options.get('type')?.value as 'member' | 'status';
		const limit = interaction.options.get('limit')?.value as number || 50;

		if (!await authenticate(interaction, true)) return await interaction.reply({ content: 'Only an admin can audit action items.', ephemeral: true });

		const channel = await interaction.channel?.fetch();
		let messages = await channel?.messages.fetch({ limit: limit });

		if (!messages) return await interaction.reply({ content: 'Unable to fetch messages.', ephemeral: true });

		messages = messages.filter(message => message.embeds.length > 0 && message.embeds[0].title?.startsWith("Action Item"));

		await interaction.deferReply({ ephemeral });

		if (type === 'member') {
			const data = new Map<string, Omit<ActionItem, 'assignees'>[]>();
			for (const message of messages.values()) {
				const embed = message.embeds[0];
				const assignees = embed.fields[1].value.split(', ').map(id => id.slice(2, -1));
				for (const assignee of assignees) {
					const value = data.get(assignee) || [];
					value.push({
						description: '\n```\n' + (embed.description || 'No description for this action item.') + '\n```',
						deadline: embed.fields[0].value,
						status: convertHexColorToStatusEmoji(embed.color),
						link: message.url,
					});
					data.set(assignee, value);
				}
			}

			const embeds: EmbedBuilder[] = [];
			for (const [assignee, value] of data) {
				const member = await interaction.guild?.members.fetch(assignee);
				const fields = value.map(item => {
					return {
						name: `${item.status} Deadline: ${item.deadline}`,
						value: item.description + 'Link: ' + item.link + '\n\n',
					};
				});
				if (fields.length > 25) fields.splice(25);
				const embed = new EmbedBuilder()
					.setAuthor({ name: 'Action Items for ' + member?.displayName || assignee, iconURL: member?.displayAvatarURL() })
					.setColor(COLORS[embeds.length % COLORS.length])
					.setTimestamp()
					.setFooter({ text: "`Audit may not be able to show all action items" })
					.addFields(...fields);

				embeds.push(embed);
			}

			if (embeds.length > 10) embeds.splice(10);

			const rowBuilder = new ActionRowBuilder<ButtonBuilder>()
				.addComponents([generateOverdueButton(data.values().map(items => items.filter(i => i.status === '🔴')).filter(l => l.length > 0).map(item => item[0].link.split("/").pop()!).filter(v => v.length > 0).toArray()), generateDoneButton(data.values().map(items => items.filter(i => i.status === '🟢')).filter(l => l.length > 0).map(item => item[0].link.split("/").pop()!).filter(v => v.length > 0).toArray())]);

			await interaction.editReply({ embeds, components: [rowBuilder] });
		} else if (type === 'status') {
			const data = new Map<string, Omit<ActionItem, 'status'>[]>();
			for (const message of messages.values()) {
				const embed = message.embeds[0];
				const status = convertHexColorToStatus(embed.color);
				const emoji = convertHexColorToStatusEmoji(embed.color);
				const key = `${emoji} ${status}`;
				const value = data.get(key) || [];
				value.push({
					description: '\n```\n' + (embed.description || 'No description for this action item.') + '\n```',
					deadline: embed.fields[0].value,
					assignees: embed.fields[1].value.split(', ').map(id => id.slice(2, -1)),
					link: message.url,
				});
				data.set(key, value);
			}

			const embeds: EmbedBuilder[] = [];
			for (const [status, value] of data) {
				const fields = value.map(item => {
					return {
						name: `Deadline: ${item.deadline}`,
						value: 'Assignee(s): ' + item.assignees.map(id => `<@${id}>`).join(', ') + item.description + 'Link: ' + item.link + '\n\n',
					};
				});
				if (fields.length > 25) fields.splice(25);
				const embed = new EmbedBuilder()
					.setTitle(`${status}`)
					.setColor(COLORS[embeds.length % COLORS.length])
					.setTimestamp()
					.setFooter({ text: "Audit may not be able to show all action items" })
					.addFields(...fields);

				embeds.push(embed);
			}

			if (embeds.length > 10) embeds.splice(10);

			const rowBuilder = new ActionRowBuilder<ButtonBuilder>()
				.addComponents([generateOverdueButton((data.get(data.keys().find(key => key.includes('🔴')) || '') || []).map(item => item.link.split("/").pop()!)), generateDoneButton((data.get(data.keys().find(key => key.includes('🟢')) || '') || []).map(item => item.link.split("/").pop()!))]);

			await interaction.editReply({ embeds, components: [rowBuilder] });
		}
	},
};