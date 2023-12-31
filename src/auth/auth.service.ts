import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { JwtService } from "@nestjs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from 'argon2';
import { AuthDto } from "../dto";
import { PrismaService } from "../prisma/prisma.service";


@Injectable({})
export class AuthService{
    constructor(private prismaService: PrismaService, private jwt: JwtService, private config: ConfigService) {}

    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password);

        try {
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email,
                    hash: hash
                }
            });
            delete (await user).hash;
            return user;
        } catch(error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2002') throw new ForbiddenException("User already exists!");
            }
        }
    }

    async login(dto: AuthDto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email,
            }
        });
        if(!user) {
            throw new ForbiddenException('Credentials incorrect!')
        }

        const pwMatches = await argon.verify(user.hash,dto.password);
        if(!pwMatches) {
            throw new ForbiddenException('Credentials incorrect!')
        }
        
        const token = await this.signToken(user.id,user.email);
        return {
            access_token: token
        };
    }

    async signToken(userId: number, email: string): Promise<string> {
        const payload = {
            sub: userId,
            email
        };
        return this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET')
        });
    }
}