import { editButton } from './../util/templates'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, type ButtonInteraction } from 'discord.js';
import { HexCodes, stuckButton, overdueButton, doneButton, authenticate } from '../util';

module.exports = {
	data: {
		name: 'inprogress'
	},

	async execute(interaction: ButtonInteraction) {
		if (!interaction.message.embeds[0]) {
			await interaction.reply({ content: 'Unable to update status. Please try again later.', ephemeral: true });
		};

		if (!await authenticate(interaction)) {
			await interaction.reply({ content: 'Only an assignee or admin can update the status of this action item.', ephemeral: true });
		}

		const embed = interaction.message.embeds[0];

		const newEmbed = new EmbedBuilder()
			.setTitle('Action Item - In Progress')
			.setColor(HexCodes.Blue)
			.setAuthor(embed.author)
			.setDescription(embed.description)
			.setTimestamp()
			.setFooter({ text: "Select a button below to update status" })
			.addFields(...embed.fields);

		const rowBuilder = new ActionRowBuilder<ButtonBuilder>()
			.addComponents([editButton, stuckButton, overdueButton, doneButton]);

		await interaction.update({
			embeds: [newEmbed],
			components: [rowBuilder],
		});
	},
};