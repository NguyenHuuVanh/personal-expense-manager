import { DashboardShell } from '@/components/layout/dashboard-shell';
import { HelpLanding } from '@/components/help/help-landing';
import { FaqSection } from '@/components/help/faq-section';
import { ContactForm } from '@/components/help/contact-form';

export default function HelpPage() {
  return (
    <DashboardShell title="Trợ giúp" subtitle="Hướng dẫn sử dụng và hỗ trợ">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <HelpLanding />
          <FaqSection />
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </DashboardShell>
  );
}
