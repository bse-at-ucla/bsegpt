import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, type ButtonInteraction } from 'discord.js';
import { authenticate, doneButton, editButton, HexCodes, stuckButton } from '../util';

module.exports = {
	data: {
		name: 'overdue'
	},

	async execute(interaction: ButtonInteraction) {
		if (!interaction.message.embeds[0]) {
			await interaction.followUp({ content: 'Unable to update status. Please try again later.', ephemeral: true });
		};

		if (!await authenticate(interaction)) {
			await interaction.followUp({ content: 'Only an assignee or admin can update the status of this action item.', ephemeral: true });
		}

		const embed = interaction.message.embeds[0];

		const newEmbed = new EmbedBuilder()
			.setTitle('Action Item - Overdue')
			.setColor(HexCodes.Red)
			.setAuthor(embed.author)
			.setDescription(embed.description)
			.setTimestamp()
			.setFooter({ text: "Select a button below to update status" })
			.addFields(...embed.fields);

		const rowBuilder = new ActionRowBuilder<ButtonBuilder>()
			.addComponents([editButton, stuckButton, doneButton]);

		interaction.client.channels.fetch('1473662141985722451').then(channel => { channel?.isSendable() && channel.send({ content: `<@&1473577049322164294>: <@${interaction.user.id}> is overdue on an action item. See the message here: ${interaction.message.url}` }) });

		await interaction.update({
			embeds: [newEmbed],
			components: [rowBuilder],
		});
	},
};