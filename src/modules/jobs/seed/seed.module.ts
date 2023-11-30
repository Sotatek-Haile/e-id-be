import { Module } from '@nestjs/common';

import { SeedConsole } from './seed.console';

@Module({
	providers: [SeedConsole],
})
export class SeedConsoleModule {}
