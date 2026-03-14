# AGENTS.md — Slidev 设计经验

## 项目结构

```
slides/
├── packages/
│   └── shared/              # Slidev addon：所有 slide 子包共享的配置和组件
│       ├── package.json       # name: "@acboxy/shared"
│       ├── global-bottom.vue  # 多边形发光背景
│       ├── style.css          # 全局自定义样式
│       ├── uno.config.ts      # UnoCSS 扩展配置
│       └── setup/
│           └── shiki.ts       # 代码高亮主题
├── slides/
│   └── YYYY-MM-DD/           # 每次演讲一个子包
│       ├── slides.md           # 幻灯片内容（唯一核心文件）
│       ├── public/             # 静态资源（图片等）
│       ├── package.json        # name + scripts + dependencies: { "@acboxy/shared": "workspace:*" }
│       └── .npmrc              # shamefully-hoist=true（Slidev 必需）
├── package.json               # 所有共享依赖在此（Slidev、UnoCSS、图标集等）
├── pnpm-workspace.yaml
└── AGENTS.md
```

### 共享机制：Slidev Addons + pnpm Workspace

`@acboxy/shared` 作为 **Slidev addon** 被每个 slide 子包引用。Slidev 的 addon 系统会自动从 addon 包根目录扫描约定文件（`global-bottom.vue`、`style.css`、`setup/*.ts`、`uno.config.ts`），无需软链接。

每个 slide 子包通过两步引用 shared：

1. `package.json` 中声明 workspace 依赖：`"@acboxy/shared": "workspace:*"`
2. `slides.md` frontmatter 中声明 addon：`addons: ['@acboxy/shared']`

### 新建 slide 子包

1. 创建 `slides/YYYY-MM-DD/` 目录
2. 创建 `package.json`：

```json
{
  "name": "@acboxy/slides-YYYY-MM-DD",
  "type": "module",
  "private": true,
  "scripts": {
    "build": "slidev build",
    "dev": "slidev --open",
    "export": "slidev export"
  },
  "dependencies": {
    "@acboxy/shared": "workspace:*"
  }
}
```

3. 创建 `.npmrc`：`shamefully-hoist=true` + `auto-install-peers=true`
4. 创建 `slides.md`（frontmatter 中包含 `addons: ['@acboxy/shared']`）和 `public/` 目录
5. 运行 `pnpm install`

## 背景设计

使用 `packages/shared/global-bottom.vue` 实现多边形模糊发光背景，基于 @pi0 @Atinux 的设计。

### 原理

- 使用 `seedrandom` 根据 seed + 页码生成稳定随机的多边形顶点
- 三层 `clip-path: polygon()` 叠加，不同方向的渐变（to-r / to-l / to-t）
- `filter: blur(70px) hue-rotate(Ndeg)` 产生模糊光晕效果
- 切换页面时多边形顶点平滑过渡（2.5s ease），产生流动感

### Frontmatter 控制

每页 slide 通过 frontmatter 独立控制背景效果：

```yaml
---
glowSeed: 233      # 随机种子，不同值产生不同多边形分布
glow: full          # 分布区域：full / top / bottom / left / right / center / top-left 等
glowOpacity: 0.4    # 发光不透明度（默认 0.4）
glowHue: 0          # 色相偏移度数（默认 0，可用于特定页面变色）
---
```

不同页面使用不同 `glowSeed` 值产生视觉变化。

### 品牌色

当前渐变色为蓝紫色系：`from-[#6366f1] to-[#8b5cf6]`。如需修改，编辑 `packages/shared/global-bottom.vue` 中的渐变类名。

### 纯黑背景

`style.css` 中 `.dark #slide-content { background-color: black !important; }` 确保深色模式下背景为纯黑，让发光效果更突出。

## 动画设计

### 页面转场

全局 frontmatter 中设置 `transition: fade-out`。`style.css` 定义了 fade-out 动画包含 `filter: blur(5px)`，使页面切换带有模糊淡出效果，而非生硬的滑动。

### v-click 隐藏效果

`style.css` 中覆盖了 Slidev 默认的 v-click 隐藏样式：

```css
.slidev-vclick-hidden {
  opacity: 0;
  pointer-events: none;
  filter: blur(3px);    /* 隐藏时带模糊，而非简单 opacity: 0 */
}
```

### $clicks 条件式动画（推荐）

比 `<v-click>` 更精细的动画控制，支持位移 + 透明度 + 缩放组合：

**从下方滑入：**

```html
<div v-click="1"
  :class="$clicks < 1 ? 'translate-y-8 op-0' : 'translate-y-0 op-100'"
  transition duration-500 ease-in-out>
  内容
</div>
```

**从左侧滑入：**

```html
<div v-click="1"
  :class="$clicks < 1 ? 'translate-x--10 op-0' : 'translate-x-0 op-100'"
  transition duration-500 ease-in-out>
  内容
</div>
```

**从右侧滑入：**

```html
<div v-click="1"
  :class="$clicks < 1 ? 'translate-x-10 op-0' : 'translate-x-0 op-100'"
  transition duration-500 ease-in-out>
  内容
</div>
```

**标题缩小上移（章节过渡页）：**

```html
<div absolute text-5xl font-bold
  :class="$clicks < 1 ? 'text-white scale-100' : 'translate-y--18 scale-40 text-white/30'"
  transition duration-500 ease-in-out>
  <span>标题文字</span>
</div>

<div flex flex-col items-center>
  <v-clicks>
    <div mt-4>展开内容</div>
  </v-clicks>
</div>
```

### 毛玻璃卡片

```html
<div border="2 solid blue-800/50" rounded-lg bg="blue-900/10" backdrop-blur-sm px-4 py-3>
  卡片内容
</div>
```

颜色变体：用不同色系替换 `blue`（如 `green`、`red`、`purple`、`amber`、`cyan`、`zinc`、`indigo`）。

### v-clicks 列表动画

对列表项逐个显示，使用 `<v-clicks>` 包裹：

```html
<v-clicks>
- 第一点
- 第二点
- 第三点
</v-clicks>
```

## 自我介绍页设计

使用 `layout: intro` 布局，左侧个人信息，右侧项目和组织。

```yaml
---
layout: intro
class: px-35
glowSeed: 205
---
```

### 布局结构

- **左侧**：GitHub 头像（圆形 + 边框）、名字、位置、社交链接
- **右侧上方**：开源项目卡片（毛玻璃样式 + 星标数）
- **右侧下方**：组织列表

### 动画节奏

三步 v-click 入场：
1. 头像和个人信息从左滑入
2. 开源项目从下滑入
3. 组织列表从下滑入

### 图标处理

社交链接图标使用 `public/` 目录下的 PNG 图片，通过 `<img>` 标签引用，避免 UnoCSS 图标解析在某些环境下的兼容性问题。

## 其他约定

### Frontmatter 必须配置项

每个 slide 子包的 `slides.md` 首页 frontmatter 应包含：

```yaml
---
layout: center
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
title: '演讲标题'
mdc: true
glowSeed: 233
duration: 20min
drawings:
  persist: false
addons:
  - '@acboxy/shared'
---
```

### UnoCSS 语法

优先使用 UnoCSS attributify 语法：

```html
<!-- 推荐 -->
<div flex flex-col items-center gap-4>

<!-- 不推荐 -->
<div class="flex flex-col items-center gap-4">
```

常用缩写：`op-80`（opacity）、`mt-6`（margin-top）、`abs-bl`（absolute bottom-left）。

### 演讲者注释

写在每页末尾的 `<!-- -->` 块中，Slidev 演讲者模式会显示：

```markdown
<!--
这里是演讲者注释，观众看不到。
点击说明用 [click] 标记。
-->
```

### 依赖管理

- 所有共享依赖在根 `package.json` 的 `devDependencies` 中
- slide 子包的 `package.json` 声明 `"@acboxy/shared": "workspace:*"` 作为依赖
- 每个子包必须有 `.npmrc`：`shamefully-hoist=true` + `auto-install-peers=true`
