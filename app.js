(() => {
  "use strict";

  const STORAGE_KEY = "xiao1000-practice-state-v1";
  const app = document.getElementById("app");
  const toastNode = document.getElementById("toast");
  const backgroundNode = document.getElementById("app-background");
  const SOUND_PRESETS = {
    drop: "清露",
    wood: "木音",
    chime: "双铃",
    feather: "轻羽"
  };
  const FONT_STACKS = {
    sans: '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif',
    song: '"Songti SC", "STSong", "SimSun", "Noto Serif CJK SC", serif',
    fangsong: '"FangSong", "STFangsong", "FangSong_GB2312", serif',
    kaiti: '"Kaiti SC", "STKaiti", "KaiTi", serif',
    hand: '"Xingkai SC", "STXingkai", "Kaiti SC", "KaiTi", cursive'
  };
  const FONT_PRESETS = {
    sans: "黑体",
    song: "宋体",
    fangsong: "仿宋",
    kaiti: "楷体",
    hand: "手写体"
  };
  const MUSIC_PRESETS = {
    piano: "舒缓钢琴",
    rain: "细雨白噪音",
    stream: "山谷溪流",
    forest: "林间微风"
  };
  const COLOR_SERIES = {
    pink: [
      { tone: "浅樱", paper: "#fff7f9", surface: "#fffdfd", deep: "#f5e5eb", accent: "#c76d8f", soft: "#fbe7ef", ink: "#382c31" },
      { tone: "莓粉", paper: "#fceef3", surface: "#fff9fb", deep: "#f1d9e3", accent: "#b84e78", soft: "#f8dce8", ink: "#38262e" },
      { tone: "深玫", paper: "#f5dfe8", surface: "#fff5f8", deep: "#e9c7d4", accent: "#923a61", soft: "#f2d1df", ink: "#342029" }
    ],
    green: [
      { tone: "薄荷", paper: "#f2faf5", surface: "#fbfffc", deep: "#dff0e6", accent: "#4f8a6c", soft: "#e1f2e8", ink: "#27372f" },
      { tone: "森绿", paper: "#eaf5ee", surface: "#f8fdfa", deep: "#d4e9dc", accent: "#367157", soft: "#d8eddf", ink: "#23352b" },
      { tone: "墨绿", paper: "#dfeee5", surface: "#f4fbf7", deep: "#c4ddce", accent: "#245b45", soft: "#cfe5d8", ink: "#1f3026" }
    ],
    blue: [
      { tone: "晴蓝", paper: "#f2f8fb", surface: "#fbfdff", deep: "#dfeef5", accent: "#4d7da2", soft: "#e2eff6", ink: "#26333b" },
      { tone: "海蓝", paper: "#eaf3f8", surface: "#f8fcff", deep: "#d5e7f0", accent: "#326b91", soft: "#d9ebf4", ink: "#23323c" },
      { tone: "靛蓝", paper: "#dfebf2", surface: "#f4faff", deep: "#c7dce8", accent: "#214f72", soft: "#cfe3ee", ink: "#202f39" }
    ],
    black: [
      { tone: "雾灰", paper: "#f3f3f1", surface: "#fbfbf9", deep: "#e4e4df", accent: "#545956", soft: "#e8e9e6", ink: "#242725" },
      { tone: "石墨", paper: "#eaeae7", surface: "#f7f7f4", deep: "#d8d8d3", accent: "#3f4441", soft: "#dedfdb", ink: "#1e211f" },
      { tone: "曜黑", paper: "#dedfdb", surface: "#f1f2ef", deep: "#c9cac5", accent: "#292d2b", soft: "#d3d5d1", ink: "#171a18" }
    ]
  };

  function characterThemes(prefix, label) {
    const labels = { pink: "粉色", green: "绿色", blue: "蓝色", black: "黑色" };
    return Object.entries(COLOR_SERIES).flatMap(([color, variants]) =>
      variants.map((variant) => ({
        id: `${prefix}-${color}-${variant.tone}`,
        name: `${label} · ${labels[color]}${variant.tone}${
          (prefix === "conan" && color === "blue" && variant.tone === "晴蓝") ||
          (prefix === "shinchan" && color === "pink" && variant.tone === "浅樱")
            ? " · 装扮样张"
            : ""
        }`,
        family: prefix,
        paper: variant.paper,
        surface: variant.surface,
        deep: variant.deep,
        ink: variant.ink,
        muted: "#716d70",
        line: variant.deep,
        accent: variant.accent,
        soft: variant.soft,
        red: "#b6403a",
        redSoft: "#f9e4e1",
        gold: "#9c742e",
        goldSoft: "#f7edda",
        hero: variant.ink
      }))
    );
  }

  const THEME_FAMILIES = [
    {
      label: "基础与马卡龙",
      themes: [
        { id: "paper", name: "原纸色", family: "paper", paper: "#f4f1e8", surface: "#fffdf8", deep: "#ebe6d8", ink: "#20231f", muted: "#77796e", line: "#ded9cc", accent: "#176b4e", soft: "#e4f1e9", red: "#b6403a", redSoft: "#fae9e7", gold: "#9f742b", goldSoft: "#f6ecd7", hero: "#20231f" },
        { id: "macaron-strawberry", name: "马卡龙 · 草莓", family: "macaron", paper: "#fff4f6", surface: "#fffafb", deep: "#f7dfe6", ink: "#3b2c31", muted: "#806e73", line: "#eed5dd", accent: "#c97090", soft: "#fae3eb", red: "#b94f66", redSoft: "#f8e0e5", gold: "#a67840", goldSoft: "#f6ead8", hero: "#744a59" },
        { id: "macaron-mint", name: "马卡龙 · 薄荷", family: "macaron", paper: "#f2faf6", surface: "#fbfffd", deep: "#dcefe5", ink: "#28362f", muted: "#6e7e75", line: "#d3e8dc", accent: "#62a888", soft: "#ddf2e8", red: "#b65b58", redSoft: "#f8e6e3", gold: "#9a7b3d", goldSoft: "#f4ecd8", hero: "#3d6858" },
        { id: "macaron-lavender", name: "马卡龙 · 薰衣草", family: "macaron", paper: "#f7f3fb", surface: "#fdfbff", deep: "#e9e0f2", ink: "#332c3b", muted: "#786f82", line: "#e1d6ec", accent: "#8c72b1", soft: "#eae2f5", red: "#ad5d78", redSoft: "#f7e3e9", gold: "#967544", goldSoft: "#f3eadb", hero: "#584867" },
        { id: "macaron-cream", name: "马卡龙 · 奶油黄", family: "macaron", paper: "#fff9eb", surface: "#fffdf8", deep: "#f6ebcf", ink: "#3d3527", muted: "#807666", line: "#eee1c4", accent: "#c08d45", soft: "#f8edda", red: "#b45d4a", redSoft: "#f8e5df", gold: "#9e7331", goldSoft: "#f5ead4", hero: "#6e5a3b" }
      ]
    },
    { label: "名侦探柯南", themes: characterThemes("conan", "柯南") },
    { label: "蜡笔小新", themes: characterThemes("shinchan", "蜡笔小新") },
    {
      label: "自然景观",
      themes: [
        { id: "nature-jungle", name: "丛林", family: "nature", paper: "#eef6ea", surface: "#f9fcf5", deep: "#dcebd3", ink: "#263526", muted: "#6e7c68", line: "#d3e4ca", accent: "#39764d", soft: "#dcefdc", red: "#aa5d48", redSoft: "#f4e5df", gold: "#947333", goldSoft: "#f1ead7", hero: "linear-gradient(135deg,#1f4931,#4d7148)" },
        { id: "nature-mountain", name: "高山", family: "nature", paper: "#f1f4f4", surface: "#fbfcfb", deep: "#e0e6e4", ink: "#293333", muted: "#727c79", line: "#d5dfdc", accent: "#496f68", soft: "#e3efeb", red: "#aa5b4e", redSoft: "#f5e5e0", gold: "#92733b", goldSoft: "#f2ead9", hero: "linear-gradient(145deg,#273c38,#8b9b91)" },
        { id: "nature-snow", name: "雪山", family: "nature", paper: "#f5f8fa", surface: "#ffffff", deep: "#e3ebf0", ink: "#29333b", muted: "#75818a", line: "#d9e4eb", accent: "#57829e", soft: "#e5f1f8", red: "#a95b60", redSoft: "#f5e5e8", gold: "#92794a", goldSoft: "#f3ecdf", hero: "linear-gradient(145deg,#3f6378,#d8e5ea)" },
        { id: "nature-river", name: "河流", family: "nature", paper: "#eff8f5", surface: "#fbfefd", deep: "#dbece8", ink: "#283737", muted: "#6c7e7b", line: "#d2e7e2", accent: "#3e867c", soft: "#dcf1ec", red: "#a95c54", redSoft: "#f5e5e2", gold: "#92783d", goldSoft: "#f1ead8", hero: "linear-gradient(145deg,#286a68,#9bc9bd)" },
        { id: "nature-sea", name: "大海", family: "nature", paper: "#edf6fa", surface: "#f9fdff", deep: "#d8eaf2", ink: "#26343d", muted: "#687b85", line: "#d0e4ed", accent: "#3f7899", soft: "#dceef7", red: "#a95b63", redSoft: "#f5e4e8", gold: "#927a43", goldSoft: "#f1eadc", hero: "linear-gradient(145deg,#275b7a,#8dc5d4)" },
        { id: "nature-grassland", name: "草原", family: "nature", paper: "#f7f8e9", surface: "#fdfef8", deep: "#e9ecd5", ink: "#35372a", muted: "#7a7d68", line: "#e1e5ca", accent: "#718a43", soft: "#eef2d9", red: "#a85f48", redSoft: "#f4e6df", gold: "#9d7931", goldSoft: "#f3ecd7", hero: "linear-gradient(145deg,#496b3d,#c5d58d)" },
        { id: "nature-cabin", name: "丛林木屋", family: "nature", paper: "#f8f2e8", surface: "#fffdf8", deep: "#eadfce", ink: "#393128", muted: "#7f7467", line: "#e4d6c1", accent: "#786444", soft: "#efe6d7", red: "#a45d4d", redSoft: "#f4e4df", gold: "#966c2f", goldSoft: "#f2e5cf", hero: "linear-gradient(145deg,#3d4e31,#8d6a46)" }
      ]
    }
  ];
  const THEME_CATALOG = new Map(
    THEME_FAMILIES.flatMap((family) => family.themes).map((theme) => [theme.id, theme])
  );

  const icons = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>',
    chevron: '<svg class="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v18H7.5A3.5 3.5 0 0 0 4 23V5.5Z"/><path d="M4 19.5A3.5 3.5 0 0 1 7.5 16H20M8 6h8"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 3h5v5M4 20l17-17M21 16v5h-5M14 14l7 7M4 4l5 5"/></svg>',
    wrong: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h14v16H5z"/><path d="M8 9h8M8 13h5"/><path d="m15 17 5 5M20 17l-5 5"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15 1.7 1.7 0 0 0 3.08 14H3v-4h.08A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 8.97 4.6 1.7 1.7 0 0 0 10 3.08V3h4v.08a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9 1.7 1.7 0 0 0 20.92 10H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 4 4L19 6"/></svg>'
  };

  let DATA = null;
  let QUESTIONS = [];
  let QUESTION_MAP = new Map();
  let CHAPTER_MAP = new Map();
  let WALLPAPERS = [];
  let WALLPAPER_MAP = new Map();
  let STATE = loadState();
  let page = { name: "home", part: null, wrongTab: "pending" };
  let sheet = null;
  let pendingSelection = [];
  let questionExplanationMode = "detailed";
  let audioContext = null;
  let drawingMode = false;
  let drawingQuestionId = "";
  let drawingColor = "#b6403a";
  let drawingWidth = 3;
  let drawingBrush = "pen";
  let drawingEraser = false;
  let drawingUndoStack = [];
  let overlayDrawingMode = false;
  let overlayUndoStack = [];
  let shapeSelectMode = false;
  let selectedShapeId = "";
  const canvasModels = new WeakMap();
  let musicEngine = null;
  let musicUnlockBound = false;
  let noteSaveTimer = null;
  let workspaceResizeHandler = null;

  function defaultState() {
    return {
      version: 4,
      progress: {},
      wrong: {},
      notebook: {},
      notes: {},
      shapes: {},
      manualWrong: {},
      activeSession: null,
      daily: {},
      expandedPart: 1,
      settings: {
        fontSize: 15,
        lineHeight: 1.7,
        fontWeight: "normal",
        explanationMode: "detailed",
        theme: "light",
        backgroundImage: "",
        wallpaperId: "theme",
        soundEnabled: true,
        soundPreset: "drop",
        noteMode: "type",
        drawing: {
          practice: { overlay: true, paper: true },
          wrong: { overlay: true, paper: true },
          notebook: { overlay: true, paper: true }
        },
        assistEnabled: false,
        highlighterOpacity: 0.28,
        themeStyle: "paper",
        contentFont: "sans",
        musicEnabled: false,
        musicTrack: "piano",
        musicVolume: 0.14,
        workspace: {
          leftRatio: 0.58,
          topRatio: 0.62
        }
      }
    };
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      const defaults = defaultState();
      const settings = { ...defaults.settings, ...(parsed?.settings || {}) };
      settings.workspace = {
        ...defaults.settings.workspace,
        ...(parsed?.settings?.workspace || {})
      };
      settings.drawing = {
        ...defaults.settings.drawing,
        ...(parsed?.settings?.drawing || {})
      };
      for (const mode of ["practice", "wrong", "notebook"]) {
        const value = settings.drawing[mode];
        settings.drawing[mode] = typeof value === "object"
          ? { overlay: value.overlay !== false, paper: value.paper !== false }
          : { overlay: value !== false, paper: value !== false };
      }
      if (parsed?.settings && parsed.settings.lineHeight === undefined) {
        settings.fontSize = 15;
        settings.lineHeight = 1.7;
      }
      if (!THEME_CATALOG.has(settings.themeStyle)) settings.themeStyle = "paper";
      if (!FONT_STACKS[settings.contentFont]) settings.contentFont = "sans";
      if (!MUSIC_PRESETS[settings.musicTrack]) settings.musicTrack = "piano";
      if (parsed?.settings?.wallpaperId === undefined && settings.backgroundImage) {
        settings.wallpaperId = "custom";
      }
      if (
        settings.wallpaperId !== "theme" &&
        settings.wallpaperId !== "custom" &&
        !/^(?:conan|shinchan|kid)-\d{2}$/.test(settings.wallpaperId || "")
      ) {
        settings.wallpaperId = settings.backgroundImage ? "custom" : "theme";
      }
      settings.highlighterOpacity = Math.min(
        0.75,
        Math.max(0.08, Number(settings.highlighterOpacity) || 0.28)
      );
      settings.musicVolume = Math.min(0.4, Math.max(0, Number(settings.musicVolume) || 0.14));
      return {
        ...defaults,
        ...(parsed || {}),
        version: 4,
        settings
      };
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
      return true;
    } catch {
      showToast("本地存储空间不足，请换一张更小的背景图片");
      return false;
    }
  }

  function themeWallpaperForCurrentTheme() {
    const theme = currentTheme();
    const color = theme.id.split("-")[1] || "";
    const mappings = {
      conan: {
        pink: "conan-02",
        green: "conan-05",
        blue: "conan-01",
        black: "conan-08"
      },
      shinchan: {
        pink: "shinchan-03",
        green: "shinchan-05",
        blue: "shinchan-07",
        black: "shinchan-08"
      }
    };
    const wallpaperId = mappings[theme.family]?.[color];
    return wallpaperId ? WALLPAPER_MAP.get(wallpaperId) || null : null;
  }

  function selectedWallpaper() {
    const wallpaperId = STATE.settings.wallpaperId || "theme";
    if (wallpaperId === "theme") return themeWallpaperForCurrentTheme();
    if (wallpaperId === "custom") {
      return STATE.settings.backgroundImage
        ? {
            id: "custom",
            title: "自定义壁纸",
            src: STATE.settings.backgroundImage,
            thumb: STATE.settings.backgroundImage
          }
        : null;
    }
    return WALLPAPER_MAP.get(wallpaperId) || null;
  }

  function wallpaperName() {
    const wallpaper = selectedWallpaper();
    return wallpaper?.title || "跟随主题";
  }

  function applyPreferences() {
    const size = Math.min(36, Math.max(10, Number(STATE.settings.fontSize) || 15));
    const lineHeight = Math.min(
      2.5,
      Math.max(1.1, Number(STATE.settings.lineHeight) || 1.7)
    );
    const isBold = STATE.settings.fontWeight === "bold";
    const theme = THEME_CATALOG.get(STATE.settings.themeStyle) || THEME_CATALOG.get("paper");
    const isDark = STATE.settings.theme === "dark";
    document.documentElement.dataset.theme = STATE.settings.theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.themeFamily = theme.family;
    document.documentElement.dataset.themeStyle = STATE.settings.themeStyle;
    document.documentElement.style.setProperty("--reading-size", `${size}px`);
    document.documentElement.style.setProperty("--reading-line-height", String(lineHeight));
    document.documentElement.style.setProperty(
      "--content-font",
      FONT_STACKS[STATE.settings.contentFont] || FONT_STACKS.sans
    );
    document.documentElement.style.setProperty(
      "--reading-title-weight",
      isBold ? "800" : "600"
    );
    document.documentElement.style.setProperty(
      "--reading-body-weight",
      isBold ? "650" : "400"
    );
    const wallpaper = selectedWallpaper();
    document.documentElement.dataset.wallpaper = wallpaper ? "image" : "theme";
    document.documentElement.style.setProperty(
      "--custom-background",
      wallpaper?.src ? `url("${wallpaper.src}")` : "none"
    );
    if (backgroundNode) {
      backgroundNode.style.opacity = wallpaper ? "1" : "0";
    }
    const palette = {
      paper: theme.paper,
      paperDeep: theme.deep,
      surface: theme.surface,
      ink: theme.ink,
      muted: theme.muted,
      line: theme.line,
      green: theme.accent,
      greenSoft: theme.soft,
      red: theme.red,
      redSoft: theme.redSoft,
      gold: theme.gold,
      goldSoft: theme.goldSoft
    };
    if (isDark) {
      palette.paper = "#151916";
      palette.paperDeep = "#252b26";
      palette.surface = "#1e241f";
      palette.ink = "#f2eee3";
      palette.muted = "#aaa99e";
      palette.line = "#3b453d";
      palette.greenSoft = "#1d392d";
      palette.redSoft = "#3b2422";
      palette.goldSoft = "#382f20";
    }
    const cssVariables = {
      "--paper": palette.paper,
      "--paper-deep": palette.paperDeep,
      "--surface": palette.surface,
      "--ink": palette.ink,
      "--muted": palette.muted,
      "--line": palette.line,
      "--green": palette.green,
      "--green-soft": palette.greenSoft,
      "--red": palette.red,
      "--red-soft": palette.redSoft,
      "--gold": palette.gold,
      "--gold-soft": palette.goldSoft,
      "--hero-bg": isDark ? "#0f1410" : theme.hero || theme.ink
    };
    for (const [name, value] of Object.entries(cssVariables)) {
      document.documentElement.style.setProperty(name, value);
    }
    const themeMeta = document.querySelector?.('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute(
        "content",
        isDark ? "#151916" : theme.paper
      );
    }
  }

  function drawingEnabledForMode(mode, channel) {
    const key = ["wrong", "notebook"].includes(mode) ? mode : "practice";
    const value = STATE.settings.drawing?.[key];
    if (typeof value === "boolean") return value;
    return value?.[channel] !== false;
  }

  function currentTheme() {
    return THEME_CATALOG.get(STATE.settings.themeStyle) || THEME_CATALOG.get("paper");
  }

  function themeBrandMark() {
    const theme = currentTheme();
    if (theme.id === "conan-blue-晴蓝") return "柯";
    if (theme.id === "shinchan-pink-浅樱") return "新";
    return "1000";
  }

  function themeHeroDecor() {
    const theme = currentTheme();
    if (theme.id === "conan-blue-晴蓝") {
      return `<div class="theme-hero-art detective-theme-art" aria-hidden="true">
        <svg viewBox="0 0 280 220">
          <circle cx="220" cy="55" r="42" class="theme-moon"/>
          <path d="M26 173c35-13 46-37 71-51 27-16 69-4 92 23 18 22 36 31 64 34" class="theme-line"/>
          <circle cx="150" cy="95" r="35" class="detective-head"/>
          <path d="M116 86c7-35 63-52 80-10l-10 3c-15-25-43-22-56 8Z" class="detective-hair"/>
          <circle cx="137" cy="94" r="15" class="detective-glasses"/>
          <circle cx="164" cy="94" r="15" class="detective-glasses"/>
          <path d="M151 94h-0.5M122 90l-20-7M179 90l18-7" class="detective-glasses"/>
          <path d="M132 112c10 8 28 8 38 0" class="theme-line"/>
          <path d="M124 132c16-10 38-10 53 0l14 57c-27 17-63 16-84 1Z" class="detective-coat"/>
          <path d="m143 140 9 7 9-7 7 13-16 11-16-11Z" class="detective-bowtie"/>
          <circle cx="70" cy="142" r="38" class="magnifier-ring"/>
          <path d="m98 171 30 29" class="magnifier-handle"/>
          <path d="M239 138h20M249 128v20" class="theme-crosshair"/>
        </svg>
        <span class="theme-case-stamp">CASE FILE · 真相只有一个</span>
      </div>`;
    }
    if (theme.id === "shinchan-pink-浅樱") {
      return `<div class="theme-hero-art shinchan-theme-art" aria-hidden="true">
        <svg viewBox="0 0 280 220">
          <circle cx="221" cy="48" r="34" class="crayon-sun"/>
          <path d="M25 61c14-18 29-18 43 0 18-19 37-14 46 7H25Z" class="crayon-cloud"/>
          <path d="M89 75c34-27 84-24 111 6 20 22 26 58 10 83-19 30-88 38-118 11-30-27-34-76-3-100Z" class="crayon-face"/>
          <path d="M107 102c11-12 24-11 34 0M155 100c10-11 23-10 32 0" class="crayon-brows"/>
          <path d="M123 118c3 3 6 3 9 0M160 117c3 3 6 3 9 0" class="crayon-eyes"/>
          <path d="M128 139c14 11 32 10 44-1" class="crayon-mouth"/>
          <path d="M82 159c-20 16-29 32-31 51M199 161c21 15 29 30 32 49" class="crayon-arms"/>
          <path d="M116 153c11-7 29-7 39 0l15 55h-73Z" class="crayon-shirt"/>
          <path d="m211 112 8-18 8 18 19 7-19 7-8 19-8-19-18-7Z" class="crayon-star"/>
          <path d="M34 121c17 4 23 11 27 26M38 156c11-7 20-8 31-4" class="crayon-scribble"/>
        </svg>
        <span class="theme-case-stamp"> crayon club · 今天也要元气满满 </span>
      </div>`;
    }
    return "";
  }

  function conciseExplanation(question) {
    const text = String(question.explanation || "").replace(/\s+/g, "");
    if (!text || text.startsWith("答案册未单独展开简析")) {
      return text || "本题解析暂缺，请以答案解析册原文为准。";
    }
    const sentences = text.match(/[^。！？!?；;]+[。！？!?；;]?/g) || [text];
    let result = "";
    for (const sentence of sentences) {
      if (result && result.length + sentence.length > 150) break;
      result += sentence;
      if (result.length >= 72) break;
    }
    if (result.length < 30) result = text.slice(0, 150);
    if (result.length < text.length && !/[。！？!?；;]$/.test(result)) result += "…";
    return result;
  }

  function ensureAudioContext() {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioContext = new AudioContextClass();
    }
    if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
    return audioContext;
  }

  function playAnswerSound(preset = STATE.settings.soundPreset, preview = false) {
    if (!preview && !STATE.settings.soundEnabled) return;
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const note = (frequency, start, duration, type = "sine", volume = 0.11, endFrequency) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      if (endFrequency) {
        oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
      }
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    };

    if (preset === "wood") {
      note(520, now, 0.1, "triangle", 0.08, 390);
      note(1040, now + 0.006, 0.055, "sine", 0.025, 760);
    } else if (preset === "chime") {
      note(660, now, 0.18, "sine", 0.075);
      note(880, now + 0.12, 0.24, "sine", 0.06);
    } else if (preset === "feather") {
      note(490, now, 0.24, "sine", 0.065, 760);
      note(980, now + 0.018, 0.18, "sine", 0.018, 1120);
    } else {
      note(840, now, 0.19, "sine", 0.095, 510);
      note(1680, now + 0.01, 0.1, "sine", 0.022, 980);
    }
  }

  function stopBackgroundMusic() {
    if (!musicEngine) return;
    clearInterval(musicEngine.timer);
    for (const source of musicEngine.sources) {
      try {
        source.stop();
      } catch {}
      try {
        source.disconnect();
      } catch {}
    }
    try {
      musicEngine.master.disconnect();
    } catch {}
    musicEngine = null;
  }

  function makeNoiseBuffer(context, seconds = 3) {
    const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
    const channel = buffer.getChannelData(0);
    let previous = 0;
    for (let index = 0; index < channel.length; index += 1) {
      const white = Math.random() * 2 - 1;
      previous = previous * 0.97 + white * 0.03;
      channel[index] = previous * 2.8;
    }
    return buffer;
  }

  function startBackgroundMusic() {
    if (!STATE.settings.musicEnabled) {
      stopBackgroundMusic();
      return;
    }
    const context = ensureAudioContext();
    if (!context) return;
    stopBackgroundMusic();
    const master = context.createGain();
    master.gain.setValueAtTime(
      Math.min(0.4, Math.max(0, Number(STATE.settings.musicVolume) || 0.14)),
      context.currentTime
    );
    master.connect(context.destination);
    musicEngine = { master, sources: [], timer: null };
    const track = STATE.settings.musicTrack;

    if (track === "piano") {
      const chords = [
        [261.63, 329.63, 392.0],
        [220.0, 261.63, 329.63],
        [174.61, 220.0, 261.63],
        [196.0, 246.94, 293.66]
      ];
      let chordIndex = 0;
      const playChord = () => {
        if (!musicEngine) return;
        const now = context.currentTime + 0.03;
        const chord = chords[chordIndex % chords.length];
        chordIndex += 1;
        chord.forEach((frequency, noteIndex) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(frequency, now + noteIndex * 0.16);
          gain.gain.setValueAtTime(0.0001, now + noteIndex * 0.16);
          gain.gain.exponentialRampToValueAtTime(0.085, now + noteIndex * 0.16 + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + noteIndex * 0.16 + 2.8);
          oscillator.connect(gain);
          gain.connect(master);
          oscillator.start(now + noteIndex * 0.16);
          oscillator.stop(now + noteIndex * 0.16 + 2.9);
          musicEngine?.sources.push(oscillator);
          oscillator.onended = () => {
            if (musicEngine) {
              musicEngine.sources = musicEngine.sources.filter((source) => source !== oscillator);
            }
          };
        });
      };
      playChord();
      musicEngine.timer = setInterval(playChord, 3200);
      return;
    }

    const noise = context.createBufferSource();
    noise.buffer = makeNoiseBuffer(context, 4);
    noise.loop = true;
    const filter = context.createBiquadFilter();
    const ambienceGain = context.createGain();
    noise.connect(filter);
    filter.connect(ambienceGain);
    ambienceGain.connect(master);
    if (track === "rain") {
      filter.type = "highpass";
      filter.frequency.value = 950;
      ambienceGain.gain.value = 0.72;
    } else if (track === "stream") {
      filter.type = "bandpass";
      filter.frequency.value = 1180;
      filter.Q.value = 0.38;
      ambienceGain.gain.value = 0.82;
    } else {
      filter.type = "lowpass";
      filter.frequency.value = 1450;
      ambienceGain.gain.value = 0.68;
    }
    noise.start();
    musicEngine.sources.push(noise);

    if (track === "forest") {
      let chirpIndex = 0;
      musicEngine.timer = setInterval(() => {
        if (!musicEngine) return;
        const now = context.currentTime;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const base = chirpIndex % 2 ? 1450 : 1780;
        chirpIndex += 1;
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(base, now);
        oscillator.frequency.exponentialRampToValueAtTime(base * 1.22, now + 0.16);
        oscillator.frequency.exponentialRampToValueAtTime(base * 0.92, now + 0.34);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.055, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start(now);
        oscillator.stop(now + 0.4);
        musicEngine?.sources.push(oscillator);
        oscillator.onended = () => {
          if (musicEngine) {
            musicEngine.sources = musicEngine.sources.filter((source) => source !== oscillator);
          }
        };
      }, 5800);
    }
  }

  function bindMusicUnlock() {
    if (musicUnlockBound) return;
    musicUnlockBound = true;
    document.addEventListener(
      "pointerdown",
      () => {
        if (STATE.settings.musicEnabled && !musicEngine) startBackgroundMusic();
      },
      { once: true, passive: true }
    );
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalizeQuestion(raw, index) {
    const answer = Array.isArray(raw.answer)
      ? raw.answer.join("")
      : String(raw.answer || raw.correct || "");
    const answerLetters = [...new Set(answer.toUpperCase().match(/[A-D]/g) || [])].sort();
    const options = {};
    for (const letter of ["A", "B", "C", "D"]) {
      options[letter] = String(raw.options?.[letter] ?? "").trim();
    }
    return {
      ...raw,
      id: String(raw.id || `q-${index + 1}`),
      type: raw.type === "multi" ? "multi" : "single",
      number: Number(raw.number || 0),
      stem: String(raw.stem || "").trim(),
      options,
      answerLetters,
      explanation: String(raw.explanation || "").trim(),
      chapterId: String(raw.chapterId || ""),
      chapter: String(raw.chapter || "")
    };
  }

  async function init() {
    applyPreferences();
    app.innerHTML = '<div class="loading"><div><div class="loader-ring"></div><div>正在准备题库…</div></div></div>';
    try {
      if (window.__XIAO1000_DATA__) {
        DATA = window.__XIAO1000_DATA__;
      } else {
        const response = await fetch("./data/questions.json", { cache: "no-store" });
        if (!response.ok) throw new Error(`题库读取失败：${response.status}`);
        DATA = await response.json();
      }
      try {
        if (window.__XIAO1000_WALLPAPERS__) {
          WALLPAPERS = window.__XIAO1000_WALLPAPERS__;
        } else {
          const wallpaperResponse = await fetch("./assets/wallpapers/wallpapers.json", {
            cache: "no-store"
          });
          if (wallpaperResponse.ok) {
            const wallpaperData = await wallpaperResponse.json();
            WALLPAPERS = Array.isArray(wallpaperData.items) ? wallpaperData.items : [];
          }
        }
      } catch {
        WALLPAPERS = [];
      }
      WALLPAPER_MAP = new Map(WALLPAPERS.map((wallpaper) => [wallpaper.id, wallpaper]));
      QUESTIONS = DATA.questions.map(normalizeQuestion);
      QUESTION_MAP = new Map(QUESTIONS.map((question) => [question.id, question]));
      for (const part of DATA.parts || []) {
        for (const chapter of part.chapters || []) {
          CHAPTER_MAP.set(chapter.id, { ...chapter, partNumber: part.number, partTitle: part.title });
        }
      }
      applyPreferences();
      render();
      registerServiceWorker();
      bindMusicUnlock();
    } catch (error) {
      app.innerHTML = `
        <div class="empty-state">
          <strong>题库没有加载成功</strong>
          ${escapeHtml(error.message)}<br><br>
          请通过应用附带的启动文件打开，或重新载入页面。
        </div>`;
    }
  }

  function registerServiceWorker() {
    if (
      !window.__XIAO1000_SINGLE__ &&
      "serviceWorker" in navigator &&
      location.protocol.startsWith("http")
    ) {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    }
  }

  function showToast(message) {
    toastNode.textContent = message;
    toastNode.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toastNode.classList.remove("show"), 1800);
  }

  function todayKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function stats() {
    const progress = Object.values(STATE.progress);
    const attempts = progress.reduce((sum, item) => sum + (item.attempts || 0), 0);
    const correct = progress.reduce((sum, item) => sum + (item.correctAttempts || 0), 0);
    const pendingWrong = Object.values(STATE.wrong).filter((item) => !item.mastered).length;
    const today = STATE.daily[todayKey()] || 0;
    return {
      answered: progress.length,
      attempts,
      accuracy: attempts ? Math.round((correct / attempts) * 100) : 0,
      pendingWrong,
      today
    };
  }

  function allChapters() {
    return (DATA?.parts || []).flatMap((part) =>
      (part.chapters || []).map((chapter) => ({
        ...chapter,
        partNumber: part.number,
        partTitle: part.title
      }))
    );
  }

  function chapterMetrics() {
    const metrics = new Map(
      allChapters().map((chapter) => [
        chapter.id,
        {
          chapter,
          attempts: 0,
          correctAttempts: 0,
          wrongQuestions: 0
        }
      ])
    );
    for (const question of QUESTIONS) {
      const metric = metrics.get(question.chapterId);
      if (!metric) continue;
      const progress = STATE.progress[question.id];
      if (progress) {
        metric.attempts += progress.attempts || 0;
        metric.correctAttempts += progress.correctAttempts || 0;
      }
      if (STATE.wrong[question.id]) metric.wrongQuestions += 1;
    }
    for (const metric of metrics.values()) {
      metric.accuracy = metric.attempts
        ? Math.round((metric.correctAttempts / metric.attempts) * 100)
        : null;
    }
    return metrics;
  }

  function notebookQuestions() {
    const chapterOrder = new Map(allChapters().map((chapter, index) => [chapter.id, index]));
    return Object.keys(STATE.notebook || {})
      .map((id) => QUESTION_MAP.get(id))
      .filter(Boolean)
      .sort((a, b) =>
        ((chapterOrder.get(a.chapterId) ?? 999) - (chapterOrder.get(b.chapterId) ?? 999))
        || ((a.type === "multi") - (b.type === "multi"))
        || (a.number - b.number)
      );
  }

  function isInNotebook(questionId) {
    return Boolean(STATE.notebook?.[questionId]);
  }

  function setNotebookState(question, enabled) {
    if (enabled) {
      const existing = STATE.notebook[question.id] || {};
      STATE.notebook[question.id] = {
        chapterId: question.chapterId,
        addedAt: existing.addedAt || Date.now(),
        updatedAt: Date.now(),
        hasDrawing: Boolean(existing.hasDrawing)
      };
    } else {
      delete STATE.notebook[question.id];
    }
    saveState();
  }

  function toggleManualWrong(question) {
    const existing = STATE.wrong[question.id];
    if (existing) {
      if ((existing.wrongCount || 0) > 0) {
        showToast("这道题已有真实错误记录，不能从这里删除");
        return;
      }
      delete STATE.wrong[question.id];
      saveState();
      render();
      showToast("已移出手动错题本");
      return;
    }
    STATE.wrong[question.id] = {
      wrongCount: 0,
      correctStreak: 0,
      mastered: false,
      manual: true,
      firstWrongAt: Date.now(),
      lastWrongAt: 0
    };
    saveState();
    render();
    showToast("已加入错题本");
  }

  const drawingCache = new Map();
  let drawingDbPromise = null;

  function openDrawingDb() {
    if (!("indexedDB" in window)) return Promise.resolve(null);
    if (drawingDbPromise) return drawingDbPromise;
    drawingDbPromise = new Promise((resolve) => {
      try {
        const request = indexedDB.open("xiao1000-drawings", 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains("drawings")) {
            db.createObjectStore("drawings");
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
    return drawingDbPromise;
  }

  async function getDrawingData(questionId) {
    if (drawingCache.has(questionId)) return drawingCache.get(questionId);
    const fallback = STATE.drawingFallback?.[questionId] || "";
    const db = await openDrawingDb();
    if (!db) return fallback;
    return new Promise((resolve) => {
      try {
        const request = db.transaction("drawings", "readonly").objectStore("drawings").get(questionId);
        request.onsuccess = () => resolve(request.result || fallback);
        request.onerror = () => resolve(fallback);
      } catch {
        resolve(fallback);
      }
    });
  }

  async function saveDrawingData(questionId, dataUrl) {
    drawingCache.set(questionId, dataUrl);
    const db = await openDrawingDb();
    if (db) {
      await new Promise((resolve) => {
        try {
          const transaction = db.transaction("drawings", "readwrite");
          transaction.objectStore("drawings").put(dataUrl, questionId);
          transaction.oncomplete = resolve;
          transaction.onerror = resolve;
        } catch {
          resolve();
        }
      });
      return;
    }
    STATE.drawingFallback = STATE.drawingFallback || {};
    STATE.drawingFallback[questionId] = dataUrl;
    saveState();
  }

  async function deleteDrawingData(questionId) {
    drawingCache.delete(questionId);
    if (STATE.drawingFallback) delete STATE.drawingFallback[questionId];
    const db = await openDrawingDb();
    if (db) {
      await new Promise((resolve) => {
        try {
          const transaction = db.transaction("drawings", "readwrite");
          transaction.objectStore("drawings").delete(questionId);
          transaction.oncomplete = resolve;
          transaction.onerror = resolve;
        } catch {
          resolve();
        }
      });
    }
    saveState();
  }

  async function clearAllDrawingData() {
    drawingCache.clear();
    STATE.drawingFallback = {};
    const db = await openDrawingDb();
    if (!db) return;
    await new Promise((resolve) => {
      try {
        const transaction = db.transaction("drawings", "readwrite");
        transaction.objectStore("drawings").clear();
        transaction.oncomplete = resolve;
        transaction.onerror = resolve;
      } catch {
        resolve();
      }
    });
  }

  function drawingStorageKey(question, target) {
    return target === "overlay" ? `overlay:${question.id}` : question.id;
  }

  function saveCanvasSnapshot(question, canvas, target = "paper") {
    const model = canvasModels.get(canvas);
    if (!model) return;
    const storageKey = drawingStorageKey(question, target);
    const hasContent = model.items.length > 0 || Boolean(model.legacyImage);
    const existing = STATE.notebook[question.id] || {};
    STATE.notebook[question.id] = {
      chapterId: question.chapterId,
      addedAt: existing.addedAt || Date.now(),
      updatedAt: Date.now(),
      hasDrawing: hasContent,
      hasPaperDrawing:
        target === "paper" ? hasContent : Boolean(existing.hasPaperDrawing),
      hasOverlayDrawing:
        target === "overlay" ? hasContent : Boolean(existing.hasOverlayDrawing)
    };
    saveState();
    const payload = JSON.stringify({
      version: 1,
      items: model.items
    });
    saveDrawingData(`vector:${storageKey}`, payload).catch(() => {
      showToast("手写内容保存失败，请重试");
    });
  }

  function brushMultiplier(brush) {
    return brush === "highlighter" ? 2.4 : brush === "marker" ? 1.45 : brush === "pencil" ? 0.8 : 1;
  }

  function drawVectorItem(context, item, width, height) {
    const brush = item.brush || "pen";
    context.globalCompositeOperation = item.eraser ? "destination-out" : "source-over";
    context.strokeStyle = item.color || "#20231f";
    context.fillStyle = item.color || "#20231f";
    context.lineCap = brush === "highlighter" ? "square" : "round";
    context.lineJoin = "round";
    context.globalAlpha = brush === "pencil" ? 0.55 : brush === "marker" ? 0.82 : 1;
    context.lineWidth = Math.max(1, Number(item.width) || 3) * brushMultiplier(brush);

    if (item.type === "stroke") {
      if (!item.points?.length) return;
      context.beginPath();
      const first = item.points[0];
      context.moveTo(first.x * width, first.y * height);
      for (let index = 1; index < item.points.length; index += 1) {
        const point = item.points[index];
        context.lineTo(point.x * width, point.y * height);
      }
      if (item.points.length === 1) {
        context.lineTo(first.x * width + 0.1, first.y * height + 0.1);
      }
      context.stroke();
      return;
    }

    const x1 = item.x1 * width;
    const y1 = item.y1 * height;
    const x2 = item.x2 * width;
    const y2 = item.y2 * height;
    context.beginPath();
    if (item.type === "line") {
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
    } else if (item.type === "ellipse") {
      context.ellipse(
        (x1 + x2) / 2,
        (y1 + y2) / 2,
        Math.max(0.5, Math.abs(x2 - x1) / 2),
        Math.max(0.5, Math.abs(y2 - y1) / 2),
        0,
        0,
        Math.PI * 2
      );
    } else if (item.type === "rect") {
      context.rect(
        Math.min(x1, x2),
        Math.min(y1, y2),
        Math.abs(x2 - x1),
        Math.abs(y2 - y1)
      );
    }
    context.stroke();
  }

  function drawSelection(context, shape, width, height) {
    if (!shape) return;
    const x1 = shape.x1 * width;
    const y1 = shape.y1 * height;
    const x2 = shape.x2 * width;
    const y2 = shape.y2 * height;
    const padding = 7;
    context.save();
    context.globalAlpha = 1;
    context.globalCompositeOperation = "source-over";
    context.strokeStyle = "#0f7bdb";
    context.lineWidth = 1.5;
    context.setLineDash([5, 4]);
    context.strokeRect(
      Math.min(x1, x2) - padding,
      Math.min(y1, y2) - padding,
      Math.abs(x2 - x1) + padding * 2,
      Math.abs(y2 - y1) + padding * 2
    );
    context.setLineDash([]);
    context.fillStyle = "#ffffff";
    context.strokeStyle = "#0f7bdb";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(x2, y2, 7, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();
  }

  function renderDrawingCanvas(canvas, model, activeItem = null) {
    if (!canvas || !model) return;
    const context = canvas.getContext("2d");
    const ratio = model.ratio || 1;
    const width = canvas.width / ratio;
    const height = canvas.height / ratio;
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (model.legacyImage) {
      context.drawImage(model.legacyImage, 0, 0, canvas.width, canvas.height);
    }
    context.restore();
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const items = activeItem ? [...model.items, activeItem] : model.items;
    for (const item of items) {
      if (item.type !== "stroke" || item.brush !== "highlighter") {
        drawVectorItem(context, item, width, height);
      }
    }

    const highlighterLayer = document.createElement("canvas");
    highlighterLayer.width = canvas.width;
    highlighterLayer.height = canvas.height;
    const highlighterContext = highlighterLayer.getContext("2d");
    highlighterContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    let hasHighlighter = false;
    for (const item of items) {
      if ((item.type === "stroke" && item.brush === "highlighter") || item.eraser) {
        drawVectorItem(highlighterContext, item, width, height);
        if (item.type === "stroke" && item.brush === "highlighter") hasHighlighter = true;
      }
    }
    if (hasHighlighter) {
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = Math.min(
        0.75,
        Math.max(0.08, Number(STATE.settings.highlighterOpacity) || 0.28)
      );
      context.drawImage(highlighterLayer, 0, 0);
      context.restore();
    }

    const selected = model.items.find(
      (item) => item.id === selectedShapeId && ["line", "ellipse", "rect"].includes(item.type)
    );
    if (selected && shapeSelectMode) drawSelection(context, selected, width, height);
  }

  function distanceToSegment(point, start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    if (!dx && !dy) return Math.hypot(point.x - start.x, point.y - start.y);
    const ratio = Math.max(
      0,
      Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy))
    );
    return Math.hypot(point.x - (start.x + ratio * dx), point.y - (start.y + ratio * dy));
  }

  function recognizeStroke(points, width, height) {
    if (!STATE.settings.assistEnabled || points.length < 5) return null;
    const start = points[0];
    const end = points[points.length - 1];
    const minX = Math.min(...points.map((point) => point.x));
    const maxX = Math.max(...points.map((point) => point.x));
    const minY = Math.min(...points.map((point) => point.y));
    const maxY = Math.max(...points.map((point) => point.y));
    const boxWidth = maxX - minX;
    const boxHeight = maxY - minY;
    if (boxWidth < 18 && boxHeight < 18) return null;
    const diagonal = Math.hypot(boxWidth, boxHeight);
    const closingDistance = Math.hypot(end.x - start.x, end.y - start.y);
    const closed = closingDistance <= Math.max(15, diagonal * 0.24);
    const chord = Math.hypot(end.x - start.x, end.y - start.y);
    const makeShape = (type) => ({
      id: `shape-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      x1: minX / width,
      y1: minY / height,
      x2: maxX / width,
      y2: maxY / height,
      color: drawingColor,
      width: drawingWidth,
      brush: drawingBrush
    });

    if (!closed && chord >= 32) {
      let maxDeviation = 0;
      for (const point of points) {
        maxDeviation = Math.max(maxDeviation, distanceToSegment(point, start, end));
      }
      if (maxDeviation <= Math.max(7, chord * 0.085)) {
        const shape = {
          ...makeShape("line"),
          x1: start.x / width,
          y1: start.y / height,
          x2: end.x / width,
          y2: end.y / height
        };
        return shape;
      }
    }

    if (closed && boxWidth >= 24 && boxHeight >= 24) {
      const minDimension = Math.max(1, Math.min(boxWidth, boxHeight));
      let edgeHits = 0;
      for (const point of points) {
        const edgeDistance = Math.min(
          Math.abs(point.x - minX),
          Math.abs(point.x - maxX),
          Math.abs(point.y - minY),
          Math.abs(point.y - maxY)
        );
        if (edgeDistance <= Math.max(6, minDimension * 0.12)) edgeHits += 1;
      }
      let axisAlignedSegments = 0;
      for (let index = 1; index < points.length; index += 1) {
        const dx = Math.abs(points[index].x - points[index - 1].x);
        const dy = Math.abs(points[index].y - points[index - 1].y);
        if (dx < 0.5 && dy < 0.5) continue;
        const angle = Math.atan2(dy, dx);
        const axisDistance = Math.min(angle, Math.abs(Math.PI / 2 - angle));
        if (axisDistance <= 0.34) axisAlignedSegments += 1;
      }
      const axisAlignedRatio = axisAlignedSegments / Math.max(1, points.length - 1);
      if (edgeHits / points.length >= 0.68 && axisAlignedRatio >= 0.68) {
        return makeShape("rect");
      }

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const radiusX = Math.max(1, boxWidth / 2);
      const radiusY = Math.max(1, boxHeight / 2);
      let radialError = 0;
      for (const point of points) {
        const normalizedRadius = Math.hypot(
          (point.x - centerX) / radiusX,
          (point.y - centerY) / radiusY
        );
        radialError += Math.abs(1 - normalizedRadius);
      }
      if (radialError / points.length <= 0.19) return makeShape("ellipse");
    }
    return null;
  }

  function shapeFromPoint(model, point, width, height) {
    const shapes = model.items
      .filter((item) => ["line", "ellipse", "rect"].includes(item.type))
      .reverse();
    return shapes.find((shape) => {
      const x1 = shape.x1 * width;
      const y1 = shape.y1 * height;
      const x2 = shape.x2 * width;
      const y2 = shape.y2 * height;
      const margin = Math.max(12, Number(shape.width) || 3);
      if (shape.type === "line") {
        return distanceToSegment(point, { x: x1, y: y1 }, { x: x2, y: y2 }) <= margin;
      }
      return (
        point.x >= Math.min(x1, x2) - margin &&
        point.x <= Math.max(x1, x2) + margin &&
        point.y >= Math.min(y1, y2) - margin &&
        point.y <= Math.max(y1, y2) + margin
      );
    });
  }

  function setupDrawingCanvas(question, target = "paper") {
    const canvasId = target === "overlay" ? "question-drawing-canvas" : "drawing-canvas";
    const canvas = document.getElementById(canvasId);
    if (!canvas || !canvas.getContext) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = Math.min(3, Math.max(1, window.devicePixelRatio || 1));
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    const context = canvas.getContext("2d");
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.lineCap = "round";
    context.lineJoin = "round";

    const storageKey = drawingStorageKey(question, target);
    const vectorKey = `vector:${storageKey}`;
    const isActive = target === "overlay" ? overlayDrawingMode : drawingMode;
    drawingQuestionId = question.id;
    const model = {
      question,
      target,
      storageKey,
      ratio,
      legacyImage: null,
      items: []
    };
    canvasModels.set(canvas, model);

    Promise.all([getDrawingData(storageKey), getDrawingData(vectorKey)]).then(
      ([legacyData, vectorData]) => {
        if (!canvas.isConnected || canvasModels.get(canvas) !== model) return;
        try {
          const parsed = vectorData ? JSON.parse(vectorData) : null;
          model.items = Array.isArray(parsed?.items) ? parsed.items : [];
        } catch {
          model.items = [];
        }
        if (!legacyData) {
          renderDrawingCanvas(canvas, model);
          return;
        }
        const image = new Image();
        image.onload = () => {
          if (!canvas.isConnected || canvasModels.get(canvas) !== model) return;
          model.legacyImage = image;
          renderDrawingCanvas(canvas, model);
        };
        image.src = legacyData;
      }
    );

    if (!isActive || canvas.dataset.bound === "true") return;
    canvas.dataset.bound = "true";
    let activePointer = null;
    let activeItem = null;
    let dragState = null;

    const pointFromEvent = (event) => {
      const bounds = canvas.getBoundingClientRect();
      return {
        x: Math.max(0, Math.min(bounds.width, event.clientX - bounds.left)),
        y: Math.max(0, Math.min(bounds.height, event.clientY - bounds.top)),
        pressure: event.pointerType === "pen" ? Math.max(0.25, event.pressure || 0.5) : 1
      };
    };

    const save = () => saveCanvasSnapshot(question, canvas, target);
    const redraw = () => renderDrawingCanvas(canvas, model, activeItem);
    const finishPointer = (event) => {
      if (activePointer !== event.pointerId) return;
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {}
      activePointer = null;
      if (dragState) {
        dragState = null;
        save();
        return;
      }
      if (!activeItem) return;
      const finished = activeItem;
      activeItem = null;
      const recognized =
        !finished.eraser
          ? recognizeStroke(finished.rawPoints || [], rect.width, rect.height)
          : null;
      if (recognized) {
        model.items.push(recognized);
        selectedShapeId = recognized.id;
      } else {
        delete finished.rawPoints;
        finished.points = finished.rawPointsNormalized || finished.points;
        delete finished.rawPointsNormalized;
        model.items.push(finished);
      }
      renderDrawingCanvas(canvas, model);
      save();
    };

    canvas.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      event.preventDefault();
      activePointer = event.pointerId;
      canvas.setPointerCapture(event.pointerId);
      const point = pointFromEvent(event);

      if (shapeSelectMode && STATE.settings.assistEnabled) {
        const shape = shapeFromPoint(model, point, rect.width, rect.height);
        if (!shape) {
          selectedShapeId = "";
          renderDrawingCanvas(canvas, model);
          return;
        }
        selectedShapeId = shape.id;
        const resizeDistance = Math.hypot(
          point.x - shape.x2 * rect.width,
          point.y - shape.y2 * rect.height
        );
        dragState = {
          shape,
          mode: resizeDistance <= 22 ? "resize" : "move",
          start: point,
          original: { x1: shape.x1, y1: shape.y1, x2: shape.x2, y2: shape.y2 }
        };
        renderDrawingCanvas(canvas, model);
        return;
      }

      const brush = drawingEraser ? "eraser" : drawingBrush;
      const normalizedPoints = [{ x: point.x / rect.width, y: point.y / rect.height }];
      activeItem = {
        id: `stroke-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: "stroke",
        brush,
        color: drawingColor,
        width: drawingWidth,
        eraser: drawingEraser,
        rawPoints: [point],
        rawPointsNormalized: normalizedPoints,
        points: normalizedPoints
      };
      redraw();
    });

    canvas.addEventListener("pointermove", (event) => {
      if (activePointer !== event.pointerId) return;
      event.preventDefault();
      const point = pointFromEvent(event);
      if (dragState) {
        const dx = (point.x - dragState.start.x) / rect.width;
        const dy = (point.y - dragState.start.y) / rect.height;
        const original = dragState.original;
        if (dragState.mode === "move") {
          dragState.shape.x1 = Math.max(0, Math.min(1, original.x1 + dx));
          dragState.shape.y1 = Math.max(0, Math.min(1, original.y1 + dy));
          dragState.shape.x2 = Math.max(0, Math.min(1, original.x2 + dx));
          dragState.shape.y2 = Math.max(0, Math.min(1, original.y2 + dy));
        } else {
          dragState.shape.x2 = Math.max(0, Math.min(1, point.x / rect.width));
          dragState.shape.y2 = Math.max(0, Math.min(1, point.y / rect.height));
        }
        redraw();
        return;
      }
      if (!activeItem) return;
      activeItem.rawPoints.push(point);
      activeItem.rawPointsNormalized.push({
        x: point.x / rect.width,
        y: point.y / rect.height
      });
      redraw();
    });
    canvas.addEventListener("pointerup", finishPointer);
    canvas.addEventListener("pointercancel", finishPointer);
  }

  function setupWorkspaceSplitters() {
    const workspace = document.getElementById("wrong-workspace");
    const top = document.getElementById("workspace-top");
    const questionPane = document.getElementById("workspace-question-pane");
    const columnHandle = document.getElementById("split-column");
    const rowHandle = document.getElementById("split-row");
    if (!workspace || !top || !questionPane || !columnHandle || !rowHandle) return;
    if (window.innerWidth < 720) return;

    const clamp = (value, minimum, maximum) =>
      Math.min(maximum, Math.max(minimum, value));

    const applyLayout = () => {
      const workspaceRect = workspace.getBoundingClientRect();
      const topRect = top.getBoundingClientRect();
      const rowRatio = clamp(Number(STATE.settings.workspace?.topRatio) || 0.62, 0.34, 0.78);
      const leftRatio = clamp(Number(STATE.settings.workspace?.leftRatio) || 0.58, 0.34, 0.72);
      const topHeight = clamp(
        (workspaceRect.height - 11) * rowRatio,
        260,
        Math.max(260, workspaceRect.height - 155)
      );
      const leftWidth = clamp(
        (topRect.width - 11) * leftRatio,
        290,
        Math.max(290, topRect.width - 230)
      );
      top.style.height = `${Math.round(topHeight)}px`;
      top.style.flex = "0 0 auto";
      questionPane.style.flexBasis = `${Math.round(leftWidth)}px`;
      questionPane.style.flexGrow = "0";
      questionPane.style.flexShrink = "0";
    };

    if (workspaceResizeHandler) window.removeEventListener("resize", workspaceResizeHandler);
    workspaceResizeHandler = applyLayout;
    window.addEventListener("resize", workspaceResizeHandler);
    applyLayout();

    const beginDrag = (event, type) => {
      event.preventDefault();
      const handle = type === "column" ? columnHandle : rowHandle;
      handle.setPointerCapture?.(event.pointerId);
      const move = (moveEvent) => {
        if (type === "column") {
          const bounds = top.getBoundingClientRect();
          const ratio = clamp((moveEvent.clientX - bounds.left - 11) / bounds.width, 0.34, 0.72);
          STATE.settings.workspace.leftRatio = ratio;
        } else {
          const bounds = workspace.getBoundingClientRect();
          const ratio = clamp((moveEvent.clientY - bounds.top) / bounds.height, 0.34, 0.78);
          STATE.settings.workspace.topRatio = ratio;
        }
        applyLayout();
      };
      const end = () => {
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", end);
        handle.removeEventListener("pointercancel", end);
        saveState();
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", end);
      handle.addEventListener("pointercancel", end);
    };

    columnHandle.addEventListener("pointerdown", (event) => beginDrag(event, "column"));
    rowHandle.addEventListener("pointerdown", (event) => beginDrag(event, "row"));
  }

  function topbar() {
    const header = page.name === "home"
      ? `<div class="brand">
           <div class="brand-mark">${themeBrandMark()}</div>
           <div><h1>肖1000 · 轻刷题</h1><p>专注选择题 · 本地保存</p></div>
         </div>
         <button class="icon-button" data-action="open-settings" aria-label="设置">${icons.settings}</button>`
      : `<button class="back-button" data-action="${page.name === "chapters" || page.name === "wrong" || page.name === "notebook" ? "home" : "close-practice"}" aria-label="返回">${icons.back}</button>
         <div class="brand"><div><h1 style="font-size:18px">${escapeHtml(pageTitle())}</h1></div></div>
         <span style="width:42px"></span>`;
    return `<header class="topbar">${header}</header>`;
  }

  function pageTitle() {
    if (page.name === "chapters") return "章节练习";
    if (page.name === "wrong") return "错题本";
    if (page.name === "notebook") return "我的笔记本";
    if (page.name === "practice") return STATE.activeSession?.title || "答题";
    return "";
  }

  function render() {
    const view = page.name === "chapters"
      ? renderChapters()
      : page.name === "wrong"
        ? renderWrong()
        : page.name === "notebook"
          ? renderNotebook()
        : page.name === "practice"
          ? renderPractice()
          : renderHome();
    app.innerHTML = (page.name === "practice" ? "" : topbar()) + view + renderSheet();
    window.scrollTo({ top: 0, behavior: "instant" });
    if (page.name === "practice" && STATE.activeSession) {
      const question = QUESTION_MAP.get(STATE.activeSession.queue[STATE.activeSession.index]);
      if (question) {
        const schedule = window.requestAnimationFrame || ((callback) => setTimeout(callback, 0));
        schedule(() => {
          setupDrawingCanvas(question, "paper");
          setupDrawingCanvas(question, "overlay");
          if (STATE.activeSession.mode === "wrong" || STATE.activeSession.mode === "notebook") {
            setupWorkspaceSplitters();
          }
        });
      }
    }
  }

  function renderHome() {
    const current = stats();
    const session = STATE.activeSession;
    const resume = session && !session.finished
      ? `<div class="resume-line">
           <div><strong>${escapeHtml(session.title)}</strong><small>上次做到 ${Math.min(session.index + 1, session.queue.length)} / ${session.queue.length}</small></div>
           <button class="plain-button" data-action="continue-session">继续 ${icons.chevron}</button>
         </div>`
      : "";

    return `
      <section class="hero">
        ${themeHeroDecor()}
        <p class="eyebrow" style="color:#b8d5c8">2027 考研政治</p>
        <h2>${session && !session.finished ? "接着刚才的进度，继续刷题。" : "把一道题，练成下意识的判断。"}</h2>
        <p>${session && !session.finished ? "本次选择会自动保存，退出应用也不会丢失。" : "点选项立即判题，显示答案与解析；错题自动累计，可从高到低集中复习。"}</p>
        <div class="hero-actions">
          <button class="primary-button" data-action="${session && !session.finished ? "continue-session" : "random-sheet"}">
            ${session && !session.finished ? "继续刷题" : "开始随机练习"}
          </button>
          <button class="secondary-button" data-action="go-chapters">按章节刷</button>
        </div>
      </section>
      ${resume}
      <div class="stats">
        <div class="stat"><strong>${current.today}</strong><span>今日作答</span></div>
        <div class="stat"><strong>${current.accuracy}%</strong><span>累计正确率</span></div>
        <div class="stat"><strong>${current.pendingWrong}</strong><span>待复习错题</span></div>
      </div>
      <div class="section-heading"><h3>开始练习</h3><span>共 ${QUESTIONS.length} 道选择题</span></div>
      <div class="action-grid">
        <button class="action-card highlight wide" data-action="random-sheet">
          <span class="action-icon">${icons.shuffle}</span>
          <span class="action-copy"><strong>随机练习</strong><small>抽取 20 / 50 / 100 题，快速进入状态</small></span>
        </button>
        <button class="action-card" data-action="go-chapters">
          <span class="action-icon">${icons.book}</span>
          <span class="action-copy"><strong>章节练习</strong><small>按五个部分和章节逐项突破</small></span>
        </button>
        <button class="action-card" data-action="go-wrong">
          <span class="action-icon">${icons.wrong}</span>
          <span class="action-copy"><strong>错题本</strong><small>按错误次数从高到低排序</small></span>
        </button>
        <button class="action-card" data-action="go-notebook">
          <span class="action-icon">${icons.book}</span>
          <span class="action-copy"><strong>我的笔记本</strong><small>${Object.keys(STATE.notebook || {}).length} 道标记题 · 涂画与章节目录</small></span>
        </button>
      </div>
    `;
  }

  function inkToolsMarkup(overlay = false) {
    const wrapperClass = overlay ? "overlay-tools" : "drawing-toolbar";
    const undoAction = overlay ? "undo-overlay" : "undo-drawing";
    const clearAction = overlay ? "clear-overlay" : "clear-drawing";
    return `<div class="${wrapperClass}" data-ink-target="${overlay ? "overlay" : "paper"}">
      <button class="drawing-tool ${!drawingEraser && drawingBrush === "pen" ? "active" : ""}" data-action="draw-brush" data-brush="pen">钢笔</button>
      <button class="drawing-tool ${!drawingEraser && drawingBrush === "pencil" ? "active" : ""}" data-action="draw-brush" data-brush="pencil">铅笔</button>
      <button class="drawing-tool ${!drawingEraser && drawingBrush === "marker" ? "active" : ""}" data-action="draw-brush" data-brush="marker">马克笔</button>
      <button class="drawing-tool ${!drawingEraser && drawingBrush === "highlighter" ? "active" : ""}" data-action="draw-brush" data-brush="highlighter">荧光笔</button>
      <button class="pen-color ${drawingColor === "#b6403a" ? "active" : ""}" style="background:#b6403a" data-action="draw-color" data-color="#b6403a" aria-label="红色画笔"></button>
      <button class="pen-color ${drawingColor === "#1d5f45" ? "active" : ""}" style="background:#1d5f45" data-action="draw-color" data-color="#1d5f45" aria-label="绿色画笔"></button>
      <button class="pen-color ${drawingColor === "#334c82" ? "active" : ""}" style="background:#334c82" data-action="draw-color" data-color="#334c82" aria-label="蓝色画笔"></button>
      <button class="pen-color ${drawingColor === "#20231f" ? "active" : ""}" style="background:#20231f" data-action="draw-color" data-color="#20231f" aria-label="黑色画笔"></button>
      <button class="pen-color ${drawingColor === "#d49a1f" ? "active" : ""}" style="background:#d49a1f" data-action="draw-color" data-color="#d49a1f" aria-label="黄色荧光"></button>
      <button class="pen-color ${drawingColor === "#F4B6C2" ? "active" : ""}" style="background:#F4B6C2" data-action="draw-color" data-color="#F4B6C2" aria-label="奶油粉"></button>
      <button class="pen-color ${drawingColor === "#A8D5BA" ? "active" : ""}" style="background:#A8D5BA" data-action="draw-color" data-color="#A8D5BA" aria-label="薄荷绿"></button>
      <button class="pen-color ${drawingColor === "#C9B8E8" ? "active" : ""}" style="background:#C9B8E8" data-action="draw-color" data-color="#C9B8E8" aria-label="薰衣草紫"></button>
      <button class="pen-color ${drawingColor === "#F7D994" ? "active" : ""}" style="background:#F7D994" data-action="draw-color" data-color="#F7D994" aria-label="奶油黄"></button>
      <button class="pen-color ${drawingColor === "#A9D6E5" ? "active" : ""}" style="background:#A9D6E5" data-action="draw-color" data-color="#A9D6E5" aria-label="天空蓝"></button>
      <button class="pen-color ${drawingColor === "#F2B28C" ? "active" : ""}" style="background:#F2B28C" data-action="draw-color" data-color="#F2B28C" aria-label="蜜桃橙"></button>
      <button class="drawing-tool ${drawingWidth === 2 ? "active" : ""}" data-action="draw-width" data-width="2">细</button>
      <button class="drawing-tool ${drawingWidth === 4 ? "active" : ""}" data-action="draw-width" data-width="4">中</button>
      <button class="drawing-tool ${drawingWidth === 7 ? "active" : ""}" data-action="draw-width" data-width="7">粗</button>
      <button class="drawing-tool ${drawingEraser ? "active" : ""}" data-action="toggle-eraser">橡皮</button>
      ${STATE.settings.assistEnabled ? `<button class="drawing-tool ${shapeSelectMode ? "active" : ""}" data-action="toggle-shape-select">${shapeSelectMode ? "退出图形" : "选择图形"}</button>` : ""}
      ${STATE.settings.assistEnabled && shapeSelectMode && selectedShapeId ? '<button class="drawing-tool" data-action="delete-shape">删除图形</button>' : ""}
      <button class="drawing-tool" data-action="${undoAction}">撤销</button>
      <button class="drawing-tool" data-action="${clearAction}">清空</button>
    </div>`;
  }

  function renderChapters() {
    const metrics = chapterMetrics();
    return `
      <p class="eyebrow">完整题库 · 按章节</p>
      <div class="part-list">
        ${(DATA.parts || []).map((part) => {
          const open = STATE.expandedPart === part.number;
          const count = part.chapters.reduce((sum, chapter) => sum + chapter.counts.single + chapter.counts.multi, 0);
          return `<section class="part-card">
            <button class="part-toggle" data-action="toggle-part" data-part="${part.number}" aria-expanded="${open}">
              <span><small>第 ${part.number} 部分</small><strong>${escapeHtml(part.title)}</strong></span>
              <span style="display:flex;align-items:center;gap:8px"><small>${count} 题</small>${icons.chevron}</span>
            </button>
            <div class="chapter-list ${open ? "open" : ""}">
              ${part.chapters.map((chapter) => {
                const answered = [
                  ...(chapter.questionIds?.single || []),
                  ...(chapter.questionIds?.multi || [])
                ].filter((id) => STATE.progress[id]).length;
                const metric = metrics.get(chapter.id);
                const accuracy = metric?.accuracy == null ? "--" : `${metric.accuracy}%`;
                return `<div class="chapter-item">
                  <div class="chapter-head">
                    <strong>${escapeHtml(chapter.title)}</strong>
                    <span>已答 ${answered}/${chapter.counts.single + chapter.counts.multi}<br>正确率 ${accuracy} · 错题 ${metric?.wrongQuestions || 0}</span>
                  </div>
                  <div class="chapter-actions">
                    ${chapter.counts.single ? `<button class="chip" data-action="start-chapter" data-id="${chapter.id}" data-type="single">单选 ${chapter.counts.single}</button>` : ""}
                    ${chapter.counts.multi ? `<button class="chip" data-action="start-chapter" data-id="${chapter.id}" data-type="multi">多选 ${chapter.counts.multi}</button>` : ""}
                    <button class="chip active" data-action="start-chapter" data-id="${chapter.id}" data-type="all">混合练习</button>
                  </div>
                </div>`;
              }).join("")}
            </div>
          </section>`;
        }).join("")}
      </div>
    `;
  }

  function renderNotebook() {
    const questions = notebookQuestions();
    if (!questions.length) {
      return `
        <p class="eyebrow">手写批注 · 按章整理</p>
        <div class="empty-state">
          <strong>笔记本还是空的</strong>
          在答题页点击“加入笔记本”，或直接使用 Apple Pencil 涂画。标记过的题会自动按章节归档。
        </div>
        <div class="sheet-actions">
          <button class="primary-button" data-action="notebook-add-sheet">添加题目</button>
        </div>
      `;
    }

    const order = new Map(allChapters().map((chapter, index) => [chapter.id, index]));
    const groups = new Map();
    for (const question of questions) {
      if (!groups.has(question.chapterId)) {
        groups.set(question.chapterId, {
          id: question.chapterId,
          title: question.chapter,
          questions: []
        });
      }
      groups.get(question.chapterId).questions.push(question);
    }
    const grouped = [...groups.values()].sort(
      (a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999)
    );
    const metrics = chapterMetrics();

    return `
      <p class="eyebrow">手写批注 · 按章整理</p>
      <div class="resume-line" style="margin:0 0 14px">
        <div><strong>共 ${questions.length} 道标记题</strong><small>可自由加题、减题并直接练习</small></div>
        <div style="display:flex;gap:7px;flex:none">
          <button class="mini-button" data-action="notebook-add-sheet">加题</button>
          <button class="primary-button" data-action="practice-notebook-all">全部练习</button>
        </div>
      </div>
      <div class="notebook-list">
        ${grouped.map((group) => {
          const metric = metrics.get(group.id);
          const accuracy = metric?.accuracy == null ? "--" : `${metric.accuracy}%`;
          return `<section class="notebook-chapter">
            <div class="notebook-chapter-head">
              <div><strong>${escapeHtml(group.title)}</strong><small>${group.questions.length} 道 · 正确率 ${accuracy} · 错题 ${metric?.wrongQuestions || 0}</small></div>
              <div class="notebook-chapter-actions">
                <button class="mini-button" data-action="notebook-add-chapter" data-id="${group.id}">加题</button>
                <button class="mini-button" data-action="practice-notebook-chapter" data-id="${group.id}">练习</button>
              </div>
            </div>
            ${group.questions.map((question) => {
              const wrongCount = STATE.wrong[question.id]?.wrongCount || 0;
              return `<div class="notebook-question">
                <button class="notebook-open" data-action="open-notebook-question" data-id="${question.id}">
                  <strong>${question.number}. ${escapeHtml(question.stem)}</strong>
                  <small>${question.type === "multi" ? "多选" : "单选"} · 错 ${wrongCount} 次${STATE.notebook[question.id]?.hasDrawing ? " · 含手写" : ""}${STATE.notes?.[question.id] ? " · 含文字" : ""}</small>
                </button>
                <button class="remove-question" data-action="remove-notebook" data-id="${question.id}" aria-label="从笔记本移除">×</button>
              </div>`;
            }).join("")}
          </section>`;
        }).join("")}
      </div>
    `;
  }

  function wrongSorted() {
    return Object.entries(STATE.wrong)
      .map(([id, value]) => ({ id, ...value, question: QUESTION_MAP.get(id) }))
      .filter((entry) => entry.question)
      .sort(
        (a, b) =>
          (b.wrongCount - a.wrongCount) ||
          ((b.lastWrongAt || b.firstWrongAt || 0) - (a.lastWrongAt || a.firstWrongAt || 0))
      );
  }

  function renderWrong() {
    const all = wrongSorted();
    const chapterStats = [...chapterMetrics().values()];
    const shown = all.filter((entry) => {
      if (page.wrongTab === "pending") return !entry.mastered;
      if (page.wrongTab === "mastered") return entry.mastered;
      return true;
    });
    const list = shown.length
      ? `<div class="wrong-list">${shown.map((entry) => {
          const q = entry.question;
          return `<button class="wrong-item" data-action="review-wrong" data-id="${q.id}">
            <span class="wrong-count">${entry.wrongCount}<small>次</small></span>
            <span class="wrong-copy"><strong>${escapeHtml(q.stem)}</strong><small>${escapeHtml(q.chapter)} · 第 ${q.number} 题 · 答案 ${q.answerLetters.join("")}${entry.manual ? " · 手动加入" : ""}</small></span>
            <span>${icons.chevron}</span>
          </button>`;
        }).join("")}</div>`
      : `<div class="empty-state"><strong>${page.wrongTab === "pending" ? "暂无待复习错题" : page.wrongTab === "mastered" ? "还没有已掌握错题" : "错题本还是空的"}</strong>答错的题会自动收录，并累计错误次数。</div>`;
    return `
      <p class="eyebrow">错题优先 · 高频先刷</p>
      <details class="chapter-accuracy">
        <summary>章节正确率与错题概况</summary>
        <div class="accuracy-list">
          ${chapterStats.map((metric) => `
            <div class="accuracy-row">
              <span>${escapeHtml(metric.chapter.title)}</span>
              <strong>${metric.accuracy == null ? "--" : `${metric.accuracy}%`}</strong>
              <span>错题 ${metric.wrongQuestions}</span>
            </div>
          `).join("")}
        </div>
      </details>
      <div class="segmented" style="margin-bottom:16px">
        <button class="${page.wrongTab === "pending" ? "active" : ""}" data-action="wrong-tab" data-tab="pending">待复习 ${all.filter((item) => !item.mastered).length}</button>
        <button class="${page.wrongTab === "mastered" ? "active" : ""}" data-action="wrong-tab" data-tab="mastered">已掌握 ${all.filter((item) => item.mastered).length}</button>
        <button class="${page.wrongTab === "all" ? "active" : ""}" data-action="wrong-tab" data-tab="all">全部 ${all.length}</button>
      </div>
      <div class="resume-line" style="margin:0 0 14px">
        <div><strong>按错误次数排序</strong><small>错误最多的题排在最前面</small></div>
        <button class="plain-button" data-action="practice-wrong" ${shown.length ? "" : "disabled"}>开始复习</button>
      </div>
      ${list}
    `;
  }

  function renderPractice() {
    const session = STATE.activeSession;
    if (!session) {
      setTimeout(() => goHome(), 0);
      return "";
    }
    const question = QUESTION_MAP.get(session.queue[session.index]);
    if (!question) {
      return '<div class="empty-state">题目不存在，可能题库已经更新。</div>';
    }
    const response = session.responses[question.id];
    const answered = Boolean(response);
    const selected = answered ? response.selected : pendingSelection;
    const explanationMode = questionExplanationMode || STATE.settings.explanationMode;
    const explanationText = explanationMode === "concise"
      ? conciseExplanation(question)
      : question.explanation;
    const progress = session.queue.length ? ((session.index + 1) / session.queue.length) * 100 : 0;
    const isMulti = question.type === "multi";
    const canShowAnswer = question.answerLetters.length > 0;
    const inNotebook = isInNotebook(question.id);
    const hasDrawing = Boolean(STATE.notebook[question.id]?.hasDrawing);
    const overlayAllowed = drawingEnabledForMode(session.mode, "overlay");
    const paperAllowed = drawingEnabledForMode(session.mode, "paper");
    if (session.mode === "wrong" || session.mode === "notebook") {
      return renderWrongStudyPage({
        session,
        question,
        response,
        answered,
        selected,
        explanationMode,
        explanationText,
        progress,
        isMulti,
        inNotebook,
        hasDrawing
      });
    }

    return `
      <main class="practice-page">
        <div class="practice-head">
          <button class="back-button" data-action="close-practice" aria-label="退出练习">${icons.back}</button>
          <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span class="muted">${escapeHtml(session.title)}</span><span class="muted">${Math.round(progress)}%</span></div>
            <div class="progress-track"><span style="width:${progress}%"></span></div>
          </div>
          <div class="practice-counter"><strong>${session.index + 1}</strong><small>/ ${session.queue.length}</small></div>
        </div>
        <article class="question-card">
          <div class="question-meta">
            <span class="badge">${isMulti ? "多项选择" : "单项选择"}</span>
            <span class="badge neutral">${escapeHtml(question.chapter)}</span>
            ${STATE.wrong[question.id] ? `<span class="badge gold">错 ${STATE.wrong[question.id].wrongCount} 次</span>` : ""}
            <button class="notebook-chip ${inNotebook ? "active" : ""}" data-action="toggle-notebook" data-id="${question.id}">${inNotebook ? "已加入笔记本" : "加入笔记本"}</button>
            <button class="notebook-chip ${STATE.wrong[question.id] ? "active" : ""}" data-action="toggle-wrongbook" data-id="${question.id}">${STATE.wrong[question.id] ? "已加入错题本" : "加入错题本"}</button>
            ${overlayAllowed ? `<button class="drawing-toggle ${overlayDrawingMode ? "active" : ""}" data-action="toggle-overlay-ink">${overlayDrawingMode ? "关闭全局涂鸦" : "开启全局涂鸦"}</button>` : ""}
          </div>
          ${overlayAllowed && overlayDrawingMode ? inkToolsMarkup(true) : ""}
          <div class="question-drawing-surface" id="question-drawing-surface">
            <h2 class="question-title">${question.number}. ${escapeHtml(question.stem)}</h2>
            <div class="options">
              ${["A", "B", "C", "D"].filter((letter) => question.options[letter]).map((letter) => {
                const isCorrectAnswer = answered && question.answerLetters.includes(letter);
                const isWrongSelected = answered && response.selected.includes(letter) && !isCorrectAnswer;
                return `<button class="option-button ${selected.includes(letter) ? "selected" : ""} ${isCorrectAnswer ? "correct" : ""} ${isWrongSelected ? "wrong" : ""}"
                  data-action="select-option" data-letter="${letter}" ${answered ? "disabled" : ""}>
                  <span class="option-letter">${letter}</span>
                  <span class="option-text">${escapeHtml(question.options[letter])}</span>
                </button>`;
              }).join("")}
            </div>
          ${answered ? `
            <section class="feedback ${response.correct ? "" : "wrong"}">
              <div class="feedback-title">
                <span>${response.correct ? "回答正确" : "回答错误"}</span>
                <span>${response.correct ? icons.check : "继续巩固"}</span>
              </div>
              <p class="answer-line">正确答案：${question.answerLetters.join("")}</p>
              <div class="explanation-switch">
                <button class="${explanationMode === "concise" ? "active" : ""}" data-action="toggle-explanation" data-mode="concise">简洁解析</button>
                <button class="${explanationMode === "detailed" ? "active" : ""}" data-action="toggle-explanation" data-mode="detailed">详细解析</button>
              </div>
              <p>${explanationText ? escapeHtml(explanationText) : "本题解析暂缺，请以答案解析册原文为准。"}</p>
              ${question.reference ? `<p class="muted">${escapeHtml(question.reference)}</p>` : ""}
            </section>
          ` : isMulti ? '<p class="muted" style="margin:14px 2px 0">可多选，选完后提交答案。</p>' : '<p class="muted" style="margin:14px 2px 0">点击选项后立即判题。</p>'}
            ${overlayAllowed ? `<canvas id="question-drawing-canvas" class="question-drawing-canvas ${overlayDrawingMode ? "active" : ""}" data-question-id="${question.id}"></canvas>` : ""}
          </div>
          ${paperAllowed ? `<section class="drawing-section">
            <div class="drawing-head">
              <strong>手写批注${hasDrawing ? " · 已有笔记" : ""}</strong>
              <button class="drawing-toggle ${drawingMode ? "active" : ""}" data-action="toggle-drawing">${drawingMode ? "收起画笔" : hasDrawing ? "继续涂画" : "开始涂画"}</button>
            </div>
            ${drawingMode ? inkToolsMarkup(false) : ""}
            ${drawingMode || hasDrawing ? `<div class="canvas-shell">
              <canvas id="drawing-canvas" class="drawing-canvas ${drawingMode ? "" : "locked"}" data-question-id="${question.id}"></canvas>
            </div>` : ""}
            <p class="drawing-hint">${drawingMode ? "可用手指或 Apple Pencil 书写；起笔后自动存入笔记本。" : hasDrawing ? "笔记已保存，点击“继续涂画”修改。" : "需要批注时再展开画布，不遮挡正常答题。"}</p>
          </section>` : ""}
        </article>
        <div class="practice-footer">
          <button class="secondary-button" data-action="prev-question" ${session.index === 0 ? "disabled" : ""}>上一题</button>
          ${!answered && isMulti
            ? `<button class="primary-button" data-action="submit-multi" ${pendingSelection.length ? "" : "disabled"}>提交答案</button>`
            : `<button class="primary-button" data-action="next-question">${session.index === session.queue.length - 1 ? (answered ? "完成本轮" : "跳至末尾") : "下一题"}</button>`}
        </div>
        ${!canShowAnswer ? '<p class="muted" style="text-align:center">此题答案数据待校对</p>' : ""}
      </main>
    `;
  }

  function renderWrongStudyPage({
    session,
    question,
    response,
    answered,
    selected,
    explanationMode,
    explanationText,
    progress,
    isMulti,
    inNotebook,
    hasDrawing
  }) {
    const overlayAllowed = drawingEnabledForMode(session.mode, "overlay");
    const paperAllowed = drawingEnabledForMode(session.mode, "paper");
    const noteMode =
      paperAllowed && STATE.settings.noteMode === "draw" ? "draw" : "type";
    const noteText = STATE.notes?.[question.id] || "";
    return `
      <main class="wrong-study-page">
        <div class="practice-head">
          <button class="back-button" data-action="close-practice" aria-label="退出练习">${icons.back}</button>
          <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span class="muted">${escapeHtml(session.title)}</span><span class="muted">${Math.round(progress)}%</span></div>
            <div class="progress-track"><span style="width:${progress}%"></span></div>
          </div>
          <div class="practice-counter"><strong>${session.index + 1}</strong><small>/ ${session.queue.length}</small></div>
        </div>
        <div class="wrong-workspace ${overlayDrawingMode ? "overlay-active" : ""}" id="wrong-workspace">
          <div class="workspace-top" id="workspace-top">
            <section class="workspace-pane workspace-question" id="workspace-question-pane">
              <div class="workspace-title">
                <strong>题目</strong>
                <span class="badge neutral">${question.type === "multi" ? "多选" : "单选"}</span>
              </div>
              <div class="workspace-meta-actions" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:12px">
                <span class="badge">${escapeHtml(question.chapter)}</span>
                ${STATE.wrong[question.id] ? `<span class="badge gold">错 ${STATE.wrong[question.id].wrongCount} 次</span>` : ""}
                <button class="notebook-chip ${inNotebook ? "active" : ""}" data-action="toggle-notebook" data-id="${question.id}">${inNotebook ? "已加入笔记本" : "加入笔记本"}</button>
                <button class="notebook-chip ${STATE.wrong[question.id] ? "active" : ""}" data-action="toggle-wrongbook" data-id="${question.id}">${STATE.wrong[question.id] ? "已加入错题本" : "加入错题本"}</button>
                ${overlayAllowed ? `<button class="drawing-toggle ${overlayDrawingMode ? "active" : ""}" data-action="toggle-overlay-ink">${overlayDrawingMode ? "关闭全局涂鸦" : "开启全局涂鸦"}</button>` : ""}
              </div>
              ${overlayAllowed && overlayDrawingMode ? inkToolsMarkup(true) : ""}
              <div class="question-drawing-surface" id="question-drawing-surface">
                <h2 class="question-title">${question.number}. ${escapeHtml(question.stem)}</h2>
                <div class="options">
                  ${["A", "B", "C", "D"].filter((letter) => question.options[letter]).map((letter) => {
                    const isCorrectAnswer = answered && question.answerLetters.includes(letter);
                    const isWrongSelected = answered && response.selected.includes(letter) && !isCorrectAnswer;
                    return `<button class="option-button ${selected.includes(letter) ? "selected" : ""} ${isCorrectAnswer ? "correct" : ""} ${isWrongSelected ? "wrong" : ""}"
                      data-action="select-option" data-letter="${letter}" ${answered ? "disabled" : ""}>
                      <span class="option-letter">${letter}</span>
                      <span class="option-text">${escapeHtml(question.options[letter])}</span>
                    </button>`;
                  }).join("")}
                </div>
              </div>
              <div class="workspace-controls">
                <button class="secondary-button" data-action="prev-question" ${session.index === 0 ? "disabled" : ""}>上一题</button>
                ${!answered && isMulti
                  ? `<button class="primary-button" data-action="submit-multi" ${pendingSelection.length ? "" : "disabled"}>提交答案</button>`
                  : `<button class="primary-button" data-action="next-question">${session.index === session.queue.length - 1 ? (answered ? "完成本轮" : "下一题") : "下一题"}</button>`}
              </div>
            </section>

            <div class="split-handle vertical" id="split-column" data-action="split-column" aria-label="左右拖动调整题目和笔记宽度"></div>

            <section class="workspace-pane workspace-note">
              <div class="note-tabs">
                <button class="${noteMode === "type" ? "active" : ""}" data-action="note-mode" data-mode="type">纸张 · 打字</button>
                ${paperAllowed ? `<button class="${noteMode === "draw" ? "active" : ""}" data-action="note-mode" data-mode="draw">纸张 · 手写</button>` : ""}
              </div>
              <div class="note-content">
                ${noteMode === "type" ? `
                  <textarea id="note-text" class="note-textarea" data-question-id="${question.id}" placeholder="在这里记录解题思路、易错点和老师讲解……">${escapeHtml(noteText)}</textarea>
                ` : `
                  ${inkToolsMarkup(false)}
                  <div class="canvas-shell">
                    <canvas id="drawing-canvas" class="drawing-canvas" data-question-id="${question.id}"></canvas>
                  </div>
                `}
              </div>
            </section>
          </div>

          <div class="split-handle horizontal" id="split-row" data-action="split-row" aria-label="上下拖动调整解析区域高度"></div>

          <section class="workspace-pane workspace-explanation" id="workspace-explanation">
            <div class="workspace-title">
              <strong>解析</strong>
              ${answered ? `<div class="explanation-switch" style="margin:0">
                <button class="${explanationMode === "concise" ? "active" : ""}" data-action="toggle-explanation" data-mode="concise">简洁</button>
                <button class="${explanationMode === "detailed" ? "active" : ""}" data-action="toggle-explanation" data-mode="detailed">详细</button>
              </div>` : ""}
            </div>
            ${answered ? `
              <div class="feedback ${response.correct ? "" : "wrong"}" style="margin-top:0">
                <div class="feedback-title">
                  <span>${response.correct ? "回答正确" : "回答错误"}</span>
                  <span>正确答案：${question.answerLetters.join("")}</span>
                </div>
                <p>${explanationText ? escapeHtml(explanationText) : "本题解析暂缺，请以答案解析册原文为准。"}</p>
                ${question.reference ? `<p class="muted">${escapeHtml(question.reference)}</p>` : ""}
              </div>
            ` : '<div class="workspace-empty">提交答案后，这里会显示正确答案和解析。</div>'}
          </section>
          ${overlayAllowed ? `<canvas id="question-drawing-canvas" class="question-drawing-canvas workspace-overlay-canvas ${overlayDrawingMode ? "active" : ""}" data-question-id="${question.id}"></canvas>` : ""}
        </div>
      </main>
    `;
  }

  function renderSheet() {
    if (!sheet) return "";
    if (sheet.type === "random") {
      return `<div class="sheet-backdrop" data-action="close-sheet">
        <section class="sheet" role="dialog" aria-modal="true" aria-label="随机练习" data-sheet-content>
          <h3>随机练习</h3>
          <p>从 ${QUESTIONS.length} 道选择题中随机抽取，顺序会保存在本机。</p>
          <div class="action-grid" style="grid-template-columns:repeat(2,1fr)">
            ${[20, 50, 100].map((count) => `<button class="secondary-button" data-action="start-random" data-count="${count}">${count} 题</button>`).join("")}
            <button class="primary-button" data-action="start-random" data-count="all">全部题目</button>
          </div>
          <div class="sheet-actions"><button class="secondary-button" data-action="close-sheet">取消</button></div>
        </section>
      </div>`;
    }
    if (sheet.type === "notebook-chapters") {
      return `<div class="sheet-backdrop" data-action="close-sheet">
        <section class="sheet" role="dialog" aria-modal="true" aria-label="选择章节" data-sheet-content>
          <h3>选择要添加题目的章节</h3>
          <p>进入章节后，点击题目即可加入或移出笔记本。</p>
          <div class="part-list">
            ${(DATA.parts || []).map((part) => `
              <details class="part-card" ${part.number === 1 ? "open" : ""}>
                <summary class="part-toggle" style="display:flex">第 ${part.number} 部分 · ${escapeHtml(part.title)}</summary>
                <div class="chapter-list open">
                  ${part.chapters.map((chapter) => `
                    <button class="notebook-question" data-action="open-notebook-picker" data-id="${chapter.id}">
                      <span><strong>${escapeHtml(chapter.title)}</strong><small>${chapter.counts.single + chapter.counts.multi} 道题</small></span>
                      <span>${icons.chevron}</span>
                    </button>
                  `).join("")}
                </div>
              </details>
            `).join("")}
          </div>
          <div class="sheet-actions"><button class="secondary-button" data-action="close-sheet">关闭</button></div>
        </section>
      </div>`;
    }
    if (sheet.type === "notebook-picker") {
      const chapter = CHAPTER_MAP.get(sheet.chapterId);
      const chapterQuestions = QUESTIONS.filter((question) => question.chapterId === sheet.chapterId);
      return `<div class="sheet-backdrop" data-action="close-sheet">
        <section class="sheet" role="dialog" aria-modal="true" aria-label="选择题目" data-sheet-content>
          <h3>${escapeHtml(chapter?.title || "添加题目")}</h3>
          <p>点击一次加入，再点一次移除。共 ${chapterQuestions.length} 道题。</p>
          <div class="question-picker-list">
            ${chapterQuestions.map((question) => `
              <button class="question-picker-item" data-action="toggle-notebook-picker" data-id="${question.id}">
                <span><strong>${question.number}. ${escapeHtml(question.stem)}</strong><small>${question.type === "multi" ? "多选" : "单选"}</small></span>
                <span class="badge ${isInNotebook(question.id) ? "gold" : "neutral"}">${isInNotebook(question.id) ? "已加入" : "加入"}</span>
              </button>
            `).join("")}
          </div>
          <div class="sheet-actions"><button class="primary-button" data-action="close-sheet">完成</button></div>
        </section>
      </div>`;
    }
    if (sheet.type === "settings") {
      const current = stats();
      const settings = STATE.settings;
      const wallpaperGroups = [];
      for (const wallpaper of WALLPAPERS) {
        let group = wallpaperGroups.find((item) => item.id === wallpaper.group);
        if (!group) {
          group = {
            id: wallpaper.group,
            title: wallpaper.groupTitle,
            items: []
          };
          wallpaperGroups.push(group);
        }
        group.items.push(wallpaper);
      }
      const themeWallpaper = themeWallpaperForCurrentTheme();
      return `<div class="sheet-backdrop" data-action="close-sheet">
        <section class="sheet" role="dialog" aria-modal="true" aria-label="刷题设置" data-sheet-content>
          <h3>刷题设置</h3>
          <p>设置和练习记录只保存在当前设备，不会上传。</p>

          <div class="setting-block">
            <div class="setting-label"><strong>题目字号</strong><small>10–36px · 作用于题目、选项和解析</small></div>
            <div class="font-stepper">
              <button data-action="font-step" data-delta="-1" aria-label="缩小字体">−</button>
              <input id="font-size-input" type="range" min="10" max="36" step="1" value="${settings.fontSize}" aria-label="题目字号" />
              <button data-action="font-step" data-delta="1" aria-label="放大字体">+</button>
              <output>${settings.fontSize}px</output>
            </div>
          </div>

          <div class="setting-block">
            <div class="setting-label"><strong>行间距</strong><small>1.1 紧凑 · 2.5 宽松</small></div>
            <div class="font-stepper">
              <button data-action="line-height-step" data-delta="-0.1" aria-label="减小行间距">−</button>
              <input id="line-height-input" type="range" min="1.1" max="2.5" step="0.1" value="${settings.lineHeight}" aria-label="行间距" />
              <button data-action="line-height-step" data-delta="0.1" aria-label="增大行间距">+</button>
              <output>${Number(settings.lineHeight).toFixed(1)}</output>
            </div>
          </div>

          <div class="setting-block">
            <div class="setting-label"><strong>字体粗细</strong><small>作用于题干、选项和解析</small></div>
            <div class="segmented">
              <button class="${settings.fontWeight !== "bold" ? "active" : ""}" data-action="font-weight-setting" data-weight="normal">常规</button>
              <button class="${settings.fontWeight === "bold" ? "active" : ""}" data-action="font-weight-setting" data-weight="bold">加粗</button>
            </div>
          </div>

          <div class="setting-block">
            <div class="setting-label"><strong>全局字体</strong><small>数字和英文自动使用 Times New Roman</small></div>
            <div class="font-choice-grid">
              ${Object.entries(FONT_PRESETS).map(([key, label]) => `
                <button class="font-choice ${settings.contentFont === key ? "active" : ""}" data-action="content-font" data-font="${key}">
                  ${label}
                </button>
              `).join("")}
            </div>
          </div>

          <div class="setting-block">
            <div class="setting-label"><strong>全局主题</strong><small>马卡龙、动漫主题与自然景观</small></div>
            <select id="theme-select" class="settings-select" aria-label="选择全局主题">
              ${THEME_FAMILIES.map((family) => `
                <optgroup label="${escapeHtml(family.label)}">
                  ${family.themes.map((theme) => `
                    <option value="${theme.id}" ${settings.themeStyle === theme.id ? "selected" : ""}>${escapeHtml(theme.name)}</option>
                  `).join("")}
                </optgroup>
              `).join("")}
            </select>
            <div class="theme-preview-line">
              <span style="background:${THEME_CATALOG.get(settings.themeStyle)?.paper || "#f4f1e8"}"></span>
              <span style="background:${THEME_CATALOG.get(settings.themeStyle)?.surface || "#fffdf8"}"></span>
              <span style="background:${THEME_CATALOG.get(settings.themeStyle)?.deep || "#ebe6d8"}"></span>
              <span style="background:${THEME_CATALOG.get(settings.themeStyle)?.accent || "#176b4e"}"></span>
              <small>${escapeHtml(THEME_CATALOG.get(settings.themeStyle)?.name || "原纸色")}</small>
            </div>
          </div>

          <div class="setting-block">
            <div class="setting-label"><strong>分模式涂鸦</strong><small>全局涂鸦与纸张手写可分别关闭，已有内容不会删除</small></div>
            ${[
              ["practice", "普通刷题", "章节和随机练习"],
              ["wrong", "错题本", "错题复习页面"],
              ["notebook", "笔记本", "标记题目练习"]
            ].map(([key, title, description]) => {
              const value = settings.drawing?.[key];
              const overlayOn = typeof value === "boolean" ? value : value?.overlay !== false;
              const paperOn = typeof value === "boolean" ? value : value?.paper !== false;
              return `<div class="drawing-mode-row">
                <div><strong>${title}</strong><br><small class="muted">${description}</small></div>
                <div class="drawing-mode-switches">
                  <label>全局<button class="switch ${overlayOn ? "on" : ""}" data-action="toggle-drawing-mode" data-mode="${key}" data-channel="overlay" aria-pressed="${overlayOn}"></button></label>
                  <label>纸张<button class="switch ${paperOn ? "on" : ""}" data-action="toggle-drawing-mode" data-mode="${key}" data-channel="paper" aria-pressed="${paperOn}"></button></label>
                </div>
              </div>`;
            }).join("")}
          </div>

          <div class="setting-block">
            <div class="toggle-row">
              <div><strong>图形辅助</strong><br><small class="muted">手写字自动整理为直线、圆/椭圆或矩形，并可移动缩放</small></div>
              <button class="switch ${settings.assistEnabled ? "on" : ""}" data-action="toggle-assist" aria-label="切换图形辅助" aria-pressed="${settings.assistEnabled}"></button>
            </div>
          </div>

          <div class="setting-block">
            <div class="setting-label"><strong>荧光笔透明度</strong><small>整层统一透明度，重复涂抹不会继续变深</small></div>
            <div class="font-stepper">
              <span></span>
              <input id="highlighter-opacity-input" type="range" min="0.08" max="0.75" step="0.01" value="${settings.highlighterOpacity}" aria-label="荧光笔透明度" />
              <span></span>
              <output>${Math.round(settings.highlighterOpacity * 100)}%</output>
            </div>
          </div>

          <div class="setting-block">
            <div class="setting-label"><strong>解析默认展示</strong><small>答题中仍可单独切换</small></div>
            <div class="segmented">
              <button class="${settings.explanationMode === "concise" ? "active" : ""}" data-action="explanation-setting" data-mode="concise">简洁版</button>
              <button class="${settings.explanationMode === "detailed" ? "active" : ""}" data-action="explanation-setting" data-mode="detailed">详细版</button>
            </div>
          </div>

          <div class="setting-block">
            <div class="toggle-row">
              <div><strong>深夜模式</strong><br><small class="muted">降低夜间阅读亮度</small></div>
              <button class="switch ${settings.theme === "dark" ? "on" : ""}" data-action="toggle-theme" aria-label="切换深夜模式" aria-pressed="${settings.theme === "dark"}"></button>
            </div>
          </div>

          <div class="setting-block wallpaper-setting">
            <div class="setting-label">
              <strong>主题壁纸</strong>
              <small>当前：${escapeHtml(wallpaperName())}</small>
            </div>
            <p class="wallpaper-help">选择壁纸后会直接替换主题自带背景，主题颜色、选框和装饰仍然保留。</p>
            <div class="wallpaper-group">
              <div class="wallpaper-group-title"><strong>跟随主题</strong><small>不额外设置壁纸</small></div>
              <div class="wallpaper-rail">
                <button class="wallpaper-choice theme-wallpaper-choice ${settings.wallpaperId === "theme" ? "active" : ""}"
                  data-action="select-wallpaper" data-wallpaper="theme">
                  ${
                    themeWallpaper
                      ? `<img src="${escapeHtml(themeWallpaper.thumb)}" alt="${escapeHtml(themeWallpaper.title)}" />`
                      : `<span class="wallpaper-theme-preview">${escapeHtml(currentTheme().name)}</span>`
                  }
                  <span class="wallpaper-caption"><strong>主题自带壁纸</strong><small>${escapeHtml(themeWallpaper?.title || "随主题自动变化")}</small></span>
                </button>
                <label class="wallpaper-choice custom-wallpaper-choice ${settings.wallpaperId === "custom" ? "active" : ""}">
                  ${
                    settings.backgroundImage
                      ? `<img src="${settings.backgroundImage}" alt="自定义壁纸预览" />`
                      : '<span class="wallpaper-upload-mark">＋</span>'
                  }
                  <span class="wallpaper-caption"><strong>本地图片</strong><small>从相册选择</small></span>
                  <input id="background-file" type="file" accept="image/*" />
                </label>
              </div>
            </div>
            ${wallpaperGroups.map((group) => `
              <div class="wallpaper-group">
                <div class="wallpaper-group-title"><strong>${escapeHtml(group.title)}</strong><small>${group.items.length} 张</small></div>
                <div class="wallpaper-rail">
                  ${group.items.map((wallpaper) => `
                    <button class="wallpaper-choice ${settings.wallpaperId === wallpaper.id ? "active" : ""}"
                      data-action="select-wallpaper" data-wallpaper="${escapeHtml(wallpaper.id)}">
                      <img src="${escapeHtml(wallpaper.thumb)}" alt="${escapeHtml(wallpaper.title)}" loading="lazy" />
                      <span class="wallpaper-caption"><strong>${escapeHtml(wallpaper.title)}</strong><small>${escapeHtml(wallpaper.groupShort)}</small></span>
                    </button>
                  `).join("")}
                </div>
              </div>
            `).join("")}
            <div class="background-actions" style="margin-top:10px">
              <label class="file-button">上传自己的壁纸<input id="background-file-secondary" type="file" accept="image/*" /></label>
              <button class="secondary-button" data-action="reset-background">改用主题背景</button>
            </div>
          </div>

          <div class="setting-block">
            <div class="toggle-row">
              <div><strong>答题音效</strong><br><small class="muted">提交答案时播放</small></div>
              <button class="switch ${settings.soundEnabled ? "on" : ""}" data-action="toggle-sound" aria-label="切换答题音效" aria-pressed="${settings.soundEnabled}"></button>
            </div>
            <div class="sound-options" style="margin-top:10px">
              ${Object.entries(SOUND_PRESETS).map(([key, label]) => `
                <button class="sound-choice ${settings.soundPreset === key ? "active" : ""}" data-action="select-sound" data-sound="${key}">
                  <span>${label}</span>
                  <span class="sound-preview" data-action="preview-sound" data-sound="${key}" title="试听">▶</span>
                </button>
              `).join("")}
            </div>
          </div>

          <div class="setting-block">
            <div class="toggle-row">
              <div><strong>全局背景音乐</strong><br><small class="muted">首次点按页面后开始播放</small></div>
              <button class="switch ${settings.musicEnabled ? "on" : ""}" data-action="toggle-music" aria-label="切换背景音乐" aria-pressed="${settings.musicEnabled}"></button>
            </div>
            <select id="music-track" class="settings-select" aria-label="选择背景音乐" style="margin-top:10px">
              ${Object.entries(MUSIC_PRESETS).map(([key, label]) => `
                <option value="${key}" ${settings.musicTrack === key ? "selected" : ""}>${label}</option>
              `).join("")}
            </select>
            <div class="font-stepper" style="margin-top:9px">
              <span></span>
              <input id="music-volume-input" type="range" min="0.03" max="0.4" step="0.01" value="${settings.musicVolume}" aria-label="背景音乐音量" />
              <span></span>
              <output>${Math.round((settings.musicVolume / 0.4) * 100)}%</output>
            </div>
          </div>

          <div class="summary-grid">
            <div class="summary-cell"><strong>${current.answered}</strong><span>已练题目</span></div>
            <div class="summary-cell"><strong>${current.attempts}</strong><span>累计作答</span></div>
            <div class="summary-cell"><strong>${Object.keys(STATE.wrong).length}</strong><span>错题记录</span></div>
          </div>
          <button class="secondary-button" style="width:100%;margin-bottom:9px" data-action="clear-data">清空全部练习记录</button>
          <div class="sheet-actions"><button class="primary-button" data-action="close-sheet">完成</button></div>
        </section>
      </div>`;
    }
    if (sheet.type === "summary") {
      const result = sheet.result;
      return `<div class="sheet-backdrop">
        <section class="sheet" role="dialog" aria-modal="true" aria-label="本轮完成">
          <h3>本轮刷题完成</h3>
          <p>${escapeHtml(sheet.title)}</p>
          <div class="summary-grid">
            <div class="summary-cell"><strong>${result.answered}</strong><span>作答</span></div>
            <div class="summary-cell"><strong>${result.correct}</strong><span>答对</span></div>
            <div class="summary-cell"><strong>${result.wrong}</strong><span>答错</span></div>
          </div>
          <div class="sheet-actions">
            ${result.wrong ? '<button class="secondary-button" data-action="practice-wrong">复习错题</button>' : ""}
            <button class="primary-button" data-action="close-summary">返回首页</button>
          </div>
        </section>
      </div>`;
    }
    return "";
  }

  function shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
  }

  function startSession(title, queue, mode = "practice") {
    if (!queue.length) {
      showToast("这里暂时没有可练习的题目");
      return;
    }
    STATE.activeSession = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title,
      mode,
      queue: queue.map((item) => (typeof item === "string" ? item : item.id)),
      index: 0,
      responses: {},
      startedAt: Date.now(),
      finished: false
    };
    pendingSelection = [];
    questionExplanationMode = STATE.settings.explanationMode;
    drawingMode =
      (mode === "wrong" || mode === "notebook") &&
      drawingEnabledForMode(mode, "paper") &&
      STATE.settings.noteMode === "draw";
    drawingQuestionId = "";
    overlayDrawingMode = false;
    sheet = null;
    page = { name: "practice", part: null, wrongTab: page.wrongTab };
    saveState();
    render();
  }

  function startRandom(count) {
    const size = count === "all" ? QUESTIONS.length : Math.min(Number(count), QUESTIONS.length);
    const queue = shuffle(QUESTIONS).slice(0, size);
    startSession(`随机练习 · ${size} 题`, queue, "random");
  }

  function startChapter(chapterId, type) {
    const chapter = CHAPTER_MAP.get(chapterId);
    if (!chapter) return;
    const pool = QUESTIONS.filter((question) =>
      question.chapterId === chapterId && (type === "all" || question.type === type)
    );
    startSession(`${chapter.title} · ${type === "all" ? "混合" : type === "single" ? "单选" : "多选"}`, pool, "chapter");
  }

  function submitAnswer(question, selected) {
    const session = STATE.activeSession;
    if (!session || session.responses[question.id] || !question.answerLetters.length) return;
    const normalized = [...selected].sort();
    const correct = normalized.join("") === question.answerLetters.join("");
    playAnswerSound(STATE.settings.soundPreset);
    session.responses[question.id] = {
      selected: normalized,
      correct,
      answeredAt: Date.now()
    };
    const progress = STATE.progress[question.id] || {
      attempts: 0,
      correctAttempts: 0,
      wrongAttempts: 0
    };
    progress.attempts += 1;
    progress.lastResult = correct ? "correct" : "wrong";
    progress.lastAt = Date.now();
    STATE.progress[question.id] = progress;
    STATE.daily[todayKey()] = (STATE.daily[todayKey()] || 0) + 1;

    if (correct) {
      progress.correctAttempts += 1;
      const wrong = STATE.wrong[question.id];
      if (wrong) {
        wrong.correctStreak = (wrong.correctStreak || 0) + 1;
        wrong.lastCorrectAt = Date.now();
        if (wrong.correctStreak >= 2) wrong.mastered = true;
      }
    } else {
      progress.wrongAttempts += 1;
      const wrong = STATE.wrong[question.id] || {
        wrongCount: 0,
        correctStreak: 0,
        mastered: false,
        firstWrongAt: Date.now()
      };
      wrong.wrongCount += 1;
      wrong.correctStreak = 0;
      wrong.mastered = false;
      wrong.manual = false;
      wrong.lastWrongAt = Date.now();
      STATE.wrong[question.id] = wrong;
    }
    pendingSelection = [];
    saveState();
    render();
  }

  function nextQuestion() {
    const session = STATE.activeSession;
    if (!session) return;
    if (session.index >= session.queue.length - 1) {
      finishSession();
      return;
    }
    session.index += 1;
    pendingSelection = [];
    saveState();
    render();
  }

  function previousQuestion() {
    const session = STATE.activeSession;
    if (!session || session.index === 0) return;
    session.index -= 1;
    pendingSelection = [];
    saveState();
    render();
  }

  function finishSession() {
    const session = STATE.activeSession;
    if (!session) return;
    const responses = Object.values(session.responses);
    const result = {
      answered: responses.length,
      correct: responses.filter((item) => item.correct).length,
      wrong: responses.filter((item) => !item.correct).length
    };
    session.finished = true;
    session.finishedAt = Date.now();
    saveState();
    sheet = { type: "summary", result, title: session.title };
    render();
  }

  function goHome() {
    page = { name: "home", part: page.part, wrongTab: page.wrongTab };
    pendingSelection = [];
    drawingMode = false;
    overlayDrawingMode = false;
    render();
  }

  function openWrongPractice() {
    const all = wrongSorted();
    const shown = all.filter((entry) => {
      if (page.wrongTab === "pending") return !entry.mastered;
      if (page.wrongTab === "mastered") return entry.mastered;
      return true;
    });
    startSession("错题复习 · 按错误次数排序", shown.map((entry) => entry.question), "wrong");
  }

  function setBackgroundFromFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      showToast("请选择图片文件");
      return;
    }
    const previous = STATE.settings.backgroundImage;
    const previousWallpaperId = STATE.settings.wallpaperId;
    showToast("正在处理背景图片…");
    const reader = new FileReader();
    reader.onerror = () => showToast("图片读取失败，请重新选择");
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => showToast("这张图片无法使用，请换一张");
      image.onload = () => {
        const maxSide = 1600;
        const ratio = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * ratio));
        canvas.height = Math.max(1, Math.round(image.height * ratio));
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        STATE.settings.backgroundImage = canvas.toDataURL("image/jpeg", 0.82);
        STATE.settings.wallpaperId = "custom";
        if (!saveState()) {
          STATE.settings.backgroundImage = previous;
          STATE.settings.wallpaperId = previousWallpaperId;
          return;
        }
        applyPreferences();
        sheet = { type: "settings" };
        render();
        showToast("背景图片已更换");
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function practiceNotebook(questions, title) {
    if (!questions.length) {
      showToast("笔记本中还没有可练习的题目");
      return;
    }
    startSession(title, questions, "notebook");
  }

  function removeFromNotebook(question) {
    setNotebookState(question, false);
    if (STATE.notes) delete STATE.notes[question.id];
    deleteDrawingData(question.id);
    deleteDrawingData(`overlay:${question.id}`);
    deleteDrawingData(`vector:${question.id}`);
    deleteDrawingData(`vector:overlay:${question.id}`);
    if (drawingQuestionId === question.id) {
      drawingMode = false;
      drawingQuestionId = "";
    }
  }

  app.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const insideSheet = event.target.closest("[data-sheet-content]");
    if (insideSheet && !event.target.closest("button[data-action]")) return;
    const action = target.dataset.action;
    if (action === "close-sheet") {
      sheet = null;
      render();
      return;
    }
    if (action === "go-chapters") {
      page = { name: "chapters", part: null, wrongTab: page.wrongTab };
      render();
    } else if (action === "go-wrong") {
      page = { name: "wrong", part: null, wrongTab: "pending" };
      render();
    } else if (action === "go-notebook") {
      page = { name: "notebook", part: null, wrongTab: page.wrongTab };
      render();
    } else if (action === "home") {
      goHome();
    } else if (action === "open-settings") {
      sheet = { type: "settings" };
      render();
    } else if (action === "font-step") {
      const nextSize = Math.min(
        36,
        Math.max(10, Number(STATE.settings.fontSize) + Number(target.dataset.delta))
      );
      STATE.settings.fontSize = nextSize;
      applyPreferences();
      saveState();
      render();
    } else if (action === "line-height-step") {
      const nextLineHeight = Math.min(
        2.5,
        Math.max(
          1.1,
          Number((Number(STATE.settings.lineHeight) + Number(target.dataset.delta)).toFixed(1))
        )
      );
      STATE.settings.lineHeight = nextLineHeight;
      applyPreferences();
      saveState();
      render();
    } else if (action === "font-weight-setting") {
      STATE.settings.fontWeight = target.dataset.weight === "bold" ? "bold" : "normal";
      applyPreferences();
      saveState();
      render();
    } else if (action === "toggle-drawing-mode") {
      const mode = ["practice", "wrong", "notebook"].includes(target.dataset.mode)
        ? target.dataset.mode
        : "practice";
      const channel = target.dataset.channel === "overlay" ? "overlay" : "paper";
      const currentValue = STATE.settings.drawing[mode];
      const current = typeof currentValue === "boolean"
        ? currentValue
        : currentValue?.[channel] !== false;
      STATE.settings.drawing[mode] = typeof currentValue === "object" && currentValue !== null
        ? { ...currentValue, [channel]: !current }
        : { overlay: current, paper: current, [channel]: !current };
      if (!current) {
        if (mode === "wrong" || mode === "notebook") {
          if (channel === "paper" && STATE.settings.noteMode === "draw") {
            drawingMode = false;
          }
        }
        if (channel === "overlay") overlayDrawingMode = false;
      }
      saveState();
      render();
    } else if (action === "explanation-setting") {
      STATE.settings.explanationMode = target.dataset.mode;
      questionExplanationMode = target.dataset.mode;
      saveState();
      render();
    } else if (action === "toggle-theme") {
      STATE.settings.theme = STATE.settings.theme === "dark" ? "light" : "dark";
      applyPreferences();
      saveState();
      render();
    } else if (action === "content-font") {
      STATE.settings.contentFont = FONT_STACKS[target.dataset.font]
        ? target.dataset.font
        : "sans";
      applyPreferences();
      saveState();
      render();
    } else if (action === "toggle-assist") {
      STATE.settings.assistEnabled = !STATE.settings.assistEnabled;
      if (!STATE.settings.assistEnabled) {
        shapeSelectMode = false;
        selectedShapeId = "";
      }
      saveState();
      render();
    } else if (action === "toggle-music") {
      STATE.settings.musicEnabled = !STATE.settings.musicEnabled;
      saveState();
      if (STATE.settings.musicEnabled) startBackgroundMusic();
      else stopBackgroundMusic();
      render();
    } else if (action === "toggle-sound") {
      STATE.settings.soundEnabled = !STATE.settings.soundEnabled;
      saveState();
      render();
    } else if (action === "select-sound") {
      STATE.settings.soundPreset = target.dataset.sound;
      saveState();
      playAnswerSound(target.dataset.sound, true);
      render();
    } else if (action === "preview-sound") {
      playAnswerSound(target.dataset.sound, true);
    } else if (action === "reset-background") {
      STATE.settings.backgroundImage = "";
      STATE.settings.wallpaperId = "theme";
      saveState();
      applyPreferences();
      render();
      showToast("已改用主题背景");
    } else if (action === "select-wallpaper") {
      const wallpaperId = target.dataset.wallpaper;
      if (wallpaperId === "theme" || WALLPAPER_MAP.has(wallpaperId)) {
        STATE.settings.wallpaperId = wallpaperId;
        saveState();
        applyPreferences();
        render();
        showToast(wallpaperId === "theme" ? "已改用主题背景" : "壁纸已更换");
      }
    } else if (action === "toggle-explanation") {
      questionExplanationMode = target.dataset.mode;
      render();
    } else if (action === "notebook-add-sheet") {
      sheet = { type: "notebook-chapters" };
      render();
    } else if (action === "notebook-add-chapter") {
      sheet = { type: "notebook-picker", chapterId: target.dataset.id };
      render();
    } else if (action === "open-notebook-picker") {
      sheet = { type: "notebook-picker", chapterId: target.dataset.id };
      render();
    } else if (action === "toggle-notebook-picker") {
      const question = QUESTION_MAP.get(target.dataset.id);
      if (question) {
        if (isInNotebook(question.id)) removeFromNotebook(question);
        else setNotebookState(question, true);
        render();
      }
    } else if (action === "remove-notebook") {
      const question = QUESTION_MAP.get(target.dataset.id);
      if (question) {
        removeFromNotebook(question);
        render();
      }
    } else if (action === "practice-notebook-all") {
      practiceNotebook(notebookQuestions(), "我的笔记本");
    } else if (action === "practice-notebook-chapter") {
      const chapter = CHAPTER_MAP.get(target.dataset.id);
      const pool = notebookQuestions().filter((question) => question.chapterId === target.dataset.id);
      practiceNotebook(pool, chapter ? `笔记本 · ${chapter.title}` : "笔记本");
    } else if (action === "open-notebook-question") {
      const entry = QUESTION_MAP.get(target.dataset.id);
      if (entry) {
        const queue = notebookQuestions();
        const index = Math.max(0, queue.findIndex((question) => question.id === entry.id));
        startSession("我的笔记本", queue.slice(index).concat(queue.slice(0, index)), "notebook");
      }
    } else if (action === "toggle-notebook") {
      const session = STATE.activeSession;
      const question = session && QUESTION_MAP.get(session.queue[session.index]);
      if (question) {
        if (isInNotebook(question.id)) removeFromNotebook(question);
        else setNotebookState(question, true);
        render();
      }
    } else if (action === "toggle-wrongbook") {
      const session = STATE.activeSession;
      const question = session && QUESTION_MAP.get(session.queue[session.index]);
      if (question) toggleManualWrong(question);
    } else if (action === "note-mode") {
      const session = STATE.activeSession;
      if (!session || !drawingEnabledForMode(session.mode, "paper")) return;
      STATE.settings.noteMode = target.dataset.mode === "draw" ? "draw" : "type";
      drawingMode = STATE.settings.noteMode === "draw";
      drawingUndoStack = [];
      shapeSelectMode = false;
      saveState();
      render();
    } else if (action === "toggle-overlay-ink") {
      const session = STATE.activeSession;
      if (!session || !drawingEnabledForMode(session.mode, "overlay")) {
        showToast("当前模式的涂鸦功能已在设置中关闭");
        return;
      }
      overlayDrawingMode = !overlayDrawingMode;
      overlayUndoStack = [];
      shapeSelectMode = false;
      selectedShapeId = "";
      render();
    } else if (action === "undo-overlay") {
      const session = STATE.activeSession;
      const question = session && QUESTION_MAP.get(session.queue[session.index]);
      const canvas = document.getElementById("question-drawing-canvas");
      const model = canvas && canvasModels.get(canvas);
      if (question && canvas && model?.items.length) {
        const removed = model.items.pop();
        if (removed?.id === selectedShapeId) selectedShapeId = "";
        renderDrawingCanvas(canvas, model);
        saveCanvasSnapshot(question, canvas, "overlay");
      } else {
        showToast("没有可撤销的新笔迹");
      }
    } else if (action === "clear-overlay") {
      const session = STATE.activeSession;
      const question = session && QUESTION_MAP.get(session.queue[session.index]);
      const canvas = document.getElementById("question-drawing-canvas");
      const model = canvas && canvasModels.get(canvas);
      if (question && canvas && model) {
        model.items = [];
        model.legacyImage = null;
        overlayUndoStack = [];
        selectedShapeId = "";
        renderDrawingCanvas(canvas, model);
        const existing = STATE.notebook[question.id];
        if (existing) {
          existing.hasOverlayDrawing = false;
          existing.hasDrawing = Boolean(existing.hasPaperDrawing || STATE.notes?.[question.id]);
          existing.updatedAt = Date.now();
          saveState();
        }
        deleteDrawingData(`overlay:${question.id}`);
        deleteDrawingData(`vector:overlay:${question.id}`);
        render();
      }
    } else if (action === "toggle-drawing") {
      drawingMode = !drawingMode;
      drawingUndoStack = [];
      shapeSelectMode = false;
      render();
    } else if (action === "draw-color") {
      drawingColor = target.dataset.color;
      drawingEraser = false;
      render();
    } else if (action === "draw-brush") {
      drawingBrush = ["pen", "pencil", "marker", "highlighter"].includes(target.dataset.brush)
        ? target.dataset.brush
        : "pen";
      drawingEraser = false;
      shapeSelectMode = false;
      render();
    } else if (action === "draw-width") {
      drawingWidth = Number(target.dataset.width) || 3;
      render();
    } else if (action === "toggle-eraser") {
      drawingEraser = !drawingEraser;
      shapeSelectMode = false;
      render();
    } else if (action === "toggle-shape-select") {
      if (!STATE.settings.assistEnabled) {
        showToast("请先在设置中开启图形辅助");
        return;
      }
      shapeSelectMode = !shapeSelectMode;
      if (!shapeSelectMode) selectedShapeId = "";
      drawingEraser = false;
      render();
    } else if (action === "delete-shape") {
      const session = STATE.activeSession;
      const question = session && QUESTION_MAP.get(session.queue[session.index]);
      const inkTarget = target.closest("[data-ink-target]")?.dataset.inkTarget || "paper";
      const canvas = document.getElementById(
        inkTarget === "overlay" ? "question-drawing-canvas" : "drawing-canvas"
      );
      const model = canvas && canvasModels.get(canvas);
      if (question && canvas && model && selectedShapeId) {
        model.items = model.items.filter((item) => item.id !== selectedShapeId);
        selectedShapeId = "";
        renderDrawingCanvas(canvas, model);
        saveCanvasSnapshot(
          question,
          canvas,
          inkTarget
        );
      }
    } else if (action === "undo-drawing") {
      const session = STATE.activeSession;
      const question = session && QUESTION_MAP.get(session.queue[session.index]);
      const canvas = document.getElementById("drawing-canvas");
      const model = canvas && canvasModels.get(canvas);
      if (question && canvas && model?.items.length) {
        const removed = model.items.pop();
        if (removed?.id === selectedShapeId) selectedShapeId = "";
        renderDrawingCanvas(canvas, model);
        saveCanvasSnapshot(question, canvas);
      } else {
        showToast("没有可撤销的新笔迹");
      }
    } else if (action === "clear-drawing") {
      const session = STATE.activeSession;
      const question = session && QUESTION_MAP.get(session.queue[session.index]);
      const canvas = document.getElementById("drawing-canvas");
      const model = canvas && canvasModels.get(canvas);
      if (question && canvas && model) {
        model.items = [];
        model.legacyImage = null;
        drawingUndoStack = [];
        selectedShapeId = "";
        renderDrawingCanvas(canvas, model);
        const existing = STATE.notebook[question.id];
        if (existing) {
          existing.hasPaperDrawing = false;
          existing.hasDrawing = Boolean(existing.hasOverlayDrawing || STATE.notes?.[question.id]);
          existing.updatedAt = Date.now();
          saveState();
        }
        deleteDrawingData(question.id);
        deleteDrawingData(`vector:${question.id}`);
        render();
      }
    } else if (action === "random-sheet") {
      sheet = { type: "random" };
      render();
    } else if (action === "start-random") {
      startRandom(target.dataset.count);
    } else if (action === "toggle-part") {
      const number = Number(target.dataset.part);
      STATE.expandedPart = STATE.expandedPart === number ? null : number;
      saveState();
      render();
    } else if (action === "start-chapter") {
      startChapter(target.dataset.id, target.dataset.type);
    } else if (action === "continue-session" && STATE.activeSession) {
      page = { name: "practice", part: null, wrongTab: page.wrongTab };
      pendingSelection = [];
      render();
    } else if (action === "close-practice") {
      goHome();
    } else if (action === "select-option") {
      const session = STATE.activeSession;
      const question = session && QUESTION_MAP.get(session.queue[session.index]);
      if (!question || session.responses[question.id]) return;
      const letter = target.dataset.letter;
      if (question.type === "single") {
        submitAnswer(question, [letter]);
      } else {
        pendingSelection = pendingSelection.includes(letter)
          ? pendingSelection.filter((item) => item !== letter)
          : [...pendingSelection, letter].sort();
        render();
      }
    } else if (action === "submit-multi") {
      const session = STATE.activeSession;
      const question = session && QUESTION_MAP.get(session.queue[session.index]);
      if (question && pendingSelection.length) submitAnswer(question, pendingSelection);
    } else if (action === "next-question") {
      nextQuestion();
    } else if (action === "prev-question") {
      previousQuestion();
    } else if (action === "wrong-tab") {
      page.wrongTab = target.dataset.tab;
      render();
    } else if (action === "practice-wrong") {
      if (sheet) sheet = null;
      page = { name: "wrong", part: null, wrongTab: "pending" };
      openWrongPractice();
    } else if (action === "review-wrong") {
      const entry = wrongSorted().find((item) => item.id === target.dataset.id);
      if (entry) {
        const queue = wrongSorted().filter((item) => !item.mastered).map((item) => item.question);
        const index = Math.max(0, queue.findIndex((item) => item.id === entry.id));
        startSession(`错题详情 · 错 ${entry.wrongCount} 次`, queue.slice(index).concat(queue.slice(0, index)), "wrong");
      }
    } else if (action === "close-summary") {
      STATE.activeSession = null;
      sheet = null;
      saveState();
      goHome();
    } else if (action === "clear-data") {
      if (window.confirm("确定清空全部答题记录、错题次数和当前进度吗？此操作不能撤销。")) {
        STATE = defaultState();
        pendingSelection = [];
        sheet = null;
        drawingMode = false;
        overlayDrawingMode = false;
        shapeSelectMode = false;
        selectedShapeId = "";
        drawingQuestionId = "";
        stopBackgroundMusic();
        clearAllDrawingData();
        applyPreferences();
        saveState();
        goHome();
        showToast("练习记录已清空");
      }
    }
  });

  app.addEventListener("input", (event) => {
    if (event.target.id === "note-text") {
      const question = QUESTION_MAP.get(event.target.dataset.questionId);
      if (!question) return;
      STATE.notes = STATE.notes || {};
      STATE.notes[question.id] = event.target.value;
      if (event.target.value.trim()) setNotebookState(question, true);
      clearTimeout(noteSaveTimer);
      noteSaveTimer = setTimeout(saveState, 250);
      return;
    }
    if (event.target.id === "font-size-input") {
      const size = Math.min(36, Math.max(10, Number(event.target.value)));
      STATE.settings.fontSize = size;
      applyPreferences();
      saveState();
      const output = event.target.parentElement?.querySelector("output");
      if (output) output.textContent = `${size}px`;
    }
    if (event.target.id === "line-height-input") {
      const lineHeight = Math.min(2.5, Math.max(1.1, Number(event.target.value)));
      STATE.settings.lineHeight = lineHeight;
      applyPreferences();
      saveState();
      const output = event.target.parentElement?.querySelector("output");
      if (output) output.textContent = lineHeight.toFixed(1);
    }
    if (event.target.id === "highlighter-opacity-input") {
      const opacity = Math.min(0.75, Math.max(0.08, Number(event.target.value)));
      STATE.settings.highlighterOpacity = opacity;
      const output = event.target.parentElement?.querySelector("output");
      if (output) output.textContent = `${Math.round(opacity * 100)}%`;
      for (const canvasId of ["question-drawing-canvas", "drawing-canvas"]) {
        const canvas = document.getElementById(canvasId);
        const model = canvas && canvasModels.get(canvas);
        if (canvas && model) renderDrawingCanvas(canvas, model);
      }
      saveState();
    }
    if (event.target.id === "music-volume-input") {
      const volume = Math.min(0.4, Math.max(0.03, Number(event.target.value)));
      STATE.settings.musicVolume = volume;
      if (musicEngine) {
        musicEngine.master.gain.setTargetAtTime(
          volume,
          musicEngine.master.context.currentTime,
          0.08
        );
      }
      const output = event.target.parentElement?.querySelector("output");
      if (output) output.textContent = `${Math.round((volume / 0.4) * 100)}%`;
      saveState();
    }
  });

  app.addEventListener("change", (event) => {
    if (
      event.target.id === "background-file" ||
      event.target.id === "background-file-secondary"
    ) {
      setBackgroundFromFile(event.target.files?.[0]);
      return;
    }
    if (event.target.id === "theme-select") {
      const nextTheme = event.target.value;
      STATE.settings.themeStyle = THEME_CATALOG.has(nextTheme) ? nextTheme : "paper";
      applyPreferences();
      saveState();
      render();
      return;
    }
    if (event.target.id === "music-track") {
      STATE.settings.musicTrack = MUSIC_PRESETS[event.target.value]
        ? event.target.value
        : "piano";
      saveState();
      if (STATE.settings.musicEnabled) startBackgroundMusic();
    }
  });

  app.addEventListener("focusout", (event) => {
    if (event.target.id !== "note-text") return;
    clearTimeout(noteSaveTimer);
    saveState();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sheet) {
      sheet = null;
      render();
    }
  });

  init();
})();
