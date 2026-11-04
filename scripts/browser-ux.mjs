import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
const output = process.env.EVIDENCE_DIR || 'docs/evidence/20261104/ux';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } }), errors = [], checks = [];
page.on('pageerror', e => errors.push(e.stack));
const tap = key => page.keyboard.press(key, { delay: 85 });
const report = { date: new Date().toISOString(), errors, checks };
try {
    await page.goto(process.env.GAME_URL || 'http://127.0.0.1:4183/');
    await page.waitForFunction(() => window.blackBird?.scene.isActive('MenuScene'));
    const index = await page.evaluate(() => window.blackBird.scene.getScene('MenuScene').items.findIndex(i => i.key === 'settings'));
    for (let i = 0; i < index; i++)
        await tap('ArrowDown');
    await tap('Enter');
    await page.getByRole('dialog').waitFor();
    await page.getByRole('button', { name: 'Alterar tecla: Pular', exact: true }).click();
    await tap('v');
    await page.getByRole('checkbox', { name: 'Reduzir movimento de câmera e efeitos' }).check();
    await page.getByRole('slider', { name: 'Volume geral', exact: true }).focus();
    await tap('Home');
    await page.screenshot({ path: path.join(output, 'settings.png') });
    await page.getByRole('button', { name: 'Voltar', exact: true }).click();
    for (let i = 0; i < index; i++)
        await tap('ArrowUp');
    await tap('Enter');
    await page.waitForFunction(() => window.blackBird.scene.isActive('GameScene'));
    await page.waitForTimeout(300);
    await tap('v');
    await page.waitForTimeout(70);
    assert.ok(await page.evaluate(() => window.blackBird.scene.getScene('GameScene').player.y < 310));
    await page.waitForTimeout(700);
    await page.keyboard.down('d');
    await page.waitForTimeout(900);
    await page.keyboard.up('d');
    await tap('Escape');
    await page.waitForTimeout(180);
    const save = await page.evaluate(() => JSON.parse(localStorage.getItem('black-bird.opening.v1')));
    assert.ok(save.checkpoint.x > 240);
    assert.equal(save.completed, false);
    checks.push('V dispara salto remapeado; movimento reduzido e volume persistem; pausa grava checkpoint seguro.');
    await page.reload();
    await page.waitForFunction(() => window.blackBird?.scene.isActive('MenuScene'));
    assert.ok(await page.evaluate(() => window.blackBird.scene.getScene('MenuScene').labels[0].text.includes('CONTINUAR')));
    await tap('Enter');
    await page.waitForTimeout(350);
    const restored = await page.evaluate(() => window.blackBird.scene.getScene('GameScene').player.x);
    assert.ok(Math.abs(restored - save.checkpoint.x) < 2);
    const settings = await page.evaluate(() => JSON.parse(localStorage.getItem('black-bird.settings.v1')));
    assert.deepEqual(settings.bindings.jump, ['KeyV']);
    assert.equal(settings.masterVolume, 0);
    checks.push('Continue após reload preserva posição e configurações.');
    await page.screenshot({ path: path.join(output, 'continued.png') });
    // Freeze autosave before injecting an on-disk corruption fixture.
    await tap('Escape');
    await page.waitForTimeout(100);
    await page.evaluate(() => localStorage.setItem('black-bird.opening.v1', '{invalid'));
    await page.reload();
    await page.waitForFunction(() => window.blackBird?.scene.isActive('MenuScene'));
    assert.equal(await page.evaluate(() => window.blackBird.scene.getScene('MenuScene').items.some(i => i.key === 'continue')), false);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('black-bird.settings.v1')).masterVolume), 0);
    checks.push('Save corrompido não oferece Continue nem apaga configurações.');
    await page.setViewportSize({ width: 900, height: 700 });
    await page.screenshot({ path: path.join(output, 'small-menu.png') });
    assert.deepEqual(errors, []);
}
catch (error) {
    report.failure = error.stack;
    console.error(error);
    process.exitCode = 1;
    await page.screenshot({ path: path.join(output, 'failure.png') });
}
finally {
    await browser.close();
    await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
    console.log(report);
}
