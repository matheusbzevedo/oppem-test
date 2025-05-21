import type { RedisOptions } from 'bullmq';

export const redisConfig: RedisOptions = {
	host: 'localhost',
	port: 6379,
	maxRetriesPerRequest: 0,
};
