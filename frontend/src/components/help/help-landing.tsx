'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import Link from 'next/link';
import { Video, Book, MessageCircle, FileText, ChevronRight } from 'lucide-react';

const quickLinks = [
  {
    title: 'Video hướng dẫn',
    description: 'Xem các video hướng dẫn sử dụng',
    icon: Video,
    href: '#videos',
    color: 'bg-[#827BF2]/10 text-[#827BF2]',
  },
  {
    title: 'Tài liệu hướng dẫn',
    description: 'Đọc các bài hướng dẫn chi tiết',
    icon: Book,
    href: '#docs',
    color: 'bg-[#21AE5A]/10 text-[#21AE5A]',
  },
  {
    title: 'Chat với hỗ trợ',
    description: 'Trò chuyện trực tiếp với đội ngũ hỗ trợ',
    icon: MessageCircle,
    href: '#chat',
    color: 'bg-[#F66PAC]/10 text-[#F66PAC]',
  },
  {
    title: 'Câu hỏi thường gặp',
    description: 'Giải đáp các câu hỏi phổ biến',
    icon: FileText,
    href: '#faq',
    color: 'bg-[#F89C34]/10 text-[#F89C34]',
  },
];

export function HelpLanding() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <Card className="bg-gradient-to-r from-[#827BF2] to-[#6B5FD4] text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-2">Xin chào! Expense Manager có thể giúp gì cho bạn?</h2>
          <p className="text-white/80 mb-4">
            Tìm kiếm câu hỏi hoặc duyệt qua các chủ đề bên dưới để được hỗ trợ
          </p>
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              className="w-full h-10 pl-4 pr-4 rounded-lg text-[#1A1D2E] bg-white/95"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <Link key={link.title} href={link.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-4">
                <div className={`w-12 h-12 rounded-lg ${link.color} flex items-center justify-center mb-3`}>
                  <link.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-[#1A1D2E] mb-1">{link.title}</h3>
                <p className="text-sm text-[#5A607F]">{link.description}</p>
                <div className="flex items-center gap-1 text-[#827BF2] mt-2 text-sm">
                  <span>Xem thêm</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Bắt đầu sử dụng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { step: 1, title: 'Thêm ví tiền', desc: 'Tạo các tài khoản ngân hàng, ví điện tử, tiền mặt' },
              { step: 2, title: 'Thêm giao dịch', desc: 'Nhập thu chi hàng ngày để theo dõi' },
              { step: 3, title: 'Đặt ngân sách', desc: 'Thiết lập giới hạn chi tiêu cho từng danh mục' },
              { step: 4, title: 'Theo dõi mục tiêu', desc: 'Đặt mục tiêu tiết kiệm và theo dõi tiến độ' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#F2F4F8] transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#827BF2] text-white flex items-center justify-center font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="font-medium text-[#1A1D2E]">{item.title}</p>
                  <p className="text-sm text-[#5A607F]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
