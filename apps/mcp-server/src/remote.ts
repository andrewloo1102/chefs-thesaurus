#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { searchSubstitutions, describeEffects } from "../../../packages/core/src/index.js";
// import { lookupStores } from "../../../packages/core/src/index.js"; // V2: Re-enable when implementing store lookup

const server = new Server(
  {
    name: "chefs-thesaurus",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool 1: Search Substitutions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_substitution",
        description: "Find cooking ingredient substitutions with precise measurements. Supports 20+ ingredients including butter, eggs, sour cream, garlic, sugar, milk, flour, and more. Returns substitute ingredient with calculated quantity based on ratio.",
        inputSchema: {
          type: "object",
          properties: {
            ingredient: {
              type: "string",
              description: "The ingredient to substitute (e.g., 'butter', 'eggs', 'sour cream', 'garlic clove')",
            },
            quantity: {
              type: "number",
              description: "Optional: Amount of the ingredient",
            },
            unit: {
              type: "string",
              description: "Optional: Unit of measurement (tsp, tbsp, cup, ml, g, unit)",
            },
            dish: {
              type: "string",
              description: "Optional: Type of dish or technique (e.g., 'Cookies', 'Cakes', 'Sauce/Gravy')",
            },
          },
          required: ["ingredient"],
        },
      },
      {
        name: "describe_effects",
        description: "Describe the effects of using a substitute ingredient in place of the original. Returns information about how the substitution will affect the dish's texture, flavor, or appearance.",
        inputSchema: {
          type: "object",
          properties: {
            base: {
              type: "string",
              description: "The original ingredient",
            },
            substitute: {
              type: "string",
              description: "The substitute ingredient",
            },
            dish: {
              type: "string",
              description: "Optional: Type of dish or technique",
            },
          },
          required: ["base", "substitute"],
        },
      },
      // V2: Re-enable when implementing store lookup with Google Places API
      // {
      //   name: "lookup_stores",
      //   description: "Find nearby stores that likely carry a specific ingredient. Returns store names, distances, and coordinates.",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       query: {
      //         type: "string",
      //         description: "The ingredient to search for",
      //       },
      //       lat: {
      //         type: "number",
      //         description: "Latitude of the search location",
      //       },
      //       lon: {
      //         type: "number",
      //         description: "Longitude of the search location",
      //       },
      //       radius_m: {
      //         type: "number",
      //         description: "Optional: Search radius in meters (default: 5000)",
      //       },
      //     },
      //     required: ["query", "lat", "lon"],
      //   },
      // },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error("No arguments provided");
  }

  try {
    if (name === "search_substitution") {
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
              type: "text",
              text: `Ingredient "${args.ingredient}" is not supported yet.\n\nExamples of supported ingredients: ${result.examples?.join(", ")}`,
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
            type: "text",
            text: response,
          },
        ],
      };
    }

    if (name === "describe_effects") {
      const result = describeEffects({
        base: args.base as string,
        substitute: args.substitute as string,
        dish: args.dish as string | undefined,
      });

      if (!result.supported) {
        return {
          content: [
            {
              type: "text",
              text: `Cannot describe effects for this substitution.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `**Effects of substituting ${args.substitute} for ${args.base}:**\n\n${result.summary}`,
          },
        ],
      };
    }

    // V2: Re-enable when implementing store lookup with Google Places API
    // if (name === "lookup_stores") {
    //   const result = lookupStores({
    //     query: args.query as string,
    //     lat: args.lat as number,
    //     lon: args.lon as number,
    //     radius_m: args.radius_m as number | undefined,
    //   });
    //
    //   let response = `**Stores near you carrying "${args.query}":**\n\n`;
    //   result.forEach((store: { name: string; lat: number; lon: number; distance_m: number }, idx: number) => {
    //     response += `${idx + 1}. **${store.name}**\n`;
    //     response += `   Distance: ${(store.distance_m / 1609.34).toFixed(2)} mi\n`;
    //     response += `   Location: ${store.lat.toFixed(4)}, ${store.lon.toFixed(4)}\n\n`;
    //   });
    //
    //   return {
    //     content: [
    //       {
    //         type: "text",
    //         text: response,
    //       },
    //     ],
    //   };
    // }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

export async function createRemoteMCPServer() {
  const transport = new SSEServerTransport("/mcp/sse");
  return { server, transport };
}
