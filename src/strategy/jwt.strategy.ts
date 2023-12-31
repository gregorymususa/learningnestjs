import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from '@nestjs/config';

import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private config: ConfigService, private prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET')
        });
    }

    async validate(payload: {sub: number; email: string;}) {
        // jwt token consists of HEADER, PAYLOAD, and VERIFY SIGNATURE
        // this returns the payload part of the JWT token
        //console.log(JSON.stringify(payload));
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email,
            }
        });
        delete user.hash;

        // returning it, appends a user object, to the request
        // and this user object contains the payload
        return user;
    }
}