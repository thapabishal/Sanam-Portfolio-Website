import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Kamala Portfolio',
  projectId: 'wixsdjnc', // Use your actual project ID
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})