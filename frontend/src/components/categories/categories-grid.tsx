'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/shadcn-ui/card';
import { Button } from '@/components/shadcn-ui/button';
import { Badge } from '@/components/shadcn-ui/badge';
import { CategoryFormDialog } from './category-form-dialog';
import { formatCurrency } from '@/utils/format-number';
import { getIconById } from '@/data/icons';
import { apiClient, ApiError } from '@/lib/api-client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/shadcn-ui/dialog';

interface CategoryData {
  _id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
  isDefault: boolean;
}

interface CategoryBreakdownRaw {
  _id: string;
  total: number;
  count: number;
  category?: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  };
}

interface CategoryBreakdown {
  _id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
}

interface CategoriesGridProps {
  refreshKey?: number;
}

function getCurrentMonthYear() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

export function CategoriesGrid({ refreshKey = 0 }: CategoriesGridProps) {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteCategory, setDeleteCategory] = useState<CategoryData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const { month, year } = getCurrentMonthYear();

      const [categoriesData, breakdownRaw] = await Promise.all([
        apiClient.get<CategoryData[]>('/categories'),
        apiClient.get<CategoryBreakdownRaw[]>(`/reports/by-category?month=${month}&year=${year}`),
      ]);

      const expenseCategories = categoriesData.filter(
        (c) => c.type === 'expense' || c.type === 'both'
      );
      setCategories(expenseCategories);

      const breakdown: CategoryBreakdown[] = breakdownRaw.map((b) => ({
        _id: b._id,
        name: b.category?.name || '',
        icon: b.category?.icon || '',
        color: b.category?.color || '#827BF2',
        total: b.total,
      }));
      setCategoryBreakdown(breakdown);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Không thể tải danh sách danh mục');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const handleDelete = async () => {
    if (!deleteCategory) return;

    setIsDeleting(true);
    try {
      await apiClient.delete(`/categories/${deleteCategory._id}`);
      toast.success('Xóa danh mục thành công');
      fetchCategories();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Đã xảy ra lỗi';
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setDeleteCategory(null);
    }
  };

  const getBreakdown = (categoryId: string) => {
    return categoryBreakdown.find((b) => b._id === categoryId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#827BF2]" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-8 text-center">
        <p className="text-[#5A607F] mb-4">Chưa có danh mục nào</p>
        <CategoryFormDialog
          trigger={
            <Button className="bg-[#827BF2] hover:bg-[#6B5FD4]">
              Tạo danh mục đầu tiên
            </Button>
          }
          onSuccess={fetchCategories}
        />
      </div>
    );
  }

  const totalExpense = categoryBreakdown.reduce((sum, cat) => sum + cat.total, 0);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => {
          const breakdown = getBreakdown(category._id);
          const percentage = breakdown && totalExpense > 0
            ? ((breakdown.total / totalExpense) * 100).toFixed(1)
            : '0';
          const IconComponent = getIconById(category.icon);

          return (
            <Card
              key={category._id}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-[#5A607F]"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <IconComponent className="w-6 h-6" style={{ color: category.color }} />
                  </div>
                  <div className="flex gap-1">
                    <CategoryFormDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                      }
                      initialData={category}
                      onSuccess={fetchCategories}
                    />
                    {!category.isDefault && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-[#E40127] hover:bg-red-50"
                        onClick={() => setDeleteCategory(category)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                <h3 className="font-semibold text-[#1A1D2E] mb-1">{category.name}</h3>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl font-bold text-[#1A1D2E] whitespace-nowrap">
                    {formatCurrency(breakdown?.total || 0)}
                  </span>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {percentage}%
                  </Badge>
                </div>

                <div className="h-1.5 rounded-full bg-[#F2F4F8] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>

                {category.isDefault && (
                  <p className="text-xs text-[#9EA3B8] mt-2">Danh mục mặc định</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa danh mục</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Bạn có chắc chắn muốn xóa danh mục <strong>{deleteCategory?.name}</strong> không?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCategory(null)} disabled={isDeleting}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
