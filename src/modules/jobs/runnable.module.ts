import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';

import { ConfigModule } from '~/config/config.module';
import { MongoModule } from '~/databases/mongo.module';

import { RepositoryModule } from '../../repositories/repository.module';
import { CONSOLE_MODULES } from './job.runner';

@Module({
	imports: [MongoModule, ConfigModule, ConsoleModule, RepositoryModule, ...CONSOLE_MODULES],
})
export class RunnableModule {}
