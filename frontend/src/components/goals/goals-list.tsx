'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/shadcn-ui/card';
import { SelectField } from '@/components/custom-fields/select-field';
import { GoalCard } from './goal-card';
import { apiClient, ApiError } from '@/lib/api-client';
import { toast } from 'sonner';

interface SavingGoal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
  isCompleted: boolean;
  completedAt?: string;
}

const filterOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'completed', label: 'Đã hoàn thành' },
];

interface GoalsListProps {
  refreshKey?: number;
  onGoalUpdated?: () => void;
}

export function GoalsList({ refreshKey = 0, onGoalUpdated }: GoalsListProps) {
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.get<SavingGoal[]>(`/goals?filter=${filter}`);
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Không thể tải danh sách mục tiêu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, refreshKey]);

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await apiClient.delete(`/goals/${goalId}`);
      toast.success('Xóa mục tiêu thành công');
      fetchGoals();
      onGoalUpdated?.();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Đã xảy ra lỗi';
      toast.error(message);
    }
  };

  const handleAddAmount = async (goalId: string, amount: number) => {
    try {
      await apiClient.post(`/goals/${goalId}/contribute`, { amount });
      toast.success('Thêm tiền thành công');
      fetchGoals();
      onGoalUpdated?.();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Đã xảy ra lỗi';
      toast.error(message);
    }
  };

  const filteredGoals = goals.filter((goal) => {
    if (filter === 'active') return !goal.isCompleted;
    if (filter === 'completed') return goal.isCompleted;
    return true;
  });

  const totalGoals = goals.length;
  const activeGoals = goals.filter((g) => !g.isCompleted).length;
  const completedGoals = goals.filter((g) => g.isCompleted).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#827BF2]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-[#5A607F]">Tổng mục tiêu</p>
          <p className="text-2xl font-bold text-[#1A1D2E] mt-1">{totalGoals}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-[#5A607F]">Đang hoạt động</p>
          <p className="text-2xl font-bold text-[#21AE5A] mt-1">{activeGoals}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-[#5A607F]">Đã hoàn thành</p>
          <p className="text-2xl font-bold text-[#827BF2] mt-1">{completedGoals}</p>
        </div>
      </div>

      {/* Filter and List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1A1D2E]">Danh sách mục tiêu</h2>
          <div className="w-48">
            <SelectField
              placeholder="Lọc"
              options={filterOptions}
              selected={filter}
              onChangeSelected={setFilter}
            />
          </div>
        </div>

        {filteredGoals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-[#5A607F]">Không có mục tiêu nào</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onDelete={() => handleDeleteGoal(goal._id)}
                onAddAmount={(amount) => handleAddAmount(goal._id, amount)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
