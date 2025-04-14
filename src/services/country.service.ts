import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface CountryData {
  iso2: string;
  populationCounts?: Array<{ year: number; value: number }>;
  flag?: string;
}

interface Holiday {
  name: string;
  date: string;
}

@Injectable()
export class CountryService {
  private readonly dateNagerApiUrl: string;
  private readonly countriesApiUrl: string;

  constructor(private configService: ConfigService) {
    const dateNagerUrl = this.configService.get<string>('DATE_NAGER_API_URL');
    const countriesUrl = this.configService.get<string>('COUNTRIES_API_URL');
    
    if (!dateNagerUrl || !countriesUrl) {
      throw new Error('Required environment variables are not set');
    }
    
    this.dateNagerApiUrl = dateNagerUrl;
    this.countriesApiUrl = countriesUrl;
  }

  async getAvailableCountries() {
    const response = await axios.get(`${this.dateNagerApiUrl}/AvailableCountries`);
    return response.data;
  }

  async getCountryInfo(countryCode: string) {
    const [borderCountries, populationData, flagData] = await Promise.all([
      this.getBorderCountries(countryCode),
      this.getPopulationData(countryCode),
      this.getFlagUrl(countryCode),
    ]);

    return {
      borderCountries,
      populationData,
      flagUrl: flagData,
    };
  }

  private async getBorderCountries(countryCode: string) {
    const response = await axios.get(`${this.dateNagerApiUrl}/CountryInfo/${countryCode}`);
    return response.data;
  }

  private async getPopulationData(countryCode: string) {
    const response = await axios.get<{ data: CountryData[] }>(`${this.countriesApiUrl}/population`);
    const countryData = response.data.data.find(
      (country) => country.iso2 === countryCode.toUpperCase(),
    );
    return countryData?.populationCounts || [];
  }

  private async getFlagUrl(countryCode: string) {
    const response = await axios.get<{ data: CountryData[] }>(`${this.countriesApiUrl}/flag/images`);
    const countryData = response.data.data.find(
      (country) => country.iso2 === countryCode.toUpperCase(),
    );
    return countryData?.flag || null;
  }

  async getPublicHolidays(countryCode: string, year: number): Promise<Holiday[]> {
    const response = await axios.get<Holiday[]>(
      `${this.dateNagerApiUrl}/PublicHolidays/${year}/${countryCode}`,
    );
    return response.data;
  }
} 