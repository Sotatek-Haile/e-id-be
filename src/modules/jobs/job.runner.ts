import { OrganizationConsoleModule } from './organization/organization-console.module';
import { PersonConsoleModule } from './person/person-console.module';
import { SeedConsoleModule } from './seed/seed.module';

export const CONSOLE_MODULES = [PersonConsoleModule, SeedConsoleModule, OrganizationConsoleModule];
