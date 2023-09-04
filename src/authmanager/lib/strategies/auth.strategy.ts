import config from '../../../config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {ExtractJwt, Strategy } from 'passport-jwt';
import { InternalCacheService } from '../internal-cache/internal-cache.service';

export interface AuthData {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    exp: number;
    pushToken?: string;
    phoneNumber?: string;
    access: string[];
    pin: string;
    authId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'user') {
    constructor(private readonly cache: InternalCacheService) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: config.jwt.publicKey,
          passReqToCallback: true,
        });
      }
    
      async validate(request: any, payload: any) {
        const authData = await this.cache.get<AuthData>(payload.authId);
    
        if (authData) {
          request.authData = authData;
          return authData;
        }
    
        throw new UnauthorizedException('Invalid token');
    }
}