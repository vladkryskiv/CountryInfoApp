import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CalendarEvent } from '../entities/calendar-event.entity';
import { CountryService } from './country.service';
import { UserService } from '../services/user.service';
import { AddHolidaysDto } from '../dto/add-holidays.dto';

interface Holiday {
  name: string;
  date: string;
  localName?: string;
  countryCode?: string;
  fixed?: boolean;
  global?: boolean;
}

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEvent)
    private calendarEventRepository: Repository<CalendarEvent>,
    private countryService: CountryService,
    private userService: UserService,
  ) {}

  async addHolidaysToCalendar(userId: number, dto: AddHolidaysDto) {
    try {
      // Validate user exists
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found. Please create a user first.`);
      }

      // Get holidays from the API
      const holidays = await this.countryService.getPublicHolidays(
        dto.countryCode,
        dto.year,
      );

      if (!holidays || !Array.isArray(holidays)) {
        throw new BadRequestException('Failed to fetch holidays from the external API');
      }

      // Filter holidays if specific ones are requested
      const filteredHolidays = dto.holidays
        ? holidays.filter((holiday: Holiday) => {
            const holidayName = holiday.name || holiday.localName;
            return holidayName && dto.holidays?.includes(holidayName);
          })
        : holidays;

      if (dto.holidays && filteredHolidays.length === 0) {
        throw new BadRequestException('None of the requested holidays were found for this country and year');
      }

      // Create calendar events
      const calendarEvents = filteredHolidays.map((holiday: Holiday) => {
        const event = new CalendarEvent();
        event.title = holiday.name || holiday.localName || 'Unknown Holiday';
        event.date = new Date(holiday.date);
        event.countryCode = dto.countryCode;
        event.user = user;
        return event;
      });

      // Save events to database
      const savedEvents = await this.calendarEventRepository.save(calendarEvents);
      return {
        message: `Successfully added ${savedEvents.length} holidays to the calendar`,
        events: savedEvents
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to add holidays to calendar. Please try again later.'
      );
    }
  }
} 