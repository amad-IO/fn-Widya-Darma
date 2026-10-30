const categories=['Berita','Jurnal','Karya','Prestasi','Ekstrakurikuler'];
const articleTitles=['Lorem ipsum dolor sit amet, consectetur.','Sed do eiusmod tempor incididunt.','Ut enim ad minim veniam, quis nostrud.'];
const articleSlugs=['lorem-ipsum','dolor-sit-amet','consectetur-adipiscing'];
const allDetails=[];
for(let k=0;k<10;k++)allDetails.push({route:'/publikasi/'+categories[Math.floor(k/2)].toLowerCase()+'-'+(k%2+1),name:'Detail '+categories[Math.floor(k/2)]+' '+(k%2+1),title:k%2?'Consectetur adipiscing elit.':'Lorem ipsum dolor sit amet.',image:['students','library','library','classroom','classroom','campus','campus','students','students','students'][k],kind:'publication'});
for(const base of ['berita','kegiatan'])for(let k=0;k<3;k++)allDetails.push({route:'/'+base+'/'+articleSlugs[k],name:'Detail '+base+' '+(k+1),title:articleTitles[k],image:['students','classroom','library'][k],date:['01 / 10 / 2026','24 / 09 / 2026','18 / 09 / 2026'][k],category:['lorem','ipsum','dolor'][k],kind:'legacy'});
const results=[];
for(const [k,item] of allDetails.entries()){
 if(k<detailStart||k>=detailEnd)continue;
 let root=page.children.find(n=>n.type==='FRAME'&&n.name===item.name+' · Desktop 1440');
 if(root){results.push({id:root.id,name:root.name,route:item.route,status:'existing'});continue;}
 root=F(null,item.name+' · Desktop 1440',1440,0,'VERTICAL','background');root.counterAxisAlignItems='CENTER';root.clipsContent=true;root.x=200+(k%4)*1640;root.y=26200+Math.floor(k/4)*4800;
 gap(root,80);
 if(item.kind==='publication'){
  const block=F(root,'PublicationDetail',1440);block.counterAxisAlignItems='CENTER';block.paddingTop=56;block.paddingBottom=80;
  const article=F(block,'Article / max-width 1024',928);
  T(article,'← Kembali ke galeri',928,14,'Regular','muted',21);gap(article,32);T(article,item.title,768,48,'SemiBold','foreground',60);gap(article,20);
  T(article,'1 Oktober 2026     Ditulis oleh Tim Dokumentasi Sekolah (contoh)',928,12,'Regular','muted',24);gap(article,40);
  const slider=F(article,'ActivitySlider',928);
  photo(slider,item.image,928,580,24,'FIT');
  for(const [name,x] of [['left',12],['right',872]]){const control=F(slider,'Slider '+name,44,0,'VERTICAL','white',12);control.cornerRadius=22;control.layoutPositioning='ABSOLUTE';control.x=x;control.y=268;icon(control,name,20,'foreground');}
  const count=F(slider,'Photo counter',54,0,'VERTICAL','foreground',6);count.cornerRadius=999;count.layoutPositioning='ABSOLUTE';count.x=858;count.y=540;T(count,'1 / 3',42,12,'Regular','white',18,'CENTER');gap(slider,16);
  const thumbnails=row(slider,'Photo thumbnails',928,12);for(const asset of [item.image,'classroom','campus'])photo(thumbnails,asset,80,64,12);gap(article,56);
  const prose=F(article,'Article paragraphs',672,24);article.counterAxisAlignItems='CENTER';T(prose,body,672,16,'Regular','muted',32);T(prose,long,672,16,'Regular','muted',32);gap(prose,24);button(prose,'Jelajahi kegiatan lainnya ↗','outline');
 }else{
  const header=section(root,'ArticleDetail heading',null,64);header.parent.paddingBottom=112;more(header,'Lorem ipsum',200);gap(header,32);label(header,item.category+' / '+item.date);gap(header,24);T(header,item.title,896,48,'Bold','foreground',60);gap(header,24);T(header,body,672,16,'Regular','muted',32);
  const content=section(root,'ArticleDetail content','white',96);content.parent.topLeftRadius=content.parent.topRightRadius=56;photo(content,item.image,1184,514.783,32);gap(content,48);
  const prose=F(content,'Article prose',672,24);content.counterAxisAlignItems='CENTER';T(prose,body+' '+long,672,16,'Regular','muted',32);T(prose,'Lorem ipsum dolor sit amet.',672,30,'Medium','foreground',45);T(prose,long+' '+body,672,16,'Regular','muted',32);const quote=F(prose,'Article quote',672,0,'VERTICAL','mist',32);quote.cornerRadius=24;T(quote,'“'+short+'”',608,24,'Regular','primary',39);T(prose,body+' '+long,672,16,'Regular','muted',32);gap(content,64);divider(content);gap(content,48);T(content,'Lorem ipsum dolor.',1184,30,'Medium','foreground',45);gap(content,32);
  const related=row(content,'Related articles',1184,32);for(let j=0;j<3;j++){if(articleTitles[j]===item.title)continue;const c=F(related,'ArticleCard',576);photo(c,['students','classroom','library'][j],576,426.667,24);gap(c,24);T(c,['01 / 10 / 2026','24 / 09 / 2026','18 / 09 / 2026'][j],576,10,'Regular','muted',15);gap(c,12);T(c,articleTitles[j],576,20,'Medium','foreground',27.5);gap(c,12);T(c,body,576,14,'Regular','muted',24);}
 }
 footer(root);navbar(root,item.kind==='publication'?'Publikasi & Galeri':'',true);
 results.push({id:root.id,name:root.name,route:item.route,width:root.width,height:root.height,descendants:root.findAll(()=>true).length});
}
return {createdNodeIds,mutatedNodeIds,details:results};
