import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const BUILD_TIME = new Date().toISOString()

function safeReadFile(filePath: string, maxLen = 2000): string {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8').substring(0, maxLen)
    }
    return 'NOT FOUND: ' + filePath
  } catch (e) {
    return 'ERROR: ' + String(e)
  }
}

function safeReadDir(dirPath: string): string[] | string {
  try {
    if (fs.existsSync(dirPath)) return fs.readdirSync(dirPath)
    return 'NOT FOUND: ' + dirPath
  } catch (e) {
    return 'ERROR: ' + String(e)
  }
}

function findAllFiles(dir: string, maxDepth = 4, depth = 0): string[] {
  if (depth >= maxDepth) return []
  try {
    if (!fs.existsSync(dir)) return []
    const results: string[] = []
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isFile()) results.push(full)
      else if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git')
        results.push(...findAllFiles(full, maxDepth, depth + 1))
    }
    return results
  } catch { return [] }
}

export async function GET(request: Request) {
  const cwd = process.cwd()
  const nextDir = path.join(cwd, '.next')
  const url = new URL(request.url)
  const baseUrl = url.origin

  // 1. Build ID
  const buildId = safeReadFile(path.join(nextDir, 'BUILD_ID'), 100).trim()

  // 2. Read the login page's client-reference-manifest to find chunk hashes
  const manifestPath = path.join(nextDir, 'server', 'app', '(auth)', 'login', 'page_client-reference-manifest.js')
  const manifestContent = safeReadFile(manifestPath, 5000)

  // Extract chunk paths from the manifest
  const chunkMatches = manifestContent.match(/static\/chunks\/[a-f0-9]+\.js/g) || []
  const uniqueChunks = [...new Set(chunkMatches)].slice(0, 15)

  // 3. Check .next/_next/static/ exists (our copy fix)
  const copyFixDir = path.join(nextDir, '_next', 'static')
  const copyFixExists = fs.existsSync(copyFixDir)
  const copyFixChunksDir = path.join(copyFixDir, 'chunks')
  const copyFixChunks = copyFixExists && fs.existsSync(copyFixChunksDir)
    ? fs.readdirSync(copyFixChunksDir).slice(0, 10)
    : 'NOT FOUND'

  // 4. Check .next/static/chunks/ exists (original build output)
  const origChunksDir = path.join(nextDir, 'static', 'chunks')
  const origChunks = fs.existsSync(origChunksDir)
    ? fs.readdirSync(origChunksDir).slice(0, 10)
    : 'NOT FOUND'

  // 5. Try to fetch chunks from CDN to see if they're accessible
  const cdnTests: Record<string, string> = {}
  const testChunks = uniqueChunks.slice(0, 3)
  for (const chunk of testChunks) {
    const chunkUrl = `${baseUrl}/_next/${chunk}`
    try {
      const resp = await fetch(chunkUrl, { method: 'HEAD' })
      cdnTests[chunk] = `status=${resp.status}, content-type=${resp.headers.get('content-type')}`
    } catch (e) {
      cdnTests[chunk] = 'FETCH ERROR: ' + String(e)
    }
  }

  // Also test the build manifest
  try {
    const bmUrl = `${baseUrl}/_next/static/${buildId}/_buildManifest.js`
    const resp = await fetch(bmUrl, { method: 'HEAD' })
    cdnTests['_buildManifest.js'] = `status=${resp.status} url=${bmUrl}`
  } catch (e) {
    cdnTests['_buildManifest.js'] = 'FETCH ERROR: ' + String(e)
  }

  // 6. List ALL files in .next/_next/ to verify what was copied
  const copiedFiles = findAllFiles(path.join(nextDir, '_next'), 3)
    .map(f => f.replace(path.join(nextDir, '_next') + '/', ''))
    .slice(0, 30)

  // 7. List files in the publish directory root that might be served as static
  const publishDirFiles = safeReadDir(nextDir)

  // 8. Check what the Netlify plugin actually published
  const netlifyDir = path.join(cwd, '.netlify')
  const netlifyDirContents = safeReadDir(netlifyDir)

  // 9. Find any .html files in .next/server/app
  const htmlFiles = findAllFiles(path.join(nextDir, 'server', 'app'), 3)
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace(path.join(nextDir, 'server', 'app') + '/', ''))

  // 10. Prerender manifest - login route details
  let prerenderInfo = 'not found'
  try {
    const pm = JSON.parse(fs.readFileSync(path.join(nextDir, 'prerender-manifest.json'), 'utf-8'))
    prerenderInfo = JSON.stringify(pm.routes?.['/login'] || 'NOT IN ROUTES')
  } catch (e) {
    prerenderInfo = 'ERROR: ' + String(e)
  }

  return NextResponse.json({
    buildTime: BUILD_TIME,
    buildId,
    nodeVersion: process.version,
    cwd,

    // Chunk analysis
    chunkHashesFromManifest: uniqueChunks,
    cdnAccessibilityTests: cdnTests,

    // File structure
    copyFixExists,
    copyFixChunks,
    origChunks,
    copiedFilesUnderNextNext: copiedFiles,
    publishDirContents: publishDirFiles,
    htmlFilesInServerApp: htmlFiles,

    // Netlify
    netlifyDirContents,
    prerenderInfo,

    // Plugin info
    pluginVersion: '@netlify/plugin-nextjs@5.15.8',

    env: {
      NODE_ENV: process.env.NODE_ENV,
      DEPLOY_ID: process.env.DEPLOY_ID,
      URL: process.env.URL,
    },
  }, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
