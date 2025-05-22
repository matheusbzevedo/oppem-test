import { beforeEach, describe, expect, it, vi } from 'vitest';
import Report from '../../../src/domain/entity/Report';
import GetReportById from './../../../src/application/usecase/GetReportById';
import type { ReportRepository } from './../../../src/infra/repository/ReportRepository';

describe('GetReportById Use Case', () => {
	let reportRepository: ReportRepository;
	let getByIdMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		getByIdMock = vi.fn();
		reportRepository = {
			getById: getByIdMock,
		} as unknown as ReportRepository;
	});

	it('should return a report with the correct structure', async () => {
		const fakeReport = Report.create(
			'1994-09-17',
			'Descrição',
			'Obra XPTO',
			'Nublado',
			['João', 'Ana'],
		);

		getByIdMock.mockResolvedValue(fakeReport);

		const useCase = new GetReportById(reportRepository);
		const result = await useCase.execute('abc123');

		expect(getByIdMock).toHaveBeenCalledWith('abc123');
		expect(result).toEqual({
			id: result.id,
			description: 'Descrição',
			site: 'Obra XPTO',
			weather: 'Nublado',
			workers: ['João', 'Ana'],
			date: result.date,
		});
	});

	it('should throw an error if report is not found', async () => {
		getByIdMock.mockResolvedValue(null);

		const useCase = new GetReportById(reportRepository);

		await expect(() => useCase.execute('not-found-id')).rejects.toThrow(
			'Report not found!',
		);
	});
});
