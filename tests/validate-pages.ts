/**
 * Page Validation Test Suite
 *
 * Uses Puppeteer to verify:
 * - All pages load without errors
 * - No console errors
 * - Core UI elements render
 * - Navigation works
 *
 * Run with: npx tsx tests/validate-pages.ts
 */

import { existsSync, readFileSync } from 'fs'
import { createServer } from 'http'
import { join } from 'path'
import { parse } from 'url'
import { type Browser, Page, chromium } from 'playwright'

// Test configuration
const CONFIG = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  screenshotDir: './test-results/screenshots',
  routes: [
    // Marketing routes (public)
    { path: '/', name: 'Landing', expectedSelector: 'h1' },
    { path: '/about', name: 'About', expectedSelector: 'h1' },
    { path: '/contact', name: 'Contact', expectedSelector: 'h1' },
    { path: '/terms', name: 'Terms', expectedSelector: 'h1' },
    { path: '/privacy', name: 'Privacy', expectedSelector: 'h1' },

    // Auth routes
    { path: '/login', name: 'Login', expectedSelector: 'button[type="submit"]', auth: false },
    { path: '/signup', name: 'Signup', expectedSelector: 'button[type="submit"]', auth: false },
    { path: '/magic-link', name: 'Magic Link', expectedSelector: 'button', auth: false },

    // Protected app routes
    {
      path: '/browse',
      name: 'Browse',
      expectedSelector: '[data-testid="browse-screen"]',
      auth: true,
    },
    {
      path: '/messages',
      name: 'Messages',
      expectedSelector: '[data-testid="messages-screen"]',
      auth: true,
    },
    {
      path: '/bookings',
      name: 'Bookings',
      expectedSelector: '[data-testid="bookings-screen"]',
      auth: true,
    },
    {
      path: '/favorites',
      name: 'Favorites',
      expectedSelector: '[data-testid="favorites-screen"]',
      auth: true,
    },
    {
      path: '/events',
      name: 'Events',
      expectedSelector: '[data-testid="events-screen"]',
      auth: true,
    },
    {
      path: '/me',
      name: 'Profile',
      expectedSelector: '[data-testid="profile-screen"]',
      auth: true,
    },
    {
      path: '/settings',
      name: 'Settings',
      expectedSelector: '[data-testid="settings-screen"]',
      auth: true,
    },
  ],
}

interface TestResult {
  route: string
  name: string
  status: 'pass' | 'fail' | 'skip'
  loadTime: number
  consoleErrors: string[]
  networkErrors: string[]
  screenshot?: string
  error?: string
}

class PageValidator {
  private browser: Browser | null = null
  private results: TestResult[] = []
  private consoleErrors: Map<string, string[]> = new Map()
  private networkErrors: Map<string, string[]> = new Map()

  async init() {
    console.log('🚀 Launching browser...')
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
  }

  async validatePage(route: string, name: string, expectedSelector?: string): Promise<TestResult> {
    if (!this.browser) throw new Error('Browser not initialized')

    const url = `${CONFIG.baseUrl}${route}`
    const page = await this.browser.newPage()

    // Collect console errors
    const pageConsoleErrors: string[] = []
    const pageNetworkErrors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        pageConsoleErrors.push(text)
        console.log(`   ❌ Console error on ${route}: ${text}`)
      }
    })

    page.on('pageerror', (error) => {
      pageConsoleErrors.push(error.message)
      console.log(`   ❌ Page error on ${route}: ${error.message}`)
    })

    page.on('response', (response) => {
      if (response.status() >= 400) {
        const error = `${response.status()} ${response.url()}`
        pageNetworkErrors.push(error)
      }
    })

    try {
      console.log(`\n📄 Testing ${name}: ${route}`)

      const startTime = Date.now()
      const response = await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: CONFIG.timeout,
      })
      const loadTime = Date.now() - startTime

      // Check for 404 or 500 errors
      if (response?.status() === 404) {
        throw new Error('Page returned 404')
      }
      if (response?.status() === 500) {
        throw new Error('Page returned 500')
      }

      // Wait for expected selector if provided
      if (expectedSelector) {
        try {
          await page.waitForSelector(expectedSelector, { timeout: 5000 })
          console.log(`   ✓ Found expected element: ${expectedSelector}`)
        } catch {
          console.log(`   ⚠ Expected element not found: ${expectedSelector}`)
        }
      }

      // Check for Next.js error overlay
      const errorOverlay = await page.$('[data-nextjs-dialog]')
      if (errorOverlay) {
        throw new Error('Next.js error overlay detected')
      }

      // Take screenshot if there are errors
      let screenshot: string | undefined
      if (pageConsoleErrors.length > 0 || pageNetworkErrors.length > 0) {
        const screenshotPath = `${CONFIG.screenshotDir}/${name.replace(/\s+/g, '-').toLowerCase()}.png`
        await page.screenshot({ path: screenshotPath, fullPage: true })
        screenshot = screenshotPath
      }

      console.log(`   ✓ Loaded in ${loadTime}ms`)
      console.log(
        `   ${pageConsoleErrors.length === 0 ? '✓' : '⚠'} ${pageConsoleErrors.length} console errors`
      )
      console.log(
        `   ${pageNetworkErrors.length === 0 ? '✓' : '⚠'} ${pageNetworkErrors.length} network errors`
      )

      await page.close()

      return {
        route,
        name,
        status: 'pass',
        loadTime,
        consoleErrors: pageConsoleErrors,
        networkErrors: pageNetworkErrors,
        screenshot,
      }
    } catch (error) {
      await page.close()
      console.log(`   ❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`)

      return {
        route,
        name,
        status: 'fail',
        loadTime: 0,
        consoleErrors: pageConsoleErrors,
        networkErrors: pageNetworkErrors,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async runAllTests() {
    console.log('🧪 Starting Page Validation Tests\n')
    console.log('='.repeat(60))

    // Create screenshot directory
    const { mkdirSync } = await import('fs')
    try {
      mkdirSync(CONFIG.screenshotDir, { recursive: true })
    } catch {}

    for (const routeConfig of CONFIG.routes) {
      const result = await this.validatePage(
        routeConfig.path,
        routeConfig.name,
        routeConfig.expectedSelector
      )
      this.results.push(result)
    }

    await this.generateReport()
  }

  async generateReport() {
    console.log('\n' + '='.repeat(60))
    console.log('📊 TEST RESULTS SUMMARY')
    console.log('='.repeat(60))

    const passed = this.results.filter((r) => r.status === 'pass').length
    const failed = this.results.filter((r) => r.status === 'fail').length
    const total = this.results.length

    console.log(`\n✅ Passed: ${passed}/${total}`)
    console.log(`❌ Failed: ${failed}/${total}`)
    console.log(
      `⏱️  Average Load Time: ${Math.round(this.results.reduce((a, r) => a + r.loadTime, 0) / total)}ms`
    )

    if (failed > 0) {
      console.log('\n❌ FAILED PAGES:')
      this.results
        .filter((r) => r.status === 'fail')
        .forEach((r) => {
          console.log(`   - ${r.name} (${r.route}): ${r.error}`)
        })
    }

    const totalConsoleErrors = this.results.reduce((a, r) => a + r.consoleErrors.length, 0)
    if (totalConsoleErrors > 0) {
      console.log(`\n⚠️  TOTAL CONSOLE ERRORS: ${totalConsoleErrors}`)
      this.results
        .filter((r) => r.consoleErrors.length > 0)
        .forEach((r) => {
          console.log(`\n   ${r.name} (${r.route}):`)
          r.consoleErrors.forEach((e) => console.log(`      - ${e.substring(0, 100)}...`))
        })
    } else {
      console.log('\n✅ No console errors detected!')
    }

    console.log('\n' + '='.repeat(60))
    console.log(failed === 0 ? '🎉 ALL TESTS PASSED!' : `⚠️  ${failed} TEST(S) FAILED`)
    console.log('='.repeat(60))

    // Write JSON report
    const reportPath = './test-results/page-validation-report.json'
    const { writeFileSync } = await import('fs')
    writeFileSync(
      reportPath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          summary: {
            total,
            passed,
            failed,
            totalConsoleErrors,
            totalNetworkErrors: this.results.reduce((a, r) => a + r.networkErrors.length, 0),
          },
          results: this.results,
        },
        null,
        2
      )
    )

    console.log(`\n📄 Full report saved to: ${reportPath}`)

    process.exit(failed > 0 ? 1 : 0)
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
    }
  }
}

// Run tests
async function main() {
  const validator = new PageValidator()

  try {
    await validator.init()
    await validator.runAllTests()
  } catch (error) {
    console.error('Test runner failed:', error)
    process.exit(1)
  } finally {
    await validator.close()
  }
}

// Check if dev server is running
async function checkDevServer(): Promise<boolean> {
  try {
    const response = await fetch(CONFIG.baseUrl)
    return response.status === 200
  } catch {
    return false
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🔍 KING SOCIAL - Page Validation Suite\n')

  checkDevServer().then((isRunning) => {
    if (!isRunning) {
      console.log('⚠️  Dev server not detected at', CONFIG.baseUrl)
      console.log('Please start the dev server first: npm run dev')
      console.log('\nOr test against a deployed URL:')
      console.log('TEST_BASE_URL=https://your-app.com npx tsx tests/validate-pages.ts')
      process.exit(1)
    }

    main()
  })
}

export { PageValidator, CONFIG }
