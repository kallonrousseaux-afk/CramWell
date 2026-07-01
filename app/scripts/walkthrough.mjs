import { chromium } from 'playwright'

const out = '/tmp/claude-0/-home-user-CramWell/65453c3f-4703-5667-994c-13547ede068f/scratchpad'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
const logs = []
page.on('console', (m) => m.type() === 'error' && logs.push(m.text()))
page.on('pageerror', (e) => logs.push(String(e)))

await page.goto('http://localhost:4173')
await page.waitForTimeout(800)
await page.screenshot({ path: `${out}/1-home.png` })

// Snap flow with sample problem
await page.getByText('Snap a problem', { exact: false }).first().click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${out}/2-snap.png` })
await page.getByText('Try a sample problem').click()
await page.waitForTimeout(900)
await page.screenshot({ path: `${out}/3-scanning.png` })
await page.waitForTimeout(1600)
await page.screenshot({ path: `${out}/4-solution.png` })
await page.getByText('add to my deck').click()
await page.waitForTimeout(900)

// Review flow
await page.getByRole('button', { name: /Review/ }).first().click()
await page.waitForTimeout(500)
await page.screenshot({ path: `${out}/5-review-front.png` })
await page.getByText('Tap to reveal').click()
await page.waitForTimeout(500)
await page.screenshot({ path: `${out}/6-review-back.png` })
await page.getByRole('button', { name: 'Good' }).click()
await page.waitForTimeout(500)

// Cram
await page.getByRole('button', { name: /Cram/ }).last().click()
await page.waitForTimeout(500)
const in5 = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10)
await page.fill('#exam-date', in5)
await page.waitForTimeout(400)
await page.screenshot({ path: `${out}/7-cram.png` })

console.log('console errors:', logs.length ? logs : 'none')
await browser.close()
