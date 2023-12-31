import {AuthGuard} from '@nestjs/passport';

// Further reading: https://docs.nestjs.com/guards
export class JwtGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }
}