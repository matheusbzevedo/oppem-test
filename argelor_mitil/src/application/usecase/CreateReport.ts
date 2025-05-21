import Report from '../../domain/entity/Report';
import type { ReportRepository } from '../../infra/repository/ReportRepository';

export default class CreateReport {
	constructor(private readonly reportRepository: ReportRepository) {}

	async execute(input: Input): Promise<Output> {
		const report = Report.create(
			input.date,
			input.description,
			input.site,
			input.weather,
			input.workers,
		);

		await this.reportRepository.save(report);

		return await {
			created: report.getDate(),
			report_id: report.id,
			state: 'saved',
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
	created: string;
	report_id: string;
	state: string;
}
