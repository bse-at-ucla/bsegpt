import { TextInputBuilder, TextInputStyle, LabelBuilder, ModalBuilder, ButtonInteraction } from 'discord.js';
import type { ValueOf } from './types'

export function capitalCase(str: string) {
	return str.trim().toLowerCase().split(' ').map((v, i) => v.split('').map((v1, i1) => i1 === 0 ? v1.toUpperCase() : v1).join('')).join(' ');
}

export function getEntryFromValue<T = any>(arr: T[], subName: keyof T, subValue: ValueOf<T>) {
	for (let i = 0; i < arr.length; i++) {
		const value = arr[i];
		if (value[subName] === subValue) {
			return value;
		}
	}
}

export function generateModal(isEditing: boolean, defaults: Array<string | undefined | null> = []) {
	const descriptionInput = new TextInputBuilder()
		.setCustomId('descriptionInput')
		.setStyle(TextInputStyle.Paragraph)
		.setValue(isEditing && typeof defaults[0] === 'string' ? defaults[0] : '');

	const descriptionLabel = new LabelBuilder()
		.setLabel("What is your action item?")
		.setDescription('Please describe what you need to do.')
		.setTextInputComponent(descriptionInput);

	const deadlineInput = new TextInputBuilder()
		.setCustomId('deadlineInput')
		.setStyle(TextInputStyle.Short)
		.setValue(isEditing && typeof defaults[1] === 'string' ? defaults[1] : 'Ex. 2/18');

	const deadlineLabel = new LabelBuilder()
		.setLabel("What is the deadline?")
		.setDescription('Please set a deadline for yourself.')
		.setTextInputComponent(deadlineInput);

	const operativeWord = isEditing ? 'Edit' : 'Create';

	return new ModalBuilder()
		.setCustomId(operativeWord.toLowerCase())
		.setTitle(`${operativeWord} Action Item`)
		.addLabelComponents(descriptionLabel, deadlineLabel);
}

export async function authenticate(interaction: ButtonInteraction, adminOnly: boolean = false) {
	const isAssignee = interaction.message.embeds[0].fields[1].value.split(', ').includes(`<@${interaction.user.id}>`);
	const isAdmin = (await interaction.guild?.roles.fetch())?.get('1473577049322164294')?.members.has(interaction.user.id);
	return adminOnly ? isAdmin : isAssignee;
}