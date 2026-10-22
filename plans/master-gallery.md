# 大师作品（/master）实施计划

## Context

- 新增仅可通过输入 `/master` 进入的试验页，不增加站内入口；先展示史蒂芬·肖尔、亨利·卡蒂埃-布列松、安塞尔·亚当斯、杉本博司、森山大道、滨田英明的摄影作品，后续可扩展。
- 现有项目采用 React/Vite/Tailwind；`src/routes.jsx` 懒加载页面；`src/layout/MainLayout.tsx` 提供固定导航和页脚。视觉基调白底、黑灰文字、中文衬线标题。
- 用户确认非商业测试用途：首批每位至少 10 张，共至少 60 张；每张须附作品名、年份、出处和简短看点。图片以可正常访问并清晰展示为选取前提，记录原始来源及署名；不将「网上可访问」等同于已获转载授权。
- 初步图源：肖尔 [303 Gallery](https://www.303gallery.com/artists/stephen-shore/images/uncommon-places) / [Houk Gallery](https://www.houkgallery.com/exhibitions/18-stephen-shore-uncommon-places-vintage-prints/works/)；布列松 [Magnum](https://www.magnumphotos.com/photographer/henri-cartier-bresson/) / [NGA](https://www.nga.gov/artists/13568-henri-cartier-bresson/artworks)；亚当斯 [美国国家档案馆](https://www.archives.gov/research/ansel-adams)；杉本博司 [官网](https://www.sugimotohiroshi.com/seascapes-1/) / [Fraenkel Gallery](https://fraenkelgallery.com/portfolios/hiroshi-sugimoto-theaters)；森山大道 [官网](https://www.moriyamadaido.com/en/photogallery/) / [NGA](https://www.nga.gov/artists/24698-daido-moriyama/artworks)；滨田英明 [官网](https://hideakihamada.com/works/)（上述仅为待逐张核实的候选）。
- 滨田官网 Haru and Mina 部分图片只有系列名及拍摄区间（如 2015–2016），未必有单幅正式标题/精确年份；用户确认按系列名/可核实区间标注，无资料时写「未知」，不得编造。
- 已实测来源 HTML/图像：滨田 [Haru and Mina 2015–2016](https://hideakihamada.com/works/6918/) 有大量作品图且有 1536px 版本；肖尔 [303 Gallery](https://www.303gallery.com/artists/stephen-shore/images/uncommon-places) 与 Houk 展览页都提供带图文说明和可调尺寸链接；森山[官网画廊](https://www.moriyamadaido.com/en/photogallery/)的缩略图仅 140px，但灯箱链接有可展示的 960px 图（样例 HTTP 200/960×630/约 40KB）；杉本[Fraenkel Theaters](https://fraenkelgallery.com/portfolios/hiroshi-sugimoto-theaters) 和 [Seascapes](https://fraenkelgallery.com/portfolios/hiroshi-sugimoto-seascapes) 均有带标题/年份的作品图；布列松 [Magnum 图文专辑](https://www.magnumphotos.com/newsroom/society/henri-cartier-bresson-the-world-of-henri-cartier-bresson/)的相册有 17 张含图注的作品图；亚当斯 [NARA 79-AA](https://www.archives.gov/research/ansel-adams) / [NARA 展览](https://www.archives.gov/exhibits/picturing_the_century/portfolios/port_adams.html) / [LOC Manzanar](https://loc.gov/collections/ansel-adams-manzanar) 有馆藏作品，具体图像需逐页验证。**这些不是已确定的 60 张清单**；不要拿站点导航图、缩略图、印刷版或不相干图片凑数。

## Approach

- 将页面做成与站点黑白/留白/中文衬线一致的「摄影阅览室」：桌面端左侧紧凑六人目录、右侧按当前摄影师展示联系印相式缩略图网格；移动端横向可滚动切换栏和自适应网格。选人即时切换当前 10+ 张，避免一次渲染全部 60 张。
- 点选作品进入沉浸式观片层，展示标题、年份、出处（可点击原始作品/系列来源页）和一两句具体的「看点」；提供上一张/下一张、键盘左右键与 Esc、关闭/返回焦点。趣味交互采用「先看图，再揭晓」切换（默认信息可见以便快速浏览）+「随机看一张」，不牺牲查找效率，不增加图库依赖；尊重 prefers-reduced-motion。
- 将摄影师与作品（稳定 id、可核实的作品名/系列名、拍摄年份或区间、出处/来源页、缩略图/大图路径、看点、必要时 alt）整理成结构化数据，方便后续添加。逐张对照图像核实真实作品、年份（不拿冲印年份冒充）、出处与非套路化看点；无单幅正式标题时显示「作品名未知 · 《系列名》 · 01」（01 只是本站展示序号），年份不可查时显示「未知」，不伪称自造标题为官方作品名。
- 为画质与稳定性，优先选源站可访问的图片并离线生成本地 WebP 缩略图/大图（`cwebp` 已可用），两档分辨率如 ~480px 与 ~1400px；校验响应、实际像素与大小、合理压缩后再放入 `public/masters/`，避免热链失效和超大首屏下载；原始来源页链接保存在数据中。非商业不等于取得复制/再分发授权，不在页面宣称已获授权。

## Files to modify

- `src/routes.jsx`：新增懒加载 `/master`。
- `src/pages/Master.tsx`（新）：页面与交互。
- `src/data/masterWorks.ts`（新，暂定）：摄影师、作品、署名及图源数据。
- `public/masters/`（新）：存放筛选后可取得的图片的适屏 WebP 版本；数据中保留对应来源页和署名，不将其表述为已获授权。
- 不改 `src/components/layout/Navbar.tsx` 的链接列表。

## Reuse

- `src/layout/MainLayout.tsx`：保留共用布局、导航与页脚。
- `src/routes.jsx`：照现有页面的 `lazy` 配置方式新增路由。
- `src/index.css`：沿用全局字体、颜色与 Tailwind 约定；避免大幅调整其他页面。
- `src/components/ui/GalleryItem.tsx` 的弹层经验可参考，但它依赖 Supabase/实况照片；大师作品用轻量独立查看器，不引入图库专用依赖。

## Steps

- [x] 确认缺失单张标题/拍摄年份时的如实标注方式：使用已知系列/年份区间，否则标「未知」。
- [x] 逐位从候选馆藏/摄影师官网选取至少 10 张**不重复且可直接展示的代表作品**（尽量覆盖不同系列/时期；若是无标题系列图则注明），逐一核对标题、拍摄年份或区间、作品出处、署名；未知项标「未知」，不以印刷年份冒充拍摄年份。
- [x] 验证图片响应状态、MIME、像素尺寸与大小；挑选能实际取得的高清图，压缩为本地适屏图并保留来源页链接，避免依赖会失效的热链或下载超大原图。
- [x] 实现静态数据和本地双尺寸图片、路由及紧凑浏览/揭晓/随机查看交互；只加载当前摄影师的缩略图，按需加载大图，图片设 `loading="lazy"`、尺寸/占位和加载失败提示。
- [x] 完成弹层语义与无障碍（可操作按钮、键盘前后切换、Esc、滚动锁定与焦点管理）、触屏布局和 reduced-motion 降级。
- [x] 核验事实、署名、图片可用性、性能与无障碍。

## Verification

- `npm run lint`、`npm run build`；开发/预览环境直达 `/master`（含刷新），确认 Navbar 没有入口；桌面与手机逐人切换，核对每人 ≥10 张、无重复/错图/破图，元数据与源页一致；测试上一张/下一张、随机、揭晓、来源链接、Esc/焦点回退/移动端点击与 reduced-motion。
- 检查首屏 Network：首页不拉取 `/master` 代码及大师图片；大师页初访不下载其余 5 人及 60 张大图。人工检查本地生成图片的尺寸与大小（目标缩略图 ≤~150KB、单张大图 ≤~500KB，原始源图很低清时不虚假放大），无 CORS/跨域依赖。
