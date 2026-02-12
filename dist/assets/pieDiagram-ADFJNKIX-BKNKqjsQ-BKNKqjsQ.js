import{R as z,g as j,s as q,a as K,b as Z,t as H,q as J,_ as u,l as F,c as Q,F as X,K as Y,a3 as tt,e as et,z as at,G as rt}from"./ProjectDetailPage-HkeMwPD_-HkeMwPD_.js";import{p as it}from"./chunk-4BX2VUAB-DZqNFbDZ-DZqNFbDZ.js";import{p as nt}from"./treemap-KMMF4GRG-B0RXtZej-B0RXtZej.js";import{d as I}from"./arc-DSfoRQ7B-DSfoRQ7B.js";import{o as ot}from"./ordinal-CjrP8Fuk-CjrP8Fuk.js";import{c as S,a as st}from"./array-DlGHEQC4-DlGHEQC4.js";import"./ui-8Or-2zOT-8Or-2zOT.js";import"./vendor-QyoG3HE1-QyoG3HE1.js";import"./Navigation-CVIh0ny8-CVIh0ny8.js";import"./index-CB-nuzdG-CB-nuzdG.js";import"./animation-Cg-7L8ts-Cg-7L8ts.js";import"./Footer-HVOx1zD2-HVOx1zD2.js";import"./input-BH5s_kIV-BH5s_kIV.js";import"./middleware-BIVXqGDk-BIVXqGDk.js";import"./step-h9vAPLdK-h9vAPLdK.js";import"./lightbulb-Chg089RR-Chg089RR.js";import"./wrench-CGPZH60Y-CGPZH60Y.js";import"./arrow-left-DMvrH_re-DMvrH_re.js";import"./external-link-BeRorKkn-BeRorKkn.js";import"./users-16n-6GNK-16n-6GNK.js";import"./clock-4rjZRXqQ-4rjZRXqQ.js";import"./star-Xr2C-_ER-Xr2C-_ER.js";import"./git-fork-DiP3rNZC-DiP3rNZC.js";import"./min-CqYlDnAw-CqYlDnAw.js";import"./_baseUniq-DD26xk-e-DD26xk-e.js";import"./init-Dmth1JHB-Dmth1JHB.js";function lt(t,a){return a<t?-1:a>t?1:a>=t?0:NaN}function ct(t){return t}function pt(){var t=ct,a=lt,m=null,x=S(0),o=S(z),l=S(0);function s(e){var i,c=(e=st(e)).length,g,y,h=0,p=new Array(c),n=new Array(c),v=+x.apply(this,arguments),w=Math.min(z,Math.max(-z,o.apply(this,arguments)-v)),f,C=Math.min(Math.abs(w)/c,l.apply(this,arguments)),$=C*(w<0?-1:1),d;for(i=0;i<c;++i)(d=n[p[i]=i]=+t(e[i],i,e))>0&&(h+=d);for(a!=null?p.sort(function(A,D){return a(n[A],n[D])}):m!=null&&p.sort(function(A,D){return m(e[A],e[D])}),i=0,y=h?(w-c*$)/h:0;i<c;++i,v=f)g=p[i],d=n[g],f=v+(d>0?d*y:0)+$,n[g]={data:e[g],index:i,value:d,startAngle:v,endAngle:f,padAngle:C};return n}return s.value=function(e){return arguments.length?(t=typeof e=="function"?e:S(+e),s):t},s.sortValues=function(e){return arguments.length?(a=e,m=null,s):a},s.sort=function(e){return arguments.length?(m=e,a=null,s):m},s.startAngle=function(e){return arguments.length?(x=typeof e=="function"?e:S(+e),s):x},s.endAngle=function(e){return arguments.length?(o=typeof e=="function"?e:S(+e),s):o},s.padAngle=function(e){return arguments.length?(l=typeof e=="function"?e:S(+e),s):l},s}var ut=rt.pie,G={sections:new Map,showData:!1},T=G.sections,N=G.showData,gt=structuredClone(ut),dt=u(()=>structuredClone(gt),"getConfig"),mt=u(()=>{T=new Map,N=G.showData,at()},"clear"),ft=u(({label:t,value:a})=>{if(a<0)throw new Error(`"${t}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);T.has(t)||(T.set(t,a),F.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),ht=u(()=>T,"getSections"),vt=u(t=>{N=t},"setShowData"),St=u(()=>N,"getShowData"),L={getConfig:dt,clear:mt,setDiagramTitle:J,getDiagramTitle:H,setAccTitle:Z,getAccTitle:K,setAccDescription:q,getAccDescription:j,addSection:ft,getSections:ht,setShowData:vt,getShowData:St},xt=u((t,a)=>{it(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),yt={parse:u(async t=>{const a=await nt("pie",t);F.debug(a),xt(a,L)},"parse")},wt=u(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),At=wt,Dt=u(t=>{const a=[...t.values()].reduce((o,l)=>o+l,0),m=[...t.entries()].map(([o,l])=>({label:o,value:l})).filter(o=>o.value/a*100>=1).sort((o,l)=>l.value-o.value);return pt().value(o=>o.value)(m)},"createPieArcs"),Ct=u((t,a,m,x)=>{F.debug(`rendering pie chart
`+t);const o=x.db,l=Q(),s=X(o.getConfig(),l.pie),e=40,i=18,c=4,g=450,y=g,h=Y(a),p=h.append("g");p.attr("transform","translate("+y/2+","+g/2+")");const{themeVariables:n}=l;let[v]=tt(n.pieOuterStrokeWidth);v??(v=2);const w=s.textPosition,f=Math.min(y,g)/2-e,C=I().innerRadius(0).outerRadius(f),$=I().innerRadius(f*w).outerRadius(f*w);p.append("circle").attr("cx",0).attr("cy",0).attr("r",f+v/2).attr("class","pieOuterCircle");const d=o.getSections(),A=Dt(d),D=[n.pie1,n.pie2,n.pie3,n.pie4,n.pie5,n.pie6,n.pie7,n.pie8,n.pie9,n.pie10,n.pie11,n.pie12];let b=0;d.forEach(r=>{b+=r});const R=A.filter(r=>(r.data.value/b*100).toFixed(0)!=="0"),E=ot(D);p.selectAll("mySlices").data(R).enter().append("path").attr("d",C).attr("fill",r=>E(r.data.label)).attr("class","pieCircle"),p.selectAll("mySlices").data(R).enter().append("text").text(r=>(r.data.value/b*100).toFixed(0)+"%").attr("transform",r=>"translate("+$.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),p.append("text").text(o.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const W=[...d.entries()].map(([r,M])=>({label:r,value:M})),k=p.selectAll(".legend").data(W).enter().append("g").attr("class","legend").attr("transform",(r,M)=>{const P=i+c,B=P*W.length/2,V=12*i,U=M*P-B;return"translate("+V+","+U+")"});k.append("rect").attr("width",i).attr("height",i).style("fill",r=>E(r.label)).style("stroke",r=>E(r.label)),k.append("text").attr("x",i+c).attr("y",i-c).text(r=>o.getShowData()?`${r.label} [${r.value}]`:r.label);const _=Math.max(...k.selectAll("text").nodes().map(r=>(r==null?void 0:r.getBoundingClientRect().width)??0)),O=y+e+i+c+_;h.attr("viewBox",`0 0 ${O} ${g}`),et(h,g,O,s.useMaxWidth)},"draw"),$t={draw:Ct},Xt={parser:yt,db:L,renderer:$t,styles:At};export{Xt as diagram};
//# sourceMappingURL=pieDiagram-ADFJNKIX-BKNKqjsQ-BKNKqjsQ.js.map
