import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
// Verify packaging contract independently from the source generator.
// @ts-expect-error pngjs is a development-only image inspector without bundled types.
import { PNG } from "pngjs";
describe("production sprite envelopes", () => {
  for (const [name, w, h, count, foot] of [
    ["nero-production-v2",320,224,14,208], ["winsth-production-v2",384,288,8,264],
    ["npc-worker-v2",96,128,4,112], ["daughter-v2",96,112,6,104],
  ] as const) it(`${name} keeps opaque art inside its frame and boots on the pivot`, () => {
    const png=PNG.sync.read(readFileSync(`public/assets/characters/${name}.png`));
    expect(png.width).toBe(w*count);expect(png.height).toBe(h);
    for(let frame=0;frame<count;frame++){
      let pixels=0,bottom=-1,left=w,right=0;
      for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(png.data[(y*png.width+frame*w+x)*4+3]>160){pixels++;bottom=Math.max(bottom,y);left=Math.min(left,x);right=Math.max(right,x);}
      expect(pixels).toBeGreaterThan(300); expect(left).toBeGreaterThan(0);expect(right).toBeLessThan(w-1);
      // A hammer may extend just below the boot pivot, but never defines it.
      expect(bottom).toBeGreaterThanOrEqual(foot-3);expect(bottom).toBeLessThan(foot+8);
    }
  });
});
