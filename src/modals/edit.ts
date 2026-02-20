import { EmbedBuilder, ModalSubmitInteraction } from 'discord.js';
import { HexCodes } from '../util';

module.exports = {
	data: {
		name: 'edit'
	},

	async execute(interaction: ModalSubmitInteraction) {
		const description = interaction.fields.getTextInputValue('descriptionInput');
		const deadline = interaction.fields.getTextInputValue('deadlineInput');

		if (!interaction.isFromMessage()) return await interaction.reply({ content: 'Unable to fetch message.', ephemeral: true });

		const embed = interaction.message.embeds[0];
		const fields = [...embed.fields];
		fields[0].value = deadline;

		const newEmbed = new EmbedBuilder()
			.setTitle(embed.title)
			.setColor(embed.color)
			.setAuthor(embed.author)
			.setDescription(description)
			.setTimestamp()
			.setFooter({ text: "Select a button below to update status" })
			.addFields(...fields);

		await interaction.update({
			embeds: [newEmbed],
			components: interaction.message.components,
		});
	},
};