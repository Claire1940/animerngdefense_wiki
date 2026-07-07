"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Boxes,
  Check,
  ChevronDown,
  Copy,
  Crown,
  Dices,
  GraduationCap,
  Map as MapIcon,
  Sparkles,
  Target,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// 小标签：用于卡片内的字段说明，统一视觉
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
      {children}
    </span>
  );
}

// 模块头部：eyebrow 徽章 + 标题 + 简介
function ModuleHeader({
  icon: Icon,
  eyebrow,
  title,
  intro,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      <div
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                   bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4"
      >
        <Icon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
        <span className="text-xs md:text-sm font-medium">{eyebrow}</span>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
        {title}
      </h2>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
        {intro}
      </p>
    </div>
  );
}

// 通用卡片容器
function ModuleCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors ${className}`}
    >
      {children}
    </div>
  );
}

// 单个 code 卡片的复制按钮（客户端）
function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 静默失败：部分环境无 clipboard 权限
    }
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy code ${code}`}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium
                 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                 text-[hsl(var(--nav-theme-light))] hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" /> Copied
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" /> Copy
        </>
      )}
    </button>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.animerngdefense.wiki";

  // Accordion 状态：luck / updates 两个模块
  const [luckExpanded, setLuckExpanded] = useState<number | null>(0);
  const [updatesExpanded, setUpdatesExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  const m = t.modules;
  const codes = m.animeRngDefenseCodes;
  const beginner = m.animeRngDefenseBeginnerGuide;
  const tier = m.animeRngDefenseUnitTierList;
  const units = m.animeRngDefenseUnitsAndRarities;
  const maps = m.animeRngDefenseMapsAndWaves;
  const team = m.animeRngDefenseBestTeamBuild;
  const luck = m.animeRngDefenseLuckAndRolling;
  const updates = m.animeRngDefenseUpdatesAndDiscord;

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Anime RNG Defense Wiki",
        description:
          "Complete Anime RNG Defense Wiki covering codes, units, tier lists, traits, maps, team builds, upgrades, and beginner tips for the Roblox anime RNG tower defense game.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Anime RNG Defense - Roblox Anime RNG Tower Defense",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Anime RNG Defense Wiki",
        alternateName: "Anime RNG Defense",
        url: siteUrl,
        description:
          "Complete Anime RNG Defense Wiki resource hub for codes, units, tier lists, traits, maps, team builds, and beginner guides for Roblox players",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Anime RNG Defense Wiki - Roblox Anime RNG Tower Defense",
        },
        sameAs: [
          "https://www.roblox.com/games/104693964860826/Anime-RNG-Defense",
          "https://www.youtube.com/watch?v=OlhoZtnWDN8",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Anime RNG Defense",
        gamePlatform: ["Roblox", "Web Browser", "PC", "Mobile", "Console"],
        applicationCategory: "Game",
        genre: ["Tower Defense", "RPG", "Anime", "Strategy"],
        numberOfPlayers: {
          minValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/104693964860826/Anime-RNG-Defense",
        },
      },
      {
        "@type": "VideoObject",
        name: "I Went from NOOB to PRO in Roblox Anime RNG Defense!",
        description:
          "Anime RNG Defense gameplay walkthrough showing how to roll units, upgrade luck, and progress through every map on Roblox.",
        uploadDate: "2026-07-04",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/OlhoZtnWDN8",
        url: "https://www.youtube.com/watch?v=OlhoZtnWDN8",
      },
    ],
  };

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/104693964860826/Anime-RNG-Defense"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="OlhoZtnWDN8"
              title="I Went from NOOB to PRO in Roblox Anime RNG Defense!"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（锚点 1:1 对应下方 8 个模块） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionIds = [
                "codes",
                "beginner-guide",
                "unit-tier-list",
                "units-and-rarities",
                "maps-and-waves-guide",
                "best-team-build",
                "luck-and-rolling-guide",
                "updates-and-discord",
              ];
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: Anime RNG Defense Codes（code-cards） */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Ticket}
            eyebrow={codes.eyebrow}
            title={codes.title}
            intro={codes.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {codes.items.map((item: any, index: number) => (
              <ModuleCard key={index}>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <code
                    className="px-3 py-1.5 rounded-md bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                               text-sm md:text-base font-mono font-semibold text-[hsl(var(--nav-theme-light))] break-all"
                  >
                    {item.code}
                  </code>
                  <CopyCodeButton code={item.code} />
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${
                      item.status === "active"
                        ? "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]"
                        : "bg-white/5 border-border text-muted-foreground"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-border text-muted-foreground">
                    {item.reward}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <FieldLabel>Requirement</FieldLabel>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {item.requirement}
                    </p>
                  </div>
                  <div>
                    <FieldLabel>Best For</FieldLabel>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {item.bestFor}
                    </p>
                  </div>
                </div>
              </ModuleCard>
            ))}
          </div>
        </div>
      </section>

      {/* Module 2: Anime RNG Defense Beginner Guide（step-by-step） */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={GraduationCap}
            eyebrow={beginner.eyebrow}
            title={beginner.title}
            intro={beginner.intro}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {beginner.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {item.step}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-start gap-2 text-sm text-[hsl(var(--nav-theme-light))]">
                    <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{item.tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Anime RNG Defense Unit Tier List（tier-grid） */}
      <section id="unit-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Crown}
            eyebrow={tier.eyebrow}
            title={tier.title}
            intro={tier.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {tier.items.map((item: any, index: number) => {
              // 按 tier 档位递减主题色不透明度，保持视觉统一且不硬编码颜色
              const tierRank = String(item.tier).toUpperCase();
              const opacityByRank: Record<string, number> = {
                S: 0.9,
                A: 0.65,
                B: 0.45,
                C: 0.3,
              };
              const op = opacityByRank[tierRank] ?? 0.5;
              return (
                <div
                  key={index}
                  className="flex gap-4 p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div
                    className="flex h-14 w-14 md:h-16 md:w-16 flex-shrink-0 items-center justify-center rounded-xl border"
                    style={{
                      backgroundColor: `hsl(var(--nav-theme) / ${op * 0.25})`,
                      borderColor: `hsl(var(--nav-theme) / ${op * 0.5})`,
                      color: `hsl(var(--nav-theme-light))`,
                    }}
                  >
                    <span className="text-2xl md:text-3xl font-bold">
                      {item.tier}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-base md:text-lg">
                        {item.label}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-muted-foreground">
                        {item.unitType}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div>
                        <FieldLabel>Why It Ranks Here</FieldLabel>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {item.whyItRanksHere}
                        </p>
                      </div>
                      <div>
                        <FieldLabel>Best Use</FieldLabel>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {item.bestUse}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 4: Anime RNG Defense Units and Rarities（card-list） */}
      <section
        id="units-and-rarities"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Boxes}
            eyebrow={units.eyebrow}
            title={units.title}
            intro={units.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {units.items.map((item: any, index: number) => (
              <ModuleCard key={index}>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="font-bold text-base md:text-lg text-[hsl(var(--nav-theme-light))]">
                    {item.name}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-muted-foreground whitespace-nowrap">
                    {item.type}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <FieldLabel>How to Get</FieldLabel>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {item.howToGet}
                    </p>
                  </div>
                  <div>
                    <FieldLabel>Why It Matters</FieldLabel>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {item.whyItMatters}
                    </p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-border/60">
                    <FieldLabel>Player Tip</FieldLabel>
                    <p className="text-sm text-muted-foreground mt-0.5 italic">
                      {item.playerTip}
                    </p>
                  </div>
                </div>
              </ModuleCard>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 中段阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 5: Anime RNG Defense Maps and Waves Guide（step-by-step） */}
      <section id="maps-and-waves-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={MapIcon}
            eyebrow={maps.eyebrow}
            title={maps.title}
            intro={maps.intro}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {maps.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {item.step}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-start gap-2 text-sm text-[hsl(var(--nav-theme-light))]">
                    <Target className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{item.goal}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Anime RNG Defense Best Team Build（card-list） */}
      <section
        id="best-team-build"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Target}
            eyebrow={team.eyebrow}
            title={team.title}
            intro={team.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.items.map((item: any, index: number) => (
              <ModuleCard key={index}>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="font-bold text-base md:text-lg text-[hsl(var(--nav-theme-light))]">
                    {item.title}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-muted-foreground whitespace-nowrap">
                    {item.role}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {item.description}
                </p>
                <div className="pt-2 border-t border-border/60">
                  <FieldLabel>Best For</FieldLabel>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {item.bestFor}
                  </p>
                </div>
              </ModuleCard>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 7: Anime RNG Defense Luck and Rolling Guide（accordion） */}
      <section id="luck-and-rolling-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Dices}
            eyebrow={luck.eyebrow}
            title={luck.title}
            intro={luck.intro}
          />
          <div className="scroll-reveal space-y-2">
            {luck.items.map((item: any, index: number) => {
              const open = luckExpanded === index;
              return (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() => setLuckExpanded(open ? null : index)}
                    className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="flex items-center gap-2.5 font-semibold">
                      <Dices className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))] transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && (
                    <div className="px-4 md:px-5 pb-4 md:pb-5 pt-1 text-sm md:text-base text-muted-foreground">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 8: Anime RNG Defense Updates and Discord（accordion） */}
      <section
        id="updates-and-discord"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Bell}
            eyebrow={updates.eyebrow}
            title={updates.title}
            intro={updates.intro}
          />
          <div className="scroll-reveal space-y-2">
            {updates.items.map((item: any, index: number) => {
              const open = updatesExpanded === index;
              return (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() => setUpdatesExpanded(open ? null : index)}
                    className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="flex items-center gap-2.5 font-semibold">
                      <Bell className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))] transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && (
                    <div className="px-4 md:px-5 pb-4 md:pb-5 pt-1 text-sm md:text-base text-muted-foreground">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.roblox.com/games/104693964860826/Anime-RNG-Defense"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.roblox}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=OlhoZtnWDN8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
