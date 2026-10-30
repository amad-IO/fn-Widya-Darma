for(const variant of ['primary','outline','white','ghost']){
 const c=mainComponent('Button / '+variant,200);
 if(!c.children.length){
  c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.itemSpacing=12;c.paddingLeft=c.paddingRight=24;c.paddingTop=c.paddingBottom=12;c.cornerRadius=999;
  c.fills=variant==='primary'?[paint('primary')]:variant==='white'?[paint('white')]:[];
  if(variant==='outline'){c.strokes=[paint('blue-200')];c.strokeWeight=1;}
  const t=T(c,'Button',152,14,'SemiBold',variant==='primary'?'white':variant==='white'?'primary':'foreground',24);
  t.textAutoResize='WIDTH_AND_HEIGHT';t.name='Button / Label';
  const prop=c.addComponentProperty('Label','TEXT','Button');t.componentPropertyReferences={characters:prop};
 }
}
const nav=mainComponent('Navbar',1440);
if(!nav.children.length){
 nav.paddingTop=24;nav.paddingBottom=16;nav.paddingLeft=nav.paddingRight=80;
 const bar=row(nav,'Navigation bar',1280,16);bar.paddingLeft=bar.paddingRight=24;bar.paddingTop=bar.paddingBottom=12;bar.counterAxisAlignItems='CENTER';bar.primaryAxisAlignItems='SPACE_BETWEEN';
 const brand=row(bar,'School brand',175,6);brand.counterAxisAlignItems='CENTER';icon(brand,'ticket',20,'foreground');T(brand,'SMA Widya Darma',149,12,'Bold','foreground',18);
 const links=row(bar,'Navigation links',429,24);links.counterAxisAlignItems='CENTER';
 for(const [name,w] of [['Beranda',54],['Profil',32],['SPMB',38],['Publikasi & Galeri',129]])T(links,name,w,12,'Medium','muted',18);
 const ai=row(bar,'Tanya AI button',126,8);ai.paddingLeft=ai.paddingRight=20;ai.paddingTop=ai.paddingBottom=10;ai.cornerRadius=999;ai.fills=[paint('primary')];icon(ai,'sparkle',18,'white');T(ai,'Tanya AI',48,12,'SemiBold','white',18);
}
const foot=mainComponent('Footer',1440);
if(!foot.children.length){
 foot.paddingLeft=foot.paddingRight=128;foot.paddingTop=40;foot.paddingBottom=96;foot.fills=[paint('white',0.55)];
 const r=row(foot,'Footer contents',1184,32);r.primaryAxisAlignItems='SPACE_BETWEEN';
 const left=F(r,'School copyright',350,12);T(left,'SMA Widya Darma',350,12,'SemiBold','foreground',18);T(left,'© 2026 · Lorem ipsum dolor sit amet.',350,12,'Regular','muted',18);
 const links=row(r,'Footer links',736,24);for(const [s,w] of [['Profil sekolah',79],['Organisasi',62],['Guru',29],['SPMB',35],['Publikasi & galeri',100],['Kontak',43]])T(links,s,w,12,'Regular','muted',18);
}
const card=mainComponent('StaffCard',281);
if(!card.children.length){
 card.paddingLeft=card.paddingRight=20;card.paddingTop=card.paddingBottom=20;card.itemSpacing=0;card.counterAxisAlignItems='CENTER';card.cornerRadius=24;card.fills=[paint('white',0.8)];card.strokes=[paint('white')];card.strokeWeight=1;
 photo(card,'portrait',96,96,48);gap(card,20);const role=T(card,'GURU · MATA PELAJARAN',241,10,'SemiBold','primary',15,'CENTER');role.name='Staff / Role';gap(card,8);const title=T(card,'Lorem Ipsum',241,18,'SemiBold','foreground',27,'CENTER');title.name='Staff / Name';gap(card,8);const detail=T(card,'Lorem ipsum',241,12,'Regular','muted',24,'CENTER');detail.name='Staff / Detail';
 for(const [name,node] of [['Name',title],['Role',role],['Detail',detail]]){const key=card.addComponentProperty(name,'TEXT',node.characters);node.componentPropertyReferences={characters:key};}
}
const pub=mainComponent('PublicationCard',378.6667);
if(!pub.children.length){pub.paddingLeft=pub.paddingRight=12;pub.paddingTop=pub.paddingBottom=12;pub.cornerRadius=24;pub.fills=[paint('white',0.65)];pub.strokes=[paint('white')];pub.strokeWeight=1;photo(pub,'students',354.6667,236.4445,16);const text=F(pub,'Publication information',354.6667,0,'VERTICAL',null,16);const category=T(text,'BERITA',322.6667,10,'SemiBold','primary',15);category.name='Publication / Category';gap(text,16);const title=T(text,'Lorem ipsum dolor sit amet.',322.6667,20,'SemiBold','foreground',28);title.name='Publication / Title';gap(text,12);T(text,body,322.6667,12,'Regular','muted',24);gap(text,20);const link=row(text,'Read more',322.6667,16);link.primaryAxisAlignItems='SPACE_BETWEEN';T(link,'Lihat selengkapnya',270,12,'Medium','foreground',18);icon(link,'arrow');for(const [name,node] of [['Title',title],['Category',category]]){const key=pub.addComponentProperty(name,'TEXT',node.characters);node.componentPropertyReferences={characters:key};}}
return {createdNodeIds,mutatedNodeIds,components:page.children.filter(n=>n.type==='COMPONENT').map(n=>({id:n.id,name:n.name,width:n.width,height:n.height})),styles:Object.values(textStyles).map(s=>({id:s.id,name:s.name})),variables:Object.values(colorVars).map(v=>({id:v.id,name:v.name})),pageId:page.id};
