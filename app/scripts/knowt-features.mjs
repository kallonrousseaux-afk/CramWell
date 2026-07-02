import { chromium } from 'playwright'
const out = '/tmp/claude-0/-home-user-CramWell/65453c3f-4703-5667-994c-13547ede068f/scratchpad'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
const errs = []
page.on('console', m => m.type() === 'error' && errs.push(m.text()))
page.on('pageerror', e => errs.push(String(e)))
await page.goto('http://localhost:4173'); await page.waitForTimeout(600)

// 1. Create from notes
await page.getByText('Paste notes').click(); await page.waitForTimeout(400)
await page.locator('textarea').fill(
`Mitochondria: powerhouse of the cell
Photosynthesis - plants turning light into energy
What year did WW2 end? 1945
Amygdala: processes fear and emotion
Capital of France: Paris`)
await page.waitForTimeout(300)
await page.screenshot({ path: `${out}/10-create.png` })
await page.getByRole('button', { name: /Make 5 flashcards/ }).click(); await page.waitForTimeout(700)
await page.getByText('Back to studying').click(); await page.waitForTimeout(400)

// 2. Study hub + Learn mode (answer 6 questions)
await page.getByRole('button', { name: /Study/ }).click(); await page.waitForTimeout(400)
await page.screenshot({ path: `${out}/11-study-hub.png` })
await page.getByRole('button', { name: /Learn/ }).click(); await page.waitForTimeout(500)
await page.screenshot({ path: `${out}/12-learn.png` })
for (let i = 0; i < 6; i++) {
  const opts = page.locator('button:has-text("True"), button:has-text("False")')
  if (await page.getByText('mastered!').count()) break
  if (await opts.count()) { await opts.first().click() }
  else {
    const choices = page.locator('div.screen div[style*="flex-direction: column"] > button')
    if (await choices.count()) await choices.first().click()
  }
  await page.waitForTimeout(1000)
}
await page.locator('button[aria-label="Close"], button:has-text("Done")').first().click(); await page.waitForTimeout(400)

// 3. Practice test — answer all 8
await page.getByRole('button', { name: /Test/ }).first().click(); await page.waitForTimeout(500)
await page.screenshot({ path: `${out}/13-test.png` })
for (let i = 0; i < 8; i++) {
  if (await page.getByText('% ', { exact: false }).count()) break
  const tf = page.locator('button:has-text("True"), button:has-text("False")')
  if (await tf.count()) await tf.first().click()
  else {
    const choices = page.locator('div.screen div[style*="flex-direction: column"] > button')
    if (!(await choices.count())) break
    await choices.first().click()
  }
  await page.waitForTimeout(950)
}
await page.waitForTimeout(500)
await page.screenshot({ path: `${out}/14-test-score.png` })
await page.getByRole('button', { name: 'Done' }).click(); await page.waitForTimeout(400)

// 4. Match game — solve it by pairing programmatically is hard; just screenshot and tap two tiles
await page.getByRole('button', { name: /Match/ }).first().click(); await page.waitForTimeout(600)
await page.screenshot({ path: `${out}/15-match.png` })
const tiles = page.locator('div[style*="grid-template-columns"] > button')
await tiles.nth(0).click(); await page.waitForTimeout(200)
await tiles.nth(1).click(); await page.waitForTimeout(700)
await page.screenshot({ path: `${out}/16-match-tap.png` })

console.log('console errors:', errs.length ? errs : 'none')
await browser.close()
