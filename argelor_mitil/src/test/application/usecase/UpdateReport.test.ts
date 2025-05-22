import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import UpdateReport from '../../../application/usecase/UpdateReport';
import Report from '../../../domain/entity/Report';
import type { ReportRepository } from '../../../infra/repository/ReportRepository';

describe('UpdateReport Use Case', () => {
	let reportRepository: ReportRepository;
	let getByIdMock: ReturnType<typeof vi.fn>;
	let updateMock: ReturnType<typeof vi.fn>;
	let restoreSpy: any;

	afterEach(() => {
		vi.restoreAllMocks();
	});

	beforeEach(() => {
		getByIdMock = vi.fn();
		updateMock = vi.fn();

		reportRepository = {
			getById: getByIdMock,
			update: updateMock,
		} as unknown as ReportRepository;

		restoreSpy = vi.spyOn(Report, 'restore');
	});

	it('should update an existing report and return success output', async () => {
		const input = {
			id: 'r1',
			date: '2025-05-21',
			description: 'Novo relatório atualizado',
			site: 'Obra Central',
			weather: 'Chuvoso',
			workers: ['Alice', 'Bob'],
		};

		getByIdMock.mockResolvedValue({ id: 'r1' });

		const fakeRestoredReport = { id: 'r1' };
		restoreSpy.mockReturnValue(fakeRestoredReport as any);

		const useCase = new UpdateReport(reportRepository);
		const result = await useCase.execute(input);

		expect(getByIdMock).toHaveBeenCalledWith('r1');
		expect(restoreSpy).toHaveBeenCalledWith(
			input.id,
			input.date,
			input.description,
			input.site,
			input.weather,
			input.workers,
		);
		expect(updateMock).toHaveBeenCalledWith(fakeRestoredReport);
		expect(result).toEqual({ report_id: 'r1', state: 'updated' });
	});
});
