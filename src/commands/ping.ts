import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { HexCodes } from 'src/util';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.addBooleanOption(option =>
			option
				.setName('ephemeral')
				.setDescription('Whether or not to make the response private to you')),

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({
			ephemeral: interaction.options.get('ephemeral')?.value as boolean || false
		});

		const sent = await interaction.fetchReply();
		const ping = sent.createdTimestamp - interaction.createdTimestamp;
		const apiPing = Math.round(interaction.client.ws.ping);

		const embed = new EmbedBuilder()
			.setColor(HexCodes.Blurple)
			.setTitle('🏓 Pong!')
			.addFields(
				{ name: 'bseGPT Client Ping', value: `\`${ping}ms\``, inline: true },
				{ name: 'Discord API Ping', value: `\`${apiPing}ms\``, inline: true }
			)
			.setTimestamp()
			.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

		await interaction.editReply({
			embeds: [embed],
		});
	},
};