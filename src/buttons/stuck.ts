import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, type ButtonInteraction } from 'discord.js';
import { HexCodes } from '../util';

module.exports = {
	data: {
		name: 'stuck'
	},

	async execute(interaction: ButtonInteraction) {
		if (!interaction.message.embeds[0]) {
			await interaction.followUp({ content: 'Unable to update status. Please try again later.', ephemeral: true });
		};

		if ((interaction.user.id !== interaction.message.author.id) && (!(await interaction.guild?.roles.fetch())?.get('1473577049322164294')?.members.has(interaction.user.id))) {
			await interaction.followUp({ content: 'Only the assignee or an admin can update the status of this action item.', ephemeral: true });
		}

		const embed = interaction.message.embeds[0];

		const newEmbed = new EmbedBuilder()
			.setTitle('Action Item - Stuck')
			.setColor(HexCodes.Yellow)
			.setAuthor(embed.author)
			.setDescription(embed.description)
			.setTimestamp()
			.setFooter({ text: "Select a button below to update status" })
			.addFields(...embed.fields);

		const unstuckButton = new ButtonBuilder()
			.setCustomId('inprogress')
			.setLabel('I\'m Unstuck')
			.setStyle(ButtonStyle.Primary)
			.setEmoji('💪');

		const overdueButton = new ButtonBuilder()
			.setCustomId('overdue')
			.setLabel('Overdue')
			.setStyle(ButtonStyle.Danger)
			.setEmoji('⛔');

		const doneButton = new ButtonBuilder()
			.setCustomId('done')
			.setLabel('Done')
			.setStyle(ButtonStyle.Success)
			.setEmoji('✅');

		const rowBuilder = new ActionRowBuilder<ButtonBuilder>()
			.addComponents([unstuckButton, overdueButton, doneButton]);

		interaction.client.channels.fetch('1473662141985722451').then(channel => { channel?.isSendable() && channel.send({ content: `<@&1473577049322164294>: <@${interaction.user.id}> is stuck on an action item. See the message here: ${interaction.message.url}` }) });

		await interaction.update({
			embeds: [newEmbed],
			components: [rowBuilder],
		});
	},
};