import { Milestone, MilestoneSchema } from '~/schemas/milestone.schema';
import { BaseRepository } from '~/shares/base/base.repository';
import { MongoRepository } from '~/shares/decorators/repository.decorator';

@MongoRepository(Milestone, MilestoneSchema)
export class MilestoneRepository extends BaseRepository<Milestone> {}
