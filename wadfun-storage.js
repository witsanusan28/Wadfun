/* Wadfun Storage V2 — IndexedDB artwork storage + reliable mode metadata
 * Intentionally isolated from responsive-engine.js and drawing/color engines.
 */
(function(){
  'use strict';

  const DB_NAME = 'WadfunDB';
  const DB_VERSION = 1;
  const STORE = 'artworks';
  let dbPromise = null;

  function id(){
    if(window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return 'art_' + Date.now() + '_' + Math.random().toString(36).slice(2,10);
  }

  function open(){
    if(dbPromise) return dbPromise;
    if(!('indexedDB' in window)) return Promise.reject(new Error('IndexedDB is not supported'));
    dbPromise = new Promise((resolve,reject)=>{
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function(){
        const db = req.result;
        let store;
        if(!db.objectStoreNames.contains(STORE)){
          store = db.createObjectStore(STORE,{keyPath:'id'});
        }else{
          store = req.transaction.objectStore(STORE);
        }
        if(!store.indexNames.contains('updatedAt')) store.createIndex('updatedAt','updatedAt',{unique:false});
        if(!store.indexNames.contains('createdAt')) store.createIndex('createdAt','createdAt',{unique:false});
        if(!store.indexNames.contains('category')) store.createIndex('category','category',{unique:false});
      };
      req.onsuccess = ()=>resolve(req.result);
      req.onerror = ()=>reject(req.error || new Error('Failed to open WadfunDB'));
      req.onblocked = ()=>reject(new Error('WadfunDB open request was blocked'));
    }).catch(err=>{
      dbPromise = null;
      throw err;
    });
    return dbPromise;
  }

  function request(req){
    return new Promise((resolve,reject)=>{
      req.onsuccess = ()=>resolve(req.result);
      req.onerror = ()=>reject(req.error || new Error('IndexedDB request failed'));
    });
  }

  function transaction(mode,work){
    return open().then(db=>new Promise((resolve,reject)=>{
      const tx = db.transaction(STORE,mode);
      const store = tx.objectStore(STORE);
      let result;
      try{ result = work(store); }catch(err){ reject(err); return; }
      tx.oncomplete = ()=>resolve(result);
      tx.onerror = ()=>reject(tx.error || new Error('IndexedDB transaction failed'));
      tx.onabort = ()=>reject(tx.error || new Error('IndexedDB transaction aborted'));
    }));
  }

  // Older gallery records can miss/incorrectly carry mode metadata.
  // Coloring records created by Wadfun carry a color-library category,
  // so use that as a safe fallback when the stored mode says draw.
  function normalizeArtwork(artwork){
    if(!artwork) return artwork;
    if(artwork.mode !== 'color' && artwork.category) return Object.assign({},artwork,{mode:'color'});
    return artwork;
  }

  async function init(){
    await open();
    return true;
  }

  async function saveArtwork(data){
    if(!data || typeof data !== 'object') throw new TypeError('Artwork data is required');
    if(!data.imageData) throw new TypeError('imageData is required');
    const now = Date.now();
    const activeScreen = document.querySelector('.screen.active')?.id;
    const detectedMode = activeScreen === 'color' ? 'color' : activeScreen === 'draw' ? 'draw' : data.mode;
    const artwork = Object.assign({},data,{
      id: data.id || id(),
      name: data.name || 'ผลงานไม่มีชื่อ',
      category: data.category || '',
      mode: detectedMode || 'draw',
      createdAt: data.createdAt || now,
      updatedAt: now
    });
    await transaction('readwrite',store=>request(store.put(artwork)));
    return artwork;
  }

  async function getArtwork(artworkId){
    if(!artworkId) return null;
    const artwork = await transaction('readonly',store=>request(store.get(artworkId)));
    return normalizeArtwork(artwork);
  }

  async function getAllArtworks(){
    const items = await transaction('readonly',store=>request(store.getAll()));
    return (items || []).map(normalizeArtwork).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
  }

  async function updateArtwork(artworkId,patch){
    if(!artworkId) throw new TypeError('Artwork id is required');
    const current = await getArtwork(artworkId);
    if(!current) return null;
    const updated = Object.assign({},current,patch||{}, {id:artworkId,updatedAt:Date.now()});
    await transaction('readwrite',store=>request(store.put(updated)));
    return normalizeArtwork(updated);
  }

  async function deleteArtwork(artworkId){
    if(!artworkId) return false;
    await transaction('readwrite',store=>request(store.delete(artworkId)));
    return true;
  }

  async function clearArtworks(){
    await transaction('readwrite',store=>request(store.clear()));
    return true;
  }

  window.wadfunStorage = Object.freeze({
    DB_NAME,DB_VERSION,STORE,
    init,saveArtwork,getArtwork,getAllArtworks,updateArtwork,deleteArtwork,clearArtworks
  });
})();
