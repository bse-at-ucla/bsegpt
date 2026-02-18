import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, type ButtonInteraction } from 'discord.js';

module.exports = {
	data: {
		name: 'delete'
	},

	async execute(interaction: ButtonInteraction) {
		await interaction.message.delete();
	},
};