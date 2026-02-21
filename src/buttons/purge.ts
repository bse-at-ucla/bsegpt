import { EmbedBuilder, type ButtonInteraction } from 'discord.js';
import { HexCodes, authenticate } from '../util';

module.exports = {
	data: {
		name: 'purge'
	},

	async execute(interaction: ButtonInteraction) {
		if (!await authenticate(interaction, true)) return await interaction.reply({ content: 'Only an admin can purge messages.', ephemeral: true });

		const limit = Number(interaction.customId.split('|')[1]);
		if (isNaN(limit)) return await interaction.reply({ content: "Unable to purge more messages.", ephemeral: true });

		const messages = await interaction.channel?.messages.fetch({ limit });
		if (!messages) return await interaction.reply({ content: 'Unable to fetch & delete messages.', ephemeral: true });

		messages.values().forEach((message) => message.delete());

		const embed = interaction.message.embeds[0];
		const newEmbed = new EmbedBuilder()
			.setColor(HexCodes.Red)
			.setTitle(`Purged ${(Number(embed.title?.split(' ')[1]) || 0) + limit} Messages`)
			.setTimestamp()
			.setFooter({ text: `Requested by ${(await interaction.guild?.members.fetch(interaction.user.id))?.displayName || interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

		await interaction.update({
			embeds: [newEmbed],
			components: interaction.message.components,
		});
	},
};