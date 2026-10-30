import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("arquivos web estaticos", () => {
  it("expõe health check e canvas do jogo", () => {
    const health = readFileSync(resolve("public/health.html"), "utf8");
    const index = readFileSync(resolve("index.html"), "utf8");
    expect(health).toContain("ok");
    expect(index).toContain("game-container");
    expect(index).toContain("Black Bird: Revolução");
  });

  it("responde 200 em /health.html quando servido", async () => {
    const html = readFileSync(resolve("public/health.html"));
    const server = createServer((req, res) => {
      if (req.url === "/health.html") {
        res.writeHead(200, { "content-type": "text/html" });
        res.end(html);
        return;
      }
      res.writeHead(404);
      res.end();
    });
    await new Promise<void>((resolveReady) => server.listen(0, resolveReady));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("sem porta");
    const response = await fetch(`http://127.0.0.1:${address.port}/health.html`);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("ok");
    await new Promise<void>((done) => server.close(() => done()));
  });
});
