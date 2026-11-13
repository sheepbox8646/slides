# slides

一些公开present的slide

*❤️ Made with [Slidev](https://sli.dev/)*

## 部署到 Cloudflare

所有 slide 部署成一个站点，每个 slide 在 `/<目录名>/` 下访问，例如 `/2026-11-15/`；根路径 `/` 是 slide 列表。

在 Cloudflare 控制台选 **Workers & Pages → Create → Import a repository**，选择本仓库，然后：

| 设置 | 值 |
|---|---|
| Build command | 留空 |
| Deploy command | `pnpm run deploy`（先构建全部 slide，再 `wrangler deploy`） |
| Root directory | `/`（仓库根目录） |

配置在根目录的 `wrangler.jsonc`：

- `scripts/build.mjs` 把 `slides/` 下每个目录用 `--base /<目录名>/` 构建到 `dist/<目录名>/`，并生成首页列表。
- 静态文件优先返回；找不到时 `worker.js` 把 `/<目录名>/9` 这类深链接回退到该 slide 的 `index.html`。

本地预览：`pnpm run preview`（构建后用 `wrangler dev` 模拟线上环境）。

写 slide 时注意：模板里用变量绑定的图片路径（`:src="..."`）不会自动加上 `/<目录名>/` 前缀，要写成 `:src="$asset(path)"`，或像静态 `src="/..."` 那样写死。
