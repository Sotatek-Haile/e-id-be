import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';

export class BackendAuthenticationException extends BaseException {
	constructor(message?: string) {
		super(message || 'Authentication failed', HttpStatus.BAD_REQUEST);
	}
}

export class VerifyAuthenticationException extends BaseException {
	constructor(message?: string) {
		super(message, HttpStatus.UNAUTHORIZED);
	}
}
