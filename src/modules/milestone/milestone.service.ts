import { Injectable } from '@nestjs/common';

import { MilestoneRepository } from '~/repositories/milestone.repository';
import { Milestone } from '~/schemas/milestone.schema';

import { CreateMileStoneRequestDto } from './dtos/request.dto';

@Injectable()
export class MilestoneService {
	constructor(private readonly milestoneRepository: MilestoneRepository) {}

	getAllMilestone(): Promise<Milestone[]> {
		return this.milestoneRepository.find();
	}

	async addMileStone(data: CreateMileStoneRequestDto): Promise<void> {
		await this.milestoneRepository.create({
			name: data.name,
			score: data.score,
		});
	}

	async deleteMileStone(id: string): Promise<void> {
		await this.milestoneRepository.deleteOne({
			_id: id,
		});
	}
}
