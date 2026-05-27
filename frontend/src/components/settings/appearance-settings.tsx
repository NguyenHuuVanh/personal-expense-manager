'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import { SelectField } from '@/components/custom-fields/select-field';
import { Separator } from '@/components/shadcn-ui/separator';

const currencyOptions = [
  { value: 'VND', label: 'Việt Nam Đồng (VND)' },
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
];

const dateFormatOptions = [
  { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
  { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
  { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' },
];

const languageOptions = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
];

export function AppearanceSettings() {
  const [currency, setCurrency] = useState('VND');
  const [dateFormat, setDateFormat] = useState('dd/mm/yyyy');
  const [language, setLanguage] = useState('vi');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Giao diện</CardTitle>
          <CardDescription>Tùy chỉnh giao diện ứng dụng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SelectField
            label="Ngôn ngữ"
            placeholder="Chọn ngôn ngữ"
            options={languageOptions}
            selected={language}
            onChangeSelected={setLanguage}
          />
          <Separator />
          <SelectField
            label="Đơn vị tiền tệ"
            placeholder="Chọn đơn vị tiền tệ"
            options={currencyOptions}
            selected={currency}
            onChangeSelected={setCurrency}
          />
          <Separator />
          <SelectField
            label="Định dạng ngày"
            placeholder="Chọn định dạng ngày"
            options={dateFormatOptions}
            selected={dateFormat}
            onChangeSelected={setDateFormat}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hiển thị</CardTitle>
          <CardDescription>Các tùy chọn hiển thị khác</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1A1D2E]">Hiện số dư ví</p>
                <p className="text-sm text-[#5A607F]">Hiển thị số dư trên màn hình chính</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#827BF2]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#827BF2]"></div>
              </label>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1A1D2E]">Compact mode</p>
                <p className="text-sm text-[#5A607F]">Hiển thị nhiều nội dung hơn trên màn hình</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#827BF2]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#827BF2]"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
