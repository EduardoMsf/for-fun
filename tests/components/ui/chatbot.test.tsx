import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

import { Chatbot } from '@/src/components/ui/chatbot/Chatbot';
import { useChatStore } from '@/src/store/chat/chat-store';

beforeEach(() => {
  useChatStore.setState({ messages: [], isLoading: false });
  vi.clearAllMocks();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe('Chatbot', () => {
  it('renders the FAB button initially', () => {
    render(<Chatbot />);
    const fabs = screen.getAllByRole('button');
    expect(fabs.length).toBeGreaterThanOrEqual(1);
  });

  it('opens the chat window when the FAB is clicked', () => {
    render(<Chatbot />);

    expect(screen.queryByPlaceholderText('Ask Mitsuha...')).toBeNull();

    const fab = screen.getAllByRole('button')[0];
    fireEvent.click(fab);

    expect(screen.getByPlaceholderText('Ask Mitsuha...')).toBeDefined();
    expect(screen.getByText('Mitsuha')).toBeDefined();
  });

  it('shows the welcome message when no messages exist', () => {
    render(<Chatbot />);
    const fab = screen.getAllByRole('button')[0];
    fireEvent.click(fab);

    expect(screen.getByText(/Hi! I'm Mitsuha/i)).toBeDefined();
  });

  it('fills input when a suggestion is clicked', () => {
    render(<Chatbot />);
    const fab = screen.getAllByRole('button')[0];
    fireEvent.click(fab);

    fireEvent.click(screen.getByText('Show me hoodies'));

    const input = screen.getByPlaceholderText('Ask Mitsuha...') as HTMLInputElement;
    expect(input.value).toBe('Show me hoodies');
  });

  it('sends a message and shows it in the chat', async () => {
    mockFetch.mockResolvedValue({ json: async () => ({ message: 'Hello!' }) });

    render(<Chatbot />);
    const fab = screen.getAllByRole('button')[0];
    fireEvent.click(fab);

    const input = screen.getByPlaceholderText('Ask Mitsuha...');
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await new Promise((r) => setTimeout(r, 50));

    expect(useChatStore.getState().messages[0].content).toBe('test message');
  });

  it('closes the chat window when FAB is clicked again', () => {
    render(<Chatbot />);
    const fab = screen.getAllByRole('button')[0];

    fireEvent.click(fab);
    expect(screen.getByPlaceholderText('Ask Mitsuha...')).toBeDefined();

    fireEvent.click(fab);
    expect(screen.queryByPlaceholderText('Ask Mitsuha...')).toBeNull();
  });
});
