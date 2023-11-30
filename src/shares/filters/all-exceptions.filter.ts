import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { LoggerService } from 'shares/helpers/logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	private logger = LoggerService.get(AllExceptionsFilter.name);

	catch(exception: any, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const isHttpException = exception instanceof HttpException;
		const err = isHttpException ? exception.getResponse() : exception.response;

		const isStringMessage = typeof err?.message === 'string';
		const isArrayMessage = Array.isArray(err?.message);

		let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
		try {
			statusCode = exception.getStatus();
		} catch (e) {
			this.logger.error(exception);
		}

		let error = 'Internal server error';
		let message: string[] = [error];

		if (isStringMessage) {
			message = [err.message];
			error = err.error ?? err.message;
		} else if (isArrayMessage) {
			message = err.message;
			error = err.error;
		}

		response.status(statusCode).json({
			statusCode,
			message,
			error,
		});
	}
}
