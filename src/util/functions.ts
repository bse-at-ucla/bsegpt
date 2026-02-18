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