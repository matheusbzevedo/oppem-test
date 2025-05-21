import { randomUUID } from 'node:crypto';
import MyDate from '../vo/Date';

export default class Report {
	private constructor(
		readonly id: string,
		private date: MyDate,
		readonly description: string,
		readonly site: string,
		readonly weather: string,
		readonly workers: string[],
	) {}

	static create(
		date: string,
		description: string,
		site: string,
		weather: string,
		workers: string[],
	): Report {
		const id = randomUUID();

		return new Report(
			id,
			new MyDate(date),
			description,
			site,
			weather,
			workers,
		);
	}

	static restore(
		id: string,
		date: string,
		description: string,
		site: string,
		weather: string,
		workers: string[],
	): Report {
		return new Report(
			id,
			new MyDate(date),
			description,
			site,
			weather,
			workers,
		);
	}

	getDate() {
		return this.date.getValue();
	}
}
