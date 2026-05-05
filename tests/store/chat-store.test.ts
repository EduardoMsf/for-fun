import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useChatStore } from '@/src/store/chat/chat-store';

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  useChatStore.setState({ messages: [], isLoading: false });
  vi.clearAllMocks();
});

describe('useChatStore', () => {
  it('starts with empty messages and isLoading false', () => {
    const { messages, isLoading } = useChatStore.getState();
    expect(messages).toEqual([]);
    expect(isLoading).toBe(false);
  });

  it('sendMessage appends user message immediately and sets isLoading', async () => {
    mockFetch.mockResolvedValue({
      json: async () => ({ message: 'Hi there!' }),
    });

    const promise = useChatStore.getState().sendMessage('Hello');

    expect(useChatStore.getState().messages[0]).toEqual({
      role: 'user',
      content: 'Hello',
    });
    expect(useChatStore.getState().isLoading).toBe(true);

    await promise;
  });

  it('appends assistant message after successful fetch', async () => {
    mockFetch.mockResolvedValue({
      json: async () => ({ message: 'How can I help?' }),
    });

    await useChatStore.getState().sendMessage('Hello');

    const { messages, isLoading } = useChatStore.getState();
    expect(messages).toHaveLength(2);
    expect(messages[1]).toEqual({ role: 'assistant', content: 'How can I help?' });
    expect(isLoading).toBe(false);
  });

  it('sends the full message history to /api/chat', async () => {
    useChatStore.setState({
      messages: [{ role: 'user', content: 'First message' }],
      isLoading: false,
    });
    mockFetch.mockResolvedValue({ json: async () => ({ message: 'Reply' }) });

    await useChatStore.getState().sendMessage('Second message');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.messages).toHaveLength(2);
    expect(body.messages[0].content).toBe('First message');
    expect(body.messages[1].content).toBe('Second message');
  });

  it('sets isLoading to false and keeps user message on fetch error', async () => {
    mockFetch.mockRejectedValue(new Error('network error'));

    await useChatStore.getState().sendMessage('Test');

    const { isLoading, messages } = useChatStore.getState();
    expect(isLoading).toBe(false);
    expect(messages).toHaveLength(1);
    expect(messages[0].role).toBe('user');
  });

  it('clearChat empties the messages array', async () => {
    useChatStore.setState({
      messages: [{ role: 'user', content: 'hi' }],
      isLoading: false,
    });

    useChatStore.getState().clearChat();

    expect(useChatStore.getState().messages).toEqual([]);
  });
});
