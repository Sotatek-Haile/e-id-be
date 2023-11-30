import { LatestBlockRepository } from './latest-block.repository';
import { ManagerRepository } from './manager.repository';
import { MilestoneRepository } from './milestone.repository';
import { OrganizationRepository } from './organization.repository';
import { PersonRepository } from './person.repository';
import { ScoreHistoryRepository } from './score-history.repository';

export const REPOSITORIES = [
	LatestBlockRepository,
	ManagerRepository,
	PersonRepository,
	OrganizationRepository,
	MilestoneRepository,
	ScoreHistoryRepository,
];
