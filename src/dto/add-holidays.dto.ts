import { IsString, IsNumber, IsArray, IsOptional, Length } from 'class-validator';

export class AddHolidaysDto {
  @IsString()
  @Length(2, 2, { message: 'Country code must be exactly 2 characters' })
  countryCode: string;

  @IsNumber()
  year: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  holidays?: string[];
} 