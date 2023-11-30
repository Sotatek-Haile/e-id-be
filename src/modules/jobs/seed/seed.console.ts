import { Injectable } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';

import { MilestoneRepository } from '~/repositories/milestone.repository';

@Console()
@Injectable()
export class SeedConsole {
	constructor(private readonly milestoneRepository: MilestoneRepository) {}

	@Command({ command: 'seed:milestone' })
	async seedMilestone(): Promise<void> {
		await this.milestoneRepository.createMany([
			{
				name: 'Tốt nghiệp tiểu học',
				score: 100,
			},
			{
				name: 'Tốt nghiệp trung học',
				score: 200,
			},
			{
				name: 'Tốt nghiệp THPT',
				score: 400,
			},
			{
				name: 'Tốt nghiệp Đại học',
				score: 1000,
			},
			{
				name: 'Vứt rác',
				score: -1,
			},
		]);
	}
}
