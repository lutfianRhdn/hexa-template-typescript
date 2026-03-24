export type EntityId = string | number;

export function isNumericId(id: EntityId): id is number {
	return typeof id === 'number';
}

export function isStringId(id: EntityId): id is string {
	return typeof id === 'string';
}

export function parseEntityId(id: string): EntityId {
	const numericId = parseInt(id, 10);
	return isNaN(numericId) ? id : numericId;
}

export function idToString(id: EntityId): string {
	return typeof id === 'number' ? id.toString() : id;
}
