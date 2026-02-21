import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, type ButtonInteraction } from 'discord.js';
import { authenticate, deleteButton, HexCodes } from '../util';

module.exports = {
	data: {
		name: 'done'
	},

	async execute(interaction: ButtonInteraction) {
		if (!interaction.message.embeds[0])
			return await interaction.reply({ content: 'Unable to update status. Please try again later.', ephemeral: true });

		if (!await authenticate(interaction))
			return await interaction.reply({ content: 'Only an assignee or admin can update the status of this action item.', ephemeral: true });

		const embed = interaction.message.embeds[0];

		const newEmbed = new EmbedBuilder()
			.setTitle('Action Item - Done')
			.setColor(HexCodes.Green)
			.setAuthor(embed.author)
			.setDescription(embed.description)
			.setTimestamp()
			.setFooter({ text: "Select a button below to update status" })
			.addFields(...embed.fields);

		const rowBuilder = new ActionRowBuilder<ButtonBuilder>()
			.addComponents([deleteButton]);

		await interaction.update({
			embeds: [newEmbed],
			components: [rowBuilder],
		});
	},
};