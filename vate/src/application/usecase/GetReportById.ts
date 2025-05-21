import type { ReportRepository } from '../../infra/repository/ReportRepository';

export default class GetReportById {
	constructor(private readonly reportRepository: ReportRepository) {}

	async execute(id: string): Promise<Output> {
		const report = await this.reportRepository.getById(id);

		if (!report) {
			throw new Error('Report not found!');
		}

		return {
			...report,
			date: report.getDate(),
		};
	}
}

interface Output {
	id: string;
	date: string;
	description: string;
	site: string;
	weather: string;
	workers: string[];
}
