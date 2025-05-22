import { Queue } from 'bullmq';
import type Report from '../../../domain/entity/Report';
import { redisConfig } from '../../config/Redis';

export class CreateReportQueue {
	private queue: Queue;

	constructor() {
		this.queue = new Queue('createReportQueue', { connection: redisConfig });
	}

	async enqueue(report: Report): Promise<void> {
		await this.queue.add('createReport', report);
	}
}
