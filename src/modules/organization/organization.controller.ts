import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OrganizationService } from './organization.service';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
	constructor(private readonly organizationService: OrganizationService) {}

	@Get('all')
	getAllPeople(): Promise<any[]> {
		return this.organizationService.getOrganization();
	}
}
