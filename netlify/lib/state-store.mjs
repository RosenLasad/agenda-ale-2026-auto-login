import crypto from "node:crypto";
import { getUser } from "@netlify/identity";
import "../../state-validation.js";
export const validateState = globalThis.AgendaStateValidation.validateState;
export const digest = (value) => crypto.createHash("sha256").update(String(value)).digest("hex");
export const accountPrefix = (id) => `accounts-v2/${digest(id)}/`;
export const pushPrefix = (id) => `push-v2/${digest(id)}/`;
export const stateKey = (id) => `${accountPrefix(id)}state`;
export const strong = { type: "json", consistency: "strong" };
export function identityId(user){
  const id = String(user?.id || user?.sub || "");
  if(!id || id.length > 256 || id.includes("@")) throw new Error("Identificativo account non valido");
  return id;
}
export async function authenticate(req){
  // Un token esplicito prevale sui cookie: non si ripiega mai sull'account
  // di un cookie precedente se il Bearer della richiesta non è valido.
  const authorization=req.headers?.get("authorization") || "";
  if(!authorization){
    const user=await getUser().catch(()=>null);
    return user?.id || user?.sub ? user : null;
  }
  if(!/^Bearer \S+$/i.test(authorization) || !process.env.URL)return null;
  try{
    const endpoint=new URL("/.netlify/identity/user",process.env.URL);
    const response=await fetch(endpoint,{headers:{Authorization:authorization},cache:"no-store",signal:AbortSignal.timeout(8000)});
    if(!response.ok)return null;
    const verified=await response.json();
    return verified?.id || verified?.sub ? verified : null;
  }catch{return null;}
}
export async function checkedSetJSON(store,key,data,conditions){
  const result=await store.setJSON(key,data,conditions);
  // Alcune versioni del client possono indicare modified anche su errori HTTP:
  // senza ETag non si considera mai confermata una scrittura condizionale.
  if(conditions && result.modified && !result.etag)throw new Error("Scrittura non confermata dal servizio di archiviazione");
  return result;
}
export async function readAccount(store, id, migrate = true){
  const key=stateKey(id);
  let entry=await store.getWithMetadata(key,strong);
  if(entry){
    if(entry.data?.ownerId !== id) throw new Error("Proprietario archivio non valido");
    validateState(entry.data.state);
    return { key, ...entry };
  }
  // Solo la vecchia chiave dell'ID esatto; mai chiavi derivate dalle email.
  if(migrate && /^[a-zA-Z0-9_-]+$/.test(id)){
    const legacyKey=`state-v1-${id}`;
    const legacy=await store.get(legacyKey,strong);
    if(legacy){
      validateState(legacy);
      const data={ownerId:id,revision:crypto.randomUUID(),state:legacy,updatedAt:legacy.updatedAt};
      await checkedSetJSON(store,key,data,{onlyIfNew:true});
      entry=await store.getWithMetadata(key,strong);
      if(!entry || entry.data?.ownerId !== id) throw new Error("Migrazione archivio non completata");
      // Mantiene il widget già associato a questo preciso archivio.
      const meta=await store.get("owner-meta",strong);
      if(meta?.key===legacyKey) await store.setJSON("owner-meta",{...meta,key,ownerId:id});
      return {key,...entry};
    }
  }
  return {key,data:null,etag:null};
}
export function json(data,status=200){return Response.json(data,{status,headers:{"cache-control":"no-store, private","vary":"Authorization"}});}
