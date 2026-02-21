import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { authenticate, HexCodes } from '../util';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Delete messages from a channel')
		.addIntegerOption(option =>
			option
				.setName('limit')
				.setDescription('The number of messages to delete')
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(100)
				.addChoices(
					{ name: "1", value: 1 },
					{ name: "5", value: 5 },
					{ name: "10", value: 10 },
					{ name: "25", value: 25 },
					{ name: "50", value: 50 },
					{ name: "75", value: 75 },
					{ name: "100", value: 100 },
					{ name: "250", value: 250 },
					{ name: "500", value: 500 },
					{ name: "1000", value: 1000 },
				)),

	async execute(interaction: ChatInputCommandInteraction) {
		const limit = interaction.options.get('limit')?.value as number;

		if (!await authenticate(interaction, true)) return await interaction.reply({ content: 'Only an admin can purge messages.', ephemeral: true });

		const messages = await interaction.channel?.messages.fetch({ limit });
		if (!messages) return await interaction.reply({ content: 'Unable to fetch & delete messages.', ephemeral: true });

		messages.values().forEach((message) => message.delete());

		const embed = new EmbedBuilder()
			.setColor(HexCodes.Red)
			.setTitle(`Purged ${limit} Messages`)
			.setTimestamp()
			.setFooter({ text: `Requested by ${(await interaction.guild?.members.fetch(interaction.user.id)) || interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

		const purgeButton = new ButtonBuilder()
			.setCustomId(`purge|${limit}`)
			.setLabel('Purge')
			.setStyle(ButtonStyle.Danger)
			.setEmoji('💥');

		const rowBuilder = new ActionRowBuilder<ButtonBuilder>()
			.addComponents([purgeButton]);

		await interaction.reply({
			embeds: [embed],
			components: [rowBuilder],
		});
	},
};