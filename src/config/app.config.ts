import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
	serviceName: 'api',
	port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
	prefixUrl: `api/v1`,
	// backendAuth: {
	// 	user: process.env.BACKEND_AUTH_USER || 'admin',
	// 	pass: process.env.BACKEND_AUTH_PASSWORD || '1',
	// },
	swagger: {
		title: 'E ID Service',
		description: 'Swagger documentation for  APIs',
		version: process.env.APP_VERSION || '1.0.0',
		user: process.env.SWAGGER_USER,
		password: process.env.SWAGGER_PASSWORD,
		path: '/docs/api',
	},
	mongodbUri: process.env.MONGODB_URI,
	urlApiAuth: process.env.URL_API_AUTH,
}));
