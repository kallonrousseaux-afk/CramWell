import { chromium } from 'playwright'
const out = '/tmp/claude-0/-home-user-CramWell/65453c3f-4703-5667-994c-13547ede068f/scratchpad'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
const errs = []
page.on('console', m => m.type() === 'error' && errs.push(m.text()))
page.on('pageerror', e => errs.push(String(e)))
await page.goto('http://localhost:4173'); await page.waitForTimeout(600)
await page.screenshot({ path: `${out}/17-home-v3.png` })

// Podcast
await page.getByRole('button', { name: /Podcast/ }).click(); await page.waitForTimeout(500)
await page.screenshot({ path: `${out}/18-podcast.png` })
const play = page.getByRole('button', { name: /Play episode/ })
if (await play.isEnabled()) { await play.click(); await page.waitForTimeout(1200); await page.screenshot({ path: `${out}/19-podcast-playing.png` }) }
await page.locator('button[aria-label="Close"]').click(); await page.waitForTimeout(400)

// Record (headless: likely unsupported fallback OR mic blocked)
await page.getByRole('button', { name: /Record/ }).click(); await page.waitForTimeout(500)
await page.screenshot({ path: `${out}/20-record.png` })
await page.locator('button[aria-label="Close"]').click(); await page.waitForTimeout(300)

// Focus: start, let it tick 3s
await page.getByRole('button', { name: /Focus/ }).click(); await page.waitForTimeout(400)
await page.getByRole('button', { name: /Start/ }).click(); await page.waitForTimeout(3200)
await page.screenshot({ path: `${out}/21-focus.png` })
const time = await page.getByText(/24:5[0-9]/).count()
console.log('focus timer ticking (expect 1):', time)
console.log('console errors:', errs.length ? errs : 'none')
await browser.close()
