# 首屏 JavaScript 过大：原因与优化计划

## Context

- 截图提示构建主 JS 约 3.24 MB、gzip 后约 1.05 MB。现有 `dist/assets/index-MYm0N67f.js` 实测 3,244,171 B，gzip 约 1,049,706 B，与截图吻合；`dist` 只有一个 JS 产物。这是旧产物的事实，不代表当前源码一定能重新构建。
- **根因**：`src/routes.jsx` 静态导入全部路由，首页也必须加载画廊和电影页面的依赖。`src/pages/Gallery.tsx` → `GalleryItem.tsx` → `libheif-js/wasm-bundle` / `LivePhotoPlayer.tsx` → `livephotoskit`，画廊还顶层导入 antd Masonry；首页 `CinemaHero.tsx` 顶层导入 p5。`libheif-js` 的 bundle 原文件约 1.46 MB（含内嵌 WASM），是主要体积嫌疑来源之一，但未经产物分析不将该原文件大小当成精确贡献。Anime.js 亦在多页使用；静态页面导入使上述依赖集中进入主包。
- 额外无效依赖：`routes.jsx` 静态 import 了已注释路由的 `UploadPage`；`Home.tsx` 静态 import 了 JSX 已注释的 `FeaturedCarousel`，不过生产构建可能树摇掉部分未使用代码，不能把它们的全部源码体积算进现有产物。
- **另一个独立问题**：当前 `index.html` 指向不存在的 `/src/main.jsx`，真实文件是 `src/main.tsx`；截图对应的旧 `dist` 不足以证明现状构建成功。实施时应先修正入口并重新建立基线，不能仅为了消除警告就调高 Vite 阈值。
- 画廊中非 Safari 的 HEIC 照片目前在每个条目挂载时立即下载和同步解码，有并发 CPU/内存风险；此为性能问题，不是上述构建大包的直接原因。

## Approach

- 修正入口后记录新的构建与首屏 Network 基线，随后用 React Router 路由级 `lazy` 将首页、电影列表/详情、画廊、测试页拆分；保留共享布局，并为异步路由提供加载反馈。移除已禁用功能的无效 import，先检查分包效果。
- 在画廊里，仅对需要 HEIC 解码的非 Safari 条目异步加载 `libheif-js/wasm-bundle`；实况照片播放器按需加载 `livephotoskit`，图片接近视口时才启动转换并控制并发，保留错误占位、退出页面取消/清理 blob URL 的行为。Safari 保持原生路径，普通图片不触发解码依赖。
- 首页 p5 是可见动画，路由拆分后仍属于首页成本。如测量显示首屏仍重，则在 `CinemaHero` 挂载后按空闲/可视时机动态加载 p5 并处理卸载竞态，保留现有视觉效果和 reduced-motion 可用性；不通过 `manualChunks` 伪造首屏改善。

## Files to modify

- `index.html`：入口改为 `/src/main.tsx`。
- `src/routes.jsx`：路由模块异步导入、加载反馈、移除无效上传页导入。
- `src/pages/Home.tsx`：清除已注释轮播相关的无用 import 和计算；不移除对应组件文件。
- `src/components/ui/GalleryItem.tsx`：按需加载 HEIF/播放器，邻近视口时解码、错误处理与资源释放。
- `src/components/ui/CinemaHero.tsx`：仅在测量后确认有收益时调整 p5 加载时机。
- `src/components/ui/LivePhotoPlayer.tsx`：仅在播放器异步加载所需时调整挂载/卸载逻辑。

## Reuse

- `src/routes.jsx` 的 React Router 现有路由配置和 `src/layout/MainLayout.tsx` 的 `Outlet`；利用 React Router 自带的 `lazy`，不新增路由依赖。页面当前导出形态不同（多数为命名导出，`Test` 为默认导出），懒加载映射时须分别处理。
- `src/pages/Gallery.tsx` 的 `LoadingFramework` 与 `PAGE_SIZE`、`src/components/ui/GalleryItem.tsx` 的 `isSafari`、占位图、`blobUrlRef` 和清理逻辑；不重写现有 Masonry。
- `src/components/ui/CinemaHero.tsx` 的 p5 sketch 和 `remove()` 清理逻辑；不新增动画库。

## Steps

- [x] 对照截图核实既有产物尺寸，追踪静态引入链及 HEIC 解码时机。
- [x] 先修正入口；重新运行构建，记录当前源码可复现的 JS 块尺寸与首页网络基线（和旧 `dist` 分开统计）。
- [x] 路由懒加载与删除死 import；测量首页与画廊下载的模块，确认首页不再加载画廊专用代码。
- [x] HEIC/实况播放器条件加载，限制可见区域转换和并发；验证 Safari、非 Safari、普通照片和失败路径。
- [x] 视首页实测瓶颈决定是否延后 p5；如画廊块仍超预算，再单独评估 antd Masonry 成本，不先行替换 UI 库。

## Verification

- 实施阶段运行 `npm run build`、`npm run lint`；记录 `dist/assets/*.js` 原始/gzip 大小、Vite 警告和浏览器首次访问实际请求/执行量。目标为首页首访所需 JS 显著低于旧单包约 1.05 MB gzip，并避免只把同一下载量挪到同步依赖块。
- 用生产预览禁用缓存检查 `/`、`/list`、`/detail/:id`、`/gallery`、`/test` 直达与跳转；首访首页不拉取 HEIF/LivePhotosKit/画廊 chunk，图库普通图不加载 HEIF，HEIC 可见时解码并能播放、打开/关闭弹层，Safari 仍正常；检查失败占位、分页、切页取消及 blob URL 释放。
- 记录首屏网络、主线程长任务和图库多张 HEIC 的滚动流畅度；保证无白屏或运行时错误。
