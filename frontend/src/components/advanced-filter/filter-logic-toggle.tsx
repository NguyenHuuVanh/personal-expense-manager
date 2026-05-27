'use client';

import { cn } from '@/utils/cn';

type FilterLogicToggleProps = {
  logic: 'AND' | 'OR';
  onChange: (logic: 'AND' | 'OR') => void;
};

export function FilterLogicToggle({ logic, onChange }: FilterLogicToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 text-sm">
      <span className="text-muted-foreground">Khớp với</span>
      <div className="inline-flex items-center rounded-md border border-border bg-muted/50 p-0.5">
        <button
          type="button"
          onClick={() => onChange('AND')}
          className={cn(
            'px-2.5 py-1 rounded text-xs font-medium transition-all duration-200 cursor-pointer',
            logic === 'AND'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          TẤT CẢ
        </button>
        <button
          type="button"
          onClick={() => onChange('OR')}
          className={cn(
            'px-2.5 py-1 rounded text-xs font-medium transition-all duration-200 cursor-pointer',
            logic === 'OR'
              ? 'bg-secondary text-secondary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          BẤT KỲ
        </button>
      </div>
      <span className="text-muted-foreground">điều kiện sau</span>
    </div>
  );
}
