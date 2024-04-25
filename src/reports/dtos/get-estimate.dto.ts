import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  Max,
  Min,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Max(1000000)
  @Min(0)
  mileage: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;
}
