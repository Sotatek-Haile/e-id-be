import { Module } from '@nestjs/common';

import { PersonConsole } from './person.console';

@Module({
	providers: [PersonConsole],
})
export class PersonConsoleModule {}
