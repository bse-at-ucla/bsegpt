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

		// const messageIds = interaction.customId.split('|').toSpliced(0, 1);
		const buf = Buffer.from(interaction.customId.split('|')[1], 'base64url');
		const messageIds = Array.from({ length: buf.length / 8 }, (_, i) => buf.readBigUInt64BE(i * 8).toString());

		messageIds.forEach(messageId => {
			interaction.channel?.messages.fetch(messageId).then(message => message?.delete());
		});

		await interaction.followUp({ content: 'Deleted action items.', ephemeral: true });
	},
};