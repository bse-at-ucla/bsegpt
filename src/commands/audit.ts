import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { HexCodes, ActionItem, convertHexColorToStatus } from '../util';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('audit')
		.setDescription('Audit the actions items in this channel')
		.addBooleanOption(option =>
			option
				.setName('ephemeral')
				.setDescription('Whether or not to make the response private to you'))
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
				.setDescription('The number of action items to audit (default 50)')
				.setRequired(false)
				.setMinValue(1)
				.setMaxValue(1000)
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
					{ name: "1000", value: 1000 },
				)),

	async execute(interaction: ChatInputCommandInteraction) {
		const ephemeral = interaction.options.get('ephemeral')?.value as boolean || false;
		const type = interaction.options.get('type')?.value as 'member' | 'status';
		const limit = interaction.options.get('limit')?.value as number || 50;

		const channel = await interaction.channel?.fetch();
		const messages = await channel?.messages.fetch({ limit: limit });

		if (!messages) return await interaction.reply({ content: 'Unable to fetch messages.', ephemeral: true });

		await interaction.deferReply({ ephemeral });

		if (type === 'member') {
			const data = new Map<string, Omit<ActionItem, 'assignees'>[]>();
			for (const message of messages.values()) {
				const embed = message.embeds[0];
				const assignees = embed.fields[1].value.split(', ').map(id => id.slice(2, -1));
				for (const assignee of assignees) {
					const value = data.get(assignee) || [];
					value.push({
						description: (embed.description || 'No description for this action item.') + '\n\n' + message.url,
						deadline: embed.fields[0].value,
						status: convertHexColorToStatus(embed.color),
					});
					data.set(assignee, value);
				}
			}

			const embeds: EmbedBuilder[] = [];
			for (const [assignee, value] of data) {
				const fields = value.map(item => {
					return {
						name: `[${item.status}] ${item.deadline}`,
						value: item.description,
						inline: true,
					};
				});
				const embed = new EmbedBuilder()
					.setTitle(`Action Items for <@${assignee}>`)
					.setColor(HexCodes.Blue)
					.setTimestamp()
					.setFooter({ text: "Audit may not be able to show all action items" })
					.addFields(...fields);

				embeds.push(embed);
			}

			await interaction.editReply({ embeds });
		} else if (type === 'status') {
			const data = new Map<string, Omit<ActionItem, 'status'>[]>();
			for (const message of messages.values()) {
				const embed = message.embeds[0];
				const status = convertHexColorToStatus(embed.color);
				const value = data.get(status) || [];
				value.push({
					description: (embed.description || 'No description for this action item.') + '\n\n' + message.url,
					deadline: embed.fields[0].value,
					assignees: embed.fields[1].value.split(', ').map(id => id.slice(2, -1)),
				});
				data.set(status, value);
			}

			const embeds: EmbedBuilder[] = [];
			for (const [status, value] of data) {
				const fields = value.map(item => {
					return {
						name: item.deadline,
						value: item.assignees.map(id => `<@${id}>`).join(', ') + '\n\n' + item.description,
						inline: true,
					};
				});
				const embed = new EmbedBuilder()
					.setTitle(`${status} Action Items`)
					.setColor(HexCodes.Blue)
					.setTimestamp()
					.setFooter({ text: "Audit may not be able to show all action items" })
					.addFields(...fields);

				embeds.push(embed);
			}

			await interaction.editReply({ embeds });
		}
	},
};