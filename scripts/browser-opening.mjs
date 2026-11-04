import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
const output = process.env.EVIDENCE_DIR || 'docs/evidence/opening';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: output, size: { width: 640, height: 360 } } });
const page = await context.newPage(), errors = [], checks = [];
page.on('pageerror', e => errors.push(e.stack));
page.on('response', r => { if (r.status() >= 400)
    errors.push(`${r.status()} ${r.url()}`); });
page.on('console', m => { if (m.type() === 'error')
    errors.push(m.text()); });
const report = { date: new Date().toISOString(), url: process.env.GAME_URL, browser: browser.version(), checks, errors, limitations: ['Chromium headless/software; vídeo não contém áudio. Web Audio e captions instrumentados; não é aprovação de mix ou playtest humano.', 'Sem fixture de posição neste percurso: deslocamento por teclado em velocidade normal.'] };
const tap = k => page.keyboard.press(k, { delay: 70 });
const snapshot = () => page.evaluate(() => { const s = window.blackBird.scene.getScene('GameScene'); return { x: s.player.x, y: s.player.y, bottom: s.player.body.bottom, grounded: s.player.onGround, mode: s.mode, flags: { ...s.world.flags }, room: s.registry.get('run').roomId, run: s.registry.get('run') }; });
const shot = name => page.screenshot({ path: path.join(output, `${name}.png`) });
async function walkTo(x) { const start = await snapshot(), right = x > start.x; await page.keyboard.down(right ? 'd' : 'a'); try {
    await page.waitForFunction(({ x, right }) => { const p = window.blackBird.scene.getScene('GameScene').player; return right ? p.x >= x : p.x <= x; }, { x, right }, { timeout: 230000, polling: 100 });
}
finally {
    await page.keyboard.up(right ? 'd' : 'a');
} await page.waitForTimeout(180); assert.equal((await snapshot()).bottom, 318); }
async function interact() { await tap('e'); await page.waitForFunction(() => window.blackBird.scene.getScene('GameScene').mode === 'DIALOGUE'); await shot(`interaction-${checks.length}`); for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(240);
    if ((await snapshot()).mode !== 'DIALOGUE')
        return;
    await tap('e');
} assert.equal((await snapshot()).mode, 'EXPLORING'); }
try {
    await page.addInitScript(() => { window.__audio = { starts: [], contexts: [] }; const original = AudioContext.prototype.createOscillator; AudioContext.prototype.createOscillator = function (...args) { window.__audio.contexts.push(this); const osc = original.apply(this, args), start = osc.start.bind(osc); osc.start = (...a) => { window.__audio.starts.push(performance.now()); return start(...a); }; return osc; }; });
    await page.goto(process.env.GAME_URL || 'http://127.0.0.1:4186/');
    await page.waitForFunction(() => window.blackBird?.scene.isActive('MenuScene'));
    report.build = await (await page.request.get(new URL('build-info.json', page.url()).href)).json();
    await tap('Enter');
    await page.waitForTimeout(400);
    await page.evaluate(() => { window.__opening = { frames: [], phases: [], blackAt: null, crashAt: null }; const s = window.blackBird.scene.getScene('GameScene'); s.events.on('postupdate', () => { const t = window.__opening; if (!t.frames.includes(s.player.frame.name))
        t.frames.push(s.player.frame.name); const phase = s.cutscene?.phase; if (phase && !t.phases.includes(phase))
        t.phases.push(phase); if (phase === 'black' && t.blackAt === null)
        t.blackAt = performance.now(); }); new MutationObserver(() => { if (document.getElementById('game-caption')?.textContent?.includes('estrondo'))
        window.__opening.crashAt ??= performance.now(); }).observe(document.getElementById('game-caption'), { childList: true, subtree: true, characterData: true }); });
    const objects = await page.evaluate(() => window.blackBird.scene.getScene('GameScene').world.interactives.map(i => ({ id: i.id, kind: i.kind, x: i.x })));
    const door = objects.find(i => i.id === 'operario-door-0');
    await walkTo(door.x);
    await interact();
    assert.equal((await snapshot()).flags[door.id], true);
    checks.push('Porta abre com input real e a conversa devolve controle.');
    const npcX = await page.evaluate(() => window.blackBird.scene.getScene('GameScene').world.npcs.getChildren()[0].x);
    await walkTo(npcX - 10);
    let nowNpc = await page.evaluate(() => window.blackBird.scene.getScene('GameScene').world.npcs.getChildren()[0].x);
    if (Math.abs((await snapshot()).x - nowNpc) > 40)
        await walkTo(nowNpc - 10);
    await interact();
    checks.push('Conversa completa da vizinha durante a travessia.');
    for (const [room, x] of [['operario', 3000], ['mercado', 7805], ['avenida', 17448], ['escola', 22294]]) {
        await walkTo(x);
        const valve = objects.find(i => i.id === `${room}-valve`);
        if (room !== 'operario') {
            await walkTo(valve.x);
            await interact();
            assert.equal((await snapshot()).flags[valve.id], true);
            checks.push(`Válvula ${room}: resposta e flag persistente.`);
        }
        await shot(`street-${room}`);
        console.log('REGION', room, (await snapshot()).run.activeWalkMs / 1000);
    }
    const mark = objects.find(i => i.kind === 'cutscene');
    await walkTo(mark.x);
    const before = await snapshot();
    assert.ok(before.run.activeWalkMs >= 180000);
    report.route = { activeSeconds: before.run.activeWalkMs / 1000, distance: before.run.walkDistance, x: before.x };
    await shot('school-arrival');
    await tap('e');
    await page.waitForFunction(() => window.blackBird.scene.getScene('GameScene').cutscene?.phase === 'daughter');
    await shot('daughter-approaches');
    await page.waitForFunction(() => window.blackBird.scene.getScene('GameScene').cutscene?.phase === 'vehicle');
    await shot('vehicle-before-cut');
    await page.waitForFunction(() => window.blackBird.scene.getScene('GameScene').cutscene?.phase === 'black');
    await shot('black');
    await page.waitForFunction(() => window.blackBird.scene.getScene('GameScene').ended);
    await shot('end');
    report.observed = await page.evaluate(() => ({ opening: window.__opening, audio: { starts: window.__audio.starts.length, states: [...new Set(window.__audio.contexts.map(c => c.state))] }, completed: JSON.parse(localStorage.getItem('black-bird.opening.v1')).completed }));
    assert.ok(report.observed.completed);
    assert.ok(report.observed.audio.starts > 10);
    assert.ok(report.observed.opening.phases.includes('black'));
    assert.ok(report.observed.opening.crashAt >= report.observed.opening.blackAt + 60);
    assert.ok(report.observed.opening.frames.filter(f => Number(f) >= 2 && Number(f) <= 7).length === 6);
    checks.push('Prólogo inteiro por teclado, tela preta antes do cue, título e save completo; seis fases de caminhada observadas.');
    await tap('Enter');
    await page.waitForTimeout(450);
    const replay = await snapshot();
    assert.equal(replay.mode, 'EXPLORING');
    assert.ok(replay.x < 200);
    assert.equal(replay.run.talked.length, 0);
    checks.push('Jogar novamente reinicia sem reload manual.');
    await page.setViewportSize({ width: 900, height: 700 });
    await shot('replay-small');
    assert.deepEqual(errors, []);
}
catch (e) {
    report.failure = e.stack;
    console.error(e);
    process.exitCode = 1;
    await shot('failure').catch(() => { });
}
finally {
    await context.close();
    const video = await page.video()?.path();
    if (video)
        await fs.rename(video, path.join(output, 'opening.webm'));
    await browser.close();
    await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
    console.log(report);
}
