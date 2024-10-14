import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CharacterModule } from './modules/character/character.module';

@Module({
  imports: [UserModule, AuthModule, CharacterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
