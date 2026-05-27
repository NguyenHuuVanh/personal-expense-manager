import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SocialButtons } from '@/components/auth/social-buttons';

describe('SocialButtons', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('phải render 3 nút social login', () => {
    render(<SocialButtons />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('phải gọi handleGoogleLogin khi click nút Google', async () => {
    const user = userEvent.setup();
    render(<SocialButtons />);

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]); // Google là nút đầu tiên

    expect(consoleSpy).toHaveBeenCalledWith('Login with Google');
  });

  it('phải gọi handleFacebookLogin khi click nút Facebook', async () => {
    const user = userEvent.setup();
    render(<SocialButtons />);

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[1]); // Facebook là nút thứ 2

    expect(consoleSpy).toHaveBeenCalledWith('Login with Facebook');
  });

  it('phải gọi handleAppleLogin khi click nút Apple', async () => {
    const user = userEvent.setup();
    render(<SocialButtons />);

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[2]); // Apple là nút thứ 3

    expect(consoleSpy).toHaveBeenCalledWith('Login with Apple');
  });

  it('tất cả nút phải có type=button (không submit form)', () => {
    render(<SocialButtons />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('type', 'button');
    });
  });
});
