import { Injectable } from '@nestjs/common';

import { OrganizationRepository } from '~/repositories/organization.repository';
import { Organization } from '~/schemas/organization.schema';

@Injectable()
export class OrganizationService {
	constructor(private readonly organizationRepository: OrganizationRepository) {}

	getOrganization(): Promise<Organization[]> {
		return this.organizationRepository.find();
	}
}
