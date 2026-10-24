/* Lamma offline shell. Cache only same-origin public assets; never cache API responses. */
const CACHE="lamma-shell-v1";
const SHELL=["./","./index.html","./manifest.webmanifest","./icons/lamma-icon.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("lamma-shell-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==self.location.origin)return;if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put("./index.html",copy))}return res}).catch(()=>caches.match("./index.html").then(x=>x||caches.match("./"))));return}e.respondWith(caches.match(r).then(cached=>cached||fetch(r).then(res=>{if(res.ok&&new URL(r.url).pathname.match(/\.(?:css|js|svg|png|webp)$/)){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy))}return res})))});
