import { Global, Module, Provider } from '@nestjs/common';
import { getModelToken, ModelDefinition, MongooseModule } from '@nestjs/mongoose';

import { REPOSITORY_MODEL_META_KEY, REPOSITORY_SCHEMA_META_KEY } from '~/shares/constants/repository.constant';

import { REPOSITORIES } from '.';

function getModelDefinitions(): ModelDefinition[] {
	return REPOSITORIES.map(repo => {
		const model = Reflect.getMetadata(REPOSITORY_MODEL_META_KEY, repo);
		const schema = Reflect.getMetadata(REPOSITORY_SCHEMA_META_KEY, repo);
		return { name: model.name, schema };
	});
}

function getModelProvider(): Provider[] {
	return REPOSITORIES.map(repo => {
		const model = Reflect.getMetadata(REPOSITORY_MODEL_META_KEY, repo);
		return {
			provide: repo,
			useFactory: (m: any) => new repo(m),
			inject: [getModelToken(model.name)],
		} as Provider;
	});
}

@Global()
@Module({
	imports: [MongooseModule.forFeature(getModelDefinitions())],
	providers: [...getModelProvider()],
	exports: [...getModelProvider()],
})
export class RepositoryModule {}
