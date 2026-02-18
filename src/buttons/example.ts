import { type ButtonInteraction } from 'discord.js';
// import { HexCodes } from '../util';

module.exports = {
	data: {
		name: 'example'
	},

	async execute(interaction: ButtonInteraction) {
		await interaction.deferUpdate();

		const split = interaction.customId.split('|');
		const parentMsg = interaction.message;

		await interaction.reply({
			embeds: [],
		});
	},
};