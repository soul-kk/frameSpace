# 项目约定

- React 19 + Vite 7，源码在 `src/`；`src/routes.jsx` 定义懒加载路由，页面放在 `src/pages/`。
- 电影数据和摄影文件来自 Supabase：客户端在 `src/services/supabase.js`，查询在 `src/services/api.js`。本地需配置 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`；不要提交 `.env` 或密钥。
- 修改图库时保留 HEIC/实况照片的按需加载、解码队列和资源清理，避免将图库依赖重新引入首页首屏。
- 验证：`npm run lint`、`npm run build`。项目暂无测试脚本。
