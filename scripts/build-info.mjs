import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
function list(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?list(`${dir}/${e.name}`):[`${dir}/${e.name}`]).sort();}
const hash=createHash('sha256');
for(const file of [...list('src'),...list('public'), 'package.json','package-lock.json','vite.config.ts','nginx.conf'].filter(f=>f!=='public/build-info.json'))hash.update(file).update(fs.readFileSync(file));
const contentHash=hash.digest('hex');
let commit=process.env.BUILD_COMMIT;
if(!commit||commit==='unknown')try{commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch{commit='unknown';}
const info={name:'Black Bird: Revolução',buildId:`bb-${contentHash.slice(0,12)}`,contentHash,baseCommit:commit,builtAt:new Date().toISOString()};
fs.writeFileSync('public/build-info.json',JSON.stringify(info,null,2)+'\n');
console.log(info.buildId);
