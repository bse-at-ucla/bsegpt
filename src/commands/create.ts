import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

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
				.setName('due_date')
				.setDescription('The due date for the action item in format MM/DD (e.g. 12/31)')
				.setRequired(true)
				.setMinLength(3)
				.setMaxLength(5))
		.addUserOption(option =>
			option
				.setName('assignee')
				.setDescription('Who to assign this action item to (leave blank for yourself)')
				.setRequired(false)),

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
			content: interaction.options.getString('description') || 'No description provided.',
			ephemeral: true,
		});
	},
};