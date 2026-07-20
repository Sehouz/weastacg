import { useState, useEffect } from "react";

/* ===== 招新配置 =====
 * 通过 Cloudflare Wrangler vars 控制（见 wrangler.json）
 * RECRUITMENT_ENABLED: "true" 启用 / "false" 关闭
 * RECRUITMENT_QQ_GROUP: 迎新QQ群号
 * RECRUITMENT_YEAR: 招新年份
 */
type RecruitmentConfig = {
  enabled: boolean;
  qqGroup: string;
  year: number;
};

/* ===== 内容数据 ===== */

const aboutCards = [
  {
    icon: "💙",
    title: "热爱汇聚",
    desc: "自2008年创立以来，我们因对ACGN的热爱而相聚，在这里每一次创作都是热爱的具象，每一场活动都是梦想的绽放。",
  },
  {
    icon: "🧡",
    title: "多元创作",
    desc: "涵盖Cosplay、乐队、舞台剧、绘画、配音、wota艺等8大部门，无论你是同人创作者还是动漫爱好者，都能找到属于自己的舞台。",
  },
  {
    icon: "💛",
    title: "共同成长",
    desc: "在这里你能认识志同道合的伙伴，在光影与色彩中并肩奔跑，丰富大学生活，提升创作技能，书写属于我们的青春物语。",
  },
];

const activities = [
  {
    title: "🎨 绘画创作",
    desc: "主笔组定期开展绘画交流与社刊《东西次元壁》创作，从线稿到上色，一起提升画技！",
    color: "bg-highlight-pink/20 border-highlight-pink/40",
  },
  {
    title: "📖 ACGN研讨",
    desc: "围绕动漫、游戏、拼模等话题展开讨论，分享你的最爱，发现新的宝藏作品！",
    color: "bg-brand-light/30 border-brand/40",
  },
  {
    title: "📰 社刊创作",
    desc: "参与社团刊物《东西次元壁》的策划与创作，让你的作品被更多人看见！",
    color: "bg-highlight-yellow/20 border-highlight-yellow/40",
  },
  {
    title: "🎤 配音演唱",
    desc: "有声部提供配音、翻唱平台，从角色配音到乐队演唱，用声音演绎二次元！",
    color: "bg-accent/20 border-accent/40",
  },
  {
    title: "📸 Cosplay",
    desc: "Cos部定期组织拍摄与舞台表演，从服装制作到现场演出，全方位体验角色魅力！",
    color: "bg-pop-pink/20 border-pop-pink/40",
  },
  {
    title: "✂️ 手作工坊",
    desc: "手作部教你制作痛包、周边等手工制品，把对角色的爱变成触手可及的实物！",
    color: "bg-pop-blue/20 border-pop-blue/40",
  },
  {
    title: "🎭 舞台剧表演",
    desc: "东西剧组编排精彩舞台剧，从剧本创作到现场演出，体验戏剧的魅力！",
    color: "bg-accent/15 border-accent/30",
  },
  {
    title: "🎸 乐队演出",
    desc: "东西放课后乐队定期排练演出，演奏动漫经典曲目，用音乐点燃现场！",
    color: "bg-brand-light/20 border-brand/30",
  },
  {
    title: "💃 宅舞应援",
    desc: "宅舞部与应援团组织随机舞蹈、wota艺表演，在律动中释放热情！",
    color: "bg-highlight-pink/15 border-highlight-pink/30",
  },
];

const highlights = [
  { emoji: "🎂", label: "2008年创立", sub: "17年老牌社团" },
  { emoji: "🎭", label: "8大部门", sub: "总有你的舞台" },
  { emoji: "📚", label: "社刊《东西次元壁》", sub: "让创作被看见" },
  { emoji: "🎁", label: "入社无门槛", sub: "填表即入" },
];

const socialLinks = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
      </svg>
    ),
    label: "B站（社团）",
    value: "@中南大东西动漫社",
    href: "https://space.bilibili.com/10284760",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
      </svg>
    ),
    label: "B站（乐队）",
    value: "@東西放課後乐队",
    href: "https://space.bilibili.com/3546897027435234",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.95 12.5c-.5 0-.95-.4-.95-.95s.4-.95.95-.95.95.4.95.95-.45.95-.95.95zM12 16.5c-2.4 0-4.4-1.8-4.7-4h1.4c.3 1.5 1.7 2.6 3.3 2.6s3-1.1 3.3-2.6h1.4c-.3 2.2-2.3 4-4.7 4zm-4.95-4.5c-.5 0-.95-.4-.95-.95s.4-.95.95-.95.95.4.95.95-.45.95-.95.95z"/>
      </svg>
    ),
    label: "小红书",
    value: "@中南大东西动漫社",
    href: "https://www.xiaohongshu.com/user/profile/66a702ca000000001d021070",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 4c.55 0 1 .45 1 1v4.5c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1zm-4 0c.55 0 1 .45 1 1v4.5c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1zm7.5 9.5h-8c-.55 0-1-.45-1-1s.45-1 1-1h8c.55 0 1 .45 1 1s-.45 1-1 1z"/>
      </svg>
    ),
    label: "官方QQ",
    value: "3020464487",
  },
];

const sparkles = [
  { top: "10%", left: "5%", delay: "0s", size: "1.2rem" },
  { top: "20%", left: "85%", delay: "0.3s", size: "1rem" },
  { top: "60%", left: "10%", delay: "0.6s", size: "0.9rem" },
  { top: "75%", left: "80%", delay: "0.9s", size: "1.1rem" },
  { top: "15%", left: "45%", delay: "1.2s", size: "0.8rem" },
];

/* ===== 招新顶部横幅 ===== */

const RECRUITMENT_BANNER_KEY = "recruitment_banner_dismissed";
const BANNER_HEIGHT = 44; // px

function RecruitmentBanner({ recruitment, onDismiss }: { recruitment: RecruitmentConfig; onDismiss: () => void }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-accent text-text-main" style={{ height: BANNER_HEIGHT }}>
      <div className="h-full max-w-6xl mx-auto px-4 flex items-center justify-center gap-3 text-sm font-bold">
        <span className="bg-white/60 rounded-full px-2 py-0.5 text-xs">NEW</span>
        <span>
          {recruitment.year} 年招新正在进行中！迎新QQ群：
          <span className="text-lg tracking-wider mx-1">{recruitment.qqGroup}</span>
        </span>
        <a href="#join" className="underline underline-offset-2 hover:opacity-80">
          立即加入 →
        </a>
        <button
          onClick={() => {
            localStorage.setItem(RECRUITMENT_BANNER_KEY, "true");
            onDismiss();
          }}
          className="ml-2 p-1 hover:bg-text-main/10 rounded transition-colors"
          aria-label="关闭"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ===== 主组件 ===== */

export function Welcome({ recruitment }: { recruitment: RecruitmentConfig }) {
  const [scrolled, setScrolled] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(true);

  useEffect(() => {
    setBannerDismissed(localStorage.getItem(RECRUITMENT_BANNER_KEY) === "true");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showBanner = recruitment.enabled && !bannerDismissed;
  const navTop = showBanner ? `${BANNER_HEIGHT}px` : "0px";

  return (
    <div className="min-h-screen">
      {showBanner && <RecruitmentBanner recruitment={recruitment} onDismiss={() => setBannerDismissed(true)} />}

      {/* Navigation */}
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
        style={{ top: navTop }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="logo" className="w-10 h-10 rounded-full border-2 border-brand shadow-sm" />
            <span className="text-xl font-bold text-brand tracking-wide">
              东西动漫社
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#about" className="text-text-main/70 hover:text-brand transition-colors">关于我们</a>
            <a href="#activities" className="text-text-main/70 hover:text-brand transition-colors">社团活动</a>
            <a href="#follow" className="text-text-main/70 hover:text-brand transition-colors">关注我们</a>
            <a href="#join" className="text-text-main/70 hover:text-brand transition-colors">加入我们</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-brand-light/40 via-bg-body to-accent/20`} style={{ paddingTop: showBanner ? `${BANNER_HEIGHT}px` : 0 }}>
        {sparkles.map((s, i) => (
          <span
            key={i}
            className="absolute animate-sparkle pointer-events-none select-none text-highlight-yellow"
            style={{
              top: s.top,
              left: s.left,
              animationDelay: s.delay,
              fontSize: s.size,
            }}
          >
            ✦
          </span>
        ))}

        <div className="relative max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left animate-fade-in-up">
            {recruitment.enabled && (
              <div className="inline-block bg-accent text-text-main text-sm font-bold px-4 py-1.5 rounded-full mb-4 animate-pulse">
                🔥 {recruitment.year} 招新进行中
              </div>
            )}
            <div className="inline-block bg-highlight-yellow/60 text-text-main text-sm font-bold px-4 py-1.5 rounded-full mb-6">
              欢迎来到 ✨
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-text-main leading-tight mb-4">
              东西<span className="text-brand">动漫</span>社
            </h1>
            <p className="text-text-light text-lg md:text-xl mb-2 leading-relaxed">
              中南财经政法大学
            </p>
            <p className="text-text-main/60 text-sm mb-6">成立于 2008 年</p>
            <p className="text-text-main/70 text-base md:text-lg mb-8 max-w-md leading-relaxed">
              跃入这五彩斑斓的次元，书写属于你的青春物语！
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a
                href="#activities"
                className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-8 py-3 rounded-full hover:brightness-110 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                探索社团活动
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <a
                href="#join"
                className="inline-flex items-center gap-2 bg-accent text-text-main font-semibold px-8 py-3 rounded-full hover:bg-accent-hover transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                加入我们
              </a>
            </div>
          </div>

          <div className="flex-1 flex justify-center animate-float">
            <div className="relative">
              <div className="absolute inset-0 bg-brand/20 rounded-full blur-3xl scale-110" />
              <img
                src="/mascot.png"
                alt="酱酱酱"
                className="relative w-64 md:w-80 lg:w-96 drop-shadow-2xl"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 border border-brand/30 shadow-md text-center">
                <span className="text-sm font-bold text-brand">社娘 · 酱酱酱</span>
                <span className="block text-xs text-text-light mt-0.5">画师 yonnana</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-main/40">
          <span className="text-xs">往下看</span>
          <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-highlight-yellow text-2xl mr-2">✦</span>
            <h2 className="inline text-4xl font-extrabold text-text-main">关于我们</h2>
            <span className="text-highlight-yellow text-2xl ml-2">✦</span>
          </div>

          <p className="text-text-light text-center max-w-3xl mx-auto mb-16 leading-relaxed text-lg">
            中南财经政法大学东西动漫社成立于2008年，是名副其实的二次元爱好者聚集地。
            我们下设Cos部、有声部、主笔组、应援团、研讨组、手作部、宅舞部、东西剧组等8个部门，
            涵盖cosplay、乐队表演、舞台剧、绘画创作、配音、wota艺等多元活动。
            入社无需面试，只要你对ACGN充满热爱，这里就是你展现创意、结交同好、共同成长的次元交汇点！
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="bg-brand/5 rounded-2xl p-5 text-center border border-brand/10 hover:border-brand/30 transition-colors"
              >
                <div className="text-3xl mb-2">{h.emoji}</div>
                <div className="text-text-main font-bold text-sm">{h.label}</div>
                <div className="text-text-light text-xs mt-0.5">{h.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {aboutCards.map((item, i) => (
              <div
                key={i}
                className="bg-bg-body rounded-2xl p-8 border border-brand/10 hover:border-brand/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-text-main mb-3">{item.title}</h3>
                <p className="text-text-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="py-24 bg-bg-body">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-highlight-yellow text-2xl mr-2">✦</span>
            <h2 className="inline text-4xl font-extrabold text-text-main">社团活动</h2>
            <span className="text-highlight-yellow text-2xl ml-2">✦</span>
            <p className="text-text-light mt-3">
              8大部门，丰富多彩的社团日常，总有一款适合你
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 border-2 ${activity.color} hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
              >
                <h3 className="text-lg font-bold text-text-main mb-2">{activity.title}</h3>
                <p className="text-text-light text-sm leading-relaxed">{activity.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Follow Us / Social Media Section */}
      <section id="follow" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-highlight-yellow text-2xl mr-2">✦</span>
            <h2 className="inline text-4xl font-extrabold text-text-main">关注我们</h2>
            <span className="text-highlight-yellow text-2xl ml-2">✦</span>
            <p className="text-text-light mt-3">
              在以下平台找到东西动漫社，了解更多动态
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {socialLinks.map((s, i) => (
              s.href ? (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-5 bg-bg-body rounded-2xl p-6 border border-brand/10 hover:border-brand/40 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors shrink-0">
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-text-main/50 text-xs mb-0.5">{s.label}</div>
                    <div className="text-text-main font-bold">{s.value}</div>
                  </div>
                  <svg className="w-5 h-5 text-text-light ml-auto shrink-0 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ) : (
                <div
                  key={i}
                  className="flex items-center gap-5 bg-bg-body rounded-2xl p-6 border border-brand/10"
                >
                  <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center text-brand shrink-0">
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-text-main/50 text-xs mb-0.5">{s.label}</div>
                    <div className="text-text-main font-bold">{s.value}</div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section id="join" className="py-24 bg-gradient-to-r from-brand to-brand-light relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-highlight-yellow/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block text-5xl mb-6">{recruitment.enabled ? "🔥" : "🎉"}</span>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            {recruitment.enabled ? `${recruitment.year} 招新进行中` : "加入我们"}
          </h2>

          {recruitment.enabled ? (
            <>
              <p className="text-white/80 text-lg mb-6 leading-relaxed">
                入社无需面试，填表即可加入！欢迎加入迎新QQ群了解更多：
              </p>
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-4">
                <div className="text-white/60 text-sm">迎新QQ群</div>
                <div className="text-2xl font-extrabold text-white tracking-wider">{recruitment.qqGroup}</div>
              </div>
              <p className="text-white/50 text-xs">
                百团大战期间开放正式入社报名，请关注社团动态获取最新消息
              </p>
            </>
          ) : (
            <>
              <p className="text-white/80 text-lg mb-2 leading-relaxed">
                入社无需面试，填表即可加入！
              </p>
              <p className="text-white/60 text-sm mb-8 leading-relaxed max-w-md mx-auto">
                正式入社时间在每年秋季学期初的招新期间，在此之前欢迎先加入外联群聊提前认识大家！
              </p>
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
                <div className="text-white/60 text-sm">外联群聊 QQ</div>
                <div className="text-2xl font-extrabold text-white tracking-wider">1023073775</div>
              </div>
              <p className="text-white/40 text-xs">
                * 正式入社报名在每年秋季学期初的百团大战期间开放，请关注社团动态获取最新消息
              </p>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-main text-white/60 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/icon.png" alt="logo" className="w-8 h-8 rounded-full border border-white/20" />
              <span className="text-white font-bold text-lg">东西动漫社</span>
            </div>
            <div className="text-sm">
              中南财经政法大学 学生社团
            </div>
            <p className="text-sm text-white/40">
              Made with 💙 by 东西动漫社
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
