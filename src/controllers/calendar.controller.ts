import { Controller, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CalendarService } from '../services/calendar.service';
import { AddHolidaysDto } from '../dto/add-holidays.dto';

@Controller('users/:userId/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('holidays')
  async addHolidaysToCalendar(
    @Param('userId') userId: string,
    @Body() dto: AddHolidaysDto,
  ) {
    try {
      return await this.calendarService.addHolidaysToCalendar(parseInt(userId), dto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to add holidays to calendar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 