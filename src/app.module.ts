import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { MongoModule } from './databases/mongo.module';
import { AppLoggerMiddleware } from './middlewares/app-logger.middleware';
import { MODULES } from './modules';
import { RepositoryModule } from './repositories/repository.module';
import { InterceptorModule } from './shares/interceptors/interceptor.module';

@Module({
	imports: [MongoModule, ConfigModule, InterceptorModule, RepositoryModule, ...MODULES],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*');
	}
}
