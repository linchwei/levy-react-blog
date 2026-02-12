const i={deepseek:{key:"sk-99b1944fe572434ea885b9eecae3b12e",url:"https://api.deepseek.com/v1",model:"deepseek-chat"},zhipu:{key:"",url:"https://open.bigmodel.cn/api/paas/v4",model:"glm-4-flash"},qwen:{key:"",url:"https://dashscope.aliyuncs.com/api/v1",model:"qwen-turbo"}};function d(){const r=[];return r.push("deepseek"),r}function g(r){const e={"Content-Type":"application/json"};switch(r){case"deepseek":e.Authorization=`Bearer ${i.deepseek.key}`;break;case"zhipu":e.Authorization=`Bearer ${i.zhipu.key}`;break;case"qwen":e.Authorization=`Bearer ${i.qwen.key}`;break}return e}function y(r,e){const{messages:s,temperature:a=.7,maxTokens:t=2e3}=e;switch(r){case"deepseek":return{model:i.deepseek.model,messages:s,temperature:a,max_tokens:t,stream:e.stream};case"zhipu":return{model:i.zhipu.model,messages:s,temperature:a,max_tokens:t,stream:e.stream};case"qwen":return{model:i.qwen.model,input:{messages:s},parameters:{temperature:a,max_tokens:t,result_format:"message"}};default:throw new Error(`未知的提供商: ${r}`)}}function A(r,e){var s,a,t,o,n;switch(r){case"deepseek":case"zhipu":return{content:((a=(s=e.choices[0])==null?void 0:s.message)==null?void 0:a.content)||"",usage:e.usage?{promptTokens:e.usage.prompt_tokens,completionTokens:e.usage.completion_tokens,totalTokens:e.usage.total_tokens}:void 0};case"qwen":return{content:((n=(o=(t=e.output)==null?void 0:t.choices[0])==null?void 0:o.message)==null?void 0:n.content)||"",usage:e.usage?{promptTokens:e.usage.input_tokens,completionTokens:e.usage.output_tokens,totalTokens:e.usage.total_tokens}:void 0};default:throw new Error(`未知的提供商: ${r}`)}}function E(r,e){var s,a,t,o,n;switch(r){case"deepseek":case"zhipu":return((a=(s=e.choices[0])==null?void 0:s.delta)==null?void 0:a.content)||null;case"qwen":return((n=(o=(t=e.output)==null?void 0:t.choices[0])==null?void 0:o.message)==null?void 0:n.content)||null;default:return null}}async function I(r){var a;const e=d();if(e.length===0)throw new Error("未配置任何 AI API Key，请在 .env.local 中配置至少一个提供商（DeepSeek、智谱GLM 或 通义千问）");let s=null;for(const t of e)try{console.log(`尝试使用 ${t} API...`);const o=await fetch(`${i[t].url}/chat/completions`,{method:"POST",headers:g(t),body:JSON.stringify(y(t,{...r,stream:!1}))});if(!o.ok){const c=await o.json().catch(()=>({})),u=((a=c.error)==null?void 0:a.message)||c.message||`HTTP ${o.status}`;if(u.includes("Insufficient Balance")||u.includes("余额不足")||o.status===429){console.warn(`${t} API 余额不足或限流，尝试下一个提供商...`),s=new Error(`${t}: ${u}`);continue}throw new Error(u)}const n=await o.json();return console.log(`${t} API 调用成功`),A(t,n)}catch(o){console.error(`${t} API 调用失败:`,o),s=o instanceof Error?o:new Error(String(o));continue}throw s||new Error("所有 AI 提供商都不可用")}async function b(r){var t,o;const{onStream:e}=r;if(!e)throw new Error("流式请求必须提供 onStream 回调函数");const s=d();if(s.length===0)throw new Error("未配置任何 AI API Key，请在 .env.local 中配置至少一个提供商（DeepSeek、智谱GLM 或 通义千问）");let a=null;for(const n of s)try{console.log(`尝试使用 ${n} API (流式)...`);const c=await fetch(`${i[n].url}/chat/completions`,{method:"POST",headers:g(n),body:JSON.stringify(y(n,{...r,stream:!0}))});if(!c.ok){const p=await c.json().catch(()=>({})),l=((t=p.error)==null?void 0:t.message)||p.message||`HTTP ${c.status}`;if(l.includes("Insufficient Balance")||l.includes("余额不足")||c.status===429){console.warn(`${n} API 余额不足或限流，尝试下一个提供商...`),a=new Error(`${n}: ${l}`);continue}throw new Error(l)}const u=(o=c.body)==null?void 0:o.getReader();if(!u)throw new Error("无法获取响应流");const $=new TextDecoder;let h="";for(;;){const{done:p,value:l}=await u.read();if(p)break;h+=$.decode(l,{stream:!0});const f=h.split(`
`);h=f.pop()||"";for(const m of f)if(!(m.trim()===""||m.trim()==="data: [DONE]")&&m.startsWith("data: "))try{const w=JSON.parse(m.slice(6)),k=E(n,w);k&&e(k)}catch{}}console.log(`${n} API 流式调用成功`);return}catch(c){console.error(`${n} API 流式调用失败:`,c),a=c instanceof Error?c:new Error(String(c));continue}throw a||new Error("所有 AI 提供商都不可用")}function P(){return d().length>0}function S(r,e){return`你是 Levy 的技术博客 AI 助手，专门帮助读者理解技术文章。

当前文章标题：${r}

文章内容概要：
${e.slice(0,2e3)}...

你的职责：
1. 回答读者关于这篇文章的技术问题
2. 解释文章中的复杂概念
3. 提供与文章相关的扩展知识
4. 帮助读者更好地理解和应用文章内容

回答要求：
- 使用中文回答
- 回答要简洁明了，避免过于冗长
- 如果问题与文章无关，礼貌地引导用户回到文章主题
- 对于代码相关问题，可以提供示例代码
- 如果不确定答案，诚实告知而不是编造`}function T(){return`你是一位专业的技术文章分析助手。请对给定的技术文章进行总结。

请按以下格式输出：
1. 一句话概括文章核心内容
2. 3-5 个关键要点（用简洁的 bullet points）
3. 文章适合什么水平的读者阅读

要求：
- 总结要准确、简洁
- 关键要点要覆盖文章的主要技术点
- 使用中文输出
- 不要添加与文章内容无关的信息`}export{I as a,T as b,b as c,S as g,P as i};
//# sourceMappingURL=aiService-BKnG4cQx-BKnG4cQx.js.map
