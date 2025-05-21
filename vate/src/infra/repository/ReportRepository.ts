import { type RedisClientType, createClient } from 'redis';
import type Report from '../../domain/entity/Report';

export interface ReportRepository {
	getAll(): Promise<Report[]>;
	getById(reportId: string): Promise<Report | undefined>;
	save(report: Report): Promise<void>;
	update(report: Report): Promise<void>;
}

// export class ReportRepositoryMemory implements ReportRepository {
// 	reports: Report[];

// 	constructor() {
// 		this.reports = [];
// 	}

// 	async getAll(): Promise<Report[]> {
// 		return await this.reports;
// 	}

// 	async getById(reportId: string): Promise<Report | undefined> {
// 		const report = this.reports.find((report) => report.id === reportId);

// 		return report;
// 	}

// 	async save(report: Report): Promise<void> {
// 		await this.reports.push(report);
// 	}

// 	async update(report: Report): Promise<void> {
// 		const foundIndex = this.reports.findIndex((rep) => rep.id === report.id);
// 		this.reports[foundIndex] = report;
// 	}
// }

export class ReportRepositoryRedis implements ReportRepository {
	private client: RedisClientType;
	private readonly redisKeyPrefix = 'report:';

	constructor(redisUrl = 'redis://localhost:6379') {
		this.client = createClient({ url: redisUrl });
		this.client.connect();
	}

	private getRedisKey(reportId: string): string {
		return `${this.redisKeyPrefix}${reportId}`;
	}

	async getAll(): Promise<Report[]> {
		const keys = await this.client.keys(`${this.redisKeyPrefix}*`);
		const values = await this.client.mGet(keys);
		const reports = values
			.filter((val): val is string => typeof val === 'string')
			.map((val) => JSON.parse(val) as Report);

		return reports;
	}

	async getById(reportId: string): Promise<Report | undefined> {
		const data = await this.client.get(this.getRedisKey(reportId));
		return data ? (JSON.parse(data) as Report) : undefined;
	}

	async save(report: Report): Promise<void> {
		await this.client.set(this.getRedisKey(report.id), JSON.stringify(report));
	}

	async update(report: Report): Promise<void> {
		await this.save(report);
	}
}
