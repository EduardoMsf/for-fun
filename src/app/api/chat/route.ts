// src/app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { initialData } from '@/src/seed/seed';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: `You are a helpful shopping assistant for this clothing store.

Here is the current product catalog:
${JSON.stringify(initialData.products, null, 2)}

Use this information to:
- Recommend products based on what the user is looking for
- Answer questions about availability (inStock), price, sizes
- Link to products using their slug: /product/[slug]

Be friendly, concise, and helpful.`,
      messages,
    });

    return NextResponse.json({
      message:
        response.content[0].type === 'text' ? response.content[0].text : '',
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 },
    );
  }
}
