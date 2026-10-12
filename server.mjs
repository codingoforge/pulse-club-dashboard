import http from 'node:http';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {handleChat, status} from './src/ai.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
function config(){let local={};try{for(const line of readFileSync(path.join(root,'.env'),'utf8').split('\n')){const m=line.match(/^([A-Z_]+)=(.*)$/);if(m)local[m[1]]=m[2].trim().replace(/^['"]|['"]$/g,'')}}catch{}return {...local,...process.env}}
const files={'/':'index.html','/index.html':'index.html','/style.css':'style.css','/script.js':'script.js'};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript'};
const server=http.createServer(async(req,res)=>{const env=config();const origin=`http://${req.headers.host}`;const url=new URL(req.url,origin);res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('Cache-Control','no-store');
 try{
  if(url.pathname==='/api/status'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(status(env)));return}
  if(url.pathname==='/api/chat'){
   if(req.headers.origin&&req.headers.origin!==origin){res.writeHead(403,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Requests must come from this dashboard.'}));return}
   let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>24000){res.writeHead(413,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Request too large.'}));return}}
   const response=await handleChat(new Request(origin+url.pathname,{method:req.method,headers:{'content-type':req.headers['content-type']||''},...(req.method!=='GET'&&req.method!=='HEAD'?{body}: {})}),env,req.socket.remoteAddress||'local');
   res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
  }
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return}
  const file=files[url.pathname];if(!file){res.writeHead(404);res.end('Not found');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]});res.end(req.method==='HEAD'?undefined:readFileSync(path.join(root,'dist',file)));
 }catch{res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'An unexpected server error occurred.'}))}
});
const env=config();server.listen(Number(env.PORT)||4175,env.HOST||'127.0.0.1',()=>console.log(`Pulse Club ready at http://${env.HOST||'127.0.0.1'}:${Number(env.PORT)||4175}`));
