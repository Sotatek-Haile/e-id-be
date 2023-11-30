import { BootstrapConsole } from 'nestjs-console';

import { RunnableModule } from '~/modules/jobs/runnable.module';

const bootstrap = new BootstrapConsole({
	module: RunnableModule,
	useDecorators: true,
	contextOptions: {
		logger: ['debug', 'error', 'log', 'warn'],
	},
});
bootstrap.init().then(async app => {
	try {
		await app.init();
		await bootstrap.boot();
		await app.close();
	} catch (e) {
		console.error(e);
		await app.close();
		process.exit(1);
	}
});
