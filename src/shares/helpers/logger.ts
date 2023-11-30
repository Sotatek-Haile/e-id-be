import * as util from 'util';
import * as winston from 'winston';
import Transport from 'winston-transport';

const { combine, colorize, printf } = winston.format;
const { timestamp } = winston.format;

export const LogTransport = {
	Console: 'consoleLog',
};

export function safeToString(json: any): string {
	if (isEmpty(json)) {
		return null;
	}

	try {
		return JSON.stringify(json, null, 2);
	} catch (ex) {
		return util.inspect(json);
	}
}

export function isEmpty(obj: any): boolean {
	// null and undefined are "empty"
	if (obj == null) return true;

	// Assume if it has a length property with a non-zero value
	// that that property is correct.
	if (obj.length > 0) return false;
	if (obj.length === 0) return true;

	// If it isn't an object at this point
	// it is empty, but it can't be anything *but* empty
	// Is it empty?  Depends on your application.
	if (typeof obj !== 'object') return true;

	// Otherwise, does it have any properties of its own?
	// Note that this doesn't handle
	// toString and valueOf enumeration bugs in IE < 9
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
	}

	return true;
}

const enumerateErrorFormat = winston.format(info => {
	if (info instanceof Error) {
		return Object.assign(
			{
				message: info.message,
				stack: info.stack,
			},
			info,
		);
	}
	return info;
});

const getConfigTransports = (transportNames: string[]): any[] => {
	const configTransports = [];
	if (transportNames.includes(LogTransport.Console)) {
		configTransports.push(
			new winston.transports.Console({
				format: combine(
					colorize(),
					printf(info => {
						const { timestamp, level, message, ...extra } = info;
						return (
							`${timestamp} [${level}]: ${message}` + (isEmpty(extra) ? '' : ` | ${safeToString(extra)}`)
						);
					}),
				),
			}),
		);
	}
	return configTransports;
};

const defaultTransports = getConfigTransports([LogTransport.Console]);

export class LoggerService {
	static get(name = '', transportNames?: string[]): winston.Logger {
		const isLoggerExisted = winston.loggers.has(name as string);
		if (!isLoggerExisted) {
			this.create(name, transportNames);
		}

		return winston.loggers.get(name as string);
	}

	private static create = (name?: string, transportNames?: string[]): void => {
		const transports: Transport[] = [];
		if (transportNames) {
			const configTransports = getConfigTransports(transportNames);
			transports.push(...configTransports);
		} else {
			transports.push(...(defaultTransports as any));
		}
		winston.loggers.add(name as string, {
			level: 'info',
			format: winston.format.combine(timestamp(), enumerateErrorFormat()),
			transports,
		});
	};
}
