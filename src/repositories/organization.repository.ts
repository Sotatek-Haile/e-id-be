import { Organization, OrganizationSchema } from '~/schemas/organzation.schema';
import { BaseRepository } from '~/shares/base/base.repository';
import { MongoRepository } from '~/shares/decorators/repository.decorator';

@MongoRepository(Organization, OrganizationSchema)
export class OrganizationRepository extends BaseRepository<Organization> {}
