import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, type User, ButtonStyle, ButtonBuilder, ActionRowBuilder } from 'discord.js';
import { generateModal, HexCodes } from '../util';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Create a new action item')
		// .addStringOption(option =>
		// 	option
		// 		.setName('description')
		// 		.setDescription('A brief description of the action item')
		// 		.setRequired(true))
		// .addStringOption(option =>
		// 	option
		// 		.setName('deadline')
		// 		.setDescription('The deadline for the action item')
		// 		.setRequired(true))
				// .setMinLength(3)
				// .setMaxLength(5))
		.addUserOption(option =>
			option
				.setName('assignee1')
				.setDescription('Who to assign this action item to (leave blank for yourself)')
				.setRequired(false))
		.addUserOption(option =>
			option
				.setName('assignee2')
				.setDescription('Another person to assign this action item to (leave blank if none)')
				.setRequired(false))
		.addUserOption(option =>
					option
						.setName('assignee3')
						.setDescription('Yet one more person to assign this action item to (leave blank if none)')
						.setRequired(false)),

	async execute(interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser('assignee1') ? interaction.options.getUser('assignee1') : interaction.user;
		const assignee2 = interaction.options.getUser('assignee2');
		const assignee3 = interaction.options.getUser('assignee3');

		if (!user) return await interaction.reply({ content: 'Unable to find the specified user. Please try again later.', ephemeral: true });

		// const memberDisplayName = await interaction.guild?.members.fetch(user!.id).then(member => member.displayName);

		const modal = generateModal(false)
			.setCustomId(`create|${user.id}${assignee2 ? `|${assignee2.id}` : ''}${assignee3 ? `|${assignee3.id}` : ''}`);

		await interaction.showModal(modal);
	},
};