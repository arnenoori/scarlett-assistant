import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, b as renderComponent, d as addAttribute, e as renderHead, F as Fragment } from '../astro_695a30f2.mjs';
import 'html-escaper';
import 'clsx';
import { Typography, Alert, Card, Button } from '@shadcn/ui';
/* empty css                           */
const $$Astro$6 = createAstro();
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Header;
  return renderTemplate`${maybeRenderHead()}<header class="py-4 border-b border-gray-200"> <div class="container mx-auto px-4"> <div class="flex items-center"> <img src="/assets/images/icon128.png" alt="TOS Buddy Logo" class="w-8 h-8 mr-2"> ${renderComponent($$result, "Typography", Typography, { "variant": "h4" }, { "default": ($$result2) => renderTemplate`TOS Buddy` })} </div> </div> </header>`;
}, "/Users/arnenoori/Coding/tos-buddy/chrome_extension/src/components/Header.astro", void 0);

const $$Astro$5 = createAstro();
const $$WebsiteInfo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$WebsiteInfo;
  const websiteData = await getWebsiteData();
  return renderTemplate`${renderComponent($$result, "Alert", Alert, { "variant": "info" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Typography", Typography, { "variant": "h6" }, { "default": ($$result3) => renderTemplate`Current Website:` })} ${renderComponent($$result2, "Typography", Typography, { "variant": "body" }, { "default": ($$result3) => renderTemplate`${websiteData.name} - ${websiteData.url}` })} ` })}bunx --bun shadcn-ui@latest add alert`;
}, "/Users/arnenoori/Coding/tos-buddy/chrome_extension/src/components/WebsiteInfo.astro", void 0);

const $$Astro$4 = createAstro();
const $$SummaryCard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$SummaryCard;
  const tosData = await getTOSSummary();
  return renderTemplate`${renderComponent($$result, "Card", Card, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Typography", Typography, { "variant": "h4" }, { "default": ($$result3) => renderTemplate`Terms of Service Summary` })} ${renderComponent($$result2, "Typography", Typography, { "variant": "body", "class": "mt-2" }, { "default": ($$result3) => renderTemplate`${tosData.summary}` })} ` })}`;
}, "/Users/arnenoori/Coding/tos-buddy/chrome_extension/src/components/SummaryCard.astro", void 0);

const $$Astro$3 = createAstro();
const $$DetailSection = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$DetailSection;
  return renderTemplate`${renderComponent($$result, "Card", Card, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Typography", Typography, { "variant": "h4" }, { "default": ($$result3) => renderTemplate`Terms of Service Details` })} ${maybeRenderHead()}<div class="mt-4">  <div class="flex items-center mb-2"> <svg class="w-6 h-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"> <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd"></path> </svg> ${renderComponent($$result2, "Typography", Typography, { "variant": "body" }, { "default": ($$result3) => renderTemplate`User Rights` })} </div> <div class="flex items-center mb-2"> <svg class="w-6 h-6 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"> <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"></path> </svg> ${renderComponent($$result2, "Typography", Typography, { "variant": "body" }, { "default": ($$result3) => renderTemplate`Data Collection` })} </div> <div class="flex items-center mb-2"> <svg class="w-6 h-6 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"> <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"></path> </svg> ${renderComponent($$result2, "Typography", Typography, { "variant": "body" }, { "default": ($$result3) => renderTemplate`Limitations of Liability` })} </div> </div> <div class="mt-6"> ${renderComponent($$result2, "Button", Button, { "variant": "outline" }, { "default": ($$result3) => renderTemplate`
Learn More
` })} </div> ` })}`;
}, "/Users/arnenoori/Coding/tos-buddy/chrome_extension/src/components/DetailSection.astro", void 0);

const $$Astro$2 = createAstro();
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead()}<footer class="mt-8 py-4 border-t border-gray-200"> <div class="container mx-auto px-4"> <div class="flex justify-between items-center"> ${renderComponent($$result, "Typography", Typography, { "variant": "body", "class": "text-gray-500" }, { "default": ($$result2) => renderTemplate`
&copy; ${( new Date()).getFullYear()} TOS Buddy. All rights reserved.
` })} ${renderComponent($$result, "Button", Button, { "variant": "ghost" }, { "default": ($$result2) => renderTemplate`
Provide Feedback
` })} </div> </div> </footer>`;
}, "/Users/arnenoori/Coding/tos-buddy/chrome_extension/src/components/Footer.astro", void 0);

const $$Astro$1 = createAstro();
const $$Loader = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Loader;
  return renderTemplate`${maybeRenderHead()}<div class="loader" data-astro-cid-4qws3apc> <div class="spinner" data-astro-cid-4qws3apc></div> <div class="text" data-astro-cid-4qws3apc>Loading...</div> </div> `;
}, "/Users/arnenoori/Coding/tos-buddy/chrome_extension/src/components/Loader.astro", void 0);

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  let websiteData = null;
  let tosData = null;
  let loading = true;
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "websiteData") {
      websiteData = message.data;
      loading = false;
    }
  });
  chrome.runtime.sendMessage({ type: "getWebsiteData" });
  if (websiteData) {
    chrome.runtime.sendMessage({ type: "getTOSSummary", websiteId: websiteData.id }, (response) => {
      tosData = response.data;
    });
  }
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/assets/images/icon128.png"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>TOS Buddy</title>${renderHead()}</head> <body> <div class="container mx-auto px-4"> ${renderComponent($$result, "Header", $$Header, {})} ${loading ? renderTemplate`<div class="mt-8"> ${renderComponent($$result, "Loader", $$Loader, {})} </div>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${websiteData && renderTemplate`${renderComponent($$result2, "WebsiteInfo", $$WebsiteInfo, { "websiteData": websiteData })}`}${tosData ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "SummaryCard", $$SummaryCard, { "tosData": tosData })} ${renderComponent($$result3, "DetailSection", $$DetailSection, { "tosData": tosData })} ` })}` : renderTemplate`<div class="mt-8"> <p>Failed to fetch TOS summary.</p> </div>`}` })}`} ${renderComponent($$result, "Footer", $$Footer, {})} </div> </body></html>`;
}, "/Users/arnenoori/Coding/tos-buddy/chrome_extension/src/pages/index.astro", void 0);

const $$file = "/Users/arnenoori/Coding/tos-buddy/chrome_extension/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
