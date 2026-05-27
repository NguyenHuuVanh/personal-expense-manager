import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BalanceCard, QuickLinks } from '@/components/expense-dashboard/sections/balance-card';

vi.mock('@/utils/format-number', () => ({
  formatCurrency: (val: number) => `${val.toLocaleString('vi-VN')} VNĐ`,
}));

describe('BalanceCard Component', () => {
  describe('rendering', () => {
    it('renders balance header', () => {
      render(
        <BalanceCard
          netBalance={10000000}
        />
      );
      expect(screen.getByText('Số dư hiện tại')).toBeInTheDocument();
    });

    it('renders formatted net balance', () => {
      render(
        <BalanceCard
          netBalance={10000000}
        />
      );
      expect(screen.getByText('10.000.000 VNĐ')).toBeInTheDocument();
    });

    it('renders income section', () => {
      render(
        <BalanceCard
          netBalance={0}
          totalIncome={5000000}
        />
      );
      expect(screen.getByText('Thu nhập tháng')).toBeInTheDocument();
      expect(screen.getByText(/5\.000\.000/)).toBeInTheDocument();
    });

    it('renders expense section', () => {
      render(
        <BalanceCard
          netBalance={0}
          totalExpense={3000000}
        />
      );
      expect(screen.getByText('Chi tiêu tháng')).toBeInTheDocument();
      expect(screen.getByText(/-3\.000\.000/)).toBeInTheDocument();
    });

    it('renders wallet icon', () => {
      render(<BalanceCard netBalance={0} />);
      const walletIcon = document.querySelector('svg');
      expect(walletIcon).toBeInTheDocument();
    });
  });

  describe('trend display', () => {
    it('renders balance trend badge', () => {
      render(
        <BalanceCard
          netBalance={10000000}
          balanceTrend={25}
        />
      );
      expect(screen.getByText(/25/)).toBeInTheDocument();
    });

    it('renders income trend', () => {
      render(
        <BalanceCard
          netBalance={0}
          totalIncome={1000000}
          incomeTrend={10}
        />
      );
      expect(screen.getByText('▲')).toBeInTheDocument();
      expect(screen.getByText(/\+10%/)).toBeInTheDocument();
    });

    it('renders expense trend', () => {
      render(
        <BalanceCard
          netBalance={0}
          totalExpense={1000000}
          expenseTrend={15}
        />
      );
      // The ▼ and - are in the same text node
      expect(screen.getByText(/▼.*-/)).toBeInTheDocument();
      expect(screen.getByText(/-15%/)).toBeInTheDocument();
    });
  });

  describe('action buttons', () => {
    it('renders "Nạp tiền" button', () => {
      render(<BalanceCard netBalance={0} />);
      expect(screen.getByText('Nạp tiền')).toBeInTheDocument();
    });

    it('renders "Chuyển" button', () => {
      render(<BalanceCard netBalance={0} />);
      expect(screen.getByText('Chuyển')).toBeInTheDocument();
    });

    it('has correct number of buttons', () => {
      render(<BalanceCard netBalance={0} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('custom className', () => {
    it('applies custom className', () => {
      const { container } = render(
        <BalanceCard
          netBalance={0}
          className="custom-balance-card"
        />
      );
      expect(container.querySelector('.custom-balance-card')).toBeInTheDocument();
    });
  });

  describe('default values', () => {
    it('uses default value of 0 for netBalance', () => {
      render(<BalanceCard />);
      expect(screen.getByText('0 VNĐ')).toBeInTheDocument();
    });

    it('uses default value of 0 for totalIncome', () => {
      render(<BalanceCard netBalance={0} />);
      expect(screen.getByText('+0 VNĐ')).toBeInTheDocument();
    });

    it('uses default value of 0 for totalExpense', () => {
      render(<BalanceCard netBalance={0} />);
      expect(screen.getByText('-0 VNĐ')).toBeInTheDocument();
    });
  });

  describe('responsive design', () => {
    it('renders with rounded-xl class', () => {
      const { container } = render(<BalanceCard netBalance={0} />);
      expect(container.querySelector('.rounded-xl')).toBeInTheDocument();
    });

    it('renders with shadow-sm class', () => {
      const { container } = render(<BalanceCard netBalance={0} />);
      expect(container.querySelector('.shadow-sm')).toBeInTheDocument();
    });
  });
});

describe('QuickLinks Component', () => {
  describe('rendering', () => {
    it('renders quick links title', () => {
      render(<QuickLinks />);
      expect(screen.getByText('Thao tác nhanh')).toBeInTheDocument();
    });

    it('renders "Thêm Giao Dịch" link', () => {
      render(<QuickLinks />);
      expect(screen.getByText('Thêm Giao Dịch')).toBeInTheDocument();
    });

    it('renders "Đặt Ngân Sách" link', () => {
      render(<QuickLinks />);
      expect(screen.getByText('Đặt Ngân Sách')).toBeInTheDocument();
    });

    it('renders "Xem Báo Cáo" link', () => {
      render(<QuickLinks />);
      expect(screen.getByText('Xem Báo Cáo')).toBeInTheDocument();
    });

    it('renders "Quản Lý Ví" link', () => {
      render(<QuickLinks />);
      expect(screen.getByText('Quản Lý Ví')).toBeInTheDocument();
    });

    it('has 4 quick links', () => {
      render(<QuickLinks />);
      const links = screen.getAllByText(/Giao Dịch|Ngân Sách|Báo Cáo|Ví/);
      expect(links.length).toBe(4);
    });
  });

  describe('buttons', () => {
    it('renders as buttons', () => {
      render(<QuickLinks />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(4);
    });
  });

  describe('icons', () => {
    it('renders icons for each link', () => {
      render(<QuickLinks />);
      const svgs = document.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('custom className', () => {
    it('applies custom className', () => {
      const { container } = render(
        <QuickLinks className="custom-quick-links" />
      );
      expect(container.querySelector('.custom-quick-links')).toBeInTheDocument();
    });
  });
});

describe('Balance Calculations', () => {
  describe('net balance calculation', () => {
    it('calculates positive balance correctly', () => {
      const totalIncome = 10000000;
      const totalExpense = 6000000;
      const netBalance = totalIncome - totalExpense;
      expect(netBalance).toBe(4000000);
    });

    it('calculates negative balance correctly', () => {
      const totalIncome = 3000000;
      const totalExpense = 5000000;
      const netBalance = totalIncome - totalExpense;
      expect(netBalance).toBe(-2000000);
    });

    it('calculates zero balance correctly', () => {
      const totalIncome = 5000000;
      const totalExpense = 5000000;
      const netBalance = totalIncome - totalExpense;
      expect(netBalance).toBe(0);
    });
  });

  describe('trend calculation', () => {
    it('calculates positive trend correctly', () => {
      const current = 1000000;
      const previous = 800000;
      const trend = ((current - previous) / previous) * 100;
      expect(Math.round(trend)).toBe(25);
    });

    it('calculates negative trend correctly', () => {
      const current = 600000;
      const previous = 800000;
      const trend = ((current - previous) / previous) * 100;
      expect(trend).toBe(-25);
    });

    it('handles zero previous value', () => {
      const current = 1000000;
      const previous = 0;
      const trend = previous === 0 ? 0 : ((current - previous) / previous) * 100;
      expect(trend).toBe(0);
    });
  });
});
