import { getStore } from "@netlify/blobs";
import webpush from "web-push";
import { identityId, authenticate, pushPrefix, digest, strong, json } from "../lib/state-store.mjs";
export default async(req,context)=>{
  if(req.method!=="POST")return json({ok:false,error:"Method Not Allowed"},405);
  const user=await authenticate(req);
  if(!user)return json({ok:false,error:"Unauthorized"},401);
  if(!process.env.WEB_PUSH_PUBLIC_KEY || !process.env.WEB_PUSH_PRIVATE_KEY)return json({ok:false,error:"Web Push non configurato"},503);
  try{
    const id=identityId(user),{endpoint}=await req.json();
    if(!endpoint)return json({ok:false,error:"Dispositivo mancante"},400);
    const store=getStore("agenda-ale"),entry=await store.get(`${pushPrefix(id)}${digest(endpoint)}`,strong);
    if(entry?.ownerId!==id)return json({ok:false,error:"Dispositivo non registrato"},404);
    webpush.setVapidDetails(process.env.WEB_PUSH_SUBJECT||process.env.URL||"https://digenda.app",process.env.WEB_PUSH_PUBLIC_KEY,process.env.WEB_PUSH_PRIVATE_KEY);
    await webpush.sendNotification(entry.subscription,JSON.stringify({title:"Digenda · Notifica di prova",body:"Le notifiche degli eventi sono attive su questo dispositivo.",tag:"digenda-push-test-"+Date.now(),url:"/?view=calendar",timestamp:Date.now()}));
    return json({ok:true,sent:true});
  }catch(error){console.error("Test push:",error);return json({ok:false,error:"Invio notifica non riuscito"},error?.statusCode===410?410:500);}
};
