import { type ButtonInteraction } from 'discord.js';
import { authenticate } from '../util';

module.exports = {
	data: {
		name: 'auditoverdue'
	},

	async execute(interaction: ButtonInteraction) {
		if (!await authenticate(interaction, true)) {
			await interaction.reply({ content: 'Only an admin can send overdue reminders.', ephemeral: true });
		}

		const buf = Buffer.from(interaction.customId.split('|')[1], 'base64url');
		const messageIds = Array.from({ length: buf.length / 8 }, (_, i) => buf.readBigUInt64BE(i * 8).toString());
		const missed: string[] = [];

		messageIds.forEach(async (messageId) => {
			const message = await interaction.channel?.messages.fetch(messageId);
			if (!message) return missed.push(messageId);
			const embed = message.embeds[0];
			const assigneesField = embed.fields.find(field => field.name === 'Assignee(s)');
			if (!assigneesField) return missed.push(message.url);
			const assignees = assigneesField.value.split(', ').map(id => id.slice(2, -1));
			for (const assignee of assignees) {
				const member = await interaction.guild?.members.fetch(assignee);
				if (!member) {
					missed.push(message.url);
					continue;
				}
				if (member.id === interaction.client.user.id) continue;
				const dm = await member.createDM();
				await dm.send({ content: `You have an overdue action item: ${message.url}` });
			}
		});

		if (missed.length > 0) {
			await interaction.reply({ content: `Could not send overdue reminders for the following messages:\n- ${missed.join('\n- ')}`, ephemeral: true });
		} else {
			await interaction.reply({ content: 'Sent overdue reminders.', ephemeral: true });
		}
	},
};