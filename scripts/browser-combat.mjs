import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const output = process.env.EVIDENCE_DIR || 'docs/evidence/combat';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: output, size: { width: 640, height: 360 } } });
const page = await context.newPage();
const errors = [], results = [];
page.on('pageerror', e => errors.push(e.stack || e.message));
page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
const tap = key => page.keyboard.press(key, { delay: 70 });
const shot = name => page.screenshot({ path: path.join(output, `${name}.png`) });
const arena = () => page.evaluate(() => {
  const s = window.blackBird.scene.getScene('ArenaScene');
  return { ammo: s.player.ammo, reloading: s.player.reloadMs, hp: s.dummies.getChildren()[0]?.hp, step: s.player.meleeStep };
});
async function check(id, run) { const observed = await run(); results.push({ id, status: 'passou', observed }); console.log(`PASS ${id}`, JSON.stringify(observed)); }
const report = { date: new Date().toISOString(), browser: browser.version(), results, errors, limitations: ['Fixtures posicionam atores para isolar combate; não são evidência de travessia.', 'Avisos técnicos/poses provisórias não representam animações finais nem avaliação humana de diversão.'] };
try {
  await page.goto(process.env.GAME_URL || 'http://127.0.0.1:4183/');
  await page.waitForFunction(() => window.blackBird?.scene.isActive('MenuScene'));
  await tap('ArrowDown'); await tap('Enter');
  await page.waitForFunction(() => window.blackBird.scene.isActive('ArenaScene'));
  await page.waitForTimeout(250);
  await check('COM-01/02/03/04', async () => {
    await page.evaluate(() => { const s = window.blackBird.scene.getScene('ArenaScene'); const d = s.dummies.getChildren()[0]; s.player.body.reset(d.x - 50, 318); });
    const before = await arena(); await tap('j'); await page.waitForTimeout(500); const after = await arena();
    assert.equal(before.hp - after.hp, 1);
    await page.keyboard.down('j'); await page.waitForTimeout(1500); await page.keyboard.up('j'); const held = await arena();
    assert.equal(after.hp - held.hp, 1);
    await page.evaluate(() => { const s = window.blackBird.scene.getScene('ArenaScene'); const d = s.dummies.getChildren()[0]; s.player.body.reset(d.x + 150, 318); s.player.facing = -1; });
    await tap('j'); await page.waitForTimeout(500); assert.equal((await arena()).hp, held.hp);
    await page.evaluate(() => { const s = window.blackBird.scene.getScene('ArenaScene'); const d = s.dummies.getChildren()[0]; s.player.body.reset(d.x + 50, 318); s.player.facing = -1; });
    await tap('j'); await page.waitForTimeout(80); await shot('nero-melee-left'); await page.waitForTimeout(500);
    const mirrored = await arena(); assert.equal(held.hp - mirrored.hp, 1);
    return { initialHp: before.hp, afterFirst: after.hp, afterHeld: held.hp, mirroredHp: mirrored.hp, holdDoesNotRepeat: true };
  });
  await check('COM-06/07 reload atomic', async () => {
    await page.evaluate(() => { const s = window.blackBird.scene.getScene('ArenaScene'); s.player.body.reset(120, 318); s.player.facing = 1; });
    const hpBefore = (await arena()).hp;
    await tap('k'); await page.waitForTimeout(420); const shotState = await arena(); assert.equal(shotState.ammo, 5);
    await page.waitForTimeout(100); assert.equal((await arena()).hp, hpBefore - 1);
    await tap('r'); await page.waitForTimeout(180); const loading = await arena(); assert.ok(loading.reloading > 0); assert.equal(loading.ammo, 5);
    await tap('j'); await page.waitForTimeout(1100); assert.equal((await arena()).ammo, 5);
    await tap('r'); await page.waitForTimeout(1000); assert.equal((await arena()).ammo, 6);
    for (let i = 0; i < 7; i++) { await tap('k'); await page.waitForTimeout(350); }
    assert.equal((await arena()).ammo, 0); await shot('empty-revolver');
    return { projectileReachedTarget: true, ammoGrantedAtCompletion: true, cancelledReloadGrantedNothing: true, emptyAmmo: 0 };
  });
  await tap('Escape'); await page.waitForTimeout(200); await tap('ArrowDown'); await tap('ArrowDown'); await tap('Enter');
  await page.waitForFunction(() => window.blackBird.scene.isActive('BossArenaScene'));
  await check('BOS-GROUND', async () => {
    await page.waitForTimeout(3000);
    const body = await page.evaluate(() => { const s = window.blackBird.scene.getScene('BossArenaScene'); return { y: s.boss.y, bottom: s.boss.body.bottom, grounded: s.boss.body.blocked.down }; });
    assert.equal(body.bottom, 318); assert.ok(body.grounded);
    return body;
  });
  await check('BOS-02/03/04/05/06 direction/recovery', async () => {
    const observed = [];
    for (const [index, move] of ['horizontal', 'slam', 'charge', 'wave'].entries()) {
      await page.evaluate(move => {
        const s = window.blackBird.scene.getScene('BossArenaScene');
        s.player.body.reset(400, 318); s.player.hp = 5; s.player.locked = false; s.player.iFrameMs = 0;
        s.boss.body.reset(540, 318); s.boss.phase = 'AGGRO'; s.boss.cooldownMs = 0; s.boss.phaseMs = 0; s.boss.forcedMove = move;
        s.waves.clear(true, true);
      }, move);
      await tap(String(index + 1));
      await page.waitForFunction(move => { const s = window.blackBird.scene.getScene('BossArenaScene'); return s.boss.phase === 'TELEGRAPH' && s.boss.move === move; }, move);
      const facing = await page.evaluate(() => window.blackBird.scene.getScene('BossArenaScene').boss.facing);
      assert.equal(await page.evaluate(() => window.blackBird.scene.getScene('BossArenaScene').boss.body.bottom), 318);
      await shot(`telegraph-${move}`);
      // For direction locking, move behind via fixture only after telegraph begins.
      if (move === 'horizontal') await page.evaluate(() => { const s = window.blackBird.scene.getScene('BossArenaScene'); s.player.body.reset(620, 318); });
      if (move === 'wave') {
        await page.waitForTimeout(850); await page.keyboard.down('Space');
      }
      await page.waitForFunction(() => window.blackBird.scene.getScene('BossArenaScene').boss.phase === 'ATTACK');
      const actualFacing = await page.evaluate(() => window.blackBird.scene.getScene('BossArenaScene').boss.facing);
      assert.equal(actualFacing, facing);
      if (move === 'wave') {
        const wave = await page.evaluate(() => { const w = window.blackBird.scene.getScene('BossArenaScene').waves.getChildren()[0]; return w && { y: w.y, vx: w.body.velocity.x }; });
        assert.ok(wave); assert.equal(wave.y, 308); assert.equal(wave.vx, -250);
        await page.waitForTimeout(150); await shot('pressure-wave'); await page.keyboard.up('Space');
        await page.waitForTimeout(350);
        assert.equal(await page.evaluate(() => window.blackBird.scene.getScene('BossArenaScene').player.hp), 5);
      }
      await page.waitForFunction(() => window.blackBird.scene.getScene('BossArenaScene').boss.phase === 'RECOVERY');
      const start = await page.evaluate(() => window.blackBird.scene.getScene('BossArenaScene').boss.x);
      await page.waitForTimeout(250);
      const recovered = await page.evaluate(() => { const s = window.blackBird.scene.getScene('BossArenaScene'); return { phase: s.boss.phase, x: s.boss.x }; });
      assert.equal(recovered.phase, 'RECOVERY'); assert.ok(Math.abs(recovered.x - start) < 1);
      observed.push({ move, directionLocked: true, recoveryStopsMovement: true });
    }
    return observed;
  });
  await check('BOS-05 wave hits grounded player', async () => {
    await page.evaluate(() => {
      const s = window.blackBird.scene.getScene('BossArenaScene');
      s.player.body.reset(400, 318); s.player.hp = 5; s.player.iFrameMs = 0;
      s.boss.body.reset(540, 318); s.boss.phase = 'AGGRO'; s.boss.cooldownMs = 0; s.boss.forcedMove = 'wave';
      s.waves.clear(true, true);
    });
    await page.waitForTimeout(1700);
    const hp = await page.evaluate(() => window.blackBird.scene.getScene('BossArenaScene').player.hp);
    assert.equal(hp, 4);
    return { hpAfterUnavoidedWave: hp, jumpingAvoidedSameThreatInPreviousTest: true };
  });
  await check('BOS-09/10', async () => {
    await page.evaluate(() => {
      const s = window.blackBird.scene.getScene('BossArenaScene');
      s.player.body.reset(180, 318); s.player.hp = 5; s.player.iFrameMs = 0;
      s.boss.body.reset(400, 318); s.boss.phase = 'AGGRO'; s.boss.cooldownMs = 0; s.boss.forcedMove = 'wave';
    });
    await page.waitForFunction(() => window.blackBird.scene.getScene('BossArenaScene').waves.countActive() > 0);
    const activeBeforeDefeat = await page.evaluate(() => window.blackBird.scene.getScene('BossArenaScene').waves.countActive());
    await page.evaluate(() => { const s = window.blackBird.scene.getScene('BossArenaScene'); s.boss.phase = 'RECOVERY'; s.boss.hp = 1; s.boss.hit(1, s.player.x); });
    await page.waitForTimeout(200);
    assert.equal(await page.evaluate(() => window.blackBird.scene.getScene('BossArenaScene').waves.countActive()), 0);
    for (let i = 0; i < 10; i++) {
      await tap('F5'); await page.waitForTimeout(250);
      const reset = await page.evaluate(() => { const s = window.blackBird.scene.getScene('BossArenaScene'); return { hp: s.player.hp, ammo: s.player.ammo, bossHp: s.boss.hp, waves: s.waves.countActive(), children: s.children.length, bottom: s.boss.body.bottom }; });
      assert.equal(reset.hp, 5); assert.equal(reset.ammo, 6); assert.equal(reset.bossHp, 28); assert.equal(reset.waves, 0);
      assert.equal(reset.bottom, 318);
      results.push({ id: `BOS-RESET-${i}`, status: 'passou', observed: reset });
    }
    await shot('nero-winsth-scale');
    return { activeBeforeDefeat, restarts: 10, threatsClearedAfterDefeat: true, anatomicalScaleApproval: 'não verificada; arte em revisão' };
  });
  assert.deepEqual(errors, []);
} catch (error) { report.failure = error.stack; console.error(error); process.exitCode = 1; await shot('failure').catch(() => {}); }
finally {
  await context.close(); const video = await page.video()?.path(); if (video) await fs.rename(video, path.join(output, 'combat.webm'));
  await browser.close(); await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
}
