import { getStore } from "@netlify/blobs";
import { identityId, authenticate, pushPrefix, digest, json } from "../lib/state-store.mjs";
export default async(req,context)=>{
  if(req.method==="GET"){
    const publicKey=process.env.WEB_PUSH_PUBLIC_KEY||"";
    return publicKey?json({ok:true,configured:true,publicKey}):json({ok:false,configured:false,error:"Web Push non configurato"},503);
  }
  const user=await authenticate(req);
  if(!user)return json({ok:false,error:"Unauthorized"},401);
  if(!["POST","DELETE"].includes(req.method))return json({ok:false,error:"Method Not Allowed"},405);
  try{
    const id=identityId(user),body=await req.json(),s=body?.subscription||body;
    if(!s || !String(s.endpoint||"").startsWith("https://") || !s.keys?.p256dh || !s.keys?.auth)return json({ok:false,error:"Registrazione dispositivo non valida"},400);
    const store=getStore("agenda-ale"),key=`${pushPrefix(id)}${digest(s.endpoint)}`;
    if(req.method==="POST")await store.setJSON(key,{ownerId:id,updatedAt:new Date().toISOString(),subscription:{endpoint:s.endpoint,expirationTime:s.expirationTime||null,keys:{p256dh:s.keys.p256dh,auth:s.keys.auth}}});
    else await store.delete(key);
    return json({ok:true,subscribed:req.method==="POST"});
  }catch(error){console.error("Registrazione push:",error);return json({ok:false,error:"Registrazione notifiche non riuscita"},500);}
};
