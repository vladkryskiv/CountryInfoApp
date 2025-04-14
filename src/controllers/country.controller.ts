import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CountryService } from '../services/country.service';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async getAvailableCountries() {
    try {
      return await this.countryService.getAvailableCountries();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch available countries',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':countryCode')
  async getCountryInfo(@Param('countryCode') countryCode: string) {
    try {
      return await this.countryService.getCountryInfo(countryCode);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch country information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 