/* InspecteurBot — optimisation sûre des fichiers avant envoi Supabase.
   Les PDF et fichiers audio sont conservés à l'identique pour préserver leur contenu. */
(function(){
 'use strict';
 if(window.IBStorageOptimizer)return;
 const MAX_EDGE=1600,QUALITY=.82;
 function outputName(name,mime){
  const base=String(name||'fichier').replace(/\.[^.]+$/,'');
  return base+(mime==='image/webp'?'.webp':mime==='image/jpeg'?'.jpg':'.png');
 }
 async function optimizeImage(file,options={}){
  if(!(file instanceof Blob)||!/^image\/(jpeg|png|webp)$/.test(file.type))return file;
  if(typeof createImageBitmap!=='function')return file;
  let bitmap;
  try{bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});}catch(_){return file;}
  try{
   const maxEdge=Number(options.maxEdge)||MAX_EDGE;
   const scale=Math.min(1,maxEdge/Math.max(bitmap.width,bitmap.height));
   const width=Math.max(1,Math.round(bitmap.width*scale)),height=Math.max(1,Math.round(bitmap.height*scale));
   const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
   const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return file;
   ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(bitmap,0,0,width,height);
   const mime='image/webp';
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,mime,Number(options.quality)||QUALITY));
   if(!blob||blob.size>=file.size)return file;
   return new File([blob],outputName(file.name,mime),{type:mime,lastModified:file.lastModified||Date.now()});
  }catch(error){console.info('Optimisation image ignorée',error);return file;}
  finally{try{bitmap.close();}catch(_){}}
 }
 async function optimizePdf(file){
  if(file.type!=='application/pdf'||!window.PDFLib||typeof window.PDFLib.PDFDocument?.load!=='function')return file;
  try{
   const bytes=await file.arrayBuffer();
   const source=new TextDecoder('latin1').decode(bytes);
   // Keep signed, encrypted, interactive and attachment-bearing PDFs byte-for-byte unchanged.
   const protectedMarkers=['/ByteRange','/Encrypt','/AcroForm','/XFA','/EmbeddedFiles','/Filespec','/Annots','/OpenAction','/JavaScript','/RichMedia','/3D','/Collection'];
   if(protectedMarkers.some(marker=>source.includes(marker)))return file;
   const original=await window.PDFLib.PDFDocument.load(bytes,{updateMetadata:false,throwOnInvalidObject:true});
   const pageCount=original.getPageCount();
   const saved=await original.save({useObjectStreams:true,addDefaultPage:false,objectsPerTick:100});
   if(!saved||saved.byteLength>=file.size*0.98)return file;
   const check=await window.PDFLib.PDFDocument.load(saved,{updateMetadata:false,throwOnInvalidObject:true});
   if(check.getPageCount()!==pageCount)return file;
   return new File([saved],file.name,{type:'application/pdf',lastModified:file.lastModified||Date.now()});
  }catch(error){console.info('Optimisation PDF ignorée, fichier original conservé',error);return file;}
 }
 async function prepare(file,options={}){
  if(!file)return file;
  if(/^image\\//.test(file.type))return optimizeImage(file,options);
  if(file.type==='application/pdf')return optimizePdf(file);
  return file;
 }
 window.IBStorageOptimizer=Object.freeze({prepare,optimizeImage});
})();