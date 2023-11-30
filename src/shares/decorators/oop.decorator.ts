export function override(container: any, key: any): void {
	const baseType = Object.getPrototypeOf(container);
	if (typeof baseType[key] !== 'function') {
		const overrideError =
			'Method ' + key + ' of ' + container.constructor.name + ' does not override any base class method';
		throw new Error(overrideError);
	}
}

export function implement(container: any, key: any): void {
	const baseType = Object.getPrototypeOf(container);
	if (typeof baseType[key] === 'function') {
		const overrideError = 'Method ' + key + ' of ' + container.constructor.name + ' implemented on base class';
		throw new Error(overrideError);
	}
}
