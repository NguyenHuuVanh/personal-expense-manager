'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import { Button } from '@/components/shadcn-ui/button';
import { Input } from '@/components/shadcn-ui/input';
import { Textarea } from '@/components/shadcn-ui/textarea';
import { Send, Mail, Phone, MapPin } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liên hệ hỗ trợ</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#21AE5A]/10 flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-[#21AE5A]" />
            </div>
            <h3 className="font-semibold text-[#1A1D2E] mb-2">Đã gửi thành công!</h3>
            <p className="text-sm text-[#5A607F]">
              Chúng tôi sẽ phản hồi trong vòng 24 giờ.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                Họ và tên
              </label>
              <Input
                placeholder="Nhập họ và tên"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                Chủ đề
              </label>
              <Input
                placeholder="Nhập chủ đề"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1A1D2E] mb-1 block">
                Nội dung
              </label>
              <Textarea
                placeholder="Nhập nội dung tin nhắn..."
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#827BF2] hover:bg-[#6B5FD4]">
              <Send className="w-4 h-4 mr-2" />
              Gửi tin nhắn
            </Button>
          </form>
        )}

        {/* Contact Info */}
        <div className="mt-6 pt-6 border-t space-y-3">
          <div className="flex items-center gap-3 text-sm text-[#5A607F]">
            <Mail className="w-4 h-4 text-[#827BF2]" />
            <span>support@expense-manager.app</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-[#5A607F]">
            <Phone className="w-4 h-4 text-[#827BF2]" />
            <span>1900 1234</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-[#5A607F]">
            <MapPin className="w-4 h-4 text-[#827BF2]" />
            <span>TP. Hồ Chí Minh, Việt Nam</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
