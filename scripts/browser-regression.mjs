import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const url = process.env.GAME_URL || 'http://127.0.0.1:4183/';
const output = process.env.EVIDENCE_DIR || 'docs/evidence/current';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  args: ['--no-sandbox'],
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: output, size: { width: 640, height: 360 } } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.stack || error.message));
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
const results = [];
const report = {
  date: new Date().toISOString(), baseCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  workingTree: execFileSync('git', ['diff', '--stat'], { encoding: 'utf8' }),
  browser: browser.version(), url, viewport: { width: 1280, height: 720 }, results, errors,
  limitations: ['Chromium headless, renderização por software; não equivale a playtest humano.', 'Não valida aprovação artística, Docker ou HML.'],
};
const shot = name => page.screenshot({ path: path.join(output, `${name}.png`) });
const tap = key => page.keyboard.press(key, { delay: 70 });
const state = () => page.evaluate(() => {
  const s = window.blackBird.scene.getScene('GameScene');
  return {
    x: s.player.x, y: s.player.y, bottom: s.player.body.bottom, grounded: s.player.onGround,
    vx: s.player.body.velocity.x, mode: s.mode, paused: s.scene.isPaused(), frame: s.player.frame.name,
    dialogue: { open: s.dialogue.open, index: s.dialogue.index },
    speaker: s.speaker?.npcId, npcs: s.world.npcs.getChildren().map(n => ({ id: n.npcId, x: n.x, y: n.y, busy: n.busy, anim: n.anims.currentAnim?.key })),
    scrollX: s.cameras.main.scrollX, room: s.registry.get('run').roomId,
    run: s.registry.get('run'), listeners: s.events.listenerCount('dialogue'),
    children: s.children.length, cutscene: s.cutscene?.phase,
  };
});
async function check(id, run) {
  const started = Date.now();
  try {
    const observed = await run();
    results.push({ id, status: 'passou', durationMs: Date.now() - started, observed });
    console.log(`PASS ${id}`, JSON.stringify(observed ?? {}));
  } catch (error) {
    results.push({ id, status: 'falhou', error: error.message });
    throw error;
  }
}
async function walkTo(x, timeout = 80000) {
  const current = await state();
  const right = x > current.x;
  await page.keyboard.down(right ? 'd' : 'a');
  try {
    await page.waitForFunction(({ x, right }) => {
      const p = window.blackBird.scene.getScene('GameScene').player;
      return right ? p.x >= x : p.x <= x;
    }, { x, right }, { timeout, polling: 100 });
  } finally { await page.keyboard.up(right ? 'd' : 'a'); }
  await page.waitForTimeout(180);
}
try {
  await page.goto(url);
  report.artifactScript = await page.locator('script[type="module"]').first().getAttribute('src');
  await page.waitForFunction(() => window.blackBird?.scene.isActive('MenuScene'));
  await shot('menu');
  await tap('Enter');
  await page.waitForFunction(() => window.blackBird.scene.isActive('GameScene'));
  await page.waitForTimeout(500);
  await shot('start');
  await check('PHY-01', async () => {
    const before = await state();
    await page.waitForTimeout(30000);
    const after = await state();
    assert.ok(Math.abs(after.y - before.y) <= 1);
    assert.equal(after.bottom, 318);
    return { beforeY: before.y, afterY: after.y, bottom: after.bottom, seconds: 30 };
  });
  await check('PAUSE-MOVEMENT', async () => {
    await page.keyboard.down('d'); await page.waitForTimeout(650); await tap('Escape');
    await page.waitForFunction(() => window.blackBird.scene.getScene('GameScene').scene.isPaused());
    const before = await state(); await page.waitForTimeout(1000); const after = await state();
    assert.equal(after.x, before.x);
    assert.deepEqual(after.npcs, before.npcs);
    await shot('paused');
    await page.keyboard.up('d'); await tap('Escape'); await page.waitForTimeout(150);
    assert.equal((await state()).mode, 'EXPLORING');
    return { beforeX: before.x, afterX: after.x, npcsFrozen: true };
  });
  await check('INP-01/02/03/09', async () => {
    // Approach the first NPC with real input; no teleport as traversal evidence.
    const npc = (await state()).npcs[0]; await walkTo(npc.x - 20);
    // Patrol continues, so step toward the current position if necessary.
    const next = (await state()).npcs[0];
    if (Math.abs((await state()).x - next.x) > 44) await walkTo(next.x - 10);
    await page.keyboard.down('d'); await tap('e');
    await page.waitForFunction(() => window.blackBird.scene.getScene('GameScene').mode === 'DIALOGUE');
    const before = await state(); await page.waitForTimeout(800); const held = await state();
    assert.equal(held.x, before.x);
    assert.equal(held.npcs.find(n => n.id === held.speaker).x, before.npcs.find(n => n.id === before.speaker).x);
    await page.keyboard.down('e'); await page.waitForTimeout(500); const index = (await state()).dialogue.index;
    await page.waitForTimeout(700); assert.equal((await state()).dialogue.index, index); await page.keyboard.up('e');
    await shot('dialogue'); await page.keyboard.up('d');
    await tap('Escape'); await page.waitForTimeout(200); assert.equal((await state()).mode, 'PAUSED');
    await tap('Escape'); await page.waitForTimeout(200); assert.equal((await state()).mode, 'DIALOGUE');
    // Inputs held during dialogue do not become a jump after closing it.
    await page.keyboard.down('Space');
    for (let i = 0; i < 8 && (await state()).dialogue.open; i++) { await page.waitForTimeout(230); await tap('e'); }
    await page.waitForTimeout(300); const after = await state();
    assert.equal(after.mode, 'EXPLORING'); assert.ok(after.grounded); await page.keyboard.up('Space');
    return { speaker: before.speaker, playerStopped: true, npcStopped: true, pauseRestoredDialogue: true };
  });
  await check('INP-04/10', async () => {
    for (let i = 0; i < 10; i++) {
      // This is an explicit interruption/lifecycle test, not a traversal claim.
      await page.evaluate(() => { const s = window.blackBird.scene.getScene('GameScene'); const n = s.world.npcs.getChildren()[0]; n.setPosition(s.player.x + 20, s.player.y); n.body.reset(n.x, n.y); });
      await tap('e'); await page.waitForTimeout(250);
      assert.equal((await state()).mode, 'DIALOGUE');
      if (i === 9) {
        await page.evaluate(() => window.blackBird.scene.getScene('GameScene').speaker.destroy());
      } else {
        for (let j = 0; j < 8 && (await state()).dialogue.open; j++) { await tap('e'); await page.waitForTimeout(210); }
      }
      await page.waitForTimeout(100); assert.equal((await state()).mode, 'EXPLORING');
    }
    assert.equal((await state()).listeners, 1);
    return { cycles: 10, dialogueListeners: 1, removedSpeakerRecovered: true };
  });
  await check('PHY-05', async () => {
    const heights = [];
    for (const heldMs of [50, 500]) {
      const floor = (await state()).y;
      await page.evaluate(() => { const s = window.blackBird.scene.getScene('GameScene'); s.registry.set('testMinY', s.player.y); const sample = () => s.registry.set('testMinY', Math.min(s.registry.get('testMinY'), s.player.y)); s.events.on('postupdate', sample); s.registry.set('testSampler', sample); });
      await page.keyboard.down('Space'); await page.waitForTimeout(heldMs); await page.keyboard.up('Space'); await page.waitForTimeout(850);
      heights.push(await page.evaluate(floor => { const s = window.blackBird.scene.getScene('GameScene'); s.events.off('postupdate', s.registry.get('testSampler')); return floor - s.registry.get('testMinY'); }, floor));
    }
    assert.ok(heights[1] > heights[0] + 10); await shot('after-jump'); return { short: heights[0], held: heights[1] };
  });
  await check('CAM-01/02/03/05/10; PHY-02; NAR-03', async () => {
    const geometry = await page.evaluate(async () => {
      const s = window.blackBird.scene.getScene('GameScene');
      return { width: s.physics.world.bounds.width, regions: ['operario', 'mercado', 'avenida', 'escola'] };
    });
    for (const x of [2200, 4300, 6500, geometry.width - 20]) { await walkTo(x); await shot(`region-${(await state()).room}`); }
    const far = await state(); assert.equal(far.room, 'escola');
    await walkTo(25, 90000); const back = await state();
    assert.equal(back.room, 'operario'); assert.equal(back.scrollX, 0); assert.ok(back.grounded); await shot('returned');
    return { farX: far.x, farCamera: far.scrollX, returnedX: back.x, activeWalkSeconds: back.run.activeWalkMs / 1000, outboundActiveSeconds: far.run.activeWalkMs / 1000, distance: back.run.walkDistance };
  });
  await check('CAM-06 / UX-08', async () => {
    await page.setViewportSize({ width: 900, height: 700 }); await page.waitForTimeout(300); await shot('small-window');
    const after = await state(); assert.equal(after.bottom, 318); assert.equal(after.scrollX, 0);
    await page.setViewportSize({ width: 1280, height: 720 });
    return { viewport: '900x700', floor: after.bottom };
  });
  await check('INP-06 / INP-09 focus', async () => {
    await page.keyboard.down('d'); await page.waitForTimeout(250);
    // DOM blur exercises the engine's actual focus lifecycle; it is synthetic.
    await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    await page.waitForTimeout(200); const before = await state(); assert.equal(before.mode, 'PAUSED');
    await page.waitForTimeout(500); assert.equal((await state()).x, before.x);
    await page.keyboard.up('d'); await page.evaluate(() => window.dispatchEvent(new Event('focus'))); await tap('Escape');
    await page.waitForTimeout(300); assert.equal((await state()).mode, 'EXPLORING');
    return { syntheticDomBlur: true, inputRecovered: true };
  });
  await check('RESET / REL-08', async () => {
    for (let i = 0; i < 3; i++) {
      await tap('Escape'); await page.waitForTimeout(100); await tap('ArrowDown'); await tap('Enter');
      await page.waitForTimeout(500); const s = await state();
      assert.equal(s.mode, 'EXPLORING'); assert.equal(s.run.talked.length, 0); assert.equal(s.listeners, 1); assert.ok(s.x < 200);
    }
    return { restarts: 3, dialogueListeners: 1, runReset: true };
  });
  await check('NAR-04/05/09', async () => {
    // Fixture only for the cinematic, explicitly not evidence of route duration.
    await page.evaluate(() => {
      const s = window.blackBird.scene.getScene('GameScene');
      const mark = s.world.interactives.find(i => i.kind === 'cutscene');
      s.player.body.reset(mark.x, 318); s.lastPlayerX = mark.x;
    });
    await page.waitForTimeout(200); await tap('e');
    await page.waitForFunction(() => window.blackBird.scene.getScene('GameScene').cutscene?.phase === 'daughter');
    await shot('daughter'); await tap('Escape'); await page.waitForTimeout(200);
    const before = await page.evaluate(() => window.blackBird.scene.getScene('GameScene').cutscene.elapsed);
    await page.waitForTimeout(500);
    assert.equal(await page.evaluate(() => window.blackBird.scene.getScene('GameScene').cutscene.elapsed), before);
    await tap('Escape');
    await page.waitForFunction(() => window.blackBird.scene.getScene('GameScene').cutscene?.phase === 'black');
    await shot('black-before-end');
    assert.equal(await page.evaluate(() => window.blackBird.scene.getScene('UIScene').objective.visible), false);
    await page.waitForFunction(() => window.blackBird.scene.getScene('GameScene').ended);
    await shot('prologue-end');
    assert.ok((await state()).run.prologueEnded);
    assert.equal(await page.evaluate(() => window.blackBird.scene.isActive('BossArenaScene')), false);
    return { fixture: true, pausedTimelineFrozen: true, blackCutCaptured: true, noBossAfterStory: true };
  });
  assert.deepEqual(errors, []);
} catch (error) {
  report.failure = error.stack;
  await shot('failure').catch(() => {});
  console.error(error);
  process.exitCode = 1;
} finally {
  await context.close();
  const video = await page.video()?.path();
  if (video) { const final = path.join(output, 'regression.webm'); await fs.rename(video, final); report.video = final; }
  await browser.close();
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
}
