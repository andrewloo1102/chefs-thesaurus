import { NextRequest, NextResponse } from 'next/server';
import { searchSubstitutions, describeEffects } from '@chefs-thesaurus/core';

/**
 * Remote MCP Server endpoint for Chef's Thesaurus
 * Supports SSE (Server-Sent Events) for MCP protocol
 */
export async function GET(request: NextRequest) {
  // Check if this is an SSE request
  const acceptHeader = request.headers.get('accept');
  
  if (acceptHeader?.includes('text/event-stream')) {
    // Return SSE stream for MCP protocol
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        controller.enqueue(encoder.encode(': connected\n\n'));
        
        // Keep connection alive with heartbeat
        const interval = setInterval(() => {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        }, 30000);

        // Clean up on close
        request.signal.addEventListener('abort', () => {
          clearInterval(interval);
          controller.close();
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  }

  // For non-SSE requests, return tool list
  return NextResponse.json({
    tools: [
      {
        name: 'search_substitution',
        description: 'Find cooking ingredient substitutions with precise measurements. Supports 20+ ingredients including butter, eggs, sour cream, garlic, sugar, milk, flour, and more. Returns substitute ingredient with calculated quantity based on ratio.',
        inputSchema: {
          type: 'object',
          properties: {
            ingredient: {
              type: 'string',
              description: "The ingredient to substitute (e.g., 'butter', 'eggs', 'sour cream', 'garlic clove')",
            },
            quantity: {
              type: 'number',
              description: 'Optional: Amount of the ingredient',
            },
            unit: {
              type: 'string',
              description: 'Optional: Unit of measurement (tsp, tbsp, cup, ml, g, unit)',
            },
            dish: {
              type: 'string',
              description: "Optional: Type of dish or technique (e.g., 'Cookies', 'Cakes', 'Sauce/Gravy')",
            },
          },
          required: ['ingredient'],
        },
      },
      {
        name: 'describe_effects',
        description: 'Describe the effects of using a substitute ingredient in place of the original. Returns information about how the substitution will affect the dish\'s texture, flavor, or appearance.',
        inputSchema: {
          type: 'object',
          properties: {
            base: {
              type: 'string',
              description: 'The original ingredient',
            },
            substitute: {
              type: 'string',
              description: 'The substitute ingredient',
            },
            dish: {
              type: 'string',
              description: 'Optional: Type of dish or technique',
            },
          },
          required: ['base', 'substitute'],
        },
      },
    ],
  });
}

/**
 * Handle POST requests for MCP messages
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tool, args } = body;

    if (!tool) {
      return NextResponse.json(
        { error: 'Missing tool name' },
        { status: 400 }
      );
    }

    // Handle search_substitution tool
    if (tool === 'search_substitution') {
      const result = searchSubstitutions({
        ingredient: args.ingredient as string,
        quantity: args.quantity as number | undefined,
        unit: args.unit as string | undefined,
        dish: args.dish as string | undefined,
      });

      if (!result.supported) {
        return NextResponse.json({
          content: [
            {
              type: 'text',
              text: `Ingredient "${args.ingredient}" is not supported yet.\n\nExamples of supported ingredients: ${result.examples?.join(', ')}`,
            },
          ],
        });
      }

      let response = `**Substitute for ${result.base}:**\n\n`;
      response += `✅ Use: **${result.substitute}**\n\n`;

      if (result.quantity && result.unit) {
        response += `📊 Amount: **${result.quantity} ${result.unit}**\n`;
        response += `(Ratio basis: ${result.basis})\n\n`;
      }

      if (result.notes) {
        response += `📝 Notes: ${result.notes}\n\n`;
      }

      if (result.alts && result.alts.length > 0) {
        response += `**Alternative substitutes:**\n`;
        result.alts.forEach((alt: { substitute: string; ratioMultiplier?: number }) => {
          response += `- ${alt.substitute} (ratio: ${alt.ratioMultiplier}x)\n`;
        });
      }

      return NextResponse.json({
        content: [
          {
            type: 'text',
            text: response,
          },
        ],
      });
    }

    // Handle describe_effects tool
    if (tool === 'describe_effects') {
      const result = describeEffects({
        base: args.base as string,
        substitute: args.substitute as string,
        dish: args.dish as string | undefined,
      });

      if (!result.supported) {
        return NextResponse.json({
          content: [
            {
              type: 'text',
              text: 'Cannot describe effects for this substitution.',
            },
          ],
        });
      }

      return NextResponse.json({
        content: [
          {
            type: 'text',
            text: `**Effects of substituting ${args.substitute} for ${args.base}:**\n\n${result.summary}`,
          },
        ],
      });
    }

    // Unknown tool
    return NextResponse.json(
      { error: `Unknown tool: ${tool}` },
      { status: 400 }
    );
  } catch (error) {
    console.error('MCP endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
