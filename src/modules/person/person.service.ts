import { BadRequestException, Injectable } from '@nestjs/common';

import { PersonRepository } from '~/repositories/person.repository';
import { ScoreHistoryRepository } from '~/repositories/score-history.repository';
import { Person } from '~/schemas/person.schema';

import { CreatePersonRequestDto, PersonEvent } from './dtos/request.dto';

@Injectable()
export class PersonService {
	constructor(
		private readonly personRepository: PersonRepository,
		private readonly scoreHistoryRepository: ScoreHistoryRepository,
	) {}

	getAllPeople(): Promise<Person[]> {
		return this.personRepository.getAllPeople();
	}

	async createPerson(data: CreatePersonRequestDto): Promise<void> {
		await this.personRepository.create({
			...data,
		});
	}

	async addPersonEvent(data: PersonEvent): Promise<void> {
		await this.scoreHistoryRepository.create({
			...data,
		});
	}

	async getPersonDetail(personAddress: string): Promise<any> {
		const person = await this.personRepository.getPersonDetail(personAddress);

		if (!person) throw new BadRequestException({ message: 'Person not found' });

		return person;
	}
}
