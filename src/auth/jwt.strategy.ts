import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
      @Injectable(AuthService)
      private usersAuthService: AuthService
  ){
    super({
      secretOrKey: 'topSecret51',
      jwtFromRequest: ExtractJwt.
    })
  }

}
