import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, type ButtonInteraction } from 'discord.js';
import { HexCodes } from '../util';

module.exports = {
	data: {
		name: 'inprogress'
	},

	async execute(interaction: ButtonInteraction) {
		await interaction.deferUpdate();

		if (!interaction.message.embeds[0]) {
			await interaction.followUp({ content: 'Unable to update status. Please try again later.', ephemeral: true });
		};

		// const roles = await interaction.guild?.roles.fetch();
		// const isAdmin = roles?.get('1473577049322164294')?.members.has(interaction.user.id);
		if ((interaction.user.id !== interaction.message.author.id) && (!(await interaction.guild?.roles.fetch())?.get('1473577049322164294')?.members.has(interaction.user.id))) {
			await interaction.followUp({ content: 'Only the assignee or an admin can update the status of this action item.', ephemeral: true });
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

		const stuckButton = new ButtonBuilder()
			.setCustomId('stuck')
			.setLabel('I\'m Stuck')
			.setStyle(ButtonStyle.Primary)
			.setEmoji('⚠️');

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
			.addComponents([stuckButton, overdueButton, doneButton]);

		await interaction.update({
			embeds: [newEmbed],
			components: [rowBuilder],
		});
	},
};