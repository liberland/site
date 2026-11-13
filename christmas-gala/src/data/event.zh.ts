/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  中文（简体）版 — Simplified Chinese text for the /zh/ page
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Only the TEXT of event.ts is translated here. Everything else (dates, prices,
 *  photos, links, statuses) comes from event.ts, so facts are changed in one place.
 *
 *  Lists are matched by position: the 2nd entry here translates the 2nd entry in
 *  event.ts. If you add or remove an item in event.ts, do the same here.
 *  A field missing here simply shows in English.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const zh = {
  name: '2026 利伯兰圣诞盛典',
  shortName: '圣诞盛典',
  tagline: '自由之夜，利伯兰新篇章。',
  guidingLine: '相聚 Le Palais 的圣诞——与利伯兰社群共度非凡之夜。',

  city: '布拉格',
  venue: {
    name: '布拉格 Le Palais 艺术酒店',
    shortName: 'Le Palais 艺术酒店',
    district: '布拉格 2 区',
    country: '捷克共和国',
    rooms: [
      '金色大堂，水晶吊灯熠熠生辉',
      '马罗尔德沙龙，保留着原作彩绘天顶',
      '图书馆休息厅，皮椅与灯光相映',
      'Artista 高级餐厅，可俯瞰布拉格',
      '美好年代风格的长廊，灰泥雕饰与马赛克地面',
    ],
    intro:
      '一座五星级“美好年代”风格酒店，坐落于一栋精心修复的十九世纪建筑中。画家卢德克·马罗尔德（Luděk Marold）曾在此生活和创作，他的原作彩绘天顶至今仍在，室内陈列着捷克及国际艺术家的作品。',
    facts: [
      { label: '酒店', value: '五星级酒店 · 修复的十九世纪建筑 · 72 间客房和套房' },
      { label: '艺术', value: '马罗尔德原作天顶 · 捷克及国际艺术家作品' },
      { label: '餐饮', value: 'Artista 餐厅（可俯瞰布拉格）· 大堂酒吧' },
    ],
    heroPhoto: {
      title: '画廊长廊',
      caption: 'Le Palais 酒店内的彩绘拱顶、威尼斯吊灯与马赛克地面。',
      alt: '布拉格 Le Palais 艺术酒店的美好年代风格画廊长廊，彩绘拱顶、水晶吊灯与马赛克地面',
    },
    portalPhoto: {
      title: '暮色中的 Le Palais',
      caption: '位于 U Zvonařky 街、灯火通明的美好年代风格酒店外立面。',
      alt: '暮色中灯火通明的布拉格 Le Palais 艺术酒店外立面及其拱形入口',
    },
    gallery: [
      { title: '大堂', caption: '酒店大堂里的水晶吊灯与金色光影。', alt: 'Le Palais 的金色大堂，水晶吊灯与花纹立柱' },
      { title: '马罗尔德沙龙', caption: '保留至今的原作彩绘藻井天顶。', alt: '带有华丽彩绘藻井天顶、吊灯和高窗的沙龙' },
      { title: '画廊长廊', caption: '灰泥雕饰、马赛克地面与灯笼光影。', alt: '美好年代风格长廊，灰泥天顶、吊灯与马赛克地面' },
      { title: 'Le Palais 酒店', caption: '推门而入，吊灯一路引领。', alt: 'Le Palais 酒店入口，玻璃门上方是酒店名称，门内可见吊灯' },
      { title: '图书馆休息厅', caption: '皮革、书籍与灯光——适合长谈的房间。', alt: '有书架、红色扶手椅和暖色灯光的图书馆休息厅' },
      { title: 'Artista', caption: '酒店的高级餐厅。', alt: 'Artista 餐厅，铺着白色桌布的餐桌与吊灯' },
      { title: '楼梯', caption: '历史悠久的楼梯，灯光如舞台。', alt: '雕花扶手的历史楼梯与温暖壁灯' },
    ],
    christmasPhoto: {
      title: 'Le Palais 的圣诞',
      caption: '装点一新的圣诞酒店大堂——摄自酒店自己的节日照片。',
      alt: 'Le Palais 大堂，高大的圣诞树、吊灯和扶手椅',
    },
  },

  programme: {
    note: '以下为计划日程，以最终确认的节目单为准。',
    summary: '15:00 起 · 制宪大会、AI 主题演讲、重大发布与圣诞盛典',
    schedule: [
      { time: '15:00', title: '制宪大会', text: '围绕宪政发展、自由与治理展开讨论。' },
      {
        time: '17:00',
        title: '新闻发布会与重大发布',
        text: '维特·耶德利奇卡（Vít Jedlička）总统与特邀嘉宾介绍利伯兰功绩（LLM）及利伯兰区块链 V2 的最新进展。',
      },
      { time: '晚间', title: '圣诞盛典', text: '授勋仪式、利伯兰荣誉与奖项、圣诞庆典及国际交流。' },
    ],
    themes: [
      {
        title: '制宪大会',
        text: '围绕利伯兰宪政发展的聚会——自由、同意，以及良好治理的形态。',
        note: '形式与发言人以最终节目单为准',
      },
      {
        title: '利伯兰功绩（LLM）',
        text: '利伯兰功绩的最新进展。LLM 是共和国基于区块链参与治理的工具。',
        note: 'LLM 与利伯兰元（LLD）是不同的工具',
      },
      {
        title: '利伯兰区块链 V2',
        text: '利伯兰现有区块链已兼容 EVM。V2 是计划中的下一代，基于以太坊技术；相关进展预计于 17:00 发布。',
        note: '计划中 · 尚未公布发布日期',
      },
      {
        title: '人工智能与国家',
        text: 'Daniel Vávra、Vojtěch Roček、Martin Groch 与 Jan Schlüter 将探讨人工智能为公共服务、投资、能源与治理带来的改变。',
        note: '演讲嘉宾已确认 · 时间以最终节目单为准',
      },
    ],
  },

  faces: {
    intro: '利伯兰总统与议会议员，将与正在把人工智能用于真实机构的人们同台：公共服务、投资、能源，乃至治理本身。',
    speakers: [
      {
        role: '利伯兰总统',
        talk: { title: '重大发布', text: '在 17:00 的新闻发布会上，介绍利伯兰功绩（LLM）与利伯兰区块链 V2 的最新进展。' },
      },
      {
        role: '利伯兰公民 · 科技企业家',
        talk: { title: 'AI 驱动的公民服务门户', text: '介绍他的新项目：一个借助人工智能、让捷克公民更便捷地获取公共服务与信息的门户。' },
      },
      {
        role: '捷克风险投资人',
        talk: { title: '被 AI 改写的旧结构', text: '人工智能如何拆解并重建组织与经济的运行方式。' },
      },
      {
        role: '深科技与能源创新者',
        talk: { title: 'AI 与 David 核反应堆', text: '人工智能如何用于设计核反应堆 David，以及这对先进硬件与清洁能源意味着什么。' },
      },
      {
        role: '利伯兰议会议员',
        talk: { title: 'Gornja Siga 数字档案', text: '一个借助 AI 的 Gornja Siga 数字档案，为利伯兰政府的工作提供参考；其方法随后启发了一套面向市镇的城市规划系统。' },
      },
      { role: '利伯兰议会议员' },
    ],
    note: '此处展示的人物不一定出席或发言，最终出席名单以节目单为准。',
    people: [],
  },

  lastYear: {
    eyebrow: '2025年圣诞 · Le Palais',
    lead: '2025年12月19日（星期五），利伯兰社群齐聚 Le Palais，参加“利伯兰圣诞派对暨宪法诵读”，纪念利伯兰成立十周年。那一晚，就是这样的感觉。',
    film: {
      title: '2025年圣诞 · Le Palais',
      note: '有声，英文字幕',
    },
    stills: [
      { alt: 'Le Palais 一盏挂满圣诞彩球的鎏金吊灯' },
      { alt: '维特·耶德利奇卡总统在会上发言，身后幻灯片写着“从民主走向贤能治理”' },
      { alt: '坐满红色扶手椅、正在鼓掌的宾客' },
      { alt: '身着礼服的维特·耶德利奇卡总统与一位宾客交谈' },
      { alt: '宾客在酒店图书馆举杯' },
      { alt: '一位鼓手在图书馆里现场演奏' },
    ],
    highlights: [
      { title: '宪法，郑重诵读', text: '由维特·耶德利奇卡总统主持的会议上，宪法被诵读、讨论并签署。' },
      {
        title: '重量级嘉宾',
        text: '特邀嘉宾 Hans-Hermann Hoppe、法学家 Stephan Kinsella 与 Alessandro Fusillo，以及多位部长和国际宾客。',
      },
      {
        title: '荣誉与护照',
        text: '捷克议会议员 Libor Vondráček 与其他贵宾一同获颁功绩之星勋章，现场还颁发了利伯兰护照。',
      },
      { title: '然后，派对开始', text: '合影、晚宴、图书馆里的现场音乐，以及为更美好的未来举杯。' },
    ],
    credit: '影片及剧照：利伯兰自由共和国，2025年圣诞 · Le Palais。',
  },

  evening: {
    lead: '会议结束后，Le Palais 换上圣诞盛装。新朋旧友身着晚礼服到来，整座建筑沐浴在温暖的灯光中，利伯兰社群齐聚一堂，共同庆祝这一年。',
    moments: [
      { title: '授勋仪式', text: '以隆重的时刻为这一年作结——并迎接新的篇章。' },
      { title: '利伯兰荣誉与奖项', text: '表彰为共和国奉献时间与才华的人们。' },
      { title: '圣诞庆典', text: '烛光、圣诞祝酒，以及欧洲冬夜的温暖。' },
      { title: '国际交流', text: '来自世界各地的朋友，从容的交谈，值得结识的新朋友。' },
    ],
    note: '晚间形式、着装要求及招待详情将随最终节目单公布。',
  },

  practical: {
    travel: '距离最近的国际机场是布拉格瓦茨拉夫·哈维尔机场（PRG）。',
    accommodation: 'Le Palais 的客房可直接向酒店预订。',
    accommodationPending: '盛典期间的客房安排待确认',
  },

  registration: {
    openLabel: '通过电子邮件报名',
    tickets: [{ group: '利伯兰公民' }, { group: '电子居民' }, { group: '公众' }],
    instructions: '须提前报名。请发送电子邮件，并注明您是利伯兰公民、电子居民还是公众。',
    updatesLabel: 'liberland.org 最新消息',
  },

  editorial: {
    celebration: [
      '2026年12月18日（星期五），利伯兰社群将齐聚布拉格 Le Palais 艺术酒店，参加圣诞盛典——白天是严肃的对话，夜晚是盛大的庆祝。',
      '下午属于思想：制宪大会、关于人工智能如何改变公共服务、投资、能源与治理的主题演讲，以及就利伯兰功绩与利伯兰区块链 V2 发布重大消息的新闻发布会。',
      '会议结束后，整座建筑换上圣诞盛装：授勋仪式、利伯兰荣誉与奖项，以及在布拉格市中心、吊灯与彩绘天顶之下，与来自世界各地的朋友共度的夜晚。',
    ],
    finale: {
      title: '诚挚邀请您',
      lead: '与利伯兰社群共度一个难忘的圣诞之夜——在布拉格市中心的 Le Palais。',
      motto: '自己活，也让别人活。',
    },
    footer:
      '节目及嘉宾以最终确认为准。本页任何内容均不构成代币、证券或投资的要约。利伯兰功绩（LLM）与利伯兰元（LLD）是不同的工具。',
  },

  site: {
    description:
      'Le Palais 的圣诞：2026年12月18日（星期五），利伯兰圣诞盛典在布拉格 Le Palais 艺术酒店举行——制宪大会，Daniel Vávra、Vojtěch Roček、Martin Groch 与 Jan Schlüter 关于人工智能与国家的演讲，关于利伯兰功绩（LLM）与利伯兰区块链 V2 的发布，以及隆重的圣诞晚会。',
    socialImage: 'og-image-zh.jpg',
    socialImageAlt: '利伯兰圣诞盛典——布拉格，2026年12月18日',
    locale: 'zh_CN',
    organiser: { name: '利伯兰自由共和国' },
  },
};
