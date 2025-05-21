export default class MyDate {
	private value: string;

	constructor(value: string) {
		const date = new Date(value);

		if (date.toDateString() === 'Invalid Date') {
			throw new Error('Data inválida');
		}

		this.value = date.toISOString();
	}

	public getValue(): string {
		return this.value;
	}
}
