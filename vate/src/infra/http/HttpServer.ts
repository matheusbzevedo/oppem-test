import express, { type Request, type Response } from 'express';

export default interface HttpServer {
	listen(port: number): void;
	register(
		method: string,
		url: string,
		callback: (params: unknown, body: unknown) => Promise<unknown> | unknown,
	): void;
}

export class ExpressAdapter implements HttpServer {
	app: express.Express;

	constructor() {
		this.app = express();
		this.app.use(express.json());
	}

	listen(port: number): void {
		this.app.listen(port, () => `Running on port ${port}`);
	}

	register(
		method: string,
		url: string,
		callback: (params: unknown, body: unknown) => Promise<unknown> | unknown,
	): void {
		this.app[method as keyof express.Express](
			url,
			async (request: Request, response: Response) => {
				try {
					const output = await callback(request.params, request.body);

					return response.json(output);
				} catch (error) {
					if (error instanceof Error) {
						response.status(422).json({ message: error.message });
					}

					response.status(500).json({ message: 'Internal server error' });
				}
			},
		);
	}
}
