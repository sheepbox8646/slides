---
highlighter: shiki
css: unocss
colorSchema: dark
transition: k-fade
title: 'Kibotos：我们如何构建一个低成本、高利用率的 Agent Infra'
lineNumbers: false
drawings:
  persist: false
mdc: true
duration: 30min
fonts:
  provider: none
layout: default
glow: r
section: Kibotos
---

<div absolute top-9 left-14>
  <img src="/brand/kibotos-lockup-dark.svg" alt="Kibotos" w-35 />
</div>

<div flex flex-col justify-center items-start h-full>
  <h1 class="reveal" text-left font-bold leading-tight style="font-size: 44px; letter-spacing: -0.02em;">
    我们如何构建一个<br/>低成本、高利用率的<br/>Agent Infra
  </h1>
</div>

<!--
大家好，我是 Acbox。今天分享 Kibotos：我们是怎么做一个低成本、高利用率的 Agent Infra 的。
-->

---
glow: tl
section: About
clicks: 2
---

<div class="grid grid-cols-[230px_1fr]" gap-10 h-full items-center>
  <div>
    <img src="https://github.com/sheepbox8646.png" w-20 h-20 rounded-2xl object-cover mb-6 />
    <div k-title text-4xl leading-tight>
      <span text-muted>Acbox</span><br/>小箱子.
    </div>
    <div mt-5 flex flex-col gap-1 text-sm text-muted>
      <span>Shanghai / Shenzhen</span>
      <span flex items-center gap-2 font-mono text-xs text-subtle mt-3><simple-icons-github text-sm text-muted />sheepbox8646</span>
      <span flex items-center gap-2 font-mono text-xs text-subtle><simple-icons-x text-sm text-muted />AcboxLiu</span>
    </div>
  </div>

  <div grid grid-cols-2 gap-3>
    <div v-click="1" k-card px-6 py-5 flex flex-col gap-2>
      <div flex items-center gap-3>
        <img src="/memoh-logo.svg" w-7 h-7 />
        <span text-base font-semibold>Memoh</span>
        <span ml-auto font-mono text-xs text-subtle>★ 2.8k</span>
      </div>
      <p text-sm leading-relaxed>开源多 Agent 平台。<br/>每个 Agent 都有自己的电脑。</p>
    </div>
    <div v-click="1" k-card px-6 py-5 flex flex-col gap-2 class="k-tint">
      <div flex items-center gap-3>
        <img src="/brand/kibotos-mark.svg" w-7 h-7 />
        <span text-base font-semibold>Kibotos</span>
        <span ml-auto font-mono text-xs text-primary>today</span>
      </div>
      <p text-sm leading-relaxed>Memoh 背后的<br/>Agent Infra。</p>
    </div>
    <div v-click="2" k-card px-6 py-5 col-span-2 flex items-center gap-8>
      <span k-kicker>组织</span>
      <div flex items-center gap-2 text-sm>
        <img src="https://github.com/felinics.png" w-6 h-6 rounded-md />
        <span>Felinic</span>
      </div>
      <div flex items-center gap-2 text-sm>
        <img src="https://avatars.githubusercontent.com/u/245437208?s=200&v=4" w-6 h-6 rounded-md />
        <span>HugeCatLab</span>
      </div>
    </div>
  </div>
</div>


<!--
先简单自我介绍。我是 Acbox，也叫小箱子。
[click] 现在主要在做 Memoh，以及它背后的 Agent Infra：Kibotos，也就是今天的主角。
[click] 团队是 Felinic。
-->

---
glow: bl
section: 01 · Agent Computer
---

<SectionCover no="1.0" top="Agent" bottom="Computer." />

---
glow: tr
section: 01 · Agent Computer
clicks: 4
---

<div text-center>
  <h1 k-title>每个 Agent 都需要一台电脑</h1>
  <p mt-2 text-base text-muted>这一年，越来越多的产品在做同一件事。</p>
</div>

<div mt-6 k-card grid grid-cols-3 overflow-hidden>
  <div v-for="(c, i) in [
      { logo: '/logos/manus.svg', name: 'Manus', desc: '给 Agent 一台常驻的云电脑。', facts: [['上线', '2026.04'], ['形态', 'Cloud Computer'], ['运行', '24 小时常驻']] },
      { logo: '/logos/grok.svg', name: 'Grok Bot', desc: '你合上电脑，它还在干活。', facts: [['上线', '2026.08'], ['形态', 'Always-on teammate'], ['价格', '订阅 $120–300/月']] },
      { icon: true, name: 'VPS + Claude Code', desc: '买一台 VPS，让 Agent 在上面写代码。', facts: [['上线', '一直都在'], ['形态', '自己租的 VPS'], ['运行', '24 小时常驻']] },
    ]"
    :key="c.name"
    v-click="i + 1"
    px-5 pt-5 pb-5 flex flex-col
    :class="i > 0 ? 'border-l border-white/[0.06]' : ''"
  >
    <div class="iso-stage rounded-[14px]" h-20 flex items-center justify-center>
      <img v-if="c.logo" :src="c.logo" w-9 h-9 />
      <simple-icons-claude v-else class="text-4xl text-[#d97757]" />
    </div>
    <div mt-4 text-base font-semibold>{{ c.name }}</div>
    <div mt-1 text-sm text-muted leading-normal>{{ c.desc }}</div>
    <div class="border-t border-white/[0.07]" mt-3 pt-3 flex flex-col gap-1.5>
      <div v-for="f in c.facts" :key="f[0]" class="grid grid-cols-[52px_1fr]" text-xs>
        <span text-subtle>{{ f[0] }}</span>
        <span font-mono class="text-[#e6e6e5]">{{ f[1] }}</span>
      </div>
    </div>
  </div>
</div>

<div v-click="4" mt-5 text-center text-xl font-semibold>
  Agent 不再借用你的电脑，它需要<span text-primary>自己的</span>电脑。
</div>

<!--
这一年里，越来越多的产品在做同一件事。
[click] Manus 推出了 Cloud Computer，给 Agent 一台常驻的云电脑。
[click] xAI 的 Grok Bot，每个 Bot 都是一个一直在线的同事，你合上电脑，它还在干活。
[click] 还有无数个小生意：买一台 VPS，在上面跑 Claude Code。
[click] 结论很简单：Agent 需要一台自己的电脑。
-->

---
glow: tr
section: 02 · Memoh
---

<SectionCover no="2.0" top="Memoh" bottom="的价格." />

<!--
先看一个我们自己的产品：Memoh。
-->

---
glow: tl
section: 02 · Memoh
clicks: 3
---

<div text-center>
  <h1 k-title>Memoh 的定价</h1>
  <div mt-2 text-base text-muted>每个套餐给的是一池算力，按需切给你的每一个 Bot。</div>
</div>

<div mt-8 grid grid-cols-3 gap-3>
  <div v-for="(p, i) in [
      { name: 'Go', price: 5, cpu: 8, ram: 16, disk: 40, members: '1 人 · Bot 不限', hi: true },
      { name: 'Pro', price: 60, cpu: 16, ram: 32, disk: 120, members: '3 人' },
      { name: 'Premium', price: 150, cpu: 32, ram: 64, disk: 300, members: '8 人' },
    ]" :key="p.name" v-click="i === 0 ? 1 : 2"
    k-card px-6 py-6 flex flex-col
    :class="p.hi ? 'k-tint' : ''"
  >
    <div flex items-center justify-between>
      <span text-base font-semibold>{{ p.name }}</span>
      <span v-if="p.hi" class="text-[11px]" font-semibold text-primary>RECOMMENDED</span>
    </div>
    <div mt-3 flex items-baseline gap-1>
      <span text-5xl font-bold tracking-tight>${{ p.price }}</span>
      <span text-sm text-muted>/ 月</span>
    </div>
    <div class="border-t border-white/[0.07]" mt-5 pt-4 flex flex-col gap-2 text-sm>
      <div flex justify-between><span text-subtle>CPU</span><span font-mono>{{ p.cpu }} 核</span></div>
      <div flex justify-between><span text-subtle>内存</span><span font-mono>{{ p.ram }} GB</span></div>
      <div flex justify-between><span text-subtle>持久卷</span><span font-mono>{{ p.disk }} GB</span></div>
      <div flex justify-between><span text-subtle>成员</span><span>{{ p.members }}</span></div>
    </div>
  </div>
</div>

<div v-click="3" mt-6 text-center text-lg>
  $5 = 8 核 16 GB，相当于 <span text-primary font-semibold>4 台 2C4G</span>，每台每月约 <span font-mono>$1.25</span>
</div>

<!--
这是 Memoh 的公开定价。
[click] 最便宜的 Go 套餐，5 美元一个月，给你 8 核 16G。
[click] Pro 和 Premium 依次翻倍。
[click] 换算一下：5 美元等于 4 台 2 核 4G 的电脑，每台每月一块多钱。
-->

---
glow: r
section: 02 · Memoh
clicks: 1
---

<div k-card grid class="grid-cols-[0.8fr_1.6fr]" gap-8 px-9 py-9 h-full>
  <div flex flex-col>
    <div text-base font-semibold>同样 4 台 2C4G，别家多少钱？</div>
    <div mt-1 text-sm text-muted leading-relaxed>每月费用，统一口径：<br/>2 vCPU / 4 GiB，10 GiB 持久盘。</div>
    <div mt-10 text-6xl font-bold tracking-tight>$5</div>
    <div mt-3 text-sm text-muted>Memoh Go，<span text-primary>不到最便宜常驻方案的十分之一</span>。</div>
    <div mt-auto text-xs text-subtle leading-relaxed>E2B 按需 = 每天用 2 小时、其余时间暂停。<br/>价格来自各家公开价格页，2026-11。</div>
  </div>
  <div flex items-center>
    <BarChart :row-height="52" label="4 台 2C4G 的月成本" :rows="[
      { name: 'Memoh Go', value: 5, label: '$5', highlight: true },
      { name: 'E2B · 按需', value: 40, label: '≈ $40' },
      { name: 'Hetzner · 常驻', value: 85, label: '≈ $85' },
      { name: 'AWS t3.medium', value: 121, label: '≈ $120' },
      { name: 'E2B · 常驻', value: 484, label: '≈ $480' },
    ]" />
  </div>
</div>

<div v-click="1" absolute left-0 right-0 class="bottom-[62px]" text-center text-xl font-semibold>
  $5 买 8 核 16G，我们凭什么？
</div>

<!--
同样是 4 台 2 核 4G，放在别家：E2B 每天只用 2 小时也要 40 美元，Hetzner 常驻 85，AWS 120，E2B 常驻要 480。
[click] 那我们凭什么卖 5 美元？
-->

---
glow: c
section: 02 · Memoh
clicks: 4
---

<div text-center>
  <h1 k-title>数千台云电脑，跑在个位数台机器上</h1>
  <div mt-2 text-base text-muted>Memoh 上线两个多月的线上数据</div>
</div>

<div mt-10 grid grid-cols-4 gap-3>
  <div v-for="(s, i) in [
      { v: '近 4000', u: '台', d: '存活的云电脑', n: '7 成以上处在冷暂停' },
      { v: '数千', u: '个', d: '服务的团队', n: '10 月新增是 9 月的近 3 倍' },
      { v: '近万', u: 'vCPU', d: '已经卖出去的算力', n: '另有 10 TB+ 内存' },
      { v: '个位数', u: '台', d: '承载它们的计算机器', n: '存储池单独部署' },
    ]" :key="s.d" v-click="i + 1" k-card px-5 py-6 flex flex-col
    :class="i === 3 ? 'k-tint' : ''"
  >
    <div flex items-baseline gap-1>
      <span text-4xl font-bold tracking-tight :class="i === 3 ? 'text-primary' : ''">{{ s.v }}</span>
      <span text-sm text-muted>{{ s.u }}</span>
    </div>
    <div mt-3 text-sm>{{ s.d }}</div>
    <div mt-1 text-xs text-subtle>{{ s.n }}</div>
  </div>
</div>

<!--
答案就藏在我们的线上数据里。
[click] 现在有将近 4000 台存活的云电脑，七成以上在冷暂停。
[click] 服务了数千个团队，10 月的新增是 9 月的将近三倍。
[click] 我们卖出去了将近一万个 vCPU、超过 10 TB 内存。
[click] 而承载它们的计算机器，只有个位数台。
-->

---
glow: tr
section: 02 · Memoh
clicks: 3
---

<div text-center>
  <h1 k-title>卖出去近万个核，真正在干活的不到一百个</h1>
</div>

<div mt-8 grid grid-cols-2 gap-3>
  <div k-card px-7 py-6>
    <div k-kicker>CPU</div>
    <BarChart :row-height="46" label="CPU 资源漏斗" :rows="[
      { name: '卖出去的', value: 9000, label: '近万 vCPU' },
      { name: '正在运行的', value: 3000, label: '约 3000' },
      { name: '真正在干活的', value: 70, label: '< 100', highlight: true },
    ]" />
  </div>
  <div k-card px-7 py-6>
    <div k-kicker>内存</div>
    <BarChart :row-height="46" label="内存资源漏斗" :rows="[
      { name: '卖出去的', value: 11, label: '> 10 TB' },
      { name: '正在运行的', value: 4, label: '约 4 TB' },
      { name: '宿主真实占用', value: 2.0, label: '约 2 TB', highlight: true },
    ]" />
  </div>
</div>

<div mt-6 grid grid-cols-3 gap-3>
  <div v-click="1" text-center><div text-3xl font-bold>&lt; 1%</div><div mt-1 text-xs text-muted>运行中电脑的 CPU 利用率中位数</div></div>
  <div v-click="2" text-center><div text-3xl font-bold text-primary>20 多倍</div><div mt-1 text-xs text-muted>卖出的 vCPU / 物理线程</div></div>
  <div v-click="3" text-center><div text-3xl font-bold>3 倍多</div><div mt-1 text-xs text-muted>卖出的内存 / 物理内存</div></div>
</div>

<!--
这是全场最重要的一页。我们卖出去将近一万个核，正在运行的大约三千个，真正在干活的不到一百个。内存也一样，卖出去十几 TB，宿主上真正占用的只有 2 TB 左右。
[click] 运行中的电脑，CPU 利用率的中位数不到 1%。
[click] 换算到物理机，卖出去的 vCPU 是物理线程数的 20 多倍。
[click] 内存是 3 倍多。用户买的是一台随时都在的电脑，真正消耗的远远小于分配量。
-->

---
glow: bl
section: 03 · Kibotos
---

<SectionCover no="3.0" top="This is" bottom="Kibotos." />

---
glow: r
section: 03 · Kibotos
clicks: 4
---

<div grid grid-cols-2 items-center h-full gap-6>
  <div>
    <img src="/brand/kibotos-lockup-dark.svg" alt="Kibotos" w-40 />
    <div mt-6 text-xl font-bold leading-snug>为 AI Agent 打造的 microVM 执行栈，<br/>跑在我们自己的裸金属上。</div>
    <div mt-7 flex flex-col gap-2>
      <div v-for="(k, i) in [
          ['隔离', 'microVM · Firecracker / 自研 KiboVM'],
          ['持久', '电脑不开着，文件也在'],
          ['唤醒', '闲置冷暂停，访问即拉起'],
        ]" :key="k[0]" v-click="i + 1" class="grid grid-cols-[56px_1fr]" text-sm>
        <span text-subtle>{{ k[0] }}</span><span font-mono class="text-[#e6e6e5]">{{ k[1] }}</span>
      </div>
    </div>
    <div v-click="4" mt-8 flex items-center gap-3 text-xs text-muted>
      <span font-mono>2026.07</span><span>E2B SaaS</span><span text-subtle>→</span>
      <span font-mono>2026.08</span><span>自建 E2B</span><span text-subtle>→</span>
      <span font-mono text-primary>2026.09</span><span text-white>Kibotos</span>
    </div>
  </div>
  <div h-100 flex>
    <HeroStack />
  </div>
</div>

<!--
这就是 Kibotos：一个为 AI Agent 打造的 microVM 执行栈，跑在我们自己的裸金属上。
[click] 每台电脑是一台 microVM，后端可以是 Firecracker，也可以是我们自研的 KiboVM。
[click] 电脑不开着的时候，文件也还在。
[click] 闲着就冷暂停，有人访问再拉起来。
[click] 我们 7 月用 E2B 的 SaaS，8 月自建了 E2B，9 月切到了 Kibotos。
【待补】为什么决定自己造，一句话的真实原因。
-->

---
glow: tl
section: 04 · 两派
---

<SectionCover no="4.0" top="两派" bottom="Agent 电脑." />

---
glow: tr
section: 04 · 两派
clicks: 2
---

<div text-center>
  <h1 k-title>给 Agent 一台电脑，市面上有两种做法</h1>
</div>

<div mt-10 grid grid-cols-2 gap-3>
  <div v-click="1" k-card px-8 py-7>
    <div flex items-center gap-3>
      <span inline-block w-3 h-3 rounded-sm style="background:#f6efe5" />
      <span text-xl font-bold>VPS 派</span>
    </div>
    <div mt-2 text-sm text-muted>一台 24 小时开着的服务器。</div>
    <div class="border-t border-white/[0.07]" mt-5 pt-4 flex flex-col gap-2 text-sm>
      <div class="grid grid-cols-[64px_1fr]"><span text-subtle>完整度</span><span>像一台真电脑：持久、root、常驻进程</span></div>
      <div class="grid grid-cols-[64px_1fr]"><span text-subtle>计费</span><span>按分配量，<span text-white font-semibold>闲着也付全价</span></span></div>
      <div class="grid grid-cols-[64px_1fr]"><span text-subtle>代表</span><span>Hetzner、DigitalOcean、Orgo、Manus</span></div>
    </div>
  </div>
  <div v-click="2" k-card px-8 py-7 class="k-tint">
    <div flex items-center gap-3>
      <span inline-block w-3 h-3 rounded-full bg-primary />
      <span text-xl font-bold>Sandbox 派</span>
    </div>
    <div mt-2 text-sm text-muted>文件持久，电脑不必一直开着。</div>
    <div class="border-t border-white/[0.07]" mt-5 pt-4 flex flex-col gap-2 text-sm>
      <div class="grid grid-cols-[64px_1fr]"><span text-subtle>完整度</span><span>会话有上限，休眠可能丢状态</span></div>
      <div class="grid grid-cols-[64px_1fr]"><span text-subtle>计费</span><span>按运行时间，<span text-white font-semibold>用多少付多少</span></span></div>
      <div class="grid grid-cols-[64px_1fr]"><span text-subtle>代表</span><span>E2B、Vercel、Cloudflare、Fly Sprites</span></div>
    </div>
  </div>
</div>

<!--
给 Agent 一台电脑，市面上基本分成两派。
[click] VPS 派：一台 24 小时开着的服务器，像一台真电脑，但闲着也要付全价。
[click] Sandbox 派：文件持久化，电脑不必一直开着，按运行时间付钱，但往往不够完整。
-->

---
glow: tl
section: 04 · 两派
clicks: 4
---

<div grid class="grid-cols-[0.9fr_1.3fr]" gap-8 h-full items-center>
  <div>
    <div k-kicker>VPS 派</div>
    <h1 k-title mt-3>一直开着，<br/>闲着也付全价</h1>
    <div mt-5 text-sm text-muted leading-relaxed>2C4G 一台，一个月二三十美元。<br/>而且 2026 年，它在涨价。</div>
    <div v-click="4" mt-6 flex flex-col gap-2 text-sm>
      <div flex gap-2><span text-primary>↑</span><span>Hetzner 今年涨了两次价</span></div>
      <div flex gap-2><span text-primary>↑</span><span>DDR5 内存一年涨了约 6 倍（OVH）</span></div>
    </div>
  </div>
  <div k-card overflow-hidden>
    <div v-for="(r, i) in [
        { logo: '/logos/landscape/si-hetzner.svg', name: 'Hetzner / DigitalOcean', note: '经典 VPS · 2C4G', price: '$21–24/月' },
        { logo: '/logos/landscape/fav-orgo.png', name: 'Orgo', note: '给 Agent 的常驻云电脑', price: '$29/月' },
        { logo: '/logos/manus.svg', name: 'Manus / Grok Bot', note: '常驻云电脑，绑在订阅里', price: '$120–300/月 订阅' },
        { logo: '/logos/landscape/si-alibabacloud.svg', name: '阿里云轻量', note: '便宜靠新用户促销', price: '¥199/年' },
      ]" :key="r.name" v-click="i < 3 ? i + 1 : 3"
      flex items-center gap-4 px-6 py-4
      :class="i > 0 ? 'border-t border-white/[0.06]' : ''"
    >
      <div class="iso-stage" rounded-lg w-10 h-10 flex items-center justify-center shrink-0>
        <img :src="r.logo" w-5 h-5 />
      </div>
      <div flex-1>
        <div text-sm font-semibold>{{ r.name }}</div>
        <div text-xs text-muted>{{ r.note }}</div>
      </div>
      <div font-mono text-sm class="text-[#e6e6e5]">{{ r.price }}</div>
    </div>
  </div>
</div>

<!--
先看 VPS 派。
[click] Hetzner、DigitalOcean 这样的经典 VPS，2 核 4G 一个月二十几美元。
[click] Orgo 这类给 Agent 做的常驻云电脑，29 美元。
[click] Manus、Grok Bot 把电脑绑在订阅里，阿里云轻量便宜是靠新用户促销。
[click] 而且 VPS 在涨价：Hetzner 今年涨了两次，DDR5 内存一年涨了大约 6 倍。
-->

---
glow: br
section: 04 · 两派
clicks: 3
---

<div grid class="grid-cols-[1fr_1.15fr]" gap-3 h-full>
  <div k-card px-8 py-7 flex flex-col class="k-tint">
    <div flex items-center gap-3>
      <img src="/logos/landscape/fav-e2b.png" w-8 h-8 rounded-md />
      <span text-xl font-bold>E2B</span>
      <span ml-auto k-kicker>经典</span>
    </div>
    <div mt-3 text-sm text-muted leading-relaxed>Firecracker microVM，按分配量计费，<br/>2C4G 运行时 $0.166 / 小时。</div>
    <div mt-auto grid grid-cols-2 gap-3>
      <div><div text-3xl font-bold>≈ $10</div><div text-xs text-muted mt-1>每天用 2 小时，其余暂停</div></div>
      <div><div text-3xl font-bold text-primary>≈ $121</div><div text-xs text-muted mt-1>一直开着</div></div>
    </div>
    <div mt-4 text-xs text-subtle>Pro 版单次会话最长 24 小时。</div>
  </div>
  <div k-card overflow-hidden flex flex-col>
    <div px-6 pt-5 k-kicker>新一代</div>
    <div v-for="(r, i) in [
        { logo: '/logos/landscape/si-vercel.svg', name: 'Vercel / Cloudflare', note: '只按活跃 CPU 计费，内存仍按分配量。Vercel 定价示例直接假设 CPU 利用率只有 10%。' },
        { logo: '/logos/landscape/fav-sprites.png', name: 'Fly Sprites', note: '持久磁盘，空闲约 30 秒自动休眠；10 月把 JuiceFS 换成了块设备。' },
        { logo: '/logos/landscape/fav-aws.png', name: 'AWS AgentCore', note: '单会话最长 8 小时；8 月又补上了能常驻 14 天的 Instances。' },
      ]" :key="r.name" v-click="i + 1"
      flex items-start gap-4 px-6 py-4
      :class="i > 0 ? 'border-t border-white/[0.06]' : ''"
    >
      <div class="iso-stage" rounded-lg w-10 h-10 flex items-center justify-center shrink-0>
        <img :src="r.logo" w-5 h-5 />
      </div>
      <div>
        <div text-sm font-semibold>{{ r.name }}</div>
        <div mt-1 text-xs text-muted leading-relaxed>{{ r.note }}</div>
      </div>
    </div>
  </div>
</div>

<!--
再看 Sandbox 派，经典代表是 E2B。按分配量计费，每天只用 2 小时、其余时间暂停，一个月 10 美元左右；一直开着就是 121 美元。
[click] 新一代里，Vercel 和 Cloudflare 改成只按活跃 CPU 计费。Vercel 在定价示例里直接假设 CPU 利用率只有 10%，理由是 Agent 大部分时间在等 LLM。
[click] Fly Sprites 给了持久磁盘，空闲 30 秒就自动休眠。
[click] AWS AgentCore 单会话最长 8 小时，8 月又补上了能常驻 14 天的实例。两派其实在互相靠拢。
-->

---
glow: tl
section: 04 · 两派
clicks: 2
---

<div text-center>
  <h1 k-title>怎么比？两把尺子</h1>
  <div mt-2 text-base text-muted>把所有厂商放到同一张图上之前，先统一口径。</div>
</div>

<div mt-8 grid grid-cols-2 gap-3>
  <div v-click="1" k-card px-8 py-7>
    <div flex items-baseline gap-3>
      <span font-mono text-xs text-primary>X</span>
      <span text-xl font-bold>月成本</span>
    </div>
    <div mt-2 text-sm text-muted>一台 2C4G 云电脑，一个月要付多少钱。</div>
    <div class="border-t border-white/[0.07]" mt-5 pt-4 flex flex-col gap-2 text-sm>
      <div class="grid grid-cols-[64px_1fr]"><span text-subtle>规格</span><span>2 vCPU / 4 GiB，10 GiB 持久盘</span></div>
      <div class="grid grid-cols-[64px_1fr]"><span text-subtle>用量</span><span>每天活跃 2 小时，活跃时 CPU 约 5%</span></div>
      <div class="grid grid-cols-[64px_1fr]"><span text-subtle>计费</span><span>按各家公开计费模型；能暂停就暂停，不能就按 24 小时算</span></div>
      <div class="grid grid-cols-[64px_1fr]"><span text-subtle>刻度</span><span>对数，从 $2 到 $200</span></div>
    </div>
  </div>
  <div v-click="2" k-card px-8 py-7 class="k-tint">
    <div flex items-baseline gap-3>
      <span font-mono text-xs text-primary>Y</span>
      <span text-xl font-bold>电脑完整度</span>
    </div>
    <div mt-2 text-sm text-muted>它有多像一台真电脑，0 到 10 分。</div>
    <div class="border-t border-white/[0.07]" mt-5 pt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm>
      <div flex gap-2><span font-mono text-primary>01</span><span>文件 / 内存持久</span></div>
      <div flex gap-2><span font-mono text-primary>02</span><span>没有会话时长上限</span></div>
      <div flex gap-2><span font-mono text-primary>03</span><span>GUI 桌面和浏览器</span></div>
      <div flex gap-2><span font-mono text-primary>04</span><span>完整网络</span></div>
      <div flex gap-2><span font-mono text-primary>05</span><span>root 与任意软件</span></div>
      <div flex gap-2><span font-mono text-primary>06</span><span>常驻后台进程</span></div>
    </div>
  </div>
</div>

<!--
在把所有厂商放到一张图上之前，先讲清楚两把尺子。
[click] 横轴是月成本：一台 2 核 4G、带 10G 持久盘的云电脑，每天活跃 2 小时，按各家自己的计费模型算；能暂停的就暂停，不能的就按 24 小时算。
[click] 纵轴是电脑完整度：它有多像一台真电脑。我们看六项：文件和内存能不能留住、有没有会话时长上限、有没有桌面和浏览器、网络是否完整、有没有 root、能不能常驻后台进程。
-->

---
glow: tr
section: 04 · 两派
clicks: 2
---

<div flex items-end justify-between>
  <h1 k-title style="font-size: 28px;">成本 × 电脑完整度</h1>
  <div flex items-center gap-4 text-xs text-muted pb-1>
    <span flex items-center gap-1.5><span inline-block w-3 h-3 rounded-full style="border: 2.5px solid #809aef" />Sandbox 派</span>
    <span flex items-center gap-1.5><span inline-block w-3 h-3 rounded-sm style="border: 2.5px solid #f6efe5" />VPS 派</span>
    <span flex items-center gap-1.5><span inline-block w-3 h-3 rotate-45 style="border: 2.5px solid #bbcdf1" />两派之间</span>
  </div>
</div>

<div mt-4 k-card px-4 pt-4 pb-2>
  <LandscapeChart :step="$clicks" />
</div>

<div v-click="1" />
<div v-click="2" />

<!--
把它们放到一张图上：横轴是一台 2 核 4G 云电脑的月成本，纵轴是它有多像一台真电脑。
先看经典的：E2B 和传统 VPS。
[click] 再放上新一代的 sandbox，两派在互相靠拢。
[click] 现在把口径换成 24 小时常驻：Sandbox 派整体往右跳，VPS 派原地不动。Sandbox 便宜的前提是，大部分时间不开机。
注：阿里云是新客促销价，EC2 的按需口径假设用户自己写脚本启停，图上用虚线框标出。部分单价只有第三方来源。
-->

---
glow: c
section: 04 · 两派
clicks: 1
---

<div h-full flex flex-col justify-center items-center text-center>
  <div k-title text-4xl leading-snug>
    一台<span text-primary>一直都在</span>的 microVM，<br/>成本比 Sandbox 还<span text-primary>低</span>。
  </div>
  <div v-click="1" mt-6 text-xl text-muted>我们是怎么做到的？</div>
</div>

---
glow: bl
section: 05 · 我们的做法
---

<SectionCover no="5.0" top="我们的" bottom="做法." note="四个观点" />

---
glow: tr
section: 05 · 我们的做法
clicks: 2
---

<div k-kicker>观点 0</div>
<h1 k-title mt-2>Agent 电脑的负载，和传统云不一样</h1>

<div mt-7 grid grid-cols-2 gap-3>
  <div k-card px-7 py-6>
    <div text-base font-semibold>传统云：为 24 小时在线的服务设计</div>
    <div class="border-t border-white/[0.07]" mt-4 pt-3 text-sm>
      <div class="grid grid-cols-[1.3fr_0.8fr_1fr]" text-xs text-subtle pb-2><span>SLA</span><span>单台</span><span>跨可用区</span></div>
      <div v-for="r in [['AWS EC2', '99.5%', '99.99%'], ['Google Compute', '99.9%', '99.99%'], ['Azure VM', '99.9%', '99.99%']]" :key="r[0]" class="grid grid-cols-[1.3fr_0.8fr_1fr]" py-1.5>
        <span>{{ r[0] }}</span><span font-mono>{{ r[1] }}</span><span font-mono class="text-[#e6e6e5]">{{ r[2] }}</span>
      </div>
    </div>
    <div mt-3 text-xs text-muted leading-relaxed>为了这几个 9：热迁移、块存储多副本、多可用区、冗余电力。成本都摊进单价。</div>
  </div>
  <div v-click="1" k-card px-7 py-6 class="k-tint">
    <div text-base font-semibold>Agent 电脑：用户来的时候在，就够了</div>
    <div mt-4 flex flex-col gap-3 text-sm>
      <div flex gap-3><span font-mono text-primary>01</span><span>不提供 24×7 服务，按当前负载动态调配，真正要用时再拉起</span></div>
      <div flex gap-3><span font-mono text-primary>02</span><span>单台挂了，重新拉起就行，访问即唤醒</span></div>
      <div flex gap-3><span font-mono text-primary>03</span><span>真正不能丢的，是用户的文件、代码和登录态</span></div>
    </div>
  </div>
</div>

<div v-click="2" mt-6 text-center text-2xl font-bold>
  我们用 <span text-primary>0.5%</span> 的可用性，换取只有别人 <span text-primary>1/3</span> 的成本优势。
</div>

<!--
先讲一个前提：Agent 电脑的负载和传统云不一样。
传统云为 24 小时在线的服务设计，所以对可用性要求很高。AWS 单台实例保证 99.5%，想要 99.99% 得自己跨可用区部署。为了这几个 9，云厂商要做热迁移、多副本、多可用区，这些成本都摊进了单价。
[click] 但 Agent 电脑真的需要这么高的可用性吗？它不提供 24×7 的服务，我们按当前负载动态调配，真正要用的用户再给他拉起来；单台挂了，重新拉起来就行；真正不能丢的是数据。
[click] 所以我们的取舍是：用 0.5% 的可用性，换取只有别人三分之一的成本。电脑可以随时重来，数据必须留住。后面三个观点都从这里推出来。
注：SLA 数字上台前到官方页面再核对一遍。
-->

---
glow: l
section: 05 · 我们的做法
clicks: 3
---

<div k-kicker>观点 1</div>
<h1 k-title mt-2>Agent sandbox 能做到比传统 VPS 高得多的利用率</h1>

<div mt-7 grid grid-cols-3 gap-3>
  <div k-card px-6 py-6>
    <div text-sm font-semibold>为什么利用率能更高</div>
    <div mt-3 text-sm text-muted leading-relaxed>Agent 大部分时间在等：等模型，等人。暂停的电脑只占磁盘，不占 CPU 和内存。</div>
    <div mt-4 font-mono text-xs class="text-[#e6e6e5]">CPU 利用率中位数 &lt; 1%</div>
  </div>
  <div v-click="1" k-card px-6 py-6>
    <div text-sm font-semibold>业界早就这么做</div>
    <div mt-3 text-sm text-muted leading-relaxed>Firecracker 论文（NSDI '20）：</div>
    <div mt-2 text-sm italic class="text-[#e6e6e5]">“tested oversubscription ratios of over 20x, and run in production with ratios as high as 10x.”</div>
  </div>
  <div v-click="2" k-card px-6 py-6 class="k-tint">
    <div text-sm font-semibold>我们怎么做</div>
    <div mt-3 flex flex-col gap-2 text-sm text-muted>
      <span>资源分配倍数由控制面统一管理，CPU、内存分开设，热调整</span>
      <span>单台 64 线程宿主，CPU 按 8 倍分配跑 <span text-white font-semibold>512 台 VM</span>，CPU steal 为 0</span>
    </div>
  </div>
</div>

<div v-click="3" mt-5 k-card px-7 py-5 flex items-center gap-6>
  <span k-kicker shrink-0>安全阀</span>
  <span text-sm>内存吃紧时，宁可杀掉一台 VM 让它重启，也不开 swap 拖慢整台宿主</span>
  <span text-subtle>·</span>
  <span text-sm>宿主可用内存低于 10%，拒绝在这台机器上新建</span>
</div>

<!--
观点一：Agent sandbox 能做到比传统 VPS 高得多的利用率。因为 Agent 大部分时间在等模型、等人，暂停的电脑只占磁盘。
[click] 这不是我们发明的，Firecracker 的论文里写着：资源按 20 倍以上分配测试过，生产环境跑到 10 倍。
[click] 我们的做法：资源分配倍数由控制面统一管理，CPU 和内存分开设、可以热调整。压测时一台 64 线程的宿主，CPU 按 8 倍分配跑 512 台 VM，CPU steal 是 0。
[click] 安全阀承接观点零：单台可以重来。内存吃紧时宁可杀掉一台，也不拖慢整台宿主；可用内存低于 10% 就不再往这台机器上放新电脑。
-->

---
glow: br
section: 05 · 我们的做法
clicks: 2
---

<div k-kicker>观点 2</div>
<h1 k-title mt-2>自建裸金属，摆脱云厂商</h1>

<div mt-7 grid grid-cols-2 gap-3>
  <div k-card px-7 py-6>
    <div text-sm font-semibold>核心路径，零托管依赖</div>
    <div mt-4 grid grid-cols-2 gap-2>
      <div v-for="d in [['数据库', '自管 PostgreSQL'], ['对象存储', 'S3 兼容 · Silo'], ['证书', '自签 PKI'], ['监控', 'VictoriaMetrics']]" :key="d[0]" class="iso-stage" rounded-xl px-4 py-3>
        <div text-xs text-subtle>{{ d[0] }}</div>
        <div mt-1 font-mono text-xs class="text-[#e6e6e5]">{{ d[1] }}</div>
      </div>
    </div>
    <div mt-4 text-xs text-muted leading-relaxed>网络：每台 VM 一个 IPv6 /128，TAP + 独立 netns 直接路由，不用 overlay。<br/>不配任何公有云凭证，主流程也必须能跑通。</div>
  </div>
  <div v-click="1" k-card px-7 py-6 flex flex-col>
    <div text-sm font-semibold>一台 2C4G 的月成本</div>
    <div mt-2 flex-1 flex items-center>
      <BarChart :row-height="44" label="一台 2C4G 的月成本" :rows="[
        { name: '裸金属 · CPU 4:1', value: 5.8, label: '≈ $6', highlight: true },
        { name: 'AWS t3.medium', value: 30, label: '$30' },
        { name: 'E2B · 常驻', value: 121, label: '$121' },
      ]" />
    </div>
    <div text-xs text-subtle>裸金属按 Hetzner AX102 公开报价（16 核 / 128 GB，€159/月）估算。</div>
  </div>
</div>

<div v-click="2" mt-5 text-center text-sm text-muted>
  诚实的一面：2026 年内存大涨价，裸金属的优势在缩小，<span text-white>所以把内存利用率做高成了核心能力。</span>
</div>

<!--
观点二：自建裸金属，摆脱云厂商。Kibotos 的核心路径不依赖任何托管云服务：自管数据库、S3 兼容存储、自签证书。网络上每台 VM 一个 IPv6 地址，直接路由，不用 overlay。
[click] 成本差距很直观：拿公开报价算，一台裸金属按 CPU 4 比 1 分配，切出来的 2C4G 每月 6 美元左右；AWS 30，E2B 常驻 121。我们自己的采购价不公开。
[click] 也要诚实：今年内存大涨价，裸金属的优势在缩小，所以把内存利用率做高成了核心能力。这就是观点三。
-->

---
glow: tl
section: 05 · 我们的做法
clicks: 3
---

<div k-kicker>观点 3</div>
<h1 k-title mt-2>在 KiboVM 和 Kibotos 里，我们为降成本做的事</h1>

<div mt-8 grid grid-cols-3 gap-3>
  <div v-for="(c, i) in [
      { t: '少开机', d: '只做冷启动，闲置就冷暂停；桌面按需启动。', k: 'P50 0.93 s 冷启动' },
      { t: '少占内存', d: '32 KiB 粒度空闲页上报；同一 Template 的只读页在宿主上共享。', k: '编译后 1.3 GiB → 0.2 GiB' },
      { t: '数据留住', d: '计算和存储分离；guest 里跑 ext4，块镜像放在存储池上。', k: 'fsync 6–10 ms → ~1 ms' },
    ]" :key="c.t" v-click="i + 1" k-card px-6 py-6 flex flex-col
  >
    <div font-mono text-xs text-primary>0{{ i + 1 }}</div>
    <div mt-3 text-lg font-bold>{{ c.t }}</div>
    <div mt-2 text-sm text-muted leading-relaxed flex-1>{{ c.d }}</div>
    <div class="border-t border-white/[0.07] text-[#e6e6e5]" mt-4 pt-3 font-mono text-xs>{{ c.k }}</div>
  </div>
</div>

<!--
观点三，在 KiboVM 和 Kibotos 里我们为降成本做的事，分三类，下一章展开。
[click] 少开机：只做冷启动，闲着就冷暂停，桌面按需才启动。
[click] 少占内存：更细粒度地把空闲内存还给宿主，相同模板的只读页在宿主上共享。
[click] 数据留住：计算和存储分离，guest 里跑 ext4，块镜像放在存储池上。
-->

---
glow: br
section: 06 · 实现细节
---

<SectionCover no="6.0" top="实现" bottom="细节." />

---
glow: tr
section: 06 · 实现细节
clicks: 2
---

<div k-card grid class="grid-cols-[0.9fr_1.1fr]" gap-8 px-9 py-8 h-full>
  <div flex flex-col>
    <div k-kicker>01 · 少开机</div>
    <div mt-3 text-2xl font-bold leading-snug>只做冷启动，<br/>不做快照，也不做预热池</div>
    <div mt-8 text-6xl font-bold tracking-tight>0.93 <span text-3xl>s</span></div>
    <div mt-2 text-sm text-muted>从创建到第一条命令返回，P50。<span font-mono>P99 0.97 s</span>。</div>
    <div mt-auto text-xs text-subtle>单台 64 线程裸金属，Firecracker，300 个样本。</div>
  </div>
  <div flex flex-col justify-center gap-3>
    <div v-click="1" class="iso-stage" rounded-2xl px-6 py-5>
      <div text-sm font-semibold>为什么不做快照？</div>
      <div mt-2 text-sm text-muted leading-relaxed>测量显示：慢在 VMM → guest init；密度先卡在 CPU 准入，创建速率先卡在数据库。复杂度该花在这些地方。</div>
    </div>
    <div v-click="2" class="iso-stage" rounded-2xl px-6 py-5>
      <div text-sm font-semibold>满载也不怎么变慢</div>
      <div mt-2 text-sm text-muted leading-relaxed>一台宿主跑到 512 台 VM，启动 P50 只慢了 <span text-white font-semibold>8%</span>。</div>
    </div>
  </div>
</div>

<!--
第一个细节：我们只做冷启动，不做快照，也不做预热池。从创建到第一条命令返回，P50 0.93 秒，P99 0.97 秒。
[click] 为什么不做快照？我们测过，慢在 VMM 到 guest init，密度先卡在 CPU 准入，创建速率先卡在数据库。复杂度应该花在这些地方。
[click] 而且满载时也不怎么变慢：一台宿主跑到 512 台 VM，启动 P50 只慢了 8%。
-->

---
glow: bl
section: 06 · 实现细节
clicks: 2
---

<div k-card grid class="grid-cols-[1fr_1fr]" gap-8 px-9 py-8 h-full>
  <div flex flex-col>
    <div k-kicker>02 · 少占内存</div>
    <div mt-3 text-2xl font-bold leading-snug>32 KiB 粒度的空闲页上报</div>
    <div mt-4 text-sm text-muted leading-relaxed>内核默认只上报 2 MiB 的整块空闲内存。跑完一次编译，空闲内存全是碎块，默认设置几乎收不回来。</div>
    <div v-click="1" mt-6 class="iso-stage" rounded-xl px-5 py-4 font-mono text-sm>
      <span text-subtle># guest kernel cmdline</span><br/>
      <span class="text-[#e6e6e5]">page_reporting.page_reporting_order=</span><span text-primary>3</span>
    </div>
    <div mt-auto text-xs text-subtle>编译耗时的差别在波动范围内。</div>
  </div>
  <div v-click="2" flex flex-col justify-center>
    <div text-sm font-semibold mb-2>编译后，宿主上的常驻内存</div>
    <BarChart :row-height="52" label="空闲页上报前后" :rows="[
      { name: '默认 2 MiB', value: 1.3, label: '≈ 1.3 GiB' },
      { name: '32 KiB 粒度', value: 0.19, label: '≈ 0.2 GiB', highlight: true },
    ]" />
    <div mt-6 text-sm font-semibold mb-2>桌面按需启动，VMM 常驻内存</div>
    <BarChart :row-height="52" label="桌面按需启动前后" :rows="[
      { name: '开机就起桌面', value: 1.4, label: '≈ 1.4 GiB' },
      { name: '用到才起', value: 0.2, label: '≈ 0.2 GiB', highlight: true },
    ]" />
  </div>
</div>

<!--
第二个细节：空闲页上报。内核默认只上报 2 MiB 的整块空闲内存，可跑完一次编译，空闲内存全是碎块，默认设置几乎收不回来。
[click] 我们只改了一个参数，把粒度降到 32 KiB。
[click] 编译之后，宿主上的常驻内存从 1.3 GiB 降到 0.2 GiB 左右。同样的思路，桌面也改成用到才启动，VMM 常驻从 1.4 GiB 降到 0.2 GiB。
-->

---
glow: r
section: 06 · 实现细节
clicks: 1
---

<div k-card grid class="grid-cols-[1fr_1fr]" gap-8 px-9 py-8 h-full>
  <div flex flex-col>
    <div flex items-center gap-3>
      <div k-kicker>02 · 少占内存</div>
      <span text-xs font-semibold text-primary px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 style="background: rgb(128 154 239 / 0.16)">路线图</span>
    </div>
    <div mt-3 text-2xl font-bold leading-snug>同一台宿主，共享只读 Template 的物理页</div>
    <div mt-4 text-sm text-muted leading-relaxed>Template 经 virtio-pmem 只读映射进 guest，以 DAX 挂成 overlay 下层。同一个 Template 的所有 VM，在宿主上只占一份内存。</div>
    <div mt-4 text-sm text-muted leading-relaxed>我们评估过计时侧信道，并决定接受。</div>
  </div>
  <div flex flex-col justify-center gap-6>
    <div><div text-5xl font-bold>≈ 30%</div><div mt-2 text-sm text-muted>10 台 VM 的测试中，宿主内存的节省</div></div>
    <div v-click="1"><div text-5xl font-bold text-primary>26–35%</div><div mt-2 text-sm text-muted>按线上规模推算，还能再省下的宿主内存</div></div>
  </div>
</div>

<!--
这一项还在路上。我们让同一个 Template 的所有 VM 在宿主上共享一份只读物理页：virtio-pmem 加 DAX。我们评估过计时侧信道，决定接受。
10 台 VM 的测试里省了大约 30% 的宿主内存。
[click] 按线上规模推算，还能再省 26% 到 35%。
-->

---
glow: tl
section: 06 · 实现细节
clicks: 2
---

<div k-card grid class="grid-cols-[1fr_1.05fr]" gap-8 px-9 py-8 h-full>
  <div flex flex-col>
    <div k-kicker>03 · 数据留住</div>
    <div mt-3 text-2xl font-bold leading-snug>guest 里跑 ext4，<br/>块镜像放在存储池上</div>
    <div mt-4 text-sm text-muted leading-relaxed>不让 guest 直接挂网络文件系统：元数据由 guest 内的 ext4 处理，guest 的 fsync 被宿主页缓存吸收。</div>
    <div v-click="1" mt-6 grid grid-cols-2 gap-3>
      <div><div text-3xl font-bold>6–10 → <span text-primary>~1</span></div><div text-xs text-muted mt-1>fsync 延迟（ms）</div></div>
      <div><div text-3xl font-bold>502 → <span text-primary>2</span></div><div text-xs text-muted mt-1>同样写入的远端 COMMIT 次数</div></div>
    </div>
    <div mt-auto text-xs text-subtle leading-relaxed>Replit、E2B、Fly Sprites 也都走了“块设备 + guest 内本地文件系统”这条路。</div>
  </div>
  <div v-click="2" flex flex-col justify-center gap-3>
    <div class="iso-stage" rounded-2xl px-6 py-5>
      <div text-sm font-semibold>单写者，不靠文件锁</div>
      <div mt-2 text-sm text-muted leading-relaxed>控制面授予使用权并带纪元号，旧持有者 5 秒内自检让位。</div>
    </div>
    <div class="iso-stage" rounded-2xl px-6 py-5>
      <div text-sm font-semibold>宿主断电，换一台起来</div>
      <div mt-2 text-sm text-muted leading-relaxed>VM 在另一台计算机器上起来用了 <span text-white font-semibold>18 秒</span>，<span font-mono>/data</span> 完整。</div>
    </div>
    <div text-xs text-subtle px-1>代价：宿主掉电可能丢最近几秒未落盘的写入，这是有意的取舍。</div>
  </div>
</div>

<!--
第三类，数据留住。我们不让 guest 直接挂网络文件系统，而是 guest 里跑 ext4，块镜像放在存储池上。
[click] 这样 fsync 从 6 到 10 毫秒降到 1 毫秒左右，同样的写入，远端提交次数从 502 次降到 2 次。
[click] 单写者靠控制面授予的使用权和纪元号，不依赖文件锁。宿主断电时，VM 在另一台机器上 18 秒起来，数据完整。代价是宿主掉电可能丢最近几秒的写入，这是有意的取舍。
注：数据测于开发环境，网络往返约 2 ms。存储池导出方式待确认。
-->

---
glow: br
section: 06 · 实现细节
clicks: 3
---

<div grid class="grid-cols-[1fr_1fr]" gap-3 h-full>
  <div k-card px-8 py-7 flex flex-col>
    <div k-kicker>KiboVM</div>
    <div mt-3 text-2xl font-bold leading-snug>从零写的 Rust VMM</div>
    <div mt-5 grid grid-cols-2 gap-3>
      <div><div text-3xl font-bold>~16 万</div><div text-xs text-muted mt-1>行 Rust</div></div>
      <div><div text-3xl font-bold>4</div><div text-xs text-muted mt-1>个后端：KVM / HVF / WHP / 软件模拟</div></div>
    </div>
    <div mt-5 text-sm text-muted leading-relaxed>内核、固件、init 打包成一个二进制，Linux、macOS、Windows 上都能跑。</div>
  </div>
  <div k-card px-8 py-7 flex flex-col gap-3>
    <div text-sm font-semibold>为高利用率而设计的默认值</div>
    <div v-for="(r, i) in [
        ['宿主 4 KiB 页', '不开 THP，方便回收'],
        ['guest 内 zram', 'guest 自己的内存弹性'],
        ['可写盘 O_DIRECT', '宿主和 guest 不各缓存一份'],
        ['完整的 virtio-balloon', '空闲页上报 + 提示 + 统计'],
        ['cowblk 写时复制卷', 'fork 直接读祖先，不拷数据'],
      ]" :key="r[0]" v-click="i < 4 ? 1 : 2" class="grid grid-cols-[150px_1fr]" text-sm>
      <span font-mono class="text-[#e6e6e5]">{{ r[0] }}</span><span text-muted>{{ r[1] }}</span>
    </div>
    <div v-click="3" mt-auto flex items-center gap-2 text-sm>
      <span text-xs font-semibold text-primary px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 style="background: rgb(128 154 239 / 0.16)">路线图</span>
      <span text-muted>快照按需加载内存、跳过零页，KiboVM 已具备，Kibotos 接入是下一步。</span>
    </div>
  </div>
</div>

<!--
KiboVM 是我们从零写的 Rust VMM，大约 16 万行，支持 4 个后端，内核和固件打包成一个二进制。
[click] 它的很多默认值是为高利用率设计的：宿主用 4K 页、guest 内开 zram、可写盘 O_DIRECT、完整的 virtio-balloon。
[click] 还有自研的写时复制卷，fork 时直接读祖先数据。
[click] 快照按需加载内存这些能力 KiboVM 已经有了，接进 Kibotos 是下一步。
-->

---
glow: c
section: 06 · 实现细节
clicks: 2
---

<div text-center>
  <h1 k-title>踩过的坑</h1>
</div>

<div mt-10 grid grid-cols-2 gap-3>
  <div v-click="1" k-card px-8 py-7>
    <div font-mono text-sm text-primary>LimitMEMLOCK=8M</div>
    <div mt-3 text-xl font-bold leading-snug>一台宿主，只能起二十几台 VM</div>
    <div mt-3 text-sm text-muted leading-relaxed>io_uring 的 ring 内存要锁定，而 systemd 默认的 MEMLOCK 只有 8 MiB。改成 infinity 之后才恢复正常。</div>
  </div>
  <div v-click="2" k-card px-8 py-7>
    <div font-mono text-sm text-primary>node restart</div>
    <div mt-3 text-xl font-bold leading-snug>接管 120 台 VM，从 35 s 到 4–5 s</div>
    <div mt-3 text-sm text-muted leading-relaxed>node 重启时数据面连接不断，客户端恢复时间从 35 秒优化到 4 到 5 秒。</div>
  </div>
</div>

<!--
最后讲两个坑。
[click] 第一个：一台宿主只能起二十几台 VM。原因是 io_uring 需要锁定内存，而 systemd 默认的 MEMLOCK 只有 8 MiB。
[click] 第二个：node 重启后接管 120 台 VM，客户端恢复从 35 秒优化到 4 到 5 秒。
-->

---
glow: tr
section: 07 · 东京
---

<SectionCover no="7.0" top="在东京" bottom="自建集群." />

---
glow: bl
section: 07 · 东京
clicks: 3
---

<div grid class="grid-cols-[0.85fr_1.15fr]" gap-6 h-full items-center>
  <div>
    <div k-kicker>集群长什么样</div>
    <h1 k-title mt-3>计算和存储，<br/>分开部署</h1>
    <div mt-6 flex flex-col gap-3 text-sm>
      <div v-click="1" class="grid grid-cols-[72px_1fr]"><span text-subtle>计算机器</span><span>每台约 64 线程、512 GB 内存，只有一块系统盘，<span text-white>只跑 VM，不存数据</span></span></div>
      <div v-click="2" class="grid grid-cols-[72px_1fr]"><span text-subtle>存储池</span><span>独立的存储机，每台 4×8 TB 机械盘 + SSD，放所有可写层和 /data 卷</span></div>
      <div v-click="3" class="grid grid-cols-[72px_1fr]"><span text-subtle>好处</span><span>计算机器挂了，数据还在；内存不够加计算，盘不够加存储</span></div>
    </div>
  </div>
  <div h-90 flex>
    <ClusterFigure :compute="6" />
  </div>
</div>

<!--
这是我们在东京的集群。
[click] 计算机器每台大约 64 线程、512 GB 内存，只有一块系统盘，只跑 VM，不存用户数据。
[click] 存储池是独立的机器，放所有电脑的可写层和数据卷。
[click] 好处是计算机器挂了数据还在，VM 换一台就能起来；计算和存储也能各自扩容。
-->

---
glow: r
section: 07 · 东京
clicks: 3
---

<div grid class="grid-cols-[0.85fr_1.15fr]" gap-6 h-full items-center>
  <div>
    <div k-kicker>扩容</div>
    <h1 k-title mt-3>从个位数台，<br/>到 16 台计算机器</h1>
    <div mt-6 flex flex-col gap-4>
      <div v-click="1" flex gap-4>
        <span font-mono text-xs text-subtle pt-1 w-12 shrink-0>现在</span>
        <span text-sm>个位数台计算机器 + 一组存储机，承载近 4000 台云电脑</span>
      </div>
      <div v-click="2" flex gap-4>
        <span font-mono text-xs text-primary pt-1 w-12 shrink-0>下一步</span>
        <span text-sm>新一批机器在东京上架：再加 10 台计算机器、3 台存储机，存储裸容量近 100 TB</span>
      </div>
    </div>
    <div v-click="3" mt-8 text-lg font-semibold leading-snug>我们的扩容不是在控制台点一下，<br/><span text-primary>而是把机器搬进机房。</span></div>
  </div>
  <div h-90 flex>
    <ClusterFigure :compute="$clicks >= 2 ? 16 : 6" />
  </div>
</div>

<!--
[click] 现在是个位数台计算机器加一组存储机，承载了将近 4000 台云电脑。
[click] 新一批机器马上在东京上架：再加 10 台计算机器、3 台存储机，计算机器到 16 台，存储接近 100 TB。
[click] 我们的扩容不是在控制台点一下，而是把机器搬进机房。
-->

---
glow: tl
section: 07 · 东京
---

<div text-center>
  <h1 k-title>上架的那些事</h1>
  <div mt-2 text-base text-muted>【待补：讲者亲历】</div>
</div>

<div mt-10 grid grid-cols-3 gap-3>
  <div v-for="q in ['为什么选东京', '机器怎么来的，多久回本', '上架和网络踩过的坑', '哪一刻觉得“还好没上云”', '几个人在运维']" :key="q" k-card px-6 py-5 text-sm text-muted>
    {{ q }}
  </div>
</div>

<!--
【待补】这一页是占位：讲者按亲历补故事，每条一两句即可。
-->

---
glow: br
section: 08 · 战绩
---

<SectionCover no="8.0" top="一些" bottom="战绩." />

---
glow: c
section: 08 · 战绩
clicks: 6
---

<div grid grid-cols-3 gap-3 h-full>
  <div v-for="(s, i) in [
      { v: '上千台', d: '同时在线的云电脑', n: '跑在个位数台计算机器上' },
      { v: '100–200', d: '单台计算机器同时跑的 VM', n: '每台约 64 线程、512 GB' },
      { v: '< 1%', d: '运行中电脑的 CPU 利用率中位数', n: '物理 CPU 只忙了不到两成' },
      { v: '20 多倍', d: '卖出的 vCPU / 物理线程', n: '运行中也有 7 倍多', hi: true },
      { v: '3 倍多', d: '卖出的内存 / 物理内存', n: '实际只占物理内存三分之二', hi: true },
      { v: '近 6000', d: '两个多月累计创建的云电脑', n: '服务数千个团队' },
    ]" :key="s.d" v-click="i + 1" k-card px-6 py-6 flex flex-col
    :class="s.hi ? 'k-tint' : ''"
  >
    <div text-4xl font-bold tracking-tight :class="s.hi ? 'text-primary' : ''">{{ s.v }}</div>
    <div mt-3 text-sm>{{ s.d }}</div>
    <div mt-auto pt-2 text-xs text-subtle>{{ s.n }}</div>
  </div>
</div>

<!--
最后用几组线上数字收尾。
[click] 同时在线上千台云电脑，跑在个位数台计算机器上。
[click] 单台机器同时跑 100 到 200 台 VM。
[click] 运行中的电脑 CPU 利用率中位数不到 1%，物理 CPU 只忙了不到两成。
[click] 卖出的 vCPU 是物理线程的 20 多倍。
[click] 卖出的内存是物理内存的 3 倍多，实际只占了三分之二。内存才是真正的瓶颈。
[click] 两个多月，累计创建将近 6000 台云电脑。
【待补】每台云电脑的真实月成本、可用性记录。
-->

---
glow: c
section: Kibotos
clicks: 1
---

<div h-full flex flex-col justify-center items-center text-center>
  <img src="/brand/kibotos-lockup-dark.svg" alt="Kibotos" w-44 class="reveal" />
  <div mt-10 grid class="reveal [&>*]:[grid-area:1/1]" style="animation-delay: 120ms">
    <div k-title text-5xl leading-snug transition duration-500 :class="$clicks >= 1 ? 'op-0 -translate-y-3' : ''">
      给你的 Agent 一个应许之地
    </div>
    <div k-title text-4xl leading-snug self-center transition duration-500 :class="$clicks >= 1 ? '' : 'op-0 translate-y-3'">
      Early Access at <span text-primary>December, 2026</span>
    </div>
  </div>
</div>

<!--
给你的 Agent 一个应许之地。
[click] Kibotos 将在 2026 年 12 月开放 Early Access。谢谢大家。
-->

---
glow: c
section: Kibotos
clicks: 0
---

<div h-full flex flex-col justify-center items-center>
  <div grid grid-cols-2 gap-6>
    <div k-card px-9 pt-8 pb-7 flex flex-col items-center class="reveal">
      <div bg-white rounded-2xl p-3>
        <img src="/qr/founder.svg" alt="Contact Founder 二维码（占位）" w-48 h-48 block />
      </div>
      <div mt-6 flex items-center gap-2 text-lg font-semibold>
        <simple-icons-wechat class="text-[#07c160]" text-xl />
        Contact Founder
      </div>
    </div>
    <div k-card px-9 pt-8 pb-7 flex flex-col items-center class="reveal k-tint" style="animation-delay: 120ms">
      <div bg-white rounded-2xl p-3>
        <img src="/qr/group.svg" alt="加入预热群 二维码（占位）" w-48 h-48 block />
      </div>
      <div mt-6 flex items-center gap-2 text-lg font-semibold>
        <simple-icons-telegram class="text-[#26a5e4]" text-xl />
        加入预热群
      </div>
    </div>
  </div>
</div>

<!--
想聊合作可以加我微信，想第一时间拿到 Early Access 可以进预热群。
【待补】两个二维码目前是占位，指向 example.com，上台前替换 public/qr/founder.svg 和 public/qr/group.svg。
-->
