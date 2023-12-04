import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateMileStoneRequestDto } from './dtos/request.dto';
import { MilestoneService } from './milestone.service';

@ApiTags('Milestone')
@Controller('milestone')
export class MilestoneController {
	constructor(private readonly milestoneService: MilestoneService) {}

	@Get('all')
	getAllMilestone(): Promise<any> {
		return this.milestoneService.getAllMilestone();
	}

	@Post()
	addMileStone(@Body() body: CreateMileStoneRequestDto): Promise<void> {
		return this.milestoneService.addMileStone(body);
	}

	@Delete(':id')
	deleteMilestone(@Param('id') id: string): Promise<void> {
		return this.milestoneService.deleteMileStone(id);
	}
}
