'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Làm thế nào để thêm ví tiền mới?',
    answer: 'Để thêm ví tiền mới, bạn vào trang Cài đặt > Ví tiền > Thêm ví. Bạn có thể thêm các loại ví như: tài khoản ngân hàng, ví điện tử (Momo, ZaloPay), hoặc tiền mặt.',
  },
  {
    question: 'Làm thế nào để tạo ngân sách?',
    answer: 'Để tạo ngân sách, vào trang Ngân sách > Tạo ngân sách. Chọn danh mục, nhập số tiền giới hạn và chọn kỳ hạn (ngày, tuần, tháng).',
  },
  {
    question: 'Tôi có thể xuất báo cáo không?',
    answer: 'Có, bạn có thể xuất báo cáo bằng cách vào trang Báo cáo > Xuất Excel. Báo cáo bao gồm chi tiêu, thu nhập và xu hướng.',
  },
  {
    question: 'Dữ liệu của tôi có được bảo mật không?',
    answer: 'Expense Manager cam kết bảo mật dữ liệu của bạn. Tất cả dữ liệu được mã hóa và lưu trữ an toàn. Chúng tôi không chia sẻ thông tin cá nhân với bên thứ ba.',
  },
  {
    question: 'Làm thế nào để đặt mục tiêu tiết kiệm?',
    answer: 'Để đặt mục tiêu tiết kiệm, vào trang Mục tiêu > Tạo mục tiêu. Nhập tên, số tiền mục tiêu và ngày kết thúc. Bạn có thể thêm tiền vào mục tiêu bất kỳ lúc nào.',
  },
  {
    question: 'Tôi có thể sử dụng Expense Manager trên điện thoại không?',
    answer: 'Expense Manager hoàn toàn tương thích với thiết bị di động. Giao diện được thiết kế responsive, tự động điều chỉnh cho màn hình nhỏ hơn.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Card id="faq">
      <CardHeader>
        <CardTitle>Câu hỏi thường gặp</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F2F4F8] transition-colors"
              >
                <span className="font-medium text-[#1A1D2E] pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#9EA3B8] shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 pt-0 text-[#5A607F]">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
