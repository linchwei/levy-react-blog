import{j as e,m as o}from"./ui-GusFL0M-.js";import{c as t,B as c,t as i}from"./index-CWBEolnY.js";import{I as n}from"./input-B0jA98LF.js";import{L as r}from"./vendor-C6cl_Q97.js";/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]],m=t("github",d);/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}]],x=t("heart",h);/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",key:"c2jq9f"}],["rect",{width:"4",height:"12",x:"2",y:"9",key:"mk3on5"}],["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}]],f=t("linkedin",b);/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],u=t("mail",p);/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]],j=t("twitter",g),a={navigation:[{label:"首页",href:"/"},{label:"文章",href:"/blog"},{label:"项目",href:"/projects"},{label:"关于",href:"/about"}],resources:[{label:"待办事项",href:"/todo"},{label:"时间线",href:"/timeline"},{label:"工具箱",href:"/tools"}],social:[{icon:m,href:"https://github.com",label:"GitHub"},{icon:j,href:"https://twitter.com",label:"Twitter"},{icon:f,href:"https://linkedin.com",label:"LinkedIn"},{icon:u,href:"mailto:hello@example.com",label:"Email"}]};function k(){const l=s=>{s.preventDefault(),i.success("订阅成功！")};return e.jsx("footer",{className:"bg-gradient-to-b from-background to-accent/10 border-t border-border/50",children:e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12",children:[e.jsxs("div",{className:"lg:col-span-1",children:[e.jsx(r,{to:"/",className:"inline-block mb-4",children:e.jsx("span",{className:"text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent",children:"MyBlog"})}),e.jsx("p",{className:"text-muted-foreground text-sm mb-4",children:"一个专注于前端开发、UI设计和开源技术的个人博客。"}),e.jsx("div",{className:"flex gap-3",children:a.social.map(s=>e.jsx(o.a,{href:s.href,target:"_blank",rel:"noopener noreferrer",whileHover:{scale:1.1},whileTap:{scale:.95},className:"p-2 rounded-full bg-accent/50 hover:bg-accent transition-colors","aria-label":s.label,children:e.jsx(s.icon,{className:"w-4 h-4"})},s.label))})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold mb-4",children:"导航"}),e.jsx("ul",{className:"space-y-2",children:a.navigation.map(s=>e.jsx("li",{children:e.jsx(r,{to:s.href,className:"text-sm text-muted-foreground hover:text-foreground transition-colors",children:s.label})},s.href))})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold mb-4",children:"资源"}),e.jsx("ul",{className:"space-y-2",children:a.resources.map(s=>e.jsx("li",{children:e.jsx(r,{to:s.href,className:"text-sm text-muted-foreground hover:text-foreground transition-colors",children:s.label})},s.href))})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold mb-4",children:"订阅更新"}),e.jsx("p",{className:"text-sm text-muted-foreground mb-4",children:"获取最新文章和项目更新"}),e.jsxs("form",{onSubmit:l,className:"flex gap-2",children:[e.jsx(n,{type:"email",placeholder:"输入邮箱",className:"flex-1",required:!0}),e.jsx(c,{type:"submit",size:"sm",children:"订阅"})]})]})]}),e.jsxs("div",{className:"pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4",children:[e.jsxs("p",{className:"text-sm text-muted-foreground flex items-center gap-1",children:["Made with ",e.jsx(x,{className:"w-4 h-4 text-red-500 fill-red-500"})," using React & Tailwind"]}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:["© ",new Date().getFullYear()," MyBlog. All rights reserved."]})]})]})})}export{k as F,m as G,x as H,f as L,u as M,j as T};
//# sourceMappingURL=Footer-CZH5dno0.js.map
