import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';

test('authenticated library, indexed streaming, ranges and removal',async()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'lantern-test-')); const data=path.join(tmp,'data'), library=path.join(tmp,'TV'),season=path.join(library,'Show','Season 01');fs.mkdirSync(season,{recursive:true});fs.mkdirSync(data);fs.writeFileSync(path.join(data,'pin.txt'),'123456');fs.writeFileSync(path.join(season,'Show.S01E02.mp4'),'0123456789');fs.writeFileSync(path.join(season,'Show.S01E02.vtt'),'WEBVTT\n');
 const port=48000+Math.floor(Math.random()*10000),base=`http://127.0.0.1:${port}`;const proc=spawn(process.execPath,['server/index.js'],{env:{...process.env,PORT:String(port),LANTERN_DATA_DIR:data},stdio:['ignore','pipe','pipe']});
 try{let ready=false;for(let i=0;i<100;i++){try{await fetch(base+'/api/status');ready=true;break}catch{await new Promise(r=>setTimeout(r,100))}}assert.ok(ready,'server starts');
 let r=await fetch(base+'/api/library');assert.equal(r.status,401);
 r=await fetch(base+'/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({pin:'123456'})});assert.equal(r.status,200);const cookie=r.headers.get('set-cookie').split(';')[0];const headers={'content-type':'application/json',cookie};
 r=await fetch(base+'/api/folders',{method:'POST',headers,body:JSON.stringify({path:library})});assert.equal(r.status,200);assert.equal((await r.json()).count,1);
 r=await fetch(base+'/api/library',{headers});let rows=await r.json();assert.equal(rows.length,1);assert.equal(rows[0].series,'Show');assert.equal(rows[0].season,1);assert.equal(rows[0].episode,2);assert.equal(rows[0].path,undefined);assert.equal(rows[0].relative,'Show/Season 01/Show.S01E02.mp4');const tree=await (await fetch(base+'/api/tree',{headers})).json();assert.equal(tree.roots[0].name,'TV');assert.deepEqual(tree.directories.map(d=>d.relative).sort(),['Show','Show/Season 01']);
 r=await fetch(base+'/api/video/'+rows[0].id,{headers:{cookie,Range:'bytes=2-5'}});assert.equal(r.status,206);assert.equal(r.headers.get('content-range'),'bytes 2-5/10');assert.equal(await r.text(),'2345');
 r=await fetch(base+'/api/video/'+rows[0].id,{headers:{cookie,Range:'bytes=99-100'}});assert.equal(r.status,416);
 r=await fetch(base+'/api/video/not-an-indexed-id',{headers});assert.equal(r.status,404);
 r=await fetch(base+'/api/subtitle/'+rows[0].id,{headers});assert.equal(r.status,200);
 r=await fetch(base+'/api/progress/'+rows[0].id,{method:'POST',headers,body:JSON.stringify({position:12,duration:120})});assert.equal(r.status,200);
 rows=await (await fetch(base+'/api/library',{headers})).json();assert.equal(rows[0].position,12);
 const folders=await (await fetch(base+'/api/folders',{headers})).json();await fetch(base+'/api/folders/'+folders[0].id,{method:'DELETE',headers});assert.equal(fs.existsSync(path.join(season,'Show.S01E02.mp4')),true);assert.equal((await (await fetch(base+'/api/library',{headers})).json()).length,0);
 }finally{proc.kill();await once(proc,'exit').catch(()=>{});fs.rmSync(tmp,{recursive:true,force:true})}
});
