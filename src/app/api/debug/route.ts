import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const BUILD_TIME = new Date().toISOString()

function safeReadJSON(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    return { _error: 'file not found: ' + filePath }
  } catch (e) {
    return { _error: String(e) }
  }
}

function safeReadDir(dirPath: string): string[] | string {
  try {
    if (fs.existsSync(dirPath)) {
      return fs.readdirSync(dirPath)
    }
    return 'DIR NOT FOUND: ' + dirPath
  } catch (e) {
    return 'ERROR: ' + String(e)
  }
}

function safeReadFile(filePath: string, maxLen = 1000): string {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8').substring(0, maxLen)
    }
    return 'FILE NOT FOUND: ' + filePath
  } catch (e) {
    return 'ERROR: ' + String(e)
  }
}

function findFiles(dir: string, pattern: RegExp, maxDepth = 3, depth = 0): string[] {
  if (depth >= maxDepth) return []
  try {
    if (!fs.existsSync(dir)) return []
    const results: string[] = []
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isFile() && pattern.test(entry.name)) {
        results.push(fullPath)
      } else if (entry.isDirectory() && !entry.name.startsWith('node_modules')) {
        results.push(...findFiles(fullPath, pattern, maxDepth, depth + 1))
      }
    }
    return results
  } catch {
    return []
  }
}

export async function GET() {
  const cwd = process.cwd()
  const nextDir = path.join(cwd, '.next')

  // 1. Build manifest — lists all chunks for each page
  const buildManifest = safeReadJSON(path.join(nextDir, 'build-manifest.json'))

  // 2. Extract login page chunks from build manifest
  let loginChunksFromManifest = 'not found in manifest'
  if (buildManifest && !buildManifest._error) {
    // Check various possible keys
    const pages = buildManifest.pages || {}
    const keys = Object.keys(pages)
    const loginKeys = keys.filter((k: string) => k.toLowerCase().includes('login'))
    loginChunksFromManifest = loginKeys.length > 0
      ? JSON.stringify(loginKeys.map((k: string) => ({ key: k, chunks: pages[k] })))
      : 'No login keys found. All page keys: ' + keys.slice(0, 20).join(', ')
  }

  // 3. Prerender manifest — shows which pages are prerendered
  const prerenderManifest = safeReadJSON(path.join(nextDir, 'prerender-manifest.json'))
  let loginPrerender = 'not found'
  if (prerenderManifest && !prerenderManifest._error) {
    const routes = prerenderManifest.routes || {}
    const loginRoute = routes['/login'] || 'NOT IN ROUTES'
    const dynamicRoutes = prerenderManifest.dynamicRoutes || {}
    loginPrerender = JSON.stringify({
      loginRoute,
      allRoutes: Object.keys(routes).slice(0, 20),
    })
  }

  // 4. Find login-related files
  const loginFiles = findFiles(path.join(nextDir, 'server', 'app'), /login|auth/i)

  // 5. Check (auth) directory structure
  const authDir = safeReadDir(path.join(nextDir, 'server', 'app', '(auth)'))
  let authLoginDir = 'N/A'
  if (Array.isArray(authDir)) {
    authLoginDir = JSON.stringify(safeReadDir(path.join(nextDir, 'server', 'app', '(auth)', 'login')))
  }

  // 6. Read routes-manifest.json
  const routesManifest = safeReadJSON(path.join(nextDir, 'routes-manifest.json'))
  let loginRouteInfo = 'not found'
  if (routesManifest && !routesManifest._error) {
    const staticRoutes = (routesManifest.staticRoutes || [])
      .filter((r: { page: string }) => r.page.includes('login'))
    const dynamicRoutes = (routesManifest.dynamicRoutes || [])
      .filter((r: { page: string }) => r.page.includes('login'))
    loginRouteInfo = JSON.stringify({ staticRoutes, dynamicRoutes })
  }

  // 7. Check required-server-files.json for config
  const requiredServerFiles = safeReadJSON(path.join(nextDir, 'required-server-files.json'))
  let nextConfig = 'not found'
  if (requiredServerFiles && !requiredServerFiles._error) {
    nextConfig = JSON.stringify(requiredServerFiles.config || 'no config key')
  }

  // 8. Check Netlify-specific files
  const netlifyFiles = safeReadDir(cwd)
  const netlifyMetadata = safeReadFile(path.join(cwd, '___netlify-metadata.json'))
  const netlifyServerHandler = safeReadFile(path.join(cwd, '___netlify-server-handler.json'))

  // 9. Try to internally fetch the login page to see what HTML the server returns
  let internalLoginFetch = 'not attempted'
  try {
    const url = process.env.URL || process.env.DEPLOY_PRIME_URL || ''
    if (url) {
      internalLoginFetch = 'Would fetch from: ' + url + '/login'
    } else {
      internalLoginFetch = 'No URL env var found. Available env vars with values: ' +
        Object.keys(process.env)
          .filter(k => !k.includes('SECRET') && !k.includes('KEY') && !k.includes('TOKEN') && !k.includes('PASSWORD'))
          .filter(k => (process.env[k] || '').length < 100)
          .map(k => k + '=' + process.env[k])
          .slice(0, 30)
          .join(', ')
    }
  } catch (e) {
    internalLoginFetch = 'Error: ' + String(e)
  }

  // 10. Check the app-path-routes-manifest
  const appPathRoutes = safeReadJSON(path.join(nextDir, 'app-path-routes-manifest.json'))

  return NextResponse.json({
    buildTime: BUILD_TIME,
    nodeVersion: process.version,
    cwd,
    buildId: safeReadFile(path.join(nextDir, 'BUILD_ID'), 100),
    buildManifestPageKeys: buildManifest && !buildManifest._error
      ? Object.keys(buildManifest.pages || {}).slice(0, 30)
      : buildManifest,
    buildManifestLoginChunks: loginChunksFromManifest,
    loginPrerender,
    loginRouteInfo,
    appPathRoutes: appPathRoutes && !appPathRoutes._error
      ? Object.entries(appPathRoutes).filter(([k]) => k.includes('login') || k.includes('auth'))
      : appPathRoutes,
    authDirContents: authDir,
    authLoginDirContents: authLoginDir,
    loginRelatedFiles: loginFiles,
    nextConfig,
    netlifyMetadata,
    netlifyServerHandler,
    internalLoginFetch,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NETLIFY: process.env.NETLIFY,
      CONTEXT: process.env.CONTEXT,
      DEPLOY_ID: process.env.DEPLOY_ID,
      URL: process.env.URL,
      DEPLOY_PRIME_URL: process.env.DEPLOY_PRIME_URL,
    },
  }, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
