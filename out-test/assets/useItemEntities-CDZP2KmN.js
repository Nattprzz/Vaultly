import{a as e}from"./chunk-BNv3lrIs.js";import{h as t,l as n}from"./index-CggXqzVX.js";var r=e(t(),1),i={director:{label:`Director/a`,icon:`ri-movie-line`,color:`#f43f5e`,priority:1},developer:{label:`Desarrollador`,icon:`ri-code-box-line`,color:`#8b5cf6`,priority:1},author:{label:`Autor/a`,icon:`ri-book-open-line`,color:`#10b981`,priority:1},artist:{label:`Artista`,icon:`ri-music-line`,color:`#ec4899`,priority:1},publisher:{label:`Publisher`,icon:`ri-building-line`,color:`#6366f1`,priority:2},actor:{label:`Reparto`,icon:`ri-user-star-line`,color:`#f59e0b`,priority:3},creator:{label:`Creador/a`,icon:`ri-lightbulb-line`,color:`#0ea5e9`,priority:2},studio:{label:`Estudio`,icon:`ri-film-line`,color:`#14b8a6`,priority:2}},a=new Map;function o(e){let[t,o]=(0,r.useState)([]),[s,c]=(0,r.useState)(!1),[l,u]=(0,r.useState)(null);return(0,r.useEffect)(()=>{if(!e){o([]);return}if(a.has(e)){o(a.get(e));return}let t=!1;return c(!0),u(null),(async()=>{try{let{data:r,error:s}=await n.from(`item_entities`).select(`
            role,
            entities (
              id,
              name,
              slug,
              type,
              image,
              bio
            )
          `).eq(`item_id`,e);if(s)throw s;let c=(r??[]).filter(e=>e.entities).map(e=>({id:e.entities.id,name:e.entities.name,slug:e.entities.slug,type:e.entities.type,image:e.entities.image??null,bio:e.entities.bio??null,role:e.role}));c.sort((e,t)=>(i[e.role]?.priority??99)-(i[t.role]?.priority??99)),t||(a.set(e,c),o(c))}catch(e){t||u(e.message)}finally{t||c(!1)}})(),()=>{t=!0}},[e]),{entities:t,loading:s,error:l}}export{o as n,i as t};
//# sourceMappingURL=useItemEntities-CDZP2KmN.js.map