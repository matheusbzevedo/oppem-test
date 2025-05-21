import { type Job, Worker } from 'bullmq';
import CreateReport from './application/usecase/CreateReport';
import GetAllReport from './application/usecase/GetAllReport';
import GetReportById from './application/usecase/GetReportById';
import UpdateReport from './application/usecase/UpdateReport';
import Report from './domain/entity/Report';
import { redisConfig } from './infra/config/Redis';
import { ExpressAdapter } from './infra/http/HttpServer';
import ReportController from './infra/http/ReportController';
import { CreateReportQueue } from './infra/jobs/queues/CreateReport.queue';
import { ReportRepositoryRedis } from './infra/repository/ReportRepository';

const httpServer = new ExpressAdapter();
const reportRepository = new ReportRepositoryRedis(process.env.REDIS_URL);
const createReportQueue = new CreateReportQueue();
const createReport = new CreateReport(createReportQueue);
const getAllReport = new GetAllReport(reportRepository);
const getReportById = new GetReportById(reportRepository);
const updateReport = new UpdateReport(reportRepository);
new ReportController(
	createReport,
	getAllReport,
	getReportById,
	updateReport,
	httpServer,
);

const createReportWorker = new Worker(
	'createReport',
	async (job: Job) => {
		const { data } = job;

		const report = Report.create(
			data.date,
			data.description,
			data.site,
			data.weather,
			data.workers,
		);

		await createReport.execute({
			...report,
			date: report.getDate(),
		});
	},
	{
		connection: redisConfig,
	},
);

createReportWorker.on('completed', (job: Job) => {
	console.log(`Created Report ${job.data.id}`);
});

createReportWorker.on('failed', (job: Job | undefined, err: Error) => {
	console.error('Failed Create Report: job is undefined', err);
});

httpServer.listen(3001);
