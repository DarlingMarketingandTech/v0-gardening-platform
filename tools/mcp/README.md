# MCP bridges (Phase C — developer tooling)

Local stdio MCP servers for Cursor/Codex to test plant APIs while implementing Guide.

## Prerequisites

```bash
npm install
```

Set `PLANTNET_API_KEY` and `TREFLE_TOKEN` in the environment (see `.codex/env.example`).

## Run manually

```bash
node tools/mcp/plantnet/index.mjs
node tools/mcp/trefle/index.mjs
```

## Cursor

Project config: [`.cursor/mcp.json`](../../.cursor/mcp.json)

## Tools exposed

| Server | Tool | Description |
|--------|------|-------------|
| plantnet-dev | `identify_plant_from_image_base64` | Species candidates from a base64 image |
| trefle-dev | `enrich_species` | Taxonomy enrichment by scientific name |

Product UI uses `lib/plant-intelligence/` server actions — not these MCP servers directly.
