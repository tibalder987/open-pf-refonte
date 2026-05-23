import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Homepage', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/OPEN PF/)
  })

  test('has no critical a11y violations', async ({ page }) => {
    await page.goto('/')
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(results.violations.filter((v) => v.impact === 'critical')).toHaveLength(0)
  })

  test('hero CTA links are present', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /Rejoindre OPEN/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Explorer l'annuaire/i })).toBeVisible()
  })

  test('stats section is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.stats')).toBeVisible()
  })

  test('members showcase is visible and contains logo cards', async ({ page }) => {
    await page.goto('/')
    const showcase = page.locator('.members-showcase')
    await expect(showcase).toBeVisible()
    const cards = showcase.locator('.showcase-link')
    await expect(cards.first()).toBeVisible()
  })

  test('showcase links navigate to member fiches', async ({ page }) => {
    await page.goto('/')
    const firstShowcaseLink = page.locator('.members-showcase .showcase-link').first()
    await firstShowcaseLink.click()
    await expect(page).toHaveURL(/\/adherents\//)
  })

  test('skip link is present and targets #contenu', async ({ page }) => {
    await page.goto('/')
    const skipLink = page.locator('.skip-link')
    await expect(skipLink).toHaveAttribute('href', '#contenu')
  })

  test('quickbar is rendered after footer in DOM order', async ({ page }) => {
    await page.goto('/')
    // The quickbar must appear AFTER the footer element in the DOM
    const footerHandle = await page.locator('footer.site-footer').elementHandle()
    const quickbarHandle = await page.locator('nav.quickbar').elementHandle()
    if (footerHandle && quickbarHandle) {
      const order = await page.evaluate(
        ([footer, quickbar]) => {
          if (!footer || !quickbar) return null
          const pos = footer.compareDocumentPosition(quickbar)
          // DOCUMENT_POSITION_FOLLOWING = 4 means quickbar is after footer
          return (pos & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
        },
        [footerHandle, quickbarHandle],
      )
      expect(order).toBe(true)
    }
  })

  test('h1 content appears before footer in DOM on /adherents', async ({ page }) => {
    await page.goto('/adherents')
    // Wait for React hydration to inject page content into main
    await expect(page.locator('h1').first()).toBeVisible()
    const h1Handle = await page.locator('h1').first().elementHandle()
    const footerHandle = await page.locator('footer.site-footer').elementHandle()
    if (h1Handle && footerHandle) {
      const footerIsAfterH1 = await page.evaluate(
        ([h1, footer]) => {
          if (!h1 || !footer) return null
          const pos = h1.compareDocumentPosition(footer)
          // DOCUMENT_POSITION_FOLLOWING = 4 means footer comes after h1 in the DOM
          return (pos & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
        },
        [h1Handle, footerHandle],
      )
      expect(footerIsAfterH1).toBe(true)
    }
  })
})

test.describe('Annuaire des adhérents', () => {
  test('loads with member cards', async ({ page }) => {
    await page.goto('/adherents')
    await expect(page.locator('h1')).toBeVisible()
    const cards = page.locator('article.member-card-v')
    await expect(cards.first()).toBeVisible()
  })

  test('has no critical a11y violations', async ({ page }) => {
    await page.goto('/adherents')
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(results.violations.filter((v) => v.impact === 'critical')).toHaveLength(0)
  })

  test('search form is present', async ({ page }) => {
    await page.goto('/adherents')
    const searchInput = page.getByRole('searchbox', { name: /Rechercher/i })
    await expect(searchInput).toBeVisible()
    await searchInput.fill('test')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/q=test/)
  })

  test('search with no results shows empty state', async ({ page }) => {
    await page.goto('/adherents?q=xyzxyz_inexistant_987')
    await expect(page.locator('.empty-state')).toBeVisible()
    await expect(page.locator('.empty-state__title')).toContainText('Aucun résultat')
  })

  test('domain filter chips are visible', async ({ page }) => {
    await page.goto('/adherents')
    await expect(page.locator('.filters .filter-chip').first()).toBeVisible()
  })

  test('domain filter updates URL', async ({ page }) => {
    await page.goto('/adherents')
    await expect(page.locator('.filters .filter-chip').first()).toBeVisible()
    // Navigate via href instead of click to avoid image-interception flakiness
    const firstFilter = page.locator('.filters a.filter-chip').nth(1)
    const href = await firstFilter.getAttribute('href')
    expect(href).toBeTruthy()
    if (href) {
      await page.goto(href)
      await expect(page).toHaveURL(/domaine=/)
    }
  })

  test('reset filters link works from empty state', async ({ page }) => {
    await page.goto('/adherents?q=xyzxyz_inexistant_987')
    await page.getByRole('link', { name: /Réinitialiser/i }).click()
    await expect(page).toHaveURL('/adherents')
  })
})

test.describe('Fiche adhérent', () => {
  test('member fiche page loads', async ({ page }) => {
    await page.goto('/adherents')
    const firstCard = page.locator('article.member-card-v a.card-link').first()
    await firstCard.click()
    await expect(page).toHaveURL(/\/adherents\//)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('contact section is present', async ({ page }) => {
    await page.goto('/adherents')
    const firstCard = page.locator('article.member-card-v a.card-link').first()
    await firstCard.click()
    await expect(page.locator('aside.contact-card')).toBeVisible()
  })

  test('has no critical a11y violations', async ({ page }) => {
    await page.goto('/adherents')
    const href = await page
      .locator('article.member-card-v a.card-link')
      .first()
      .getAttribute('href')
    if (href) {
      await page.goto(href)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
      expect(results.violations.filter((v) => v.impact === 'critical')).toHaveLength(0)
    }
  })
})

test.describe("Formulaire d'adhésion", () => {
  test('renders step 1', async ({ page }) => {
    await page.goto('/adhesion')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('step 1 has required fields with correct ARIA attributes', async ({ page }) => {
    await page.goto('/adhesion')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.stepper')).toBeVisible()
    // Required fields must have aria-required="true" on the inputs
    await expect(page.locator('#name[aria-required="true"]')).toBeVisible()
    await expect(page.locator('#legalStatus[aria-required="true"]')).toBeVisible()
    // The "Suivant" button must be present
    await expect(page.getByRole('button', { name: /suivant/i })).toBeVisible()
  })
})

test.describe('Footer', () => {
  test('legal links are present', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /Mentions légales/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Politique de confidentialité/i })).toBeVisible()
  })

  test('footer navigation links are not broken', async ({ page }) => {
    await page.goto('/')
    const footerLinks = page.locator('footer .footer-links a')
    const hrefs = await footerLinks.evaluateAll((els) =>
      els
        .map((el) => el.getAttribute('href'))
        .filter((h): h is string => h !== null && h.startsWith('/')),
    )
    for (const href of hrefs.slice(0, 6)) {
      const response = await page.request.get(href)
      expect(response.status(), `${href} returned ${response.status()}`).not.toBe(404)
    }
  })
})

test.describe('Login admin', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })

  test('redirects unauthenticated access to login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/admin\/login/)
  })
})

test.describe('Pages secondaires', () => {
  test('réseau page loads', async ({ page }) => {
    await page.goto('/reseau')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('contact page loads', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('offres-emploi shows empty state', async ({ page }) => {
    await page.goto('/offres-emploi')
    await expect(page.locator('.empty-state')).toBeVisible()
  })

  test('événements shows empty state', async ({ page }) => {
    await page.goto('/evenements')
    await expect(page.locator('.empty-state')).toBeVisible()
  })

  test('404 page renders', async ({ page }) => {
    const response = await page.goto('/cette-route-nexiste-pas-12345')
    expect(response?.status()).toBe(404)
  })
})
