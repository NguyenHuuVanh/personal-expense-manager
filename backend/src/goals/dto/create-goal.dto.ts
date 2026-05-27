import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  targetAmount: number;

  @IsDateString()
  deadline: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;
}

export class UpdateGoalDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  targetAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  currentAmount?: number;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}
