import { type ButtonInteraction } from 'discord.js';
import { authenticate } from '../util';

module.exports = {
	data: {
		name: 'delete'
	},

	async execute(interaction: ButtonInteraction) {
		if (!await authenticate(interaction, true)) {
			await interaction.reply({ content: 'Only an admin can delete an action item.', ephemeral: true });
		}

		await interaction.message.delete();
	},
};