import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, type User, ButtonStyle, ButtonBuilder, ActionRowBuilder } from 'discord.js';
import { HexCodes } from '../util';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Create a new action item')
		.addStringOption(option =>
			option
				.setName('description')
				.setDescription('A brief description of the action item')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('deadline')
				.setDescription('The deadline for the action item')
				.setRequired(true))
				// .setMinLength(3)
				// .setMaxLength(5))
		.addUserOption(option =>
			option
				.setName('assignee')
				.setDescription('Who to assign this action item to (leave blank for yourself)')
				.setRequired(false)),

	async execute(interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser('assignee') ? interaction.options.getUser('assignee') : interaction.user;

		if (!user) await interaction.reply({ content: 'Unable to find the specified user. Please try again later.', ephemeral: true });

		const embed = new EmbedBuilder()
			.setTitle('Action Item - In Progress')
			.setColor(HexCodes.Blue)
			.setAuthor({ name: user!.displayName, iconURL: user!.displayAvatarURL() })
			.setDescription(interaction.options.getString('description') || 'N/A')
			.setTimestamp()
			.setFooter({ text: "Select a button below to update status" })
			.addFields(
				// { name: 'Description', value: interaction.options.getString('description') || 'N/A' },
				{ name: 'Deadline', value: interaction.options.getString('deadline') || 'N/A' },
				{ name: 'Assignee', value: `<@${user!.id}>` }
			);

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

		await interaction.reply({
			embeds: [embed],
			components: [rowBuilder],
		});
	},
};