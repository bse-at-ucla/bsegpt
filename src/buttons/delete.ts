import { type ButtonInteraction } from 'discord.js';

module.exports = {
	data: {
		name: 'delete'
	},

	async execute(interaction: ButtonInteraction) {
		if (!(await interaction.guild?.roles.fetch())?.get('1473577049322164294')?.members.has(interaction.user.id)) {
			await interaction.followUp({ content: 'Only an admin can delete an action item.', ephemeral: true });
		}

		await interaction.message.delete();
	},
};