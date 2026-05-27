import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  async create(userId: string, createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new this.categoryModel({ ...createCategoryDto, userId });
    return category.save();
  }

  async findAllByUser(userId: string): Promise<Category[]> {
    return this.categoryModel.find({ userId }).exec();
  }

  async update(id: string, userId: string, updateDto: Partial<CreateCategoryDto>): Promise<Category> {
    const category = await this.categoryModel
      .findOneAndUpdate({ _id: id, userId }, updateDto, { new: true })
      .exec();
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.categoryModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Category not found');
  }

  async seedDefaults(userId: string): Promise<void> {
    const defaults = [
      { name: 'Ăn uống', icon: '🍜', color: '#FF5733' },
      { name: 'Di chuyển', icon: '🚗', color: '#33A1FF' },
      { name: 'Giải trí', icon: '🎮', color: '#9B59B6' },
      { name: 'Mua sắm', icon: '🛒', color: '#2ECC71' },
      { name: 'Hóa đơn', icon: '📄', color: '#F39C12' },
      { name: 'Sức khỏe', icon: '💊', color: '#E74C3C' },
      { name: 'Khác', icon: '📦', color: '#95A5A6' },
    ];

    for (const cat of defaults) {
      await this.categoryModel.findOneAndUpdate(
        { name: cat.name, userId },
        { ...cat, userId, isDefault: true },
        { upsert: true },
      );
    }
  }
}
