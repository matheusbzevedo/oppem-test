import Report from '../../domain/entity/Report';
import type { ReportRepository } from '../../infra/repository/ReportRepository';

export default class UpdateReport {
	constructor(private readonly reportRepository: ReportRepository) {}

	async execute(input: Input): Promise<Output> {
		const existingReport = await this.reportRepository.getById(input.id);

		if (!existingReport) {
			throw new Error('Report not found');
		}

		const report = Report.restore(
			input.id,
			input.date,
			input.description,
			input.site,
			input.weather,
			input.workers,
		);

		await this.reportRepository.update(report);

		return {
			id: report.id,
			status: 'atualizado',
		};
	}
}

interface Input {
	id: string;
	date: string;
	description: string;
	site: string;
	weather: string;
	workers: string[];
}

interface Output {
	id: string;
	status: string;
}
