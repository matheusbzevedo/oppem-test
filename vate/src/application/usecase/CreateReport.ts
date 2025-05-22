import Report from '../../domain/entity/Report';
import type { CreateReportQueue } from '../../infra/jobs/queues/CreateReport.queue';

export default class CreateReport {
	constructor(private readonly createReportQueue: CreateReportQueue) {}

	async execute(input: Input): Promise<Output> {
		const report = Report.create(
			input.date,
			input.description,
			input.site,
			input.weather,
			input.workers,
		);

		await this.createReportQueue.enqueue(report);

		return {
			createdAt: report.getDate(),
			id: report.id,
			status: 'registrado',
		};
	}
}

interface Input {
	date: string;
	description: string;
	site: string;
	weather: string;
	workers: string[];
}

interface Output {
	id: string;
	createdAt: string;
	status: string;
}
