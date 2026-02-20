export interface ActionItem {
	description: string;
	deadline: string;
	assignees: string[];
	status: string;
}

export type AnonymousActionItem = Omit<ActionItem, "assignees">;