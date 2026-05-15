#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const TREFLE_BASE = 'https://trefle.io/api/v1'

async function searchSpecies(scientificName) {
  const token = process.env.TREFLE_TOKEN ?? process.env.TREFLE_API_KEY
  if (!token) {
    throw new Error('TREFLE_TOKEN is not set')
  }

  const url = new URL(`${TREFLE_BASE}/species/search`)
  url.searchParams.set('token', token)
  url.searchParams.set('q', scientificName)

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Trefle ${response.status}`)
  }
  return response.json()
}

const server = new McpServer({
  name: 'trefle-dev',
  version: '1.0.0',
})

server.tool(
  'enrich_species',
  'Enrich a scientific name with Trefle taxonomy and growth fields.',
  {
    scientificName: z.string().describe('Scientific name to search'),
  },
  async ({ scientificName }) => {
    const data = await searchSpecies(scientificName)
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    }
  },
)

const transport = new StdioServerTransport()
await server.connect(transport)
