import { Body, Controller, Injectable, Ip, Param, Post, UseGuards } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AuthData } from 'src/authmanager/lib/strategies/auth.strategy';
import { GetAuthData } from 'src/authmanager/lib/decorators/get-auth-data.decorator';
import { JwtAuthGuard } from 'src/authmanager/lib/jwt-guard/jwt-guard.guard';

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
import { User } from '@prisma/client';

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

    @Post('user/verify-email/:token')
    @ApiOperation({ summary: 'Verify user account' })
    @ApiOkResponse({ description: 'success' })
    @ApiUnprocessableEntityResponse({ description: 'Validation error' })
    verifyEmail(
    @Param('token') token: string,
    ) {
      return this.authService.verifyUser(token);
    }

    // Cron job that runs every that runs every 6 hours to delete unverified user accounts
    @Cron('0 */6 * * *', {
        timeZone: 'Africa/Lagos'
    })
    handleCron() {
        return this.authService.deleteUnverifiedAccounts();
    }
}
