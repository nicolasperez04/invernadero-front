# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> EVENTS >> should display event history
- Location: e2e\app.spec.ts:255:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e3]:
    - generic [ref=e4]:
        - generic [ref=e5]: 🌾 Sistema de Invernadero
        - generic [ref=e6]:
            - generic [ref=e7]:
                - button "ES" [ref=e8] [cursor=pointer]
                - generic [ref=e9]: '|'
                - button "EN" [ref=e10] [cursor=pointer]
            - generic [ref=e11]:
                - img [ref=e12]: account_circle
                - generic [ref=e13]: nicolas@gmail.com
            - button "Cerrar sesión" [ref=e14] [cursor=pointer]:
                - img [ref=e15]: logout
                - text: Cerrar sesión
    - generic [ref=e16]:
        - generic [ref=e17]:
            - generic [ref=e19]: Menú
            - generic [ref=e20] [cursor=pointer]:
                - img [ref=e21]: dashboard
                - generic [ref=e22]: Dashboard
            - generic [ref=e23] [cursor=pointer]:
                - img [ref=e24]: grass
                - generic [ref=e25]: Cultivos
            - generic [ref=e26] [cursor=pointer]:
                - img [ref=e27]: place
                - generic [ref=e28]: Lotes
            - generic [ref=e29] [cursor=pointer]:
                - img [ref=e30]: event
                - generic [ref=e31]: Eventos
        - generic [ref=e33]:
            - generic [ref=e34]:
                - heading "Eventos" [level=1] [ref=e35]:
                    - img [ref=e36]: event
                    - text: Eventos
                - paragraph [ref=e37]: Descripción
            - generic [ref=e38]:
                - generic [ref=e39]:
                    - img [ref=e40]: place
                    - text: Seleccione lote
                - generic [ref=e42]:
                    - generic [ref=e43]: Lote
                    - combobox [ref=e44]:
                        - option "Seleccione lote"
                        - option "Lote E2E 1778292856657" [selected]
            - generic [ref=e45]:
                - generic [ref=e46]:
                    - img [ref=e47]: add_circle
                    - text: Nuevo Evento
                - generic [ref=e48]:
                    - generic [ref=e49]:
                        - generic [ref=e50]: Tipo
                        - combobox [ref=e51]:
                            - option "Seleccione tipo de evento" [selected]
                            - option "Siembra"
                            - option "Riego"
                            - option "Fertilización"
                            - option "Poda"
                            - option "Control de plagas"
                            - option "Cosecha"
                    - generic [ref=e52]:
                        - generic [ref=e53]: Fecha y Hora
                        - textbox [ref=e54]
                    - generic [ref=e55]:
                        - generic [ref=e56]: Descripción
                        - textbox "Descripción del evento (opcional)" [ref=e57]
                - button "Registrar" [disabled] [ref=e59]:
                    - img [ref=e60]: add
                    - text: Registrar
            - generic [ref=e61]:
                - heading "Historial - -" [level=3] [ref=e63]
                - generic [ref=e65]:
                    - img [ref=e66]: inbox
                    - paragraph [ref=e67]: No hay eventos registrados aún
```

# Test source

```ts
  171 |     if (optCount > 1) {
  172 |       const timestamp = Date.now();
  173 |       const lotName = `Lote E2E ${timestamp}`;
  174 |
  175 |       await page.locator('input[type="text"]').fill(lotName);
  176 |       await lotSelect.selectOption({ index: 1 });
  177 |       await page.locator('input[type="date"]').first().fill('2026-05-01');
  178 |       await page.locator('input[type="date"]').last().fill('2026-06-30');
  179 |       await page.click('button:has-text("Crear")');
  180 |       await page.waitForTimeout(3000);
  181 |     }
  182 |   });
  183 |
  184 |   test('should open and close lot summary modal', async ({ page }) => {
  185 |     await page.goto('/lots');
  186 |     await page.waitForTimeout(2000);
  187 |
  188 |     const summaryBtns = page.locator('button.btn-summary');
  189 |     const count = await summaryBtns.count();
  190 |
  191 |     if (count > 0) {
  192 |       await summaryBtns.first().click();
  193 |       await page.waitForTimeout(2000);
  194 |
  195 |       await expect(page.locator('.modal-overlay')).toBeVisible({ timeout: 3000 });
  196 |
  197 |       const closeBtn = page.locator('.modal-overlay .btn-close');
  198 |       if (await closeBtn.isVisible()) {
  199 |         await closeBtn.click();
  200 |         await page.waitForTimeout(1000);
  201 |       }
  202 |     }
  203 |   });
  204 |
  205 |   test('should delete lot with confirm dialog', async ({ page }) => {
  206 |     await page.goto('/lots');
  207 |     await page.waitForTimeout(2000);
  208 |
  209 |     const deleteBtns = page.locator('button.btn-delete');
  210 |     const count = await deleteBtns.count();
  211 |
  212 |     if (count > 0) {
  213 |       await deleteBtns.first().click();
  214 |       await page.waitForTimeout(2000);
  215 |
  216 |       const dialog = page.locator('mat-dialog-container');
  217 |       if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
  218 |         await page.locator('mat-dialog-actions button').last().click();
  219 |         await page.waitForTimeout(3000);
  220 |       }
  221 |     }
  222 |   });
  223 | });
  224 |
  225 | test.describe('EVENTS', () => {
  226 |   test.beforeEach(async ({ page }) => {
  227 |     await login(page);
  228 |   });
  229 |
  230 |   test('should display events page', async ({ page }) => {
  231 |     await page.goto('/events');
  232 |     await page.waitForSelector('h1:has-text("Eventos")', { timeout: 5000 });
  233 |     await expect(page.locator('select')).toBeVisible();
  234 |   });
  235 |
  236 |   test('should select lot and load events', async ({ page }) => {
  237 |     await page.goto('/events');
  238 |     await page.waitForTimeout(2000);
  239 |
  240 |     const lotSelect = page.locator('select').first();
  241 |     await lotSelect.waitFor({ state: 'visible' });
  242 |
  243 |     const options = page.locator('select:first-child option');
  244 |     const optCount = await options.count();
  245 |
  246 |     if (optCount > 1) {
  247 |       await lotSelect.selectOption({ index: 1 });
  248 |       await page.waitForTimeout(3000);
  249 |
  250 |       const tableVisible = await page.locator('table').isVisible().catch(() => false);
  251 |       expect(tableVisible || optCount > 1).toBeTruthy();
  252 |     }
  253 |   });
  254 |
  255 |   test('should display event history', async ({ page }) => {
  256 |     await page.goto('/events');
  257 |     await page.waitForTimeout(2000);
  258 |
  259 |     const lotSelect = page.locator('select').first();
  260 |     await lotSelect.waitFor({ state: 'visible', timeout: 5000 });
  261 |
  262 |     const options = lotSelect.locator('option');
  263 |     const optCount = await options.count();
  264 |
  265 |     if (optCount > 1) {
  266 |       await lotSelect.selectOption({ index: 1 });
  267 |       await page.waitForTimeout(3000);
  268 |
  269 |       const table = page.locator('table');
  270 |       const tableExists = await table.count();
> 271 |       expect(tableExists).toBeGreaterThan(0);
      |                           ^ Error: expect(received).toBeGreaterThan(expected)
  272 |     }
  273 |   });
  274 | });
  275 |
  276 | test.describe('NAVIGATION', () => {
  277 |   test.beforeEach(async ({ page }) => {
  278 |     await login(page);
  279 |   });
  280 |
  281 |   test('should navigate to dashboard', async ({ page }) => {
  282 |     await page.locator('.nav-item:has-text("Dashboard")').click();
  283 |     await page.waitForURL(/.*\/dashboard/);
  284 |     await expect(page.locator('.page-title')).toContainText('Dashboard');
  285 |   });
  286 |
  287 |   test('should navigate to crops', async ({ page }) => {
  288 |     await page.locator('.nav-item:has-text("Cultivos")').click();
  289 |     await page.waitForURL(/.*\/crops/);
  290 |     await expect(page.locator('h1')).toContainText('Cultivos');
  291 |   });
  292 |
  293 |   test('should navigate to lots', async ({ page }) => {
  294 |     await page.locator('.nav-item:has-text("Lotes")').click();
  295 |     await page.waitForURL(/.*\/lots/);
  296 |     await expect(page.locator('h1')).toContainText('Lotes');
  297 |   });
  298 |
  299 |   test('should navigate to events', async ({ page }) => {
  300 |     await page.locator('.nav-item:has-text("Eventos")').click();
  301 |     await page.waitForURL(/.*\/events/);
  302 |     await expect(page.locator('h1')).toContainText('Eventos');
  303 |   });
  304 | });
```
