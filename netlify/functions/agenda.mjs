import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";
import { identityId, authenticate, readAccount, validateState, accountPrefix, checkedSetJSON, json } from "../lib/state-store.mjs";

export default async (req,context)=>{
  const user=await authenticate(req);
  if(!user)return json({ok:false,error:"Accesso richiesto"},401);
  try{
    const id=identityId(user),store=getStore("agenda-ale");
    let current=await readAccount(store,id);
    if(req.method==="GET")return json({ok:true,data:current.data?.state||null,revision:current.data?.revision||null,updatedAt:current.data?.state?.updatedAt||null});
    if(req.method!=="PUT")return json({ok:false,error:"Method Not Allowed"},405);
    let body;
    try{body=await req.json();validateState(body?.state);}catch(error){return json({ok:false,error:error.message||"Archivio non valido"},400);}
    // Tutte le scritture devono specificare esattamente la revisione letta.
    if(!Object.prototype.hasOwnProperty.call(body,"baseRevision"))return json({ok:false,error:"Aggiorna Agenda prima di salvare: versione dell'app precedente"},428);
    const conflict=()=>json({ok:false,conflict:true,message:"Il cloud è cambiato. Conserva e confronta le due versioni.",data:current.data?.state||null,revision:current.data?.revision||null,remoteUpdatedAt:current.data?.state?.updatedAt||null},409);
    if(body.baseRevision!==(current.data?.revision||null))return conflict();
    const state=structuredClone(body.state);
    if(state.actions===undefined && current.data?.state?.actions!==undefined)state.actions=current.data.state.actions;
    state.updatedAt=new Date().toISOString();
    const data={ownerId:id,state,updatedAt:state.updatedAt,revision:crypto.randomUUID()};
    // Copia immutabile della versione precedente, prima di qualunque sostituzione.
    if(current.data)await checkedSetJSON(store,`${accountPrefix(id)}history/${current.data.revision}`,current.data,{onlyIfNew:true});
    const result=await checkedSetJSON(store,current.key,data,current.etag?{onlyIfMatch:current.etag}:{onlyIfNew:true});
    if(!result.modified){current=await readAccount(store,id);return conflict();}
    const confirmed=await readAccount(store,id,false);
    if(confirmed.data?.revision!==data.revision){current=confirmed;return conflict();}
    return json({ok:true,updatedAt:state.updatedAt,revision:data.revision});
  }catch(error){console.error("Archivio Agenda:",error);return json({ok:false,error:"Impossibile leggere o salvare l’archivio. I dati locali restano conservati."},500);}
};
