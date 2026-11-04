import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
const output = process.env.EVIDENCE_DIR || 'docs/evidence/resilience';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--no-sandbox'] });
const report = { date: new Date().toISOString(), url: process.env.GAME_URL, checks: [], errors: [], limitations: ['Fixtures only for region-return and cinematic skip cases; they do not prove route duration.'] };
const tap = (p, k) => p.keyboard.press(k, { delay: 80 });
const url = process.env.GAME_URL || 'http://127.0.0.1:4187/';
async function open(context) { const p = await context.newPage(); p.on('pageerror', e => report.errors.push(e.stack)); await p.goto(url); await p.waitForFunction(() => window.blackBird?.scene.isActive('MenuScene')); return p; }
try {
    const c = await browser.newContext({ viewport: { width: 1280, height: 720 } }), p = await open(c);
    await tap(p, 'Enter');
    await p.waitForTimeout(250);
    await tap(p, 'e');
    await p.waitForFunction(() => window.blackBird.scene.getScene('GameScene').mode === 'DIALOGUE');
    await p.waitForTimeout(250);
    await tap(p, 'e');
    await p.waitForTimeout(350);
    assert.equal(await p.evaluate(() => window.blackBird.scene.getScene('GameScene').world.flags['operario-door-0']), true);
    await tap(p, 'Escape');
    await p.reload();
    await p.waitForFunction(() => window.blackBird?.scene.isActive('MenuScene'));
    await tap(p, 'Enter');
    await p.waitForTimeout(350);
    const restored = await p.evaluate(() => { const s = window.blackBird.scene.getScene('GameScene'), door = s.world.interactives.find(i => i.id === 'operario-door-0'); return { flag: s.world.flags[door.id], scale: door.sprite.scaleX, opened: door.sprite.getData('opened') }; });
    assert.deepEqual(restored, { flag: true, scale: .12, opened: true });
    await p.evaluate(() => { const s = window.blackBird.scene.getScene('GameScene'); s.player.body.reset(6000, 318); });
    await p.waitForTimeout(200);
    await p.evaluate(() => { const s = window.blackBird.scene.getScene('GameScene'); s.player.body.reset(176, 318); });
    await p.waitForTimeout(200);
    assert.equal(await p.evaluate(() => window.blackBird.scene.getScene('GameScene').world.flags['operario-door-0']), true);
    report.checks.push({ case: 'door-save-return', restored, fixture: 'only the round trip positions; initial door interaction and reload use real input' });
    await p.screenshot({ path: path.join(output, 'restored-door.png') });
    await p.evaluate(() => { const s = window.blackBird.scene.getScene('GameScene'); const mark = s.world.interactives.find(i => i.kind === 'cutscene'); s.player.body.reset(mark.x, 318); });
    await p.waitForTimeout(200);
    await tap(p, 'e');
    await p.waitForFunction(() => window.blackBird.scene.getScene('GameScene').mode === 'CUTSCENE');
    await tap(p, 'f');
    await p.waitForFunction(() => window.blackBird.scene.getScene('GameScene').ended);
    await p.waitForTimeout(400);
    assert.equal(await p.evaluate(() => document.getElementById('game-caption').textContent), '');
    assert.equal(await p.evaluate(() => JSON.parse(localStorage.getItem('black-bird.opening.v1')).completed), true);
    report.checks.push({ case: 'skip', completed: true, noLateCrashCaption: true });
    await c.close();
    const blocked = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    await blocked.addInitScript(() => { const set = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (k === 'black-bird.opening.v1')
        throw new DOMException('storage blocked', 'QuotaExceededError'); return set.call(this, k, v); }; });
    const q = await open(blocked);
    await tap(q, 'Enter');
    await q.waitForTimeout(350);
    assert.ok(await q.evaluate(() => window.blackBird.scene.getScene('UIScene').notice.text.includes('Não foi possível salvar')));
    await q.keyboard.down('d');
    await q.waitForTimeout(500);
    await q.keyboard.up('d');
    assert.ok(await q.evaluate(() => window.blackBird.scene.getScene('GameScene').player.x > 225));
    await q.screenshot({ path: path.join(output, 'storage-blocked.png') });
    report.checks.push({ case: 'blocked-storage', movementRemainsUsable: true, visibleNotice: true });
    await blocked.close();
    const missing = await browser.newContext({ viewport: { width: 1280, height: 720 } }), r = await missing.newPage();
    r.on('pageerror', e => report.errors.push(e.stack));
    await r.route('**/nero-production-v2.png', route => route.abort('failed'));
    await r.goto(url);
    await r.waitForFunction(() => window.blackBird?.scene.getScene('BootScene').failedAssets.includes('nero'));
    await r.waitForFunction(() => window.blackBird.scene.getScene('BootScene').children.getChildren().some(c => c.text?.includes('A cidade não terminou')));
    assert.equal(await r.evaluate(() => window.blackBird.scene.isActive('MenuScene')), false);
    await r.screenshot({ path: path.join(output, 'missing-asset.png') });
    await r.unroute('**/nero-production-v2.png');
    await tap(r, 'Enter');
    await r.waitForFunction(() => window.blackBird?.scene.isActive('MenuScene'));
    report.checks.push({ case: 'asset-network-failure', visibleRetry: true, retryRestoredMenu: true, expectedNetworkAbort: 'nero-production-v2.png' });
    await missing.close();
    assert.deepEqual(report.errors, []);
}
catch (e) {
    report.failure = e.stack;
    console.error(e);
    process.exitCode = 1;
}
finally {
    await browser.close();
    await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
    console.log(report);
}
