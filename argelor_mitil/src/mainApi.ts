import CreateReport from './application/usecase/CreateReport';
import GetAllReport from './application/usecase/GetAllReport';
import GetReportById from './application/usecase/GetReportById';
import UpdateReport from './application/usecase/UpdateReport';
import { ExpressAdapter } from './infra/http/HttpServer';
import ReportController from './infra/http/ReportController';
import { ReportRepositoryMemory } from './infra/repository/ReportRepository';

const httpServer = new ExpressAdapter();
const reportRepository = new ReportRepositoryMemory();
const createReport = new CreateReport(reportRepository);
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

httpServer.listen(3002);
