import type CreateReport from '../../application/usecase/CreateReport';
import type GetAllReport from '../../application/usecase/GetAllReport';
import type GetReportById from '../../application/usecase/GetReportById';
import type UpdateReport from '../../application/usecase/UpdateReport';
import type HttpServer from './HttpServer';

export default class ReportController {
	constructor(
		readonly createReport: CreateReport,
		readonly getAllReports: GetAllReport,
		readonly getReportById: GetReportById,
		readonly updateReport: UpdateReport,
		readonly httpServer: HttpServer,
	) {
		httpServer.register(
			'post',
			'/daily-reports',
			async (_parameters, body: any) => {
				const output = await createReport.execute(body);

				return output;
			},
		);

		httpServer.register('get', '/daily-reports', async () => {
			const output = await getAllReports.execute();

			return output;
		});

		httpServer.register(
			'get',
			'/daily-reports/{:id}',
			async (parameters: any) => {
				const output = await getReportById.execute(parameters.id);

				return output;
			},
		);

		httpServer.register(
			'put',
			'/daily-reports/{:id}',
			async (parameters: any, body: any) => {
				const output = await updateReport.execute({
					...body,
					id: parameters.id,
				});

				return output;
			},
		);
	}
}
