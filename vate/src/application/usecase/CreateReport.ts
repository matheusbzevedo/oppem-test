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
