import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as httpContext from 'express-http-context';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { setCorrelationId } from './middlewares/app-logger.middleware';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	const appConfigObj = configService.get('app');

	app.use(httpContext.middleware);
	app.enableCors();
	app.use(setCorrelationId);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);
	// app.useGlobalFilters(new AllExceptionsFilter());
	app.setGlobalPrefix(appConfigObj.prefixUrl);

	// app.use(helmet());
	const options = new DocumentBuilder()
		.setTitle(appConfigObj.swagger.title)
		.setDescription(appConfigObj.swagger.description)
		.setVersion(appConfigObj.swagger.version)
		.addBearerAuth()
		.addBasicAuth()
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup(appConfigObj.swagger.path, app, document, {
		customSiteTitle: appConfigObj.swagger.title,
	});

	await app.listen(appConfigObj.port, () => {
		console.log(`${appConfigObj.serviceName} running on ${appConfigObj.port}`);
		console.log(`swagger: http://localhost:${appConfigObj.port}${appConfigObj.swagger.path}`);
	});
}

bootstrap();
