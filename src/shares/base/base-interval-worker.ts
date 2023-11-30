import { Logger } from '@nestjs/common';

export abstract class BaseIntervalWorker {
	protected logger = new Logger(BaseIntervalWorker.name);
	protected _isStarted = false;
	protected _nextTickTimer = 30000;
	protected _processingTimeout = 300000;

	public start(): void {
		if (this._isStarted) {
			this.logger.warn(`Trying to start processor twice: ${this.constructor.name}`);
			return;
		}

		this._isStarted = true;

		this.prepare()
			.then(res => {
				this.logger.log(res);
				this.logger.log(`${this.constructor.name} finished preparing. Will start the first tick shortly...`);
				this.onTick();
			})
			.catch(err => {
				throw err;
			});
	}

	public getNextTickTimer(): number {
		return this._nextTickTimer;
	}

	public getProcessingTimeout(): number {
		return this._processingTimeout;
	}

	protected setNextTickTimer(timeout: number): void {
		this._nextTickTimer = timeout;
	}

	protected setProcessingTimeout(timeout: number): void {
		this._processingTimeout = timeout;
	}

	protected onTick(): void {
		const duration = this.getProcessingTimeout();
		const classname = this.constructor.name;
		const timer = setTimeout(async () => {
			this.logger.log(
				`${classname}::onTick timeout (${duration} ms) is exceeded. Worker will be restarted shortly...`,
			);
			process.exit(1);
		}, duration);

		this.doProcess()
			.then(() => {
				clearTimeout(timer);
				setTimeout(() => {
					this.onTick();
				}, this.getNextTickTimer());
			})
			.catch(err => {
				clearTimeout(timer);
				this.logger.error(
					`======================================================================================`,
				);
				this.logger.error(err);
				this.logger.error(`${classname} something went wrong. The worker will be restarted shortly...`);
				this.logger.error(
					`======================================================================================`,
				);
				setTimeout(() => {
					this.onTick();
				}, this.getNextTickTimer());
			});
	}

	protected abstract prepare(): Promise<void>;
	protected abstract doProcess(): Promise<void>;
}

export default BaseIntervalWorker;
