import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  create(@Request() req, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(req.user.userId, createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories for current user' })
  findAll(@Request() req) {
    return this.categoriesService.findAllByUser(req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category' })
  update(@Request() req, @Param('id') id: string, @Body() updateDto: Partial<CreateCategoryDto>) {
    return this.categoriesService.update(id, req.user.userId, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  delete(@Request() req, @Param('id') id: string) {
    return this.categoriesService.delete(id, req.user.userId);
  }
}
