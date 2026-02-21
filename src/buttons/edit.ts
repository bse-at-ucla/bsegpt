import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, type ButtonInteraction } from 'discord.js';
import { authenticate, generateModal, HexCodes } from '../util';

module.exports = {
	data: {
		name: 'edit'
	},

	async execute(interaction: ButtonInteraction) {
		if (!interaction.message.embeds[0])
			return await interaction.reply({ content: 'Unable to update status. Please try again later.', ephemeral: true });

		if (!await authenticate(interaction))
			return await interaction.reply({ content: 'Only an assignee or admin can update the status of this action item.', ephemeral: true });

		const embed = interaction.message.embeds[0];
		const modal = generateModal(true, [embed.description, embed.fields[0].value]);

		await interaction.showModal(modal);
	},
};