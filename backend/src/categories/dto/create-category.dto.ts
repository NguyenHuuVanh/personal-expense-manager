import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Ăn uống' })
  @IsString()
  name: string;

  @ApiProperty({ example: '🍜', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ example: '#FF5733', required: false })
  @IsOptional()
  @IsString()
  color?: string;
}
