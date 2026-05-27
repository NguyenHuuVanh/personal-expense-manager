'use client';

import { useState } from 'react';
import { MoreVertical, Pencil, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/shadcn-ui/card';
import { Button } from '@/components/shadcn-ui/button';
import { Badge } from '@/components/shadcn-ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn-ui/dialog';
import { Input } from '@/components/shadcn-ui/input';
import { formatCurrency } from '@/utils/format-number';
import { cn } from '@/utils/cn';
import { CategoryIcon } from '@/components/ui/category-icon';

import type { GoalCardProps } from '@/types/goal';

export type { GoalCardProps } from '@/types/goal';

export function GoalCard({ goal, onDelete, onAddAmount }: GoalCardProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addAmount, setAddAmount] = useState('');

  const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const remaining = goal.targetAmount - goal.currentAmount;
  const isCompleted = goal.isCompleted || goal.currentAmount >= goal.targetAmount;

  const daysUntilDeadline = Math.ceil(
    (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleAddAmount = () => {
    const amount = Number(addAmount);
    if (amount > 0) {
      onAddAmount?.(amount);
      setShowAddModal(false);
      setAddAmount('');
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${goal.color}20` }}
              >
                <CategoryIcon iconId={goal.icon} size={24} style={{ color: goal.color }} />
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1D2E]">{goal.name}</h3>
                <p className="text-sm text-[#5A607F]">
                  {isCompleted ? (
                    <Badge variant="success" className="bg-[#21AE5A]">Đã hoàn thành</Badge>
                  ) : (
                    `Còn ${daysUntilDeadline} ngày`
                  )}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Amount */}
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-bold text-[#1A1D2E]">
                  {formatCurrency(goal.currentAmount)}
                </span>
                <span className="text-sm text-[#5A607F]">
                  / {formatCurrency(goal.targetAmount)}
                </span>
              </div>
              <div className="h-3 w-full bg-[#F2F4F8] rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', isCompleted ? 'bg-[#21AE5A]' : 'bg-[#827BF2]')}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Remaining */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#5A607F]">
                {isCompleted ? (
                  <span className="text-[#21AE5A] font-medium">Mục tiêu đã đạt!</span>
                ) : (
                  <>
                    Còn lại: <span className="font-medium text-[#1A1D2E]">{formatCurrency(remaining)}</span>
                  </>
                )}
              </span>
              <span className="text-[#5A607F]">{percentage.toFixed(0)}%</span>
            </div>

            {/* Actions */}
            {!isCompleted && (
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm tiền
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-[#E40127] hover:bg-red-50" onClick={onDelete}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Amount Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm tiền vào mục tiêu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                Số tiền muốn thêm
              </label>
              <Input
                type="number"
                placeholder="Nhập số tiền"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
              />
            </div>
            <p className="text-sm text-[#5A607F]">
              Mục tiêu: {goal.name}
              <br />
              Còn lại: {formatCurrency(remaining)}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Hủy
            </Button>
            <Button className="bg-[#827BF2] hover:bg-[#6B5FD4]" onClick={handleAddAmount}>
              Thêm tiền
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
