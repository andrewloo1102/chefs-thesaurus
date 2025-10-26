import { NextRequest } from 'next/server';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { searchSubstitutions, describeEffects } from '@chefs-thesaurus/core';

// Create MCP server singleton
const mcpServer = new Server(
  {
    name: 'chefs-thesaurus',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool list handler
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
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
  };
});

// Register tool call handler
mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error('No arguments provided');
  }

  try {
    if (name === 'search_substitution') {
      const result = searchSubstitutions({
        ingredient: args.ingredient as string,
        quantity: args.quantity as number | undefined,
        unit: args.unit as string | undefined,
        dish: args.dish as string | undefined,
      });

      if (!result.supported) {
        return {
          content: [
            {
              type: 'text',
              text: `Ingredient "${args.ingredient}" is not supported yet.\n\nExamples of supported ingredients: ${result.examples?.join(', ')}`,
            },
          ],
        };
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

      return {
        content: [
          {
            type: 'text',
            text: response,
          },
        ],
      };
    }

    if (name === 'describe_effects') {
      const result = describeEffects({
        base: args.base as string,
        substitute: args.substitute as string,
        dish: args.dish as string | undefined,
      });

      if (!result.supported) {
        return {
          content: [
            {
              type: 'text',
              text: 'Cannot describe effects for this substitution.',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `**Effects of substituting ${args.substitute} for ${args.base}:**\n\n${result.summary}`,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Handle SSE requests for MCP protocol
export async function GET(request: NextRequest) {
  const acceptHeader = request.headers.get('accept');
  
  if (acceptHeader?.includes('text/event-stream')) {
    const transport = new SSEServerTransport('/api/mcp', request.headers);
    
    try {
      await mcpServer.connect(transport);
      
      // Return the SSE stream from the transport
      return new Response(transport.getReadableStream(), {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    } catch (error) {
      console.error('MCP connection error:', error);
      return new Response(`Error: ${error instanceof Error ? error.message : String(error)}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }

  // Non-SSE request - return tools list
  return Response.json({
    tools: [
      {
        name: 'search_substitution',
        description: 'Find cooking ingredient substitutions with precise measurements.',
      },
      {
        name: 'describe_effects',
        description: 'Describe the effects of using a substitute ingredient.',
      },
    ],
  });
}

// Handle POST requests for initialization
export async function POST(request: NextRequest) {
  const acceptHeader = request.headers.get('accept');
  
  if (acceptHeader?.includes('text/event-stream')) {
    // Redirect POST SSE requests to GET handler
    return GET(request);
  }

  return Response.json({ message: 'MCP server is running' });
}
