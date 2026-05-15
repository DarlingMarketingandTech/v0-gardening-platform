# Tooling and intelligence stack

When to enable MCP servers, skills, and plant APIs for **Momma D's Garden** — without feature creep in the product UI.

## Product rule

The crawl and MCP layer is for **builders**. Momma D sees action, reason, timing, and collapsible provenance — never raw research dumps.

## Environment variables

Copy names from [`.codex/env.example`](../.codex/env.example). Never commit real values.

| Variable | Phase | Purpose |
|----------|-------|---------|
| `PLANTNET_API_KEY` | C | Photo identification (server-only) |
| `TREFLE_TOKEN` | C | Species enrichment after ID |
| `FIRECRAWL_API_KEY` | D | Trusted page extraction for Guide corpus |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | B | PR/CI from Codex plugins |

## Phase triggers

### Phase B — Now (product PRs)

- `npm run verify` before merge
- Codex profile: [`.codex/config.toml`](../.codex/config.toml)
- Agents: `garden-product`, `garden-engineer`
- Cursor rule: [`.cursor/rules/momma-d-gardening.mdc`](../.cursor/rules/momma-d-gardening.mdc)

### Phase C — Guide plant ID

Enable when wiring live identification:

1. Set `PLANTNET_API_KEY` and `TREFLE_TOKEN` in `.env.local` (server only).
2. Optional: run MCP bridges under `tools/mcp/` for agent testing.
3. App path: `lib/plant-intelligence/` → `app/actions/identify-plant.ts` → Guide **Identify** panel.

### Phase D — Knowledge corpus

After static Guide articles prove useful:

1. Firecrawl (Cursor plugin already enabled) to extract 20–40 trusted URLs.
2. Normalize to `lib/knowledge/snippets.ts` shape.
3. Optional Graphify ingest for **agent** retrieval only.

Defer: Neo4j, Composio, Playwright MCP, codexfast.

## Cursor MCP (project)

See [`.cursor/mcp.json`](../.cursor/mcp.json) for team-shareable server entries when Phase C starts.

## Validation

- `npm run verify`
- Mobile pass: `/my-garden`, `/setup`
- Plant ID: keys only on server; UI shows confidence + disclaimer
