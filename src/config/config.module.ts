import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import configs from '.';

@Module({
	imports: [NestConfigModule.forRoot({ load: configs, isGlobal: true })],
})
export class ConfigModule {}
