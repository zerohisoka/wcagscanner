import * as axe from 'axe-core'

export interface ScanViolation {
  id: string
  impact: string
  description: string
  help: string
  helpUrl: string
  nodes: Array<{
    html: string
    target: string[]
    failureSummary: string
  }>
}

export interface ScanResult {
  url: string
  score: number
  violations: ScanViolation[]
  passes: number
  totalViolations: number
  critical: number
  serious: number
  moderate: number
  minor: number
  bigSix: {
    contrast: number
    altText: number
    labels: number
    links: number
    buttons: number
    language: number
  }
}

export async function runScan(url: string): Promise<ScanResult> {
  const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN!

  // Connect to browserless remote Chrome
  const puppeteer = require('puppeteer-core')

  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://production-sfo.browserless.io?token=${BROWSERLESS_TOKEN}`,
  })

  let page = null

  try {
    page = await browser.newPage()

    await page.setBypassCSP(true)

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    )

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 25000,
    })

    await new Promise(r => setTimeout(r, 2000))

    // Inject axe-core using callback style
    await page.addScriptTag({
      url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.2/axe.min.js'
    })

    await page.waitForFunction(
      () => typeof (window as any).axe !== 'undefined',
      { timeout: 10000 }
    )

    const rawResults = await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        ;(window as any).axe.run(
          document,
          {
            runOnly: ['wcag2a', 'wcag2aa'],
            elementRef: false,
            selectors: true,
            ancestry: false,
            xpath: false,
          },
          (err: any, results: any) => {
            if (err) {
              reject(err.message || 'axe run failed')
              return
            }

            const violations = results.violations.map((v: any) => ({
              id: String(v.id || ''),
              impact: String(v.impact || 'minor'),
              description: String(v.description || ''),
              help: String(v.help || ''),
              helpUrl: String(v.helpUrl || ''),
              nodes: (v.nodes || []).slice(0, 5).map((n: any) => ({
                html: String(n.html || '').slice(0, 500),
                target: (n.target || []).map((t: any) => String(t)),
                failureSummary: String(n.failureSummary || ''),
              })),
            }))

            resolve({
              violations,
              passCount: results.passes ? results.passes.length : 0,
              url: String(results.url || ''),
            })
          }
        )
      })
    })

    const data = rawResults as any
    const violations: ScanViolation[] = data.violations || []

    let deductions = 0
    let critical = 0, serious = 0, moderate = 0, minor = 0

    violations.forEach((v) => {
      switch (v.impact) {
        case 'critical': critical++; deductions += 8; break
        case 'serious': serious++; deductions += 4; break
        case 'moderate': moderate++; deductions += 2; break
        default: minor++; deductions += 0.5
      }
    })

    const score = Math.max(0, Math.min(100, Math.round(100 - deductions)))

    const bigSix = {
      contrast: violations.filter(v => v.id === 'color-contrast').length,
      altText: violations.filter(v => v.id === 'image-alt').length,
      labels: violations.filter(v => v.id === 'label').length,
      links: violations.filter(v => v.id === 'link-name').length,
      buttons: violations.filter(v => v.id === 'button-name').length,
      language: violations.filter(v => v.id === 'html-has-lang').length,
    }

    return {
      url: data.url || url,
      score,
      violations,
      passes: data.passCount || 0,
      totalViolations: violations.length,
      critical,
      serious,
      moderate,
      minor,
      bigSix,
    }

  } finally {
    if (page) await page.close()
    await browser.disconnect()
  }
}