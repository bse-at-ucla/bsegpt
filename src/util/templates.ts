import { ButtonBuilder, ButtonStyle } from "discord.js";

export const editButton = new ButtonBuilder()
	.setCustomId('edit')
	.setLabel('Edit')
	.setStyle(ButtonStyle.Secondary)
	.setEmoji('✏️');

export const stuckButton = new ButtonBuilder()
	.setCustomId('stuck')
	.setLabel('I\'m Stuck')
	.setStyle(ButtonStyle.Primary)
	.setEmoji('⚠️');

export const unstuckButton = new ButtonBuilder()
	.setCustomId('inprogress')
	.setLabel('I\'m Unstuck')
	.setStyle(ButtonStyle.Primary)
	.setEmoji('💪');

export const overdueButton = new ButtonBuilder()
	.setCustomId('overdue')
	.setLabel('Overdue')
	.setStyle(ButtonStyle.Danger)
	.setEmoji('⛔');

export const doneButton = new ButtonBuilder()
	.setCustomId('done')
	.setLabel('Done')
	.setStyle(ButtonStyle.Success)
	.setEmoji('✅');

export const deleteButton = new ButtonBuilder()
	.setCustomId('delete')
	.setLabel('Delete')
	.setStyle(ButtonStyle.Danger)
	.setEmoji('🗑️');