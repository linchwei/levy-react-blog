import{S as z,g as j,s as q,a as H,b as Z,q as J,p as K,_ as u,l as F,c as Q,D as X,H as Y,a3 as tt,e as et,y as at,E as rt}from"./ProjectDetailPage-q2o-aZ1h.js";import{p as it}from"./chunk-4BX2VUAB-Bmvoq6pO.js";import{p as nt}from"./treemap-KMMF4GRG-DcCthktK.js";import{d as I}from"./arc-OTqu-g2u.js";import{o as ot}from"./ordinal-DILIJJjt.js";import{c as S,a as st}from"./array-DlGHEQC4.js";import"./ui-DYkYaoix.js";import"./vendor-QyoG3HE1.js";import"./Navigation-DXnCMIzu.js";import"./index-CfE-GKv_.js";import"./animation-BjUy5Qx7.js";import"./Footer-CNs8wlMF.js";import"./input-BFdyaGdD.js";import"./middleware-DopGOoqf.js";import"./step-kUCwMD6D.js";import"./lightbulb-Ns5VmKNR.js";import"./wrench-1sFRAdfp.js";import"./arrow-left-BhBhA2p7.js";import"./external-link-jdwbitUr.js";import"./users-xdiKoXqj.js";import"./clock-BlW36vnv.js";import"./star-B4tElhP9.js";import"./git-fork-DQFeGX9G.js";import"./min-BLSdSKSR.js";import"./_baseUniq-BsRlwgvr.js";import"./init-Dmth1JHB.js";function lt(t,a){return a<t?-1:a>t?1:a>=t?0:NaN}function ct(t){return t}function pt(){var t=ct,a=lt,m=null,y=S(0),o=S(z),l=S(0);function s(e){var i,c=(e=st(e)).length,g,x,h=0,p=new Array(c),n=new Array(c),v=+y.apply(this,arguments),w=Math.min(z,Math.max(-z,o.apply(this,arguments)-v)),f,C=Math.min(Math.abs(w)/c,l.apply(this,arguments)),$=C*(w<0?-1:1),d;for(i=0;i<c;++i)(d=n[p[i]=i]=+t(e[i],i,e))>0&&(h+=d);for(a!=null?p.sort(function(A,D){return a(n[A],n[D])}):m!=null&&p.sort(function(A,D){return m(e[A],e[D])}),i=0,x=h?(w-c*$)/h:0;i<c;++i,v=f)g=p[i],d=n[g],f=v+(d>0?d*x:0)+$,n[g]={data:e[g],index:i,value:d,startAngle:v,endAngle:f,padAngle:C};return n}return s.value=function(e){return arguments.length?(t=typeof e=="function"?e:S(+e),s):t},s.sortValues=function(e){return arguments.length?(a=e,m=null,s):a},s.sort=function(e){return arguments.length?(m=e,a=null,s):m},s.startAngle=function(e){return arguments.length?(y=typeof e=="function"?e:S(+e),s):y},s.endAngle=function(e){return arguments.length?(o=typeof e=="function"?e:S(+e),s):o},s.padAngle=function(e){return arguments.length?(l=typeof e=="function"?e:S(+e),s):l},s}var ut=rt.pie,G={sections:new Map,showData:!1},T=G.sections,N=G.showData,gt=structuredClone(ut),dt=u(()=>structuredClone(gt),"getConfig"),mt=u(()=>{T=new Map,N=G.showData,at()},"clear"),ft=u(({label:t,value:a})=>{if(a<0)throw new Error(`"${t}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);T.has(t)||(T.set(t,a),F.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),ht=u(()=>T,"getSections"),vt=u(t=>{N=t},"setShowData"),St=u(()=>N,"getShowData"),L={getConfig:dt,clear:mt,setDiagramTitle:K,getDiagramTitle:J,setAccTitle:Z,getAccTitle:H,setAccDescription:q,getAccDescription:j,addSection:ft,getSections:ht,setShowData:vt,getShowData:St},yt=u((t,a)=>{it(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),xt={parse:u(async t=>{const a=await nt("pie",t);F.debug(a),yt(a,L)},"parse")},wt=u(t=>`
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
`,"getStyles"),At=wt,Dt=u(t=>{const a=[...t.values()].reduce((o,l)=>o+l,0),m=[...t.entries()].map(([o,l])=>({label:o,value:l})).filter(o=>o.value/a*100>=1).sort((o,l)=>l.value-o.value);return pt().value(o=>o.value)(m)},"createPieArcs"),Ct=u((t,a,m,y)=>{F.debug(`rendering pie chart
`+t);const o=y.db,l=Q(),s=X(o.getConfig(),l.pie),e=40,i=18,c=4,g=450,x=g,h=Y(a),p=h.append("g");p.attr("transform","translate("+x/2+","+g/2+")");const{themeVariables:n}=l;let[v]=tt(n.pieOuterStrokeWidth);v??(v=2);const w=s.textPosition,f=Math.min(x,g)/2-e,C=I().innerRadius(0).outerRadius(f),$=I().innerRadius(f*w).outerRadius(f*w);p.append("circle").attr("cx",0).attr("cy",0).attr("r",f+v/2).attr("class","pieOuterCircle");const d=o.getSections(),A=Dt(d),D=[n.pie1,n.pie2,n.pie3,n.pie4,n.pie5,n.pie6,n.pie7,n.pie8,n.pie9,n.pie10,n.pie11,n.pie12];let E=0;d.forEach(r=>{E+=r});const W=A.filter(r=>(r.data.value/E*100).toFixed(0)!=="0"),b=ot(D);p.selectAll("mySlices").data(W).enter().append("path").attr("d",C).attr("fill",r=>b(r.data.label)).attr("class","pieCircle"),p.selectAll("mySlices").data(W).enter().append("text").text(r=>(r.data.value/E*100).toFixed(0)+"%").attr("transform",r=>"translate("+$.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),p.append("text").text(o.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const O=[...d.entries()].map(([r,M])=>({label:r,value:M})),k=p.selectAll(".legend").data(O).enter().append("g").attr("class","legend").attr("transform",(r,M)=>{const R=i+c,B=R*O.length/2,V=12*i,U=M*R-B;return"translate("+V+","+U+")"});k.append("rect").attr("width",i).attr("height",i).style("fill",r=>b(r.label)).style("stroke",r=>b(r.label)),k.append("text").attr("x",i+c).attr("y",i-c).text(r=>o.getShowData()?`${r.label} [${r.value}]`:r.label);const _=Math.max(...k.selectAll("text").nodes().map(r=>(r==null?void 0:r.getBoundingClientRect().width)??0)),P=x+e+i+c+_;h.attr("viewBox",`0 0 ${P} ${g}`),et(h,g,P,s.useMaxWidth)},"draw"),$t={draw:Ct},Xt={parser:xt,db:L,renderer:$t,styles:At};export{Xt as diagram};
//# sourceMappingURL=pieDiagram-ADFJNKIX-D3owibCe.js.map
