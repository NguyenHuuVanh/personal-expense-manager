'use client';

import { useState } from 'react';

import { ICON_MAP, ALL_ICONS } from '@/data/icons';
import { CATEGORY_TABS, TAB_ICONS, DEFAULT_ACCENT_COLOR } from '@/constants/icon';
import type { IconPickerProps, CategoryTabKey } from '@/types/icon';

export type { IconPickerProps } from '@/types/icon';

export function IconPicker({ selectedIcon, onSelect, accentColor = DEFAULT_ACCENT_COLOR }: IconPickerProps) {
  const [activeTab, setActiveTab] = useState<CategoryTabKey>('general');

  return (
    <div>
      <label className="text-sm font-medium text-[#1A1D2E] mb-2 block">
        Biểu tượng
      </label>
      <div className="space-y-2">
        <div className="flex gap-1 flex-wrap">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#827BF2] text-white'
                  : 'bg-[#F2F4F8] text-[#5A607F] hover:bg-[#EAE8FD]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 p-2 bg-[#F2F4F8] rounded-lg max-h-48 overflow-y-auto">
          {TAB_ICONS[activeTab].map((iconId) => {
            const entry = ALL_ICONS.find((i) => i.id === iconId);
            if (!entry) return null;
            const isSelected = selectedIcon === iconId;
            return (
              <button
                key={iconId}
                type="button"
                onClick={() => onSelect(iconId)}
                title={entry.label}
                className={`w-9 h-9 rounded-lg text-sm flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#827BF2] ring-2 ring-[#827BF2] text-white'
                    : 'bg-white hover:bg-[#EAE8FD] text-[#5A607F]'
                }`}
              >
                <entry.Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
