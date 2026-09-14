import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/').pop()

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}/` : '/',
})