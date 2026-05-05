import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockRegisterUser = vi.fn();
const mockLogin = vi.fn();

vi.mock('@/src/actions', () => ({
  registerUser: (...args: unknown[]) => mockRegisterUser(...args),
  login: (...args: unknown[]) => mockLogin(...args),
}));

import { RegisterForm } from '@/src/app/auth/new-account/ui/RegisterForm';

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(window, 'location', {
    value: { replace: vi.fn() },
    writable: true,
  });
});

describe('RegisterForm', () => {
  it('renders name, email, and password fields', () => {
    const { container } = render(<RegisterForm />);
    expect(container.querySelector('input[name="name"]')).toBeDefined();
    expect(container.querySelector('input[name="email"]')).toBeDefined();
    expect(container.querySelector('input[name="password"]')).toBeDefined();
    expect(screen.getByRole('button', { name: /create account/i })).toBeDefined();
  });

  it('renders sign in link', () => {
    render(<RegisterForm />);
    expect(screen.getByRole('link', { name: /have an account/i })).toBeDefined();
  });

  it('shows error message when registration fails', async () => {
    mockRegisterUser.mockResolvedValue({ ok: false, message: 'Email already in use' });
    mockLogin.mockResolvedValue(undefined);

    const { container } = render(<RegisterForm />);

    fireEvent.change(container.querySelector('input[name="name"]')!, { target: { value: 'Test User' } });
    fireEvent.change(container.querySelector('input[name="email"]')!, { target: { value: 'test@test.com' } });
    fireEvent.change(container.querySelector('input[name="password"]')!, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText('Email already in use')).toBeDefined();
    });
  });

  it('calls registerUser and login on successful submit', async () => {
    mockRegisterUser.mockResolvedValue({ ok: true });
    mockLogin.mockResolvedValue(undefined);

    const { container } = render(<RegisterForm />);

    fireEvent.change(container.querySelector('input[name="name"]')!, { target: { value: 'Jane Doe' } });
    fireEvent.change(container.querySelector('input[name="email"]')!, { target: { value: 'jane@test.com' } });
    fireEvent.change(container.querySelector('input[name="password"]')!, { target: { value: 'securepass' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith('Jane Doe', 'jane@test.com', 'securepass');
      expect(mockLogin).toHaveBeenCalledWith('jane@test.com', 'securepass');
    });
  });
});
