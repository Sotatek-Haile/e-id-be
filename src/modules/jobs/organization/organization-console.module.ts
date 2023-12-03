import { Module } from '@nestjs/common';

import { OrganizationConsole } from './organization.console';

@Module({
	providers: [OrganizationConsole],
})
export class OrganizationConsoleModule {}
