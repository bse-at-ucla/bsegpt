import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ModalSubmitInteraction } from 'discord.js';
import { doneButton, editButton, HexCodes, overdueButton, stuckButton } from '../util';

module.exports = {
	data: {
		name: 'create'
	},

	async execute(interaction: ModalSubmitInteraction) {
		const description = interaction.fields.getTextInputValue('descriptionInput');
		const deadline = interaction.fields.getTextInputValue('deadlineInput');

		const split = interaction.customId.split('|').toSpliced(0, 1);

		if (!interaction.isFromMessage()) return await interaction.reply({ content: 'Unable to fetch message.', ephemeral: true });

		const embed = new EmbedBuilder()
			.setTitle('Action Item - In Progress')
			.setColor(HexCodes.Blue)
			.setDescription(description)
			.setTimestamp()
			.setFooter({ text: "Select a button below to update status" })
			.addFields(
				{ name: 'Deadline', value: deadline },
				{ name: 'Assignee(s)', value: split.map(id => `<@${id}>`).join(', ') }
		);

		const rowBuilder = new ActionRowBuilder<ButtonBuilder>()
			.addComponents([editButton, stuckButton, overdueButton, doneButton]);

		await interaction.update({
			embeds: [embed],
			components: [rowBuilder],
		});
	},
};