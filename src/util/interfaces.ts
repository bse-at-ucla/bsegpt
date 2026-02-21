export interface ActionItem {
	description: string;
	deadline: string;
	assignees: string[];
	status: string;
	link: string;
}

export type AnonymousActionItem = Omit<ActionItem, "assignees">;