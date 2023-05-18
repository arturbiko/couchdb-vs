export interface ValidationBag {
	message?: string;
	value?: any;
	valid: boolean;
}

/**
 * Validates database name. Only lowercase characters (a-z), digits (0-9),
 * and any of the characters _, $, (, ), +, -, and / are allowed.
 * Must begin with a letter.
 *
 * @param name Databasename
 */
export function validateDatabaseName(name?: string): ValidationBag {
	if (!name) {
		return {
			valid: false,
			value: name,
			message: 'Missing database name.',
		};
	}

	const regex = /^[a-z][a-z0-9_$()+\-/]*$/i;

	if (!regex.test(name)) {
		return {
			valid: false,
			value: name,
			message:
				'Only lowercase characters (a-z), ' +
				'digits (0-9) and any of the characters _, $, (, ), +, -, ' +
				'and / are allowed Must begin with a letter.',
		};
	}

	return { valid: true };
}
