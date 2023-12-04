import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HttpResponseSuccess } from '~/shares/decorators/http-response.decorator';

import { CreatePersonRequestDto } from './dtos/request.dto';
import { PersonResponse } from './dtos/response.dto';
import { PersonService } from './person.service';

@ApiTags('Person')
@Controller('person')
export class PersonController {
	constructor(private readonly personService: PersonService) {}

	@Get('all')
	@HttpResponseSuccess({
		type: [PersonResponse],
	})
	getAllPeople(): Promise<PersonResponse[]> {
		return this.personService.getAllPeople();
	}

	@Post()
	createPerson(@Body() body: CreatePersonRequestDto): Promise<void> {
		return this.personService.createPerson(body);
	}

	// @Post(':id/event')
	// addPersonEvent(@Body() body: PersonEvent): Promise<void> {
	// 	return this.personService.addPersonEvent(body);
	// }

	@Get('detail/:personAddress')
	getPersonDetail(@Param('personAddress') personAddress: string): Promise<any> {
		return this.personService.getPersonDetail(personAddress);
	}
}
