import { type ButtonInteraction } from 'discord.js';
import { authenticate } from 'src/util';

module.exports = {
	data: {
		name: 'delete'
	},

	async execute(interaction: ButtonInteraction) {
		if (!await authenticate(interaction, true)) {
			await interaction.followUp({ content: 'Only an admin can delete an action item.', ephemeral: true });
		}

		await interaction.message.delete();
	},
};