import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { ResponseDto } from '../dto/base-response.dto';

export class ResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<ResponseDto<any>> {
		return next.handle().pipe(map(data => new ResponseDto(data)));
	}
}
