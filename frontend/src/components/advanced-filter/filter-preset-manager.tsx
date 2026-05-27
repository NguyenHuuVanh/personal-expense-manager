'use client';

import type { FilterPreset } from '@/types/advanced-filter';
import { Bookmark, Clock, Save, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/shadcn-ui/button';
import { cn } from '@/utils/cn';

type FilterPresetManagerProps = {
  presets: FilterPreset[];
  onLoadPreset: (presetId: string) => void;
  onSavePreset: (name: string) => void;
  onDeletePreset: (presetId: string) => void;
  hasActiveRules: boolean;
};

export function FilterPresetManager({
  presets,
  onLoadPreset,
  onSavePreset,
  onDeletePreset,
  hasActiveRules,
}: FilterPresetManagerProps) {
  const [isNaming, setIsNaming] = useState(false);
  const [presetName, setPresetName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNaming) {
      inputRef.current?.focus();
    }
  }, [isNaming]);

  const handleSave = () => {
    if (!presetName.trim()) {
      return;
    }
    onSavePreset(presetName.trim());
    setPresetName('');
    setIsNaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsNaming(false);
      setPresetName('');
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'hôm nay';
    }
    if (diffDays === 1) {
      return 'hôm qua';
    }
    if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    }
    return d.toLocaleDateString('vi-VN');
  };

  return (
    <div className="border-t border-border pt-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <Bookmark className="w-3.5 h-3.5" />
          Bộ lọc đã lưu
        </div>
        {hasActiveRules && !isNaming && (
          <button
            type="button"
            onClick={() => setIsNaming(true)}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Lưu bộ lọc hiện tại
          </button>
        )}
      </div>

      {/* Save form */}
      {isNaming && (
        <div className="flex items-center gap-2 mb-3 animate-in fade-in-0 slide-in-from-top-1 duration-200">
          <input
            type="text"
            value={presetName}
            onChange={e => setPresetName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tên bộ lọc..."
            className="flex-1 h-8 px-3 rounded-md text-sm border border-primary/20 bg-primary/5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            ref={inputRef}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={!presetName.trim()}
            className="h-8 px-3"
          >
            Lưu
          </Button>
          <button
            type="button"
            onClick={() => {
              setIsNaming(false);
              setPresetName('');
            }}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Preset list */}
      {presets.length === 0 ? (
        <div className="py-3 text-center text-xs text-muted-foreground">
          Chưa có bộ lọc nào được lưu
        </div>
      ) : (
        <div className="space-y-1">
          {presets.map(preset => (
            <div
              key={preset.id}
              className={cn(
                'group flex items-center gap-2 px-2.5 py-2 rounded-md cursor-pointer transition-colors',
                'hover:bg-muted',
              )}
              onClick={() => onLoadPreset(preset.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onLoadPreset(preset.id);
                }
              }}
            >
              <Bookmark className="w-4 h-4 text-primary/60 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{preset.name}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {preset.group.rules.length}
                    {' '}
                    điều kiện
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(preset.createdAt)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePreset(preset.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                title="Xóa"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
