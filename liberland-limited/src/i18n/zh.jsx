// Simplified Chinese copy, translated from en.jsx. The registered company name, the
// registered office and the organisers' event names stay in English, as registered or
// published, so readers can match them against the registry and the organiser's site.
const { COMPANY: C_ZH, MAIL: M_ZH, LINKS: L_ZH } = window.LL_DATA;
const REGISTRY_ZH = "https://www.cr.gov.hk/sc/electronic/e-servicesportal/e-search.htm";
const OFFICE_ZH = "（香港干诺道中111号永安中心16楼1601室）";

window.LL_I18N = window.LL_I18N || {};
window.LL_I18N.zh = {
  lang: "zh-Hans",
  registry: REGISTRY_ZH,

  // "2026年11月21日至22日"
  formatRange(start, end) {
    const [y1, m1, d1] = start.split("-").map(Number);
    const [y2, m2, d2] = end.split("-").map(Number);
    if (y1 === y2 && m1 === m2) return `${y1}年${m1}月${d1}日至${d2}日`;
    if (y1 === y2) return `${y1}年${m1}月${d1}日至${m2}月${d2}日`;
    return `${y1}年${m1}月${d1}日至${y2}年${m2}月${d2}日`;
  },

  nav: {
    links: [
      { href: "#about", label: "关于" },
      { href: "#membership", label: "会员" },
      { href: "#events", label: "探访与活动" },
      { href: "#company", label: "公司与联系" },
      { href: "#faq", label: "常见问题" },
    ],
    cta: "了解会员资格",
    sub: `香港 · 商业登记号码 ${C_ZH.brn}`,
    menu: "菜单",
    theme: "切换浅色或深色模式",
    skip: "跳至正文",
  },

  hero: {
    eyebrow: "现实中的利伯兰社区",
    title: [
      { text: "结识社区成员。" },
      { text: "探访多瑙河。" },
      { text: "了解会员资格。", em: true },
    ],
    lede: "利伯兰是一个由人、项目与聚会共同付诸实践的理念。在这里了解与社区建立联系的实际途径，发现值得探访的地方，并通过 Liberland Limited 了解会员资格。",
    primary: "了解会员资格",
    secondary: "探访多瑙河",
    meta: [
      { label: "运营方", value: "Liberland Limited（香港）" },
      { label: "访客据点", value: "Ark Village，塞尔维亚阿帕廷" },
      { label: "咨询", value: C_ZH.email },
    ],
    card: {
      label: "本网站运营方",
      rows: [
        ["注册名称", C_ZH.name],
        ["司法管辖区", "香港"],
        ["商业登记号码", C_ZH.brn],
      ],
      verify: "核实我们的公司注册信息",
    },
  },

  marquee: ["会员咨询", "多瑙河畔的社区活动", "塞尔维亚阿帕廷访客信息", "香港注册公司", `商业登记号码 ${C_ZH.brn}`],

  about: {
    label: "01 — 我们做什么",
    title: ["与利伯兰的", { em: "现实联系。" }],
    intro: "无论您是初次了解利伯兰，还是多年来一直关注这个社区，都有切实可行的参与方式。您可以从一次交流开始，了解本地区的活动，或计划一次探访。",
    cards: [
      {
        label: "01 · 会员",
        title: "了解会员资格",
        text: "了解与利伯兰社区相关的私人会员资格如何运作。在做出决定之前，请先咨询当前的安排、参与方式及适用条款。",
        button: "会员信息",
        href: "#membership",
        provider: "由 Liberland Limited 提供",
      },
      {
        label: "02 · 社区活动",
        title: "线下相聚",
        text: "了解多瑙河地区公开宣布的聚会、静修活动和社区体验。活动详情和预订由各活动组织方提供。",
        button: "浏览活动",
        href: "#events",
        provider: "由各活动组织方组织并负责预订",
      },
      {
        label: "03 · 探访本地区",
        title: "探索 Ark Village",
        text: "位于塞尔维亚阿帕廷的 Ark Village 是探索多瑙河地区、结识与利伯兰相关人士的便利据点。住宿和体验活动直接通过 Ark Village 安排。",
        button: "了解 Ark Village",
        href: L_ZH.arkExperience,
        provider: "由 Ark Village 运营",
      },
      {
        label: "04 · 利伯兰官方身份",
        title: "电子居民身份与公民身份",
        text: "您要申请的是利伯兰电子居民身份或公民身份，而非私人社区会员资格吗？相关申请及官方身份信息均通过利伯兰官方网站办理。",
        button: "官方申请",
        href: L_ZH.application,
        provider: "由 liberland.org 办理——并非 Liberland Limited 的服务",
        external: true,
      },
    ],
  },

  membership: {
    label: "02 — 会员",
    title: ["会员资格，", { em: "从一次清晰的沟通开始。" }],
    intro: [
      "Liberland Limited 为有意了解与利伯兰社区相关的私人会员资格的人士提供联系渠道。",
      "会员安排可能包括不同形式的参与。在接受任何付费会员资格之前，您应当收到一份书面说明，列明所提供的服务、相关费用、会员期限以及适用的合同条款。",
    ],
    stepsLabel: "会员咨询流程",
    steps: [
      { n: "01", title: "与我们联系", text: "简单介绍您自己、您的兴趣，以及您希望如何参与社区。" },
      { n: "02", title: "了解相关安排", text: "我们会说明目前可提供的会员选项，并在您做出承诺之前提供相关条款。" },
      { n: "03", title: "做出知情决定", text: "咨询不会产生会员资格或付款义务。只有在您接受适用协议后，会员资格才开始生效。" },
    ],
    cta: "咨询会员事宜",
    ctaHint: ["将打开您的电子邮件应用，收件人为 ", { href: M_ZH.membership, text: C_ZH.email }, "。"],
    clarification: [
      "通过 Liberland Limited 安排的私人会员资格，与",
      { href: L_ZH.liberlandFaq, text: "利伯兰电子居民身份及公民身份", external: true },
      "相互独立。会员资格本身并不提供护照、移民身份、政治权利、财产所有权或进入任何领土的权利。",
    ],
  },

  events: {
    label: "03 — 活动",
    title: ["相聚", { em: "多瑙河畔。" }],
    intro: "活动和聚会是结识对利伯兰感兴趣人士的实用方式。以下是本地区已公开宣布的活动。请务必向活动组织方确认日期、名额及预订条件。组织方网站为英文页面。",
    organiser: "由 Ark Village 组织",
    details: "活动详情",
    whenLabel: "日期",
    whereLabel: "地点",
    items: {
      longevity: {
        title: "Longevity Ark Retreat（长寿主题静修周末）",
        where: "塞尔维亚阿帕廷 Ark Village",
        text: "一个探索健康、长寿、运动、恢复与自然的周末，汇聚乐于学习、共享体验的访客。",
      },
      winterAlchemy: {
        title: "Winter Alchemy Retreat（冬季静修周末）",
        where: "塞尔维亚阿帕廷 Ark Village",
        text: "一场以地方饮食传统、户外烹饪、自然以及多瑙河畔共同活动为主题的冬季聚会。",
      },
    },
    none: "目前此处没有即将举行的活动。组织方的日历始终显示最新安排。",
    calendarText: "想了解更多活动？请浏览组织方的最新日历。活动安排、价格和名额可能会有变动。",
    calendarButton: "Ark Village 完整活动日历",
  },

  visit: {
    label: "04 — 探访",
    title: ["探访", { em: "多瑙河地区。" }],
    intro: "Ark Village 位于塞尔维亚阿帕廷，靠近多瑙河，为有意探访利伯兰相关地区的人士提供住宿、活动和体验。",
    locationLabel: "地点",
    location: ["Ark Village", "Mirni Dunav 3", "Apatin, Serbia（塞尔维亚阿帕廷）"],
    map: "在 OpenStreetMap 上查看",
    cards: [
      {
        title: "规划一次体验",
        text: "通过 Ark Village 的专属体验页面，了解探访方案、当地活动和住宿选择。",
        button: "浏览体验项目",
        href: L_ZH.arkExperience,
      },
      {
        title: "联系 Ark Village",
        text: "直接向当地运营方咨询住宿、名额、团体预订及访客安排。",
        button: "联系 Ark Village",
        href: L_ZH.arkContact,
      },
    ],
    operator: "由 Ark Village 运营",
    noteLabel: "Ark Village 的位置",
    note: "Ark Village 位于塞尔维亚境内，与利伯兰所主张的领土并不相同。预订住宿或购买会员资格，均不提供跨越边境或进入该领土的任何特殊权利。访客须自行遵守适用的旅行和入境要求。",
  },

  company: {
    label: "05 — 公司",
    title: ["一家注册公司。", { em: "一个现实中的社区。" }],
    text: [
      "Liberland Limited 是一家在香港注册的公司。本网站介绍私人社区会员资格，以及在现实中与利伯兰项目建立联系的实际途径。",
      "我们的法律身份可通过香港公司注册处公开核实。我们将本公司的服务，与利伯兰的公民机构以及独立活动和住宿运营方提供的服务明确区分。",
    ],
    panelLabel: "公司资料",
    rows: [
      ["注册名称", C_ZH.name],
      ["司法管辖区", "香港"],
      ["商业登记号码", C_ZH.brn],
      ["商业登记证号码", C_ZH.brc],
      ["注册办事处", [C_ZH.office.join(", "), OFFICE_ZH]],
      ["联系方式", { href: `mailto:${C_ZH.email}`, text: C_ZH.email }],
      ["注册处", { href: REGISTRY_ZH, text: "通过香港公司注册处核实", external: true }],
    ],
    verify: "核实我们的公司注册信息",
    verifyHint: [
      "请使用公司注册处的",
      { href: L_ZH.registrySearch, text: "电子服务网站", external: true },
      "进行电子查册，搜索 “Liberland Limited” 或商业登记号码 “64816138”。",
    ],
    disambiguation: "另有一家在英国注册的公司 LIBERLAND LIMITED（公司编号 15671292），属于不同的法律实体，其编号并不代表本香港公司。",
  },

  contact: {
    label: "06 — 联系",
    title: ["联系 ", { em: "Liberland Limited" }],
    intro: "对私人会员资格、社区联系或本网站有疑问？请发送电子邮件给我们。有关 Ark Village 的住宿和活动，请直接联系组织方。",
    rows: [
      ["会员及网站咨询", { href: `mailto:${C_ZH.email}`, text: C_ZH.email }],
      ["公司", C_ZH.name],
      ["注册信息", `香港 — 商业登记号码 ${C_ZH.brn}`],
      ["注册办事处", [...C_ZH.office, OFFICE_ZH]],
    ],
    footnote: "以上地址为本公司的注册办事处，不应被理解为对公众开放的访客中心或活动场地。",
    button: "发送电子邮件",
    arkLabel: "前往 Ark Village？",
    arkText: "住宿、名额及活动预订由 Ark Village 负责。",
    arkLink: "Ark Village 访客咨询",
  },

  faq: {
    label: "07 — 常见问题",
    title: ["常见", { em: "问题。" }],
    items: [
      {
        q: "什么是 Liberland Limited？",
        a: "Liberland Limited 是一家与利伯兰社区相关的香港注册公司。本网站提供私人会员咨询的相关信息，以及与本地区活动和地点建立联系的实际途径。",
      },
      {
        q: "Liberland Limited 的会员资格等同于利伯兰公民身份吗？",
        a: "不是。通过公司获得的私人会员资格，与利伯兰电子居民身份及公民身份不同。如需办理官方申请，请访问 liberland.org。",
        link: { href: L_ZH.application, text: "liberland.org/application", external: true },
      },
      {
        q: "我可以探访利伯兰所在的地区吗？",
        a: "可以。访客可以探访多瑙河地区的地点，包括位于塞尔维亚阿帕廷的 Ark Village。前往特定地点仍须遵守适用法律、边境程序及当地情况。",
        link: { href: L_ZH.arkExperience, text: "在 Ark Village 体验利伯兰", external: true },
      },
      {
        q: "会员资格是否保证可以参加活动或获得住宿？",
        a: "不保证。能否参加特定活动或获得住宿，取决于相关组织方的名额和条款。任何特定会员安排所包含的权益，都必须在该安排中明确说明。",
      },
      {
        q: "如何了解会员资格？",
        a: "请向我们发送会员咨询。我们可以提供目前可选的安排及其适用条款。咨询不会产生付款义务。",
        link: { href: M_ZH.membership, text: "发送会员咨询" },
      },
      {
        q: "我可以核实这家公司吗？",
        a: "可以。Liberland Limited 在香港注册，商业登记号码为 64816138。您可以通过香港公司注册处查询本公司的资料。",
        link: { href: REGISTRY_ZH, text: "香港公司注册处", external: true },
      },
      {
        q: "本网站上的活动是由 Liberland Limited 运营的吗？",
        a: "不一定。如果活动由其他方组织，我们会注明该组织方，并链接至其原始活动信息。预订和参与条件受组织方自身条款约束。",
      },
      {
        q: "我可以通过本网站购买房地产或投资产品吗？",
        a: "本网站目前不提供房地产、证券或投资权益的购买。有关探访和住宿的信息仅为方便访客而提供，不构成房产销售或投资要约。",
      },
      {
        q: "会员资格是否给予我签证或入境权利？",
        a: "不会。会员资格不授予签证、居留许可或任何获承认国家的公民身份，也不授予任何特殊的移民或过境权利。",
      },
    ],
  },

  footer: {
    blurb: "现实中的社区联系、会员咨询，以及有关利伯兰项目的信息。",
    idLine: `Liberland Limited · 香港 · 商业登记号码 ${C_ZH.brn}`,
    officeLabel: "注册办事处",
    office: C_ZH.office.join(", "),
    navLabel: "导航",
    nav: [
      { href: "#membership", label: "会员" },
      { href: "#events", label: "活动" },
      { href: "#visit", label: "探访" },
      { href: "#contact", label: "联系" },
      { href: "privacy/", label: "隐私" },
      { href: "terms/", label: "条款" },
    ],
    resourcesLabel: "独立资源",
    resources: [
      { href: L_ZH.liberland, label: "利伯兰官方网站" },
      { href: L_ZH.application, label: "利伯兰电子居民身份及公民身份" },
      { href: L_ZH.docs, label: "利伯兰文档" },
      { href: L_ZH.ark, label: "Ark Village" },
      { href: REGISTRY_ZH, label: "香港公司注册处" },
    ],
    legal: "Liberland Limited 是一家在香港注册的公司。由公司管理的私人会员资格，不得与政府身份、公民身份或移民权利相混淆。",
    copyright: year => `© ${year} Liberland Limited.`,
  },

  newTab: "（在新标签页中打开）",
};
