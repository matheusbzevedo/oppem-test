import type { ReportRepository } from '../../infra/repository/ReportRepository';

export default class GetAllReport {
	constructor(private readonly reportRepository: ReportRepository) {}

	async execute(): Promise<Output[]> {
		const reports = await this.reportRepository.getAll();

		return reports.map((report) => ({ ...report, date: report.getDate() }));
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
