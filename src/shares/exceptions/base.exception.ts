import { HttpException } from '@nestjs/common';

export class BaseException extends HttpException {
	constructor(message: string, httpStatus: number) {
		super(message, httpStatus);
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	getResponse(): {
		statusCode: number;
		message: (string | object)[];
		error: string | object;
	} {
		const message = super.getResponse();
		return {
			statusCode: this.getStatus(),
			message: [message],
			error: message,
		};
	}
}
