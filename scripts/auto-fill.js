const { chromium } = require('playwright');
const fs = require('fs');

async function fillPage(page, cfg) {
  const defaultValue = cfg.defaultValue || 'DemoUser';
  const inputs = await page.$$('input, textarea, select');
  for (const el of inputs) {
    try {
      const tag = await el.evaluate(n => n.tagName.toLowerCase());
      const type = await el.evaluate(n => n.type || 'text');
      const name = await el.evaluate(n => n.getAttribute('name') || n.id || '');

      if (tag === 'select') {
        const options = await el.$$('option');
        if (options.length) {
          const optVal = await options[0].evaluate(o => o.value || o.textContent);
          await el.selectOption(optVal);
        }
        continue;
      }

      if (type === 'checkbox' || type === 'radio') {
        const checked = await el.evaluate(n => n.checked);
        if (!checked) await el.click();
        continue;
      }

      // prefer filling using page.fill if element has an id or selector
      try {
        await el.fill(String(defaultValue));
      } catch (e) {
        // fallback to type
        await el.type(String(defaultValue), { delay: 10 });
      }
    } catch (err) {
      // continue on failures
    }
  }
}

(async () => {
  const cfgPath = process.argv[2] || 'scripts/auto-fill.json';
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  const browser = await chromium.launch({ headless: cfg.headless ?? true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // optional login step
    if (cfg.login && cfg.login.url) {
      await page.goto(cfg.login.url, { waitUntil: 'networkidle' });
      if (cfg.login.beforeWaitFor) await page.waitForTimeout(cfg.login.beforeWaitFor);
      // fill all inputs on login page with defaultValue or provided credentials
      if (cfg.login.credentials) {
        for (const sel of Object.keys(cfg.login.credentials)) {
          const v = cfg.login.credentials[sel];
          try { await page.fill(sel, v); } catch (e) { try { await page.type(sel, v); } catch (ee) {} }
        }
      } else {
        await fillPage(page, cfg);
      }
      if (cfg.login.submitSelector) {
        await page.click(cfg.login.submitSelector);
        await page.waitForTimeout(cfg.login.waitAfterSubmit || 1500);
      }
    }

    // main flows
    for (const step of cfg.steps || []) {
      if (step.url) {
        await page.goto(step.url, { waitUntil: 'networkidle' });
      }
      if (step.waitFor) await page.waitForSelector(step.waitFor, { timeout: step.waitTimeout || 5000 }).catch(()=>{});

      // fill all fields with default value or use per-field map
      if (step.fields && step.fields.length) {
        for (const f of step.fields) {
          try {
            if (f.type === 'select') await page.selectOption(f.selector, f.value);
            else if (f.type === 'click') await page.click(f.selector);
            else await page.fill(f.selector, String(f.value ?? cfg.defaultValue));
          } catch (e) {}
        }
      } else {
        await fillPage(page, cfg);
      }

      if (step.submitSelector) {
        await page.click(step.submitSelector).catch(()=>{});
      }

      if (step.waitAfter) await page.waitForTimeout(step.waitAfter);
    }

    if (cfg.screenshot) await page.screenshot({ path: cfg.screenshotPath || 'auto-fill-result.png', fullPage: true });
    console.log('Auto-fill completed');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Auto-fill error:', err);
    try { await page.screenshot({ path: 'auto-fill-error.png', fullPage: true }); } catch (e) {}
    await browser.close();
    process.exit(1);
  }
})();
