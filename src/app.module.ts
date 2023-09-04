import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UserModule } from './modules/users/user/user.module';
// import { AuthModule } from './modules/users/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
