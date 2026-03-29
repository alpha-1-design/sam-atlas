# BROWSER AUTOMATION SKILL

## Purpose
Control web browsers to perform tasks autonomously.

## Status
Intermediate

## Tools
- Playwright (primary)
- Puppeteer (backup)
- Selenium (legacy support)

## Capabilities
- Navigate to URLs
- Click elements
- Fill forms
- Extract data (scraping)
- Take screenshots
- Handle authentication
- Wait for elements

## Setup
```typescript
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
```

## Common Tasks

### Navigation
```typescript
await page.goto('https://example.com');
await page.click('nav > a:first-child');
await page.goBack();
```

### Form Filling
```typescript
await page.fill('input[name="email"]', 'user@example.com');
await page.fill('input[name="password"]', 'secret');
await page.click('button[type="submit"]');
```

### Data Extraction
```typescript
const title = await page.textContent('h1');
const prices = await page.$$eval('.price', els => 
  els.map(el => el.textContent)
);
```

### Waiting
```typescript
await page.waitForSelector('.loaded-content');
await page.waitForNavigation();
await page.waitForTimeout(2000);
```

## Error Handling
- Timeout: Retry with longer wait
- Element not found: Log and skip
- Navigation failed: Retry 3 times
- Captcha detected: Flag for manual review

## Best Practices
1. Always wait for elements
2. Handle popups gracefully
3. Use selectors carefully
4. Respect robots.txt
5. Add delays between actions
6. Close browser when done

## Use Cases
- Web scraping
- Form automation
- Testing
- Screenshots
- PDF generation
