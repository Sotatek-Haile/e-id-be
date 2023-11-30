import { Manager, ManagerSchema } from '~/schemas/manager.schema';
import { BaseRepository } from '~/shares/base/base.repository';
import { MongoRepository } from '~/shares/decorators/repository.decorator';

@MongoRepository(Manager, ManagerSchema)
export class ManagerRepository extends BaseRepository<Manager> {}
