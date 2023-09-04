import { AuthData } from 'src/authmanager/lib/strategies/auth.strategy';
import { GetAuthData } from 'src/authmanager/lib/decorators/get-auth-data.decorator';
import { JwtAuthGuard } from 'src/authmanager/lib/jwt-guard/jwt-guard.guard';
// import { ResponseMessage } from '@circle-ng/utils';
import { Body, Controller, Injectable, Ip, Post, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiHeaders,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dtos/auth-register.dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('user/register')
    @ApiOperation({ summary: 'Register a user' })
    @ApiOkResponse({ description: 'Registration success'})
    @ApiUnprocessableEntityResponse({ description: 'Validation error' })
    register(@Body() body: AuthRegisterDto) {
        return this.authService.registerUser(body);
    }
}
