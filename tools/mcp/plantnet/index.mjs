#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const PLANTNET_BASE = 'https://my-api.plantnet.org/v2'

async function identifyBase64(imageBase64, organs = ['auto']) {
  const apiKey = process.env.PLANTNET_API_KEY ?? process.env.PLANT_NET_API_KEY
  if (!apiKey) {
    throw new Error('PLANTNET_API_KEY is not set')
  }

  const binary = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const form = new FormData()
  form.append('images', new Blob([binary]), 'plant.jpg')
  for (const organ of organs) {
    form.append('organs', organ)
  }

  const url = `${PLANTNET_BASE}/identify/all?api-key=${encodeURIComponent(apiKey)}`
  const response = await fetch(url, { method: 'POST', body: form })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`PlantNet ${response.status}: ${text.slice(0, 300)}`)
  }
  return response.json()
}

const server = new McpServer({
  name: 'plantnet-dev',
  version: '1.0.0',
})

server.tool(
  'identify_plant_from_image_base64',
  'Identify plant species from a base64-encoded image (PlantNet API).',
  {
    imageBase64: z.string().describe('Base64 image data, optionally with data URL prefix'),
    organs: z.array(z.string()).optional().describe('Plant organs, default auto'),
  },
  async ({ imageBase64, organs }) => {
    const data = await identifyBase64(imageBase64, organs ?? ['auto'])
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    }
  },
)

const transport = new StdioServerTransport()
await server.connect(transport)
