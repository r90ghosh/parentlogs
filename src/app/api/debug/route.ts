import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// This timestamp is baked into the build at compile time
const BUILD_TIME = new Date().toISOString()

export async function GET() {
  // Check what chunks exist in the build output
  let chunks: string[] = []
  let buildId = 'unknown'
  let loginHtmlSnippet = 'not found'
  let errors: string[] = []

  try {
    // Try to read build ID
    const buildIdPath = path.join(process.cwd(), '.next', 'BUILD_ID')
    if (fs.existsSync(buildIdPath)) {
      buildId = fs.readFileSync(buildIdPath, 'utf-8').trim()
    } else {
      errors.push('BUILD_ID file not found at: ' + buildIdPath)
    }
  } catch (e) {
    errors.push('Error reading BUILD_ID: ' + String(e))
  }

  try {
    // Try to list chunk files
    const chunksDir = path.join(process.cwd(), '.next', 'static', 'chunks')
    if (fs.existsSync(chunksDir)) {
      chunks = fs.readdirSync(chunksDir).filter(f => f.endsWith('.js')).slice(0, 10)
    } else {
      errors.push('Chunks dir not found at: ' + chunksDir)
      // Try to find .next directory
      const cwd = process.cwd()
      const cwdContents = fs.readdirSync(cwd).slice(0, 20)
      errors.push('CWD contents: ' + cwdContents.join(', '))

      const nextDir = path.join(cwd, '.next')
      if (fs.existsSync(nextDir)) {
        const nextContents = fs.readdirSync(nextDir).slice(0, 20)
        errors.push('.next contents: ' + nextContents.join(', '))

        const staticDir = path.join(nextDir, 'static')
        if (fs.existsSync(staticDir)) {
          const staticContents = fs.readdirSync(staticDir).slice(0, 20)
          errors.push('.next/static contents: ' + staticContents.join(', '))
        } else {
          errors.push('.next/static does not exist')
        }
      } else {
        errors.push('.next directory does not exist')
      }
    }
  } catch (e) {
    errors.push('Error reading chunks dir: ' + String(e))
  }

  try {
    // Try to read first 500 chars of prerendered login HTML
    const loginPath = path.join(process.cwd(), '.next', 'server', 'app', 'login.html')
    if (fs.existsSync(loginPath)) {
      const html = fs.readFileSync(loginPath, 'utf-8')
      loginHtmlSnippet = html.substring(0, 500)
    } else {
      errors.push('login.html not found at: ' + loginPath)
      // Check alternative paths
      const serverDir = path.join(process.cwd(), '.next', 'server')
      if (fs.existsSync(serverDir)) {
        const serverContents = fs.readdirSync(serverDir).slice(0, 20)
        errors.push('.next/server contents: ' + serverContents.join(', '))

        const appDir = path.join(serverDir, 'app')
        if (fs.existsSync(appDir)) {
          const appContents = fs.readdirSync(appDir).slice(0, 30)
          errors.push('.next/server/app contents: ' + appContents.join(', '))
        }
      }
    }
  } catch (e) {
    errors.push('Error reading login.html: ' + String(e))
  }

  return NextResponse.json({
    status: 'ok',
    buildTime: BUILD_TIME,
    nodeVersion: process.version,
    platform: process.platform,
    cwd: process.cwd(),
    buildId,
    chunksInBuild: chunks,
    loginHtmlSnippet,
    errors,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NETLIFY: process.env.NETLIFY,
      CONTEXT: process.env.CONTEXT,
      DEPLOY_ID: process.env.DEPLOY_ID,
    },
  }, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
