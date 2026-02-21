import { type ButtonInteraction } from 'discord.js';
import { authenticate } from '../util';

module.exports = {
	data: {
		name: 'auditpurge'
	},

	async execute(interaction: ButtonInteraction) {
		if (!await authenticate(interaction, true)) {
			await interaction.followUp({ content: 'Only an admin can delete action items.', ephemeral: true });
		}

		const messageIds = interaction.customId.split('|').toSpliced(0, 1);

		messageIds.forEach(messageId => {
			interaction.channel?.messages.fetch(messageId).then(message => message?.delete());
		});

		await interaction.followUp({ content: 'Deleted action items.', ephemeral: true });
	},
};