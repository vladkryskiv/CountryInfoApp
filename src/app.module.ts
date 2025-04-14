import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryController } from './controllers/country.controller';
import { CalendarController } from './controllers/calendar.controller';
import { UserController } from './controllers/user.controller';
import { CountryService } from './services/country.service';
import { CalendarService } from './services/calendar.service';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { CalendarEvent } from './entities/calendar-event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, CalendarEvent],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, CalendarEvent]),
  ],
  controllers: [CountryController, CalendarController, UserController],
  providers: [CountryService, CalendarService, UserService],
})
export class AppModule {} 