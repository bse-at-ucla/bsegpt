import { EmbedBuilder, ModalSubmitInteraction } from 'discord.js';
import { HexCodes } from '../util';

module.exports = {
	data: {
		name: 'example'
	},

	async execute(interaction: ModalSubmitInteraction) {
		const split = interaction.customId.split('|');

		const data = interaction.fields.getTextInputValue('*');

		await interaction.reply({
			embeds: [],
		})
	},
};