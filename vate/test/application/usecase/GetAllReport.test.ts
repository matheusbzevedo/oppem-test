import { beforeEach, describe, expect, it, vi } from 'vitest';
import Report from '../../../src/domain/entity/Report';
import GetAllReport from './../../../src/application/usecase/GetAllReport';
import type { ReportRepository } from './../../../src/infra/repository/ReportRepository';

describe('GetAllReport Use Case', () => {
	let reportRepository: ReportRepository;
	let getAllMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		getAllMock = vi.fn();

		reportRepository = {
			getAll: getAllMock,
		} as unknown as ReportRepository;
	});

	it('should return all reports with correct structure', async () => {
		const fakeReports = [
			Report.restore('1', '2025-05-21', 'Relatório 1', 'Obra A', 'Sol', [
				'João',
				'Maria',
			]),
		];

		getAllMock.mockResolvedValue(fakeReports);

		const useCase = new GetAllReport(reportRepository);
		const result = await useCase.execute();

		expect(result).toEqual([
			{
				id: '1',
				description: 'Relatório 1',
				site: 'Obra A',
				weather: 'Sol',
				workers: ['João', 'Maria'],
				date: '2025-05-21T00:00:00.000Z',
			},
		]);

		expect(getAllMock).toHaveBeenCalledTimes(1);
	});
});
