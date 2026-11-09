import { getStore } from "@netlify/blobs";
import { strong, digest, checkedSetJSON } from "../lib/state-store.mjs";
export default async ()=>{
  const store=getStore("agenda-ale"),now=new Date().toISOString(),day=now.slice(0,10);
  let count=0;
  // Una copia per ciascun account, più archivi precedenti non ancora migrati.
  for(const prefix of ["accounts-v2/","state-v1-"]){
    for await(const page of store.list({prefix,paginate:true})){
      for(const blob of page.blobs){
        if(prefix==="accounts-v2/" && !/^accounts-v2\/[^/]+\/state$/.test(blob.key))continue;
        const data=await store.get(blob.key,strong);
        if(!data)continue;
        const snapshot=`backups-v2/${day}/${digest(blob.key)}`;
        await checkedSetJSON(store,snapshot,{backedUpAtUTC:now,stateKey:blob.key,data},{onlyIfNew:true});count++;
      }
    }
  }
  console.log("Backup giornaliero completato",{count});
};
export const config={schedule:"@daily"};
