const fs = require('fs');
const path = require('path');
const { execFileSync, spawn } = require('child_process');

const ROOT = 'e:/semester 7/Computing Project/WEB Widya Darma';
const IMG_DIR = `${ROOT}/frontend/public/images`;
const WORK_DIR = `${ROOT}/frontend/work`;

const IMAGE_PATHS = {
  img_01: `${IMG_DIR}/01.webp`,
  img_02: `${IMG_DIR}/02.webp`,
  img_03: `${IMG_DIR}/03.webp`,
  img_05: `${IMG_DIR}/05.webp`,
  img_09: `${IMG_DIR}/09.webp`,
  img_11: `${IMG_DIR}/11.webp`,
  img_14: `${IMG_DIR}/14.webp`,
  img_31: `${IMG_DIR}/31.webp`,
  img_32: `${IMG_DIR}/32.webp`,
  img_33: `${IMG_DIR}/33.webp`,
  img_34: `${IMG_DIR}/34.webp`,
  img_35: `${IMG_DIR}/35.webp`,
  img_41: `${IMG_DIR}/41.webp`,
  img_48: `${IMG_DIR}/48.webp`,
  img_50: `${IMG_DIR}/50.webp`,
  img_14_gray: `${WORK_DIR}/14-gray.jpg`,
  img_31_gray: `${WORK_DIR}/31-gray.jpg`,
  staff: `${WORK_DIR}/staff-avatar.png`
};

const HEX = {
  bg: '#f6f7f9',
  white: '#ffffff',
  ink: '#24272d',
  muted: '#70757f',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  border: '#e2e8f0',
  borderSoft: '#eef2f6',
  pillActive: '#edf0f3',
  primary: '#07528c',
  primaryDark: '#063b68',
  navyTop: '#083359',
  navyBot: '#041d33',
  blue50: '#eff7fc',
  blue100: '#dceefa',
  blue200: '#b8dcf2',
  sky300: '#7dd3fc',
  sky400: '#38bdf8',
  emerald500: '#10b981',
  emerald50: '#ecfdf5',
  amber500: '#f59e0b',
  black: '#000000'
};

function colorHex(key, opacity = 1) {
  const base = (HEX[key] || key).replace('#', '');
  if (opacity >= 0.999) return '#' + base.slice(0, 6);
  const alpha = Math.max(0, Math.min(255, Math.round(opacity * 255)))
    .toString(16)
    .padStart(2, '0');
  return '#' + base.slice(0, 6) + alpha;
}

let idCounter = 1;
function nextAs(prefix = 'n') {
  return `${prefix}_${idCounter++}`;
}
function ref(asName) {
  return { $ref: asName };
}

const commands = [];

// Rename page to match SMA Widya Darma Desktop
commands.push({
  command: 'page.rename',
  params: { name: 'Website SMA Widya Darma · Desktop (1440px)' }
});

function mapAlign(a) {
  if (!a) return 'min';
  const m = {
    MIN: 'min',
    CENTER: 'center',
    MAX: 'max',
    SPACE_BETWEEN: 'spaceBetween',
    SPACE_AROUND: 'spaceAround',
    SPACE_EVENLY: 'spaceEvenly'
  };
  return m[a] || a;
}

function normPad(p) {
  if (typeof p === 'number') return p;
  if (Array.isArray(p)) {
    if (p.length === 2) return [p[0], p[1], p[0], p[1]];
    if (p.length === 4) return p;
  }
  return 0;
}

function shadowCard(alpha = 0.08, y = 12, blur = 32) {
  return [
    {
      type: 'dropShadow',
      color: colorHex('#07294d', alpha),
      offset: [0, y],
      radius: blur
    }
  ];
}

function gradLinear(c1, o1, c2, o2) {
  return {
    type: 'linearGradient',
    stops: [colorHex(c1, o1), colorHex(c2, o2)]
  };
}

function box(parentAs, name, opts = {}) {
  const asName = opts.as || nextAs('box');
  const props = {};

  if (opts.clip !== undefined) props.clip = Boolean(opts.clip);
  if (opts.fills !== undefined) {
    props.fills = opts.fills;
  } else if (opts.fill) {
    props.fill = colorHex(opts.fill, opts.opacity ?? 1);
  } else {
    props.fills = [];
  }

  if (opts.stroke) {
    props.stroke = colorHex(opts.stroke, opts.strokeOpacity ?? 1);
    props.strokeWeight = opts.strokeWeight || 1;
    if (opts.dash) props.dashes = opts.dash;
  }
  if (opts.radius !== undefined) props.cornerRadius = opts.radius;
  if (opts.effects) props.effects = opts.effects;
  if (opts.abs) props.absolute = true;

  const mode = opts.layout || 'VERTICAL';
  if (mode !== 'NONE') {
    props.layout = mode === 'HORIZONTAL' ? 'horizontal' : 'vertical';
    props.gap = opts.gap ?? 0;
    props.mainAlign = mapAlign(opts.alignMain || 'MIN');
    props.crossAlign = mapAlign(opts.alignCross || 'MIN');
    if (opts.pad !== undefined) props.padding = normPad(opts.pad);

    if (opts.w && opts.h) {
      props.sizingH = 'fixed';
      props.sizingV = 'fixed';
    } else if (opts.w) {
      props.sizingH = 'fixed';
      props.sizingV = 'hug';
    } else if (opts.h) {
      props.sizingH = 'hug';
      props.sizingV = 'fixed';
    } else {
      props.sizingH = 'hug';
      props.sizingV = 'hug';
    }
  }

  const params = {
    type: 'frame',
    name,
    props
  };
  if (parentAs) params.parent = ref(parentAs);
  if (opts.x !== undefined) params.x = opts.x;
  if (opts.y !== undefined) params.y = opts.y;
  if (opts.w !== undefined) params.width = opts.w;
  if (opts.h !== undefined) params.height = opts.h;

  commands.push({
    command: 'node.create',
    as: asName,
    params
  });

  return asName;
}

function row(parentAs, name, opts = {}) {
  return box(parentAs, name, { ...opts, layout: 'HORIZONTAL' });
}

function photoBox(parentAs, name, assetKey, w, h, radius = 24, overlayGradient = null, extraOpts = {}) {
  const fAs = box(parentAs, name, {
    layout: 'NONE',
    w,
    h,
    radius,
    clip: true,
    fill: '#dceefa',
    ...extraOpts
  });
  commands.push({
    command: 'image.place',
    params: {
      target: ref(fAs),
      path: IMAGE_PATHS[assetKey] || IMAGE_PATHS.img_01,
      mode: 'fill'
    }
  });
  if (overlayGradient) {
    box(fAs, name + ' / Shade', {
      layout: 'NONE',
      x: 0,
      y: 0,
      w,
      h,
      fills: [overlayGradient]
    });
  }
  return fAs;
}

function txt(parentAs, value, opts = {}) {
  const asName = nextAs('txt');
  const size = opts.size || 14;
  const style = opts.weight || 'Regular';
  const alignMap = { LEFT: 'left', CENTER: 'center', RIGHT: 'right', JUSTIFIED: 'justified' };
  const props = {
    fontFamily: 'Plus Jakarta Sans',
    fontStyle: style,
    fontSize: size,
    lineHeight: opts.lh || Math.round(size * (size >= 36 ? 1.18 : 1.55)),
    textAlign: alignMap[opts.align || 'LEFT'] || 'left',
    fill: colorHex(opts.color || 'ink', opts.opacity ?? 1)
  };
  if (opts.ls) props.letterSpacing = opts.ls;
  if (opts.abs) props.absolute = true;
  if (opts.w) {
    props.sizingH = 'fixed';
    props.sizingV = 'hug';
    props.textAutoResize = 'height';
  }

  const params = {
    type: 'text',
    name: opts.name || String(value).slice(0, 36),
    text: String(value),
    props
  };
  if (parentAs) params.parent = ref(parentAs);
  if (opts.w) params.width = opts.w;
  if (opts.x !== undefined) params.x = opts.x;
  if (opts.y !== undefined) params.y = opts.y;

  commands.push({
    command: 'node.create',
    as: asName,
    params
  });

  if (opts.highlights && Array.isArray(opts.highlights)) {
    const str = String(value);
    for (const hl of opts.highlights) {
      const idx = str.indexOf(hl.word);
      if (idx >= 0) {
        commands.push({
          command: 'text.style',
          params: {
            id: ref(asName),
            start: idx,
            end: idx + hl.word.length,
            textFills: [colorHex(hl.color || 'primary', hl.opacity ?? 1)]
          }
        });
      }
    }
  }
  return asName;
}

function iconBox(parentAs, kind, size = 18, colorKey = 'primary') {
  const c = colorHex(colorKey);
  const paths = {
    ticket: 'M2 9 L2 7 L22 7 L22 9 L20 12 L22 15 L22 17 L2 17 L2 15 L4 12 Z',
    sparkle: 'M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z',
    chevronDown: 'M6 9 L12 15 L18 9',
    arrowRight: 'M5 12 L19 12 M13 6 L19 12 L13 18',
    arrowUpRight: 'M7 17 L17 7 M8 7 L17 7 L17 16',
    arrowDown: 'M12 5 L12 19 M6 13 L12 19 L18 13',
    arrowLeft: 'M19 12 L5 12 M11 6 L5 12 L11 18',
    arrowUp: 'M12 19 L12 5 M6 11 L12 5 L18 11',
    check: 'M20 6 L9 17 L4 12',
    pin: 'M12 2 C8 2 5 5 5 9 C5 14 12 22 12 22 C12 22 19 14 19 9 C19 5 16 2 12 2 Z',
    mail: 'M2 5 L22 5 L22 19 L2 19 Z M2 6 L12 13 L22 6',
    phone: 'M5 4 L9 4 L11 9 L8.5 11.5 C10 14 12 16 14.5 17.5 L17 15 L22 17 L22 21 C12 21 5 14 5 4 Z',
    globe: 'M12 2 C6.5 2 2 6.5 2 12 C2 17.5 6.5 22 12 22 C17.5 22 22 17.5 22 12 C22 6.5 17.5 2 12 2 Z M2 12 L22 12',
    download: 'M12 3 L12 15 M7 10 L12 15 L17 10 M4 19 L20 19'
  };
  const wrapAs = box(parentAs, 'Icon / ' + kind, {
    layout: 'NONE',
    w: size,
    h: size
  });
  const isFilled = kind === 'sparkle';
  commands.push({
    command: 'node.create',
    params: {
      type: 'vector',
      name: kind,
      parent: ref(wrapAs),
      x: 2,
      y: 2,
      width: Math.max(8, size - 4),
      height: Math.max(8, size - 4),
      path: paths[kind] || paths.arrowRight,
      props: isFilled
        ? { fill: c }
        : { fills: [], stroke: c, strokeWeight: 2, strokeCap: 'round', strokeJoin: 'round' }
    }
  });
  return wrapAs;
}

function pillBadge(parentAs, label, opts = {}) {
  const p = row(parentAs, 'Badge / ' + label, {
    pad: opts.pad || [6, 14],
    gap: 8,
    radius: 999,
    alignCross: 'CENTER',
    fill: opts.fill || 'blue50',
    opacity: opts.opacity ?? 1,
    stroke: opts.stroke || 'blue200',
    strokeOpacity: opts.strokeOpacity ?? 1
  });
  if (opts.dotColor) {
    commands.push({
      command: 'node.create',
      params: {
        type: 'ellipse',
        name: 'Dot',
        parent: ref(p),
        width: 7,
        height: 7,
        props: { fill: colorHex(opts.dotColor) }
      }
    });
  }
  txt(p, label, {
    size: opts.size || 12,
    weight: opts.weight || 'SemiBold',
    color: opts.color || 'primary',
    lh: 16,
    ls: opts.ls || 0
  });
  return p;
}

function actionPill(parentAs, label, opts = {}) {
  const btn = row(parentAs, 'Button / ' + label, {
    w: opts.w,
    pad: opts.pad || [11, 22],
    gap: 8,
    radius: 999,
    alignMain: 'CENTER',
    alignCross: 'CENTER',
    fill: opts.fill || 'primary',
    opacity: opts.opacity ?? 1,
    stroke: opts.stroke,
    strokeOpacity: opts.strokeOpacity ?? 1,
    effects: opts.shadow ? shadowCard(0.14, 8, 20) : undefined
  });
  txt(btn, label, {
    size: opts.size || 13,
    weight: 'SemiBold',
    color: opts.color || 'white',
    lh: 18
  });
  if (opts.icon) {
    iconBox(btn, opts.icon, 15, opts.color || 'white');
  }
  return btn;
}

// Track prototype links
const navRegistry = [];
const footerRegistry = [];
const linkTasks = [];
function onClickNavigate(nodeAs, targetKey) {
  if (!nodeAs) return;
  linkTasks.push({ nodeAs, kind: 'NAVIGATE', targetKey });
}
function onClickScroll(nodeAs, targetNodeFn) {
  if (!nodeAs) return;
  linkTasks.push({ nodeAs, kind: 'SCROLL_TO', targetNodeFn });
}

// ---------------------------------------------------------------------------
// SHARED NAVBAR (Navbar.tsx)
// ---------------------------------------------------------------------------
function buildNavbar(parentAs, activeKey, mode = 'default') {
  const isHero = mode === 'hero';
  const wrap = box(parentAs, 'Navbar', {
    w: 1440,
    pad: [20, 80, 12, 80],
    alignCross: 'CENTER'
  });
  const bar = row(wrap, 'Navbar / Inner (1280)', {
    w: 1280,
    pad: [12, 24],
    radius: 24,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER',
    fills: isHero ? [] : [colorHex('bg', 0.92)]
  });

  const brand = row(bar, 'Brand / SMA Widya Darma', {
    gap: 8,
    alignCross: 'CENTER',
    pad: [4, 4]
  });
  iconBox(brand, 'ticket', 20, isHero ? 'white' : 'ink');
  txt(brand, 'SMA Widya Darma', {
    size: 13,
    weight: 'Bold',
    color: isHero ? 'white' : 'ink',
    lh: 18
  });

  const center = row(bar, 'Navbar / Links', {
    gap: 6,
    alignCross: 'CENTER'
  });

  const items = [
    { key: 'home', label: 'Beranda' },
    { key: 'profile', label: 'Profil', chevron: true },
    { key: 'teachers', label: 'Profil Guru' },
    { key: 'spmb', label: 'SPMB' },
    { key: 'publications', label: 'Galeri Kegiatan' }
  ];

  const linkNodes = {};
  for (const item of items) {
    const isActive = activeKey === item.key;
    const pill = row(center, 'Nav / ' + item.label, {
      pad: [8, 16],
      gap: 5,
      radius: 999,
      alignCross: 'CENTER',
      fills: isActive ? [colorHex('pillActive')] : []
    });
    txt(pill, item.label, {
      size: 12,
      weight: isActive ? 'SemiBold' : 'Medium',
      color: isActive ? 'primary' : isHero ? 'white' : 'muted',
      opacity: isActive ? 1 : isHero ? 0.88 : 1,
      lh: 18
    });
    if (item.chevron) {
      iconBox(pill, 'chevronDown', 13, isActive ? 'primary' : isHero ? 'white' : 'muted');
    }
    linkNodes[item.key] = pill;
  }

  const aiBtn = row(bar, 'Nav / Tanya AI Button', {
    pad: [10, 20],
    gap: 8,
    radius: 999,
    alignCross: 'CENTER',
    fill: isHero ? 'white' : 'primary',
    opacity: isHero ? 0.2 : 1,
    stroke: isHero ? 'white' : undefined,
    strokeOpacity: isHero ? 0.45 : 1,
    effects: isHero ? undefined : shadowCard(0.16, 6, 16)
  });
  iconBox(aiBtn, 'sparkle', 16, 'white');
  txt(aiBtn, 'Tanya AI', {
    size: 12,
    weight: 'SemiBold',
    color: 'white',
    lh: 18
  });

  navRegistry.push({ brand, linkNodes, aiBtn, activeKey });
  return wrap;
}

// ---------------------------------------------------------------------------
// SHARED FOOTER (Footer.tsx)
// ---------------------------------------------------------------------------
function buildFooter(parentAs) {
  const foot = box(parentAs, 'Footer', {
    w: 1440,
    pad: [64, 80, 40, 80],
    gap: 44,
    alignCross: 'CENTER',
    fills: [gradLinear('navyTop', 1, 'navyBot', 1)],
    stroke: 'white',
    strokeOpacity: 0.1
  });

  const grid = row(foot, 'Footer / 4-Column Grid', {
    w: 1280,
    gap: 48,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'MIN'
  });

  const col1 = box(grid, 'Footer / Col 1 Brand', { w: 360, gap: 16 });
  const brandRow = row(col1, 'Brand Row', { gap: 12, alignCross: 'CENTER' });
  const ib = row(brandRow, 'Icon Box', {
    w: 36,
    h: 36,
    radius: 10,
    alignMain: 'CENTER',
    alignCross: 'CENTER',
    fill: 'white',
    opacity: 0.1,
    stroke: 'white',
    strokeOpacity: 0.18
  });
  iconBox(ib, 'ticket', 18, 'sky300');
  txt(brandRow, 'SMA Widya Darma', { size: 16, weight: 'Bold', color: 'white', lh: 22 });
  txt(
    col1,
    'Mewujudkan generasi berkarakter unggul, berwawasan luas, dan siap menghadapi tantangan masa depan melalui pendidikan berkualitas.',
    { w: 340, size: 13, color: 'white', opacity: 0.72, lh: 22 }
  );

  const col2 = box(grid, 'Footer / Col 2 Navigasi', { w: 180, gap: 14 });
  txt(col2, 'NAVIGASI', { size: 11, weight: 'Bold', color: 'sky300', ls: 1.8, lh: 16 });
  const navList = box(col2, 'Links', { gap: 10 });
  const fLinks = {};
  for (const [key, label] of [
    ['home', 'Beranda'],
    ['profile', 'Profil Sekolah'],
    ['teachers', 'Profil Guru'],
    ['spmb', 'Informasi SPMB'],
    ['publications', 'Galeri Kegiatan'],
    ['ai', 'Tanya AI']
  ]) {
    fLinks[key] = txt(navList, label, { size: 13, color: 'white', opacity: 0.75, lh: 20 });
  }

  const col3 = box(grid, 'Footer / Col 3 Kontak Sekolah', { w: 300, gap: 14 });
  txt(col3, 'KONTAK SEKOLAH', { size: 11, weight: 'Bold', color: 'sky300', ls: 1.8, lh: 16 });
  for (const [ic, title, val] of [
    ['pin', 'Alamat', 'Jl. Ketintang No. 147-151, Surabaya'],
    ['mail', 'Email', 'smawdsby@gmail.com'],
    ['phone', 'WhatsApp', '085921095353']
  ]) {
    const item = row(col3, 'Kontak / ' + title, { gap: 12, alignCross: 'MIN' });
    iconBox(item, ic, 16, 'sky300');
    const info = box(item, 'Text', { gap: 2 });
    txt(info, title, { size: 12, weight: 'SemiBold', color: 'white', opacity: 0.9, lh: 16 });
    txt(info, val, { w: 250, size: 13, color: 'white', opacity: 0.7, lh: 19 });
  }

  const col4 = box(grid, 'Footer / Col 4 Pusat Layanan', { w: 296, gap: 14 });
  txt(col4, 'PUSAT LAYANAN', { size: 11, weight: 'Bold', color: 'sky300', ls: 1.8, lh: 16 });
  txt(col4, 'Butuh informasi lebih lanjut mengenai pendaftaran atau kegiatan sekolah?', {
    w: 280,
    size: 13,
    color: 'white',
    opacity: 0.72,
    lh: 20
  });
  const waBtn = actionPill(col4, 'Hubungi via WhatsApp', {
    fill: 'white',
    color: 'primary',
    icon: 'phone',
    pad: [10, 18],
    size: 12
  });
  onClickNavigate(waBtn, 'spmb');

  txt(col4, 'MEDIA SOSIAL', { size: 11, weight: 'Bold', color: 'sky300', ls: 1.8, lh: 16 });
  const soc = box(col4, 'Social Links', { gap: 6 });
  txt(soc, 'TikTok · smadya.official', { size: 12, color: 'white', opacity: 0.72, lh: 18 });
  txt(soc, 'Instagram · smadya_official', { size: 12, color: 'white', opacity: 0.72, lh: 18 });
  txt(soc, 'YouTube · SMA WIDYA DARMA SURABAYA', { size: 12, color: 'white', opacity: 0.72, lh: 18 });

  box(foot, 'Divider', { w: 1280, h: 1, fill: 'white', opacity: 0.12 });
  const bot = row(foot, 'Footer / Bottom Bar', {
    w: 1280,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER'
  });
  txt(bot, '© 2026 SMA Widya Darma. All rights reserved.', {
    size: 12,
    color: 'white',
    opacity: 0.55,
    lh: 18
  });
  txt(bot, 'Akreditasi A+ · Unggul & Berkarakter', {
    size: 12,
    color: 'white',
    opacity: 0.55,
    lh: 18
  });

  footerRegistry.push(fLinks);
  return foot;
}

// ---------------------------------------------------------------------------
// SHARED SECTION: SchoolIntro (SchoolSections.tsx)
// ---------------------------------------------------------------------------
function buildSchoolIntro(parentAs, isProfile = false) {
  const sec = box(parentAs, 'Section / Sekilas Sekolah', {
    w: 1440,
    pad: [88, 144],
    gap: 56,
    alignCross: 'CENTER',
    fill: 'bg'
  });

  const topRow = row(sec, 'Top Row (1152)', {
    w: 1152,
    gap: 56,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER'
  });

  if (!isProfile) {
    const left = box(topRow, 'Intro / Left Column', { w: 640, gap: 20 });
    txt(left, 'Membangun generasi unggul melalui pendidikan berkualitas.', {
      w: 620,
      size: 40,
      weight: 'Bold',
      color: 'ink',
      lh: 48,
      ls: -1,
      highlights: [{ word: 'pendidikan berkualitas.', color: 'primary' }]
    });
    txt(
      left,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      { w: 610, size: 15, color: 'muted', lh: 26 }
    );
    txt(
      left,
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
      { w: 610, size: 15, color: 'muted', lh: 26 }
    );

    const statsRow = row(left, 'Stats Row', {
      w: 610,
      pad: [24, 0, 0, 0],
      gap: 36,
      alignCross: 'CENTER'
    });
    for (const [val, label] of [
      ['A+', 'Akreditasi'],
      ['20', 'Jumlah Guru'],
      ['153', 'Jumlah Murid']
    ]) {
      const st = box(statsRow, 'Stat / ' + label, { w: 165, gap: 4 });
      txt(st, val, { size: 38, weight: 'Bold', color: 'primary', lh: 44, ls: -1 });
      txt(st, label, { size: 13, weight: 'Medium', color: 'muted', lh: 18 });
    }

    const right = photoBox(
      topRow,
      'Kampus Utama Card',
      'img_14',
      456,
      480,
      32,
      gradLinear('black', 0.05, 'black', 0.68),
      { effects: shadowCard(0.1, 16, 36) }
    );
    const topBadge = pillBadge(right, 'KAMPUS UTAMA', {
      fill: 'black',
      opacity: 0.45,
      stroke: 'white',
      strokeOpacity: 0.25,
      color: 'white',
      dotColor: 'sky300',
      size: 11
    });
    commands.push({
      command: 'node.set',
      params: { ids: [ref(topBadge)], props: { x: 24, y: 24 } }
    });

    const glassCard = box(right, 'Suasana Belajar Glass Card', {
      x: 24,
      y: 348,
      w: 408,
      pad: [18, 20],
      gap: 6,
      radius: 20,
      fill: 'white',
      opacity: 0.18,
      stroke: 'white',
      strokeOpacity: 0.3
    });
    txt(glassCard, 'SUASANA BELAJAR', {
      size: 10,
      weight: 'Bold',
      color: 'sky300',
      ls: 1.6,
      lh: 14
    });
    txt(
      glassCard,
      'Lingkungan kondusif yang mendukung tumbuh kembang akademik dan karakter siswa.',
      { w: 368, size: 13, weight: 'Medium', color: 'white', lh: 20 }
    );
  } else {
    const left = box(topRow, 'Profile Intro / Left', { w: 520, gap: 28 });
    txt(left, 'Membangun generasi unggul melalui pendidikan berkualitas.', {
      w: 500,
      size: 40,
      weight: 'Bold',
      color: 'ink',
      lh: 48,
      ls: -1,
      highlights: [{ word: 'pendidikan berkualitas.', color: 'primary' }]
    });
    const statsRow = row(left, 'Stats Row', { gap: 32, alignCross: 'CENTER' });
    for (const [val, label] of [
      ['A+', 'Akreditasi'],
      ['20', 'Jumlah Guru'],
      ['153', 'Jumlah Murid']
    ]) {
      const st = box(statsRow, 'Stat / ' + label, { w: 140, gap: 4 });
      txt(st, val, { size: 36, weight: 'Bold', color: 'primary', lh: 42 });
      txt(st, label, { size: 13, weight: 'Medium', color: 'muted', lh: 18 });
    }

    const right = box(topRow, 'Profile Intro / Right Copy', { w: 576, gap: 16 });
    for (let i = 0; i < 3; i++) {
      txt(
        right,
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        { w: 576, size: 15, color: 'muted', lh: 26 }
      );
    }
  }

  box(sec, 'Pillars Divider', { w: 1152, h: 1, fill: 'border' });
  const pillars = row(sec, 'Pillars 3-Col Grid', {
    w: 1152,
    gap: 36,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'MIN'
  });
  for (const [tag, title, desc] of [
    [
      '01 · AKADEMIK',
      'Kurikulum Terstruktur & Adaptif',
      'Pembelajaran terarah yang mendorong nalar kritis dan kesiapan perguruan tinggi.'
    ],
    [
      '02 · KARAKTER',
      'Pembinaan Minat, Bakat & Etika',
      'Pendampingan siswa secara aktif melalui kegiatan ekstrakurikuler dan organisasi.'
    ],
    [
      '03 · FASILITAS',
      'Lingkungan Belajar Nyaman & Modern',
      'Ruang kelas dan sarana pendukung yang menunjang kegiatan belajar sehari-hari.'
    ]
  ]) {
    const pCard = box(pillars, 'Pillar / ' + tag, { w: 360, gap: 8 });
    txt(pCard, tag, { size: 11, weight: 'Bold', color: 'primary', ls: 1.5, lh: 16 });
    txt(pCard, title, { w: 340, size: 16, weight: 'Bold', color: 'ink', lh: 22 });
    txt(pCard, desc, { w: 340, size: 13, color: 'muted', lh: 21 });
  }
  return sec;
}

// ---------------------------------------------------------------------------
// SHARED SECTION: StaffSection (StaffSection.tsx)
// ---------------------------------------------------------------------------
const TEACHERS = [
  'EndangSuprihatin,S.Pd.,M.M.',
  'Drs. Ec. Sugeng Subagyo',
  'Dra. Sri Yuniati',
  'Dra. Harnanik',
  'Erni Yulianti, S.Pd.',
  'Sugeng Hariyanto, S.Pd.',
  'M. Yunan Helmi, S.Pd.',
  'M. Hariyanto, S.Pd.',
  'Retno Indarti, S.Pd.',
  'Rizka Amalia, S.Pd.',
  'Wiwik Sugiarti, S.Pd.',
  'Aniswatul Khusna, S.Pd.',
  'Dwi Wahyuni, S.Pd.',
  'Luluk Mukaromah, S.Pd.',
  'Achmad Fauzi, S.Pd.',
  'Siti Aminah, S.Pd.',
  'Budi Santoso, S.Pd.',
  'Hendra Wijaya, S.Kom.',
  'Nurul Hidayah, S.Pd.',
  'Wahyu Pratama, S.Pd.'
];

function buildStaffSection(parentAs, showPrincipal = true) {
  const sec = box(parentAs, 'Section / Profil Guru', {
    w: 1440,
    pad: [88, 144],
    gap: 56,
    alignCross: 'CENTER',
    fill: 'bg'
  });

  const head = box(sec, 'Staff Header', { w: 760, gap: 12, alignCross: 'CENTER' });
  pillBadge(head, 'Profil Guru');
  txt(head, 'Pendidik berdedikasi, membimbing\ngenerasi berprestasi', {
    w: 760,
    size: 40,
    weight: 'Bold',
    color: 'ink',
    align: 'CENTER',
    lh: 48,
    ls: -1,
    highlights: [{ word: 'generasi berprestasi', color: 'primary' }]
  });
  txt(head, '20 guru dalam keluarga SMA Widya Darma Surabaya.', {
    size: 15,
    color: 'muted',
    align: 'CENTER',
    lh: 24
  });

  if (showPrincipal) {
    const principalRow = row(sec, 'Sambutan Kepala Sekolah', {
      w: 1080,
      gap: 56,
      alignMain: 'CENTER',
      alignCross: 'CENTER'
    });

    photoBox(principalRow, 'Principal Leaf Photo', 'img_02', 340, 400, [50, 0, 50, 0], null, {
      stroke: 'white',
      strokeWeight: 4,
      effects: shadowCard(0.1, 16, 36)
    });

    const pText = box(principalRow, 'Principal Message', { w: 684, gap: 18 });
    txt(pText, 'SAMBUTAN KEPALA SEKOLAH', {
      size: 11,
      weight: 'Bold',
      color: 'primary',
      ls: 1.8,
      lh: 16
    });
    txt(pText, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', {
      w: 660,
      size: 30,
      weight: 'Bold',
      color: 'ink',
      lh: 38,
      ls: -0.6
    });
    txt(
      pText,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      { w: 660, size: 15, color: 'muted', lh: 26 }
    );
    txt(
      pText,
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
      { w: 660, size: 15, color: 'muted', lh: 26 }
    );

    const sig = box(pText, 'Principal Signature', {
      w: 660,
      pad: [16, 0, 0, 0],
      gap: 4
    });
    txt(sig, 'Lorem Ipsum, M.Pd.', { size: 16, weight: 'Bold', color: 'ink', lh: 22 });
    txt(sig, 'Kepala Sekolah SMA Widya Darma', {
      size: 13,
      weight: 'Medium',
      color: 'muted',
      lh: 18
    });
  }

  const marquee = row(sec, 'StaffMarquee / 6 Cards', {
    w: 1152,
    gap: 20,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'MIN'
  });

  for (let i = 0; i < 6; i++) {
    const sc = box(marquee, 'StaffCard / ' + TEACHERS[i], {
      w: 175,
      gap: 10,
      alignCross: 'CENTER'
    });
    photoBox(sc, 'Portrait Leaf', 'staff', 155, 180, [24, 0, 24, 0], null, {
      stroke: 'white',
      strokeWeight: 3,
      effects: shadowCard(0.06, 8, 20)
    });

    const pedestal = box(sc, 'Pedestal Card', {
      w: 175,
      pad: [12, 14],
      gap: 4,
      radius: [16, 16, 12, 12],
      fill: 'white',
      stroke: 'borderSoft',
      effects: shadowCard(0.05, 6, 16)
    });
    txt(pedestal, TEACHERS[i], {
      w: 147,
      size: 12,
      weight: 'Bold',
      color: 'ink',
      lh: 17
    });
    txt(pedestal, 'Guru', {
      size: 11,
      weight: 'Medium',
      color: 'primary',
      lh: 15
    });
    onClickNavigate(sc, 'teachers');
  }

  const allTeachersBtn = actionPill(sec, 'Lihat semua guru', {
    fill: 'blue50',
    stroke: 'blue200',
    color: 'primary',
    icon: 'arrowRight',
    pad: [11, 24]
  });
  onClickNavigate(allTeachersBtn, 'teachers');
  return sec;
}

const PUBLICATIONS = [
  {
    img: 'img_01',
    cat: 'BERITA',
    date: '2026-10-01',
    title: 'Lorem ipsum dolor sit amet',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    img: 'img_02',
    cat: 'KEGIATAN',
    date: '2026-10-01',
    title: 'Consectetur adipiscing elit',
    excerpt:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    img: 'img_03',
    cat: 'PRESTASI',
    date: '2026-10-01',
    title: 'Sed do eiusmod tempor incididunt',
    excerpt:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
  },
  {
    img: 'img_05',
    cat: 'JURNAL',
    date: '2026-10-01',
    title: 'Ut labore et dolore magna aliqua',
    excerpt:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    img: 'img_09',
    cat: 'KARYA',
    date: '2026-10-01',
    title: 'Quis nostrud exercitation ullamco',
    excerpt:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.'
  },
  {
    img: 'img_11',
    cat: 'EKSTRAKURIKULER',
    date: '2026-10-01',
    title: 'Laboris nisi ut aliquip ex ea',
    excerpt:
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.'
  }
];

function buildPubCard(parentAs, item) {
  const card = box(parentAs, 'PublicationCard / ' + item.title, {
    w: 368,
    pad: 14,
    gap: 14,
    radius: 24,
    fill: 'white',
    stroke: 'borderSoft',
    effects: shadowCard(0.06, 10, 28)
  });
  photoBox(card, 'Cover Photo', item.img, 340, 212, 16);
  const body = box(card, 'Body', { w: 340, pad: [4, 8, 8, 8], gap: 8 });
  txt(body, `${item.cat}  ·  ${item.date}`, {
    size: 11,
    weight: 'Bold',
    color: 'primary',
    ls: 1.2,
    lh: 16
  });
  txt(body, item.title, {
    w: 324,
    size: 18,
    weight: 'Bold',
    color: 'ink',
    lh: 25
  });
  txt(body, item.excerpt, {
    w: 324,
    size: 13,
    color: 'muted',
    lh: 21
  });
  const more = row(body, 'Baca selengkapnya', {
    pad: [6, 0, 0, 0],
    gap: 6,
    alignCross: 'CENTER'
  });
  txt(more, 'Baca selengkapnya', {
    size: 12,
    weight: 'SemiBold',
    color: 'primary',
    lh: 18
  });
  iconBox(more, 'arrowRight', 14, 'primary');
  onClickNavigate(card, 'article');
  return card;
}

// ---------------------------------------------------------------------------
// CREATE TOP-LEVEL DESKTOP SCREEN FRAMES (1440px ONLY)
// ---------------------------------------------------------------------------
const screens = {};
let screenIndex = 0;

function createScreenFrame(key, title, fixedH = null) {
  const col = screenIndex % 4;
  const r = Math.floor(screenIndex / 4);
  const x = col * 1640;
  const y = r * 4400;
  screenIndex++;

  const fAs = box(null, title, {
    as: 'screen_' + key,
    x,
    y,
    w: 1440,
    h: fixedH || undefined,
    clip: true,
    fill: 'bg',
    alignCross: 'CENTER'
  });
  screens[key] = fAs;
  return fAs;
}

// ===========================================================================
// SCREEN 01: 01 · Beranda / Desktop
// ===========================================================================
{
  const s = createScreenFrame('home', '01 · Beranda / Desktop');

  const heroWrap = box(s, 'Hero + Showcase Section', {
    w: 1440,
    gap: 32,
    pad: [0, 0, 72, 0],
    alignCross: 'CENTER',
    clip: true,
    fill: 'bg'
  });

  // Background grayscale campus photo + soft mist overlay
  const heroBg = photoBox(
    heroWrap,
    'Hero Grayscale Campus Bg',
    'img_14_gray',
    1440,
    820,
    0,
    gradLinear('bg', 0.65, 'bg', 0.96),
    { abs: true, x: 0, y: 0 }
  );

  buildNavbar(heroWrap, 'home', 'default');

  const heroHead = box(heroWrap, 'Hero Headline Block', {
    w: 960,
    pad: [24, 0, 8, 0],
    gap: 14,
    alignCross: 'CENTER'
  });
  txt(heroHead, 'Lorem ipsum dolor sit', {
    size: 60,
    weight: 'Bold',
    color: 'ink',
    align: 'CENTER',
    lh: 68,
    ls: -1.8
  });
  const line2 = row(heroHead, 'Title Line 2 + Pill', {
    gap: 14,
    alignMain: 'CENTER',
    alignCross: 'CENTER'
  });
  txt(line2, 'amet,', {
    size: 60,
    weight: 'Bold',
    color: 'ink',
    lh: 68,
    ls: -1.8
  });
  const wordPill = row(line2, 'Highlight Pill / consectetur.', {
    pad: [4, 20],
    radius: 18,
    fill: 'primary',
    opacity: 0.1,
    stroke: 'primary',
    strokeOpacity: 0.2
  });
  txt(wordPill, 'consectetur.', {
    size: 60,
    weight: 'Bold',
    color: 'primary',
    lh: 68,
    ls: -1.8
  });

  txt(
    heroHead,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    {
      w: 580,
      size: 16,
      color: 'muted',
      align: 'CENTER',
      lh: 26
    }
  );

  const showcaseRow = row(heroWrap, 'Showcase 3-Card Stage', {
    w: 1200,
    pad: [16, 0, 0, 0],
    gap: 28,
    alignMain: 'CENTER',
    alignCross: 'CENTER'
  });

  for (const item of [
    { img: 'img_03', cat: 'PROFIL SEKOLAH', title: 'Lorem ipsum dolor', target: 'profile', topPad: 24 },
    { img: 'img_01', cat: 'INFORMASI SPMB', title: 'Lorem ipsum dolor', target: 'spmb', topPad: 0 },
    { img: 'img_31', cat: 'PUBLIKASI & GALERI', title: 'Lorem ipsum dolor', target: 'publications', topPad: 24 }
  ]) {
    const colWrap = box(showcaseRow, 'Stage Slot / ' + item.cat, {
      pad: [item.topPad, 0, 0, 0],
      alignCross: 'CENTER'
    });
    const card = box(colWrap, 'ShowcaseCard / ' + item.cat, {
      w: 372,
      pad: 10,
      radius: 28,
      fill: 'white',
      stroke: 'white',
      effects: shadowCard(0.12, 18, 40)
    });
    const media = photoBox(
      card,
      'Photo',
      item.img,
      352,
      320,
      20,
      gradLinear('black', 0.04, 'black', 0.65)
    );
    const bottomBar = row(media, 'Caption Overlay', {
      x: 16,
      y: 244,
      w: 320,
      alignMain: 'SPACE_BETWEEN',
      alignCross: 'CENTER'
    });
    const glassInfo = box(bottomBar, 'Glass Pill', {
      pad: [10, 16],
      gap: 2,
      radius: 16,
      fill: 'black',
      opacity: 0.45,
      stroke: 'white',
      strokeOpacity: 0.25
    });
    txt(glassInfo, item.cat, {
      size: 10,
      weight: 'Bold',
      color: 'sky300',
      ls: 1.4,
      lh: 14
    });
    txt(glassInfo, item.title, {
      size: 15,
      weight: 'Bold',
      color: 'white',
      lh: 20
    });
    const circleBtn = row(bottomBar, 'Arrow Circle', {
      w: 40,
      h: 40,
      radius: 999,
      alignMain: 'CENTER',
      alignCross: 'CENTER',
      fill: 'white',
      effects: shadowCard(0.15, 4, 12)
    });
    iconBox(circleBtn, 'arrowUpRight', 18, 'ink');
    onClickNavigate(card, item.target);
  }

  buildSchoolIntro(s, false);
  buildStaffSection(s, true);

  const pubSec = box(s, 'Section / PublicationPreview', {
    w: 1440,
    pad: [88, 144],
    gap: 44,
    alignCross: 'CENTER',
    fill: 'blue50'
  });
  const pubHead = box(pubSec, 'Publication Header', {
    w: 760,
    gap: 12,
    alignCross: 'CENTER'
  });
  pillBadge(pubHead, 'Publikasi & Galeri');
  txt(pubHead, 'Momen belajar, berkarya, dan berprestasi', {
    w: 760,
    size: 40,
    weight: 'Bold',
    color: 'ink',
    align: 'CENTER',
    lh: 48,
    ls: -1,
    highlights: [{ word: 'berprestasi', color: 'primary' }]
  });
  txt(
    pubHead,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    { size: 15, color: 'muted', align: 'CENTER', lh: 24 }
  );

  const pubRow = row(pubSec, 'Publication 3-Card Row', {
    w: 1152,
    gap: 24,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'MIN'
  });
  for (let i = 0; i < 3; i++) buildPubCard(pubRow, PUBLICATIONS[i]);

  const allPubsBtn = actionPill(pubSec, 'Lihat semua publikasi', {
    fill: 'white',
    stroke: 'blue200',
    color: 'primary',
    icon: 'arrowRight',
    pad: [11, 24]
  });
  onClickNavigate(allPubsBtn, 'publications');

  buildFooter(s);
}

// ===========================================================================
// SCREEN 02: 02 · Profil Sekolah / Desktop
// ===========================================================================
{
  const s = createScreenFrame('profile', '02 · Profil Sekolah / Desktop');

  const hero = box(s, 'Profile Hero (Full-Bleed)', {
    w: 1440,
    h: 640,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER',
    clip: true,
    fill: 'navyBot'
  });
  photoBox(hero, 'Hero Bg Photo', 'img_01', 1440, 640, 0, gradLinear('black', 0.45, 'black', 0.6), {
    abs: true,
    x: 0,
    y: 0
  });
  buildNavbar(hero, 'profile', 'hero');

  const centerTitle = box(hero, 'Hero Center Title', {
    gap: 8,
    alignCross: 'CENTER'
  });
  txt(centerTitle, 'PROFIL', {
    size: 64,
    weight: 'Bold',
    color: 'white',
    align: 'CENTER',
    lh: 72,
    ls: -1.5
  });
  txt(centerTitle, 'SMA Widya Darma', {
    size: 46,
    weight: 'Bold',
    color: 'sky300',
    align: 'CENTER',
    lh: 54,
    ls: -1
  });

  const bottomFade = box(hero, 'Bottom Fade + Subnav', {
    w: 1440,
    pad: [32, 80, 28, 80],
    alignCross: 'CENTER',
    fills: [gradLinear('bg', 0, 'bg', 1)]
  });
  const subSwitch = row(bottomFade, 'Profile Sub-Switcher', {
    pad: 6,
    gap: 6,
    radius: 999,
    fill: 'white',
    stroke: 'border',
    effects: shadowCard(0.08, 6, 18)
  });
  actionPill(subSwitch, 'Profil Sekolah', {
    fill: 'primary',
    color: 'white',
    pad: [8, 18],
    size: 12
  });
  const tab2 = actionPill(subSwitch, 'Direktori 20 Guru', {
    fill: 'white',
    color: 'muted',
    icon: 'arrowRight',
    pad: [8, 18],
    size: 12
  });
  onClickNavigate(tab2, 'teachers');

  const introCopy = box(s, 'Section / Intro Editorial Copy', {
    w: 1440,
    pad: [56, 340, 24, 340],
    gap: 20,
    alignCross: 'CENTER',
    fill: 'bg'
  });
  txt(
    introCopy,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    { w: 760, size: 16, color: 'slate600', align: 'CENTER', lh: 28 }
  );
  txt(
    introCopy,
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    { w: 760, size: 16, color: 'slate600', align: 'CENTER', lh: 28 }
  );

  buildSchoolIntro(s, true);

  const vmSec = box(s, 'Section / Visi & Misi', {
    w: 1440,
    pad: [80, 144],
    gap: 64,
    alignCross: 'CENTER',
    fill: 'bg'
  });
  const vmHead = box(vmSec, 'Visi & Misi Header', { gap: 12, alignCross: 'CENTER' });
  txt(vmHead, 'Visi & Misi', {
    size: 38,
    weight: 'Bold',
    color: 'ink',
    align: 'CENTER',
    lh: 44
  });
  box(vmHead, 'Accent Bar', { w: 56, h: 4, radius: 999, fill: 'primary' });

  const visiRow = row(vmSec, 'Row 1 / Visi Sekolah', {
    w: 1152,
    gap: 56,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER'
  });
  const visiPhotos = row(visiRow, '3 Staggered Pill Photos (Visi)', {
    gap: 16,
    alignCross: 'MIN'
  });
  for (const [imgKey, topPad] of [
    ['img_32', 0],
    ['img_14', 28],
    ['img_31', 0]
  ]) {
    const slot = box(visiPhotos, 'Pill Slot', { pad: [topPad, 0, 0, 0] });
    photoBox(slot, 'Pill Photo', imgKey, 156, 330, 32, null, {
      stroke: 'white',
      strokeWeight: 4,
      effects: shadowCard(0.08, 10, 24)
    });
  }

  const visiText = box(visiRow, 'Visi Content', { w: 560, gap: 18 });
  txt(visiText, 'VISI SEKOLAH', {
    size: 11,
    weight: 'Bold',
    color: 'primary',
    ls: 1.8,
    lh: 16
  });
  txt(visiText, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', {
    w: 540,
    size: 32,
    weight: 'Bold',
    color: 'ink',
    lh: 40,
    ls: -0.6
  });
  const quoteBox = row(visiText, 'Blockquote', {
    w: 540,
    pad: [12, 20],
    gap: 16,
    radius: 16,
    fill: 'blue50',
    stroke: 'blue200'
  });
  txt(
    quoteBox,
    '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."',
    { w: 500, size: 15, weight: 'Medium', color: 'primary', lh: 25 }
  );
  txt(
    visiText,
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
    { w: 540, size: 15, color: 'muted', lh: 25 }
  );

  const misiRow = row(vmSec, 'Row 2 / Misi Sekolah', {
    w: 1152,
    gap: 56,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER'
  });
  const misiText = box(misiRow, 'Misi Content', { w: 560, gap: 18 });
  txt(misiText, 'MISI SEKOLAH', {
    size: 11,
    weight: 'Bold',
    color: 'primary',
    ls: 1.8,
    lh: 16
  });
  txt(misiText, 'Consectetur adipiscing elit sed do eiusmod.', {
    w: 540,
    size: 32,
    weight: 'Bold',
    color: 'ink',
    lh: 40,
    ls: -0.6
  });
  for (const [num, mCopy] of [
    [
      '01',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.'
    ],
    [
      '02',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.'
    ],
    [
      '03',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    ]
  ]) {
    const mItem = row(misiText, 'Misi ' + num, {
      w: 540,
      gap: 16,
      alignCross: 'MIN'
    });
    const badge = row(mItem, 'Number Badge', {
      w: 32,
      h: 32,
      radius: 999,
      alignMain: 'CENTER',
      alignCross: 'CENTER',
      fill: 'blue50',
      stroke: 'blue200'
    });
    txt(badge, num, { size: 12, weight: 'Bold', color: 'primary', lh: 16 });
    txt(mItem, mCopy, { w: 488, size: 14, color: 'muted', lh: 23 });
  }

  const misiPhotos = row(misiRow, '3 Staggered Pill Photos (Misi)', {
    gap: 16,
    alignCross: 'MIN'
  });
  for (const [imgKey, topPad] of [
    ['img_33', 0],
    ['img_34', 28],
    ['img_41', 0]
  ]) {
    const slot = box(misiPhotos, 'Pill Slot', { pad: [topPad, 0, 0, 0] });
    photoBox(slot, 'Pill Photo', imgKey, 156, 330, 32, null, {
      stroke: 'white',
      strokeWeight: 4,
      effects: shadowCard(0.08, 10, 24)
    });
  }

  buildStaffSection(s, true);
  buildFooter(s);
}

// ===========================================================================
// SCREEN 03: 03 · Profil Guru / Desktop
// ===========================================================================
{
  const s = createScreenFrame('teachers', '03 · Profil Guru / Desktop');

  const hero = box(s, 'Guru Hero (Full-Bleed)', {
    w: 1440,
    h: 560,
    gap: 36,
    alignCross: 'CENTER',
    clip: true,
    fill: 'navyBot'
  });
  photoBox(
    hero,
    'Guru Hero Bg',
    'img_50',
    1440,
    560,
    0,
    gradLinear('navyBot', 0.68, 'navyBot', 0.88),
    { abs: true, x: 0, y: 0 }
  );
  buildNavbar(hero, 'teachers', 'hero');

  const heroBody = box(hero, 'Guru Hero Content', {
    w: 880,
    pad: [24, 0, 0, 0],
    gap: 16,
    alignCross: 'CENTER'
  });
  const bc = txt(heroBody, 'Beranda  /  Profil Guru', {
    size: 12,
    weight: 'Medium',
    color: 'white',
    opacity: 0.75,
    lh: 18
  });
  onClickNavigate(bc, 'home');

  pillBadge(heroBody, 'Direktori Guru', {
    fill: 'white',
    opacity: 0.14,
    stroke: 'white',
    strokeOpacity: 0.3,
    color: 'white',
    dotColor: 'sky300'
  });

  txt(heroBody, 'Pendidik berdedikasi, membimbing\ngenerasi berprestasi', {
    w: 860,
    size: 48,
    weight: 'Bold',
    color: 'white',
    align: 'CENTER',
    lh: 58,
    ls: -1.2,
    highlights: [{ word: 'generasi berprestasi', color: 'sky300' }]
  });
  box(heroBody, 'Sky Shimmer Underline', { w: 180, h: 4, radius: 999, fill: 'sky300' });
  txt(heroBody, 'Mengenal 20 guru SMA Widya Darma Surabaya.', {
    size: 16,
    color: 'white',
    opacity: 0.8,
    align: 'CENTER',
    lh: 24
  });

  const dirSec = box(s, 'Section / Daftar Nama Guru (20 Guru)', {
    w: 1440,
    pad: [72, 144, 96, 144],
    gap: 32,
    alignCross: 'CENTER',
    fill: 'bg'
  });
  const dirHead = row(dirSec, 'Directory Header Bar', {
    w: 1152,
    pad: [0, 0, 16, 0],
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER'
  });
  txt(dirHead, 'Daftar Nama Guru', { size: 24, weight: 'Bold', color: 'ink', lh: 32 });
  txt(dirHead, 'Jumlah: 20 guru', { size: 14, weight: 'Medium', color: 'muted', lh: 20 });

  const gridWrap = box(dirSec, '20-Teacher 3-Column Grid', {
    w: 1152,
    gap: 18
  });
  for (let r = 0; r < 7; r++) {
    const gRow = row(gridWrap, 'Row ' + (r + 1), {
      w: 1152,
      gap: 24,
      alignMain: 'MIN',
      alignCross: 'CENTER'
    });
    for (let c = 0; c < 3; c++) {
      const idx = r * 3 + c;
      if (idx >= TEACHERS.length) break;
      const tCard = row(gRow, `StaffDirectoryCard / ${idx + 1}. ${TEACHERS[idx]}`, {
        w: 368,
        pad: 14,
        gap: 14,
        radius: 20,
        alignMain: 'SPACE_BETWEEN',
        alignCross: 'CENTER',
        fill: 'white',
        stroke: 'borderSoft',
        effects: shadowCard(0.04, 6, 18)
      });
      const leftPart = row(tCard, 'Left', { w: 230, gap: 12, alignCross: 'CENTER' });
      photoBox(leftPart, 'Avatar', 'staff', 64, 72, 12);
      const nameCol = box(leftPart, 'Name Column', { w: 150, gap: 4 });
      pillBadge(nameCol, 'Guru', { pad: [2, 8], size: 10 });
      txt(nameCol, TEACHERS[idx], {
        w: 150,
        size: 13,
        weight: 'Bold',
        color: 'ink',
        lh: 18
      });

      const rightPart = box(tCard, 'Right Meta', {
        w: 96,
        pad: [6, 0, 6, 12],
        gap: 4
      });
      txt(rightPart, 'Guru', { size: 12, weight: 'SemiBold', color: 'ink', lh: 16 });
      txt(rightPart, `Kode guru ${idx + 1}`, {
        size: 11,
        color: 'muted',
        lh: 15
      });
    }
  }

  buildFooter(s);
}

// ===========================================================================
// SCREEN 04: 04 · Informasi SPMB / Desktop
// ===========================================================================
{
  const s = createScreenFrame('spmb', '04 · Informasi SPMB / Desktop');

  const hero = box(s, 'SPMB Hero + Admission Pass', {
    w: 1440,
    pad: [0, 0, 72, 0],
    gap: 32,
    alignCross: 'CENTER',
    fill: 'bg'
  });
  buildNavbar(hero, 'spmb', 'default');

  const headBlock = box(hero, 'SPMB Headline Block', {
    w: 920,
    gap: 14,
    alignCross: 'CENTER'
  });
  const bc = txt(headBlock, 'Beranda  /  SPMB', {
    size: 12,
    weight: 'Medium',
    color: 'muted',
    lh: 18
  });
  onClickNavigate(bc, 'home');

  const hLine1 = row(headBlock, 'Headline Line 1', {
    gap: 14,
    alignMain: 'CENTER',
    alignCross: 'CENTER'
  });
  txt(hLine1, 'Tiket menuju', {
    size: 54,
    weight: 'Bold',
    color: 'ink',
    lh: 62,
    ls: -1.5
  });
  photoBox(hLine1, 'Inline Pill Photo', 'img_32', 112, 48, 999, null, {
    stroke: 'white',
    strokeWeight: 3,
    effects: shadowCard(0.12, 6, 16)
  });
  txt(hLine1, 'masa', {
    size: 54,
    weight: 'Bold',
    color: 'ink',
    lh: 62,
    ls: -1.5
  });

  txt(headBlock, 'depanmu sudah dibuka.', {
    size: 54,
    weight: 'Bold',
    color: 'ink',
    align: 'CENTER',
    lh: 62,
    ls: -1.5,
    highlights: [{ word: 'sudah dibuka.', color: 'primary' }]
  });
  box(headBlock, 'Scribble Underline', { w: 220, h: 5, radius: 999, fill: 'sky300' });
  txt(
    headBlock,
    'Penerimaan Peserta Didik Baru Tahun Ajaran 2026/2027. Siapkan dirimu menjadi bagian dari generasi unggul SMA Widya Darma Surabaya.',
    { w: 660, size: 15, color: 'muted', align: 'CENTER', lh: 25 }
  );

  const ticketCard = row(hero, 'Admission Pass Ticket Card', {
    w: 1152,
    h: 430,
    radius: 32,
    clip: true,
    fill: 'white',
    stroke: 'borderSoft',
    effects: shadowCard(0.1, 20, 44)
  });

  const ticketLeft = photoBox(
    ticketCard,
    'Ticket Left Photo Panel',
    'img_33',
    756,
    430,
    0,
    gradLinear('black', 0.1, 'black', 0.74)
  );
  const tTopRow = row(ticketLeft, 'Ticket Top Pills', {
    x: 28,
    y: 28,
    w: 700,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER'
  });
  pillBadge(tTopRow, 'ADMISSION PASS', {
    fill: 'black',
    opacity: 0.45,
    stroke: 'white',
    strokeOpacity: 0.25,
    color: 'white',
    dotColor: 'sky300'
  });
  pillBadge(tTopRow, 'Pendaftaran Dibuka', {
    fill: 'emerald50',
    stroke: 'emerald500',
    color: 'ink',
    dotColor: 'emerald500'
  });

  const tBotText = box(ticketLeft, 'Ticket Bottom Info', {
    x: 28,
    y: 312,
    w: 680,
    gap: 6
  });
  txt(tBotText, 'PENERIMAAN PESERTA DIDIK BARU', {
    size: 11,
    weight: 'Bold',
    color: 'sky300',
    ls: 1.8,
    lh: 16
  });
  txt(tBotText, 'SMA Widya Darma Surabaya', {
    size: 30,
    weight: 'Bold',
    color: 'white',
    lh: 36
  });
  txt(tBotText, 'Jl. Ketintang No. 147-151, Wonokromo, Surabaya', {
    size: 13,
    color: 'white',
    opacity: 0.82,
    lh: 20
  });

  const perf = box(ticketCard, 'Perforated Divider', {
    layout: 'NONE',
    w: 36,
    h: 430,
    fill: 'white'
  });
  commands.push({
    command: 'node.create',
    params: {
      type: 'ellipse',
      name: 'Notch Top',
      parent: ref(perf),
      x: 4,
      y: -14,
      width: 28,
      height: 28,
      props: { fill: colorHex('bg') }
    }
  });
  commands.push({
    command: 'node.create',
    params: {
      type: 'ellipse',
      name: 'Notch Bottom',
      parent: ref(perf),
      x: 4,
      y: 416,
      width: 28,
      height: 28,
      props: { fill: colorHex('bg') }
    }
  });
  box(perf, 'Dashed Line', {
    layout: 'NONE',
    x: 17,
    y: 24,
    w: 2,
    h: 382,
    stroke: 'border',
    dash: [6, 6]
  });

  const stub = box(ticketCard, 'Ticket Right Stub', {
    w: 360,
    h: 430,
    pad: [28, 28],
    gap: 18,
    alignMain: 'SPACE_BETWEEN',
    fill: 'white'
  });
  const stubTop = row(stub, 'Stub Header', {
    w: 304,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'MIN'
  });
  const stLeft = box(stubTop, 'Tahun Ajaran', { gap: 2 });
  txt(stLeft, 'TAHUN AJARAN', { size: 10, weight: 'Bold', color: 'muted', ls: 1.4, lh: 14 });
  txt(stLeft, '2026/2027', { size: 20, weight: 'Bold', color: 'ink', lh: 26 });
  const stRight = box(stubTop, 'Gelombang', { gap: 2, alignCross: 'MAX' });
  txt(stRight, 'GELOMBANG AKTIF', {
    size: 10,
    weight: 'Bold',
    color: 'muted',
    ls: 1.4,
    lh: 14
  });
  txt(stRight, 'Gel. 01', { size: 20, weight: 'Bold', color: 'primary', lh: 26 });

  const metaGrid = box(stub, 'Pass Details 2x2', {
    w: 304,
    pad: [12, 12],
    gap: 12,
    radius: 16,
    fill: 'bg',
    stroke: 'border',
    dash: [4, 4]
  });
  const mg1 = row(metaGrid, 'Row 1', { w: 280, alignMain: 'SPACE_BETWEEN' });
  for (const [k, v] of [
    ['JENJANG', 'SMA (Kelas X)'],
    ['AKREDITASI', 'A+ (Unggul)']
  ]) {
    const cell = box(mg1, k, { w: 132, gap: 2 });
    txt(cell, k, { size: 10, weight: 'Bold', color: 'slate400', ls: 1.2, lh: 14 });
    txt(cell, v, { size: 13, weight: 'Bold', color: 'ink', lh: 18 });
  }
  const mg2 = row(metaGrid, 'Row 2', { w: 280, alignMain: 'SPACE_BETWEEN' });
  for (const [k, v] of [
    ['KUOTA', 'Terbatas'],
    ['JALUR', 'Reguler & Prestasi']
  ]) {
    const cell = box(mg2, k, { w: 132, gap: 2 });
    txt(cell, k, { size: 10, weight: 'Bold', color: 'slate400', ls: 1.2, lh: 14 });
    txt(cell, v, { size: 13, weight: 'Bold', color: 'ink', lh: 18 });
  }

  const barcodeWrap = box(stub, 'Barcode Block', {
    w: 304,
    gap: 6,
    alignCross: 'CENTER'
  });
  const bars = row(barcodeWrap, 'Barcode Bars', {
    w: 280,
    h: 34,
    gap: 3,
    alignMain: 'CENTER',
    alignCross: 'CENTER'
  });
  for (const bw of [3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4, 2, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2]) {
    box(bars, 'b', { w: bw, h: 32, fill: 'ink', opacity: 0.78 });
  }
  txt(barcodeWrap, 'SMAWD-SPMB-2026', {
    size: 10,
    weight: 'SemiBold',
    color: 'slate400',
    ls: 3,
    lh: 14
  });

  const scrollJadwalBtn = actionPill(stub, 'Lihat syarat & jadwal', {
    w: 304,
    fill: 'primary',
    color: 'white',
    icon: 'arrowDown',
    pad: [12, 24],
    shadow: true
  });

  const sec01 = box(s, 'Section 01 / Jadwal & Persyaratan', {
    w: 1440,
    pad: [80, 144],
    gap: 40,
    alignCross: 'CENTER',
    fill: 'bg'
  });
  onClickScroll(scrollJadwalBtn, () => sec01);

  const s01Head = box(sec01, 'Header 01', { w: 1152, gap: 8 });
  txt(s01Head, '01 · JADWAL & PERSYARATAN', {
    size: 11,
    weight: 'Bold',
    color: 'primary',
    ls: 1.8,
    lh: 16
  });
  txt(s01Head, 'Persiapkan dokumen dan catat tanggal pentingnya.', {
    w: 760,
    size: 36,
    weight: 'Bold',
    color: 'ink',
    lh: 44,
    ls: -0.8,
    highlights: [{ word: 'tanggal pentingnya.', color: 'primary' }]
  });

  const s01Cards = row(sec01, '3 Cards Row', {
    w: 1152,
    gap: 24,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'MIN'
  });

  const cJadwal = box(s01Cards, 'Card 01 / Jadwal Penerimaan', {
    w: 368,
    pad: 28,
    gap: 20,
    radius: 24,
    fill: 'white',
    stroke: 'borderSoft',
    effects: shadowCard(0.05, 10, 24)
  });
  txt(cJadwal, '01 · JADWAL PENERIMAAN', {
    size: 11,
    weight: 'Bold',
    color: 'primary',
    ls: 1.4,
    lh: 16
  });
  txt(cJadwal, 'Gelombang Pendaftaran', {
    size: 20,
    weight: 'Bold',
    color: 'ink',
    lh: 26
  });
  for (const [wName, wDate, wStatus, dotC] of [
    ['Gelombang 1', 'Januari – Maret 2026', 'Sedang Dibuka', 'emerald500'],
    ['Gelombang 2', 'April – Mei 2026', 'Segera Dibuka', 'amber500'],
    ['Gelombang 3', 'Juni – Juli 2026', 'Terjadwal', 'slate400'],
    ['Daftar Ulang & MPLS', 'Juli 2026', 'Tahun Ajaran Baru', 'primary']
  ]) {
    const wRow = row(cJadwal, wName, {
      w: 312,
      pad: [10, 12],
      radius: 14,
      alignMain: 'SPACE_BETWEEN',
      alignCross: 'CENTER',
      fill: 'bg'
    });
    const wl = box(wRow, 'Left', { gap: 2 });
    txt(wl, wName, { size: 13, weight: 'Bold', color: 'ink', lh: 18 });
    txt(wl, wDate, { size: 11, color: 'muted', lh: 15 });
    pillBadge(wRow, wStatus, {
      pad: [4, 10],
      size: 10,
      fill: 'white',
      stroke: 'border',
      color: 'ink',
      dotColor: dotC
    });
  }

  const cSyarat = box(s01Cards, 'Card 02 / Persyaratan Calon Siswa', {
    w: 368,
    pad: 28,
    gap: 16,
    radius: 24,
    fill: 'white',
    stroke: 'borderSoft',
    effects: shadowCard(0.05, 10, 24)
  });
  txt(cSyarat, '02 · PERSYARATAN UMUM', {
    size: 11,
    weight: 'Bold',
    color: 'primary',
    ls: 1.4,
    lh: 16
  });
  txt(cSyarat, 'Persyaratan Calon Siswa', {
    size: 20,
    weight: 'Bold',
    color: 'ink',
    lh: 26
  });
  for (let i = 1; i <= 6; i++) {
    const sr = row(cSyarat, 'Syarat ' + i, {
      w: 312,
      gap: 12,
      alignCross: 'CENTER'
    });
    const nb = row(sr, 'Num', {
      w: 26,
      h: 26,
      radius: 999,
      alignMain: 'CENTER',
      alignCross: 'CENTER',
      fill: 'blue50'
    });
    txt(nb, String(i), { size: 11, weight: 'Bold', color: 'primary', lh: 14 });
    txt(sr, 'Lorem ipsum dolor sit amet consectetur adipiscing.', {
      w: 270,
      size: 13,
      color: 'muted',
      lh: 19
    });
  }

  const cDok = box(s01Cards, 'Card 03 / Dokumen Pendaftaran', {
    w: 368,
    pad: 28,
    gap: 14,
    radius: 24,
    fill: 'white',
    stroke: 'borderSoft',
    effects: shadowCard(0.05, 10, 24)
  });
  txt(cDok, '03 · BERKAS KELENGKAPAN', {
    size: 11,
    weight: 'Bold',
    color: 'primary',
    ls: 1.4,
    lh: 16
  });
  txt(cDok, 'Dokumen Pendaftaran', {
    size: 20,
    weight: 'Bold',
    color: 'ink',
    lh: 26
  });
  for (const d of [
    'Fotokopi Ijazah / SKL SMP/MTs dilegalisir',
    'Fotokopi Kartu Keluarga (KK) & Akta Kelahiran',
    'Pas foto berwarna ukuran 3×4 (4 lembar)',
    'Fotokopi Rapor semester 1–5',
    'Surat Keterangan Kelakuan Baik dari sekolah asal'
  ]) {
    const dr = row(cDok, d, { w: 312, gap: 10, alignCross: 'CENTER' });
    const cb = row(dr, 'Check', {
      w: 22,
      h: 22,
      radius: 999,
      alignMain: 'CENTER',
      alignCross: 'CENTER',
      fill: 'emerald50'
    });
    iconBox(cb, 'check', 13, 'emerald500');
    txt(dr, d, { w: 278, size: 13, color: 'muted', lh: 19 });
  }
  const dlBtn = row(cDok, 'Button / Unduh Formulir Pendaftaran', {
    w: 312,
    pad: [10, 16],
    gap: 8,
    radius: 14,
    alignMain: 'CENTER',
    alignCross: 'CENTER',
    fill: 'blue50',
    stroke: 'blue200',
    dash: [4, 4]
  });
  iconBox(dlBtn, 'download', 15, 'primary');
  txt(dlBtn, 'Unduh Formulir Pendaftaran', {
    size: 12,
    weight: 'SemiBold',
    color: 'primary',
    lh: 18
  });

  const sec02 = box(s, 'Section 02 / Alur Pendaftaran', {
    w: 1440,
    pad: [64, 144],
    gap: 36,
    alignCross: 'CENTER',
    fill: 'bg'
  });
  const s02Head = box(sec02, 'Header 02', { w: 1152, gap: 8 });
  txt(s02Head, '02 · ALUR PENDAFTARAN', {
    size: 11,
    weight: 'Bold',
    color: 'primary',
    ls: 1.8,
    lh: 16
  });
  txt(s02Head, 'Enam langkah mudah menjadi bagian dari kami.', {
    w: 760,
    size: 36,
    weight: 'Bold',
    color: 'ink',
    lh: 44,
    ls: -0.8,
    highlights: [{ word: 'bagian dari kami.', color: 'primary' }]
  });

  const stepsData = [
    ['01', 'Ambil Formulir', 'Ambil formulir pendaftaran secara langsung di sekolah atau unduh online.'],
    ['02', 'Lengkapi Berkas', 'Isi formulir dan siapkan seluruh dokumen persyaratan yang dibutuhkan.'],
    ['03', 'Verifikasi Panitia', 'Serahkan berkas kepada panitia SPMB untuk diverifikasi kelengkapannya.'],
    ['04', 'Wawancara & Pemetaan', 'Ikuti sesi wawancara singkat bersama calon siswa dan orang tua/wali.'],
    ['05', 'Pengumuman Hasil', 'Pantau pengumuman hasil seleksi sesuai jadwal gelombang aktif.'],
    ['06', 'Daftar Ulang', 'Selesaikan administrasi daftar ulang dan persiapan MPLS siswa baru.']
  ];

  const stepsGrid = box(sec02, 'Steps 3x2 Grid', { w: 1152, gap: 24 });
  for (let r = 0; r < 2; r++) {
    const sRow = row(stepsGrid, 'Step Row ' + (r + 1), {
      w: 1152,
      gap: 24,
      alignMain: 'SPACE_BETWEEN'
    });
    for (let c = 0; c < 3; c++) {
      const [num, stTitle, stDesc] = stepsData[r * 3 + c];
      const sc = box(sRow, 'Step ' + num, {
        w: 368,
        pad: 24,
        gap: 12,
        radius: 24,
        fill: 'white',
        stroke: 'borderSoft',
        effects: shadowCard(0.04, 8, 20)
      });
      const topSt = row(sc, 'Top', {
        w: 320,
        alignMain: 'SPACE_BETWEEN',
        alignCross: 'CENTER'
      });
      const ib = row(topSt, 'Icon Box', {
        w: 40,
        h: 40,
        radius: 12,
        alignMain: 'CENTER',
        alignCross: 'CENTER',
        fill: 'blue50'
      });
      iconBox(ib, 'ticket', 18, 'primary');
      txt(topSt, num, {
        size: 36,
        weight: 'Bold',
        color: 'primary',
        opacity: 0.14,
        lh: 40
      });
      txt(sc, stTitle, { size: 17, weight: 'Bold', color: 'ink', lh: 24 });
      txt(sc, stDesc, { w: 320, size: 13, color: 'muted', lh: 21 });
    }
  }

  const sec03 = box(s, 'Section 03 / Biaya Pendidikan', {
    w: 1440,
    pad: [64, 144],
    gap: 40,
    alignCross: 'CENTER',
    fill: 'bg'
  });
  const feeRow = row(sec03, 'Biaya 2-Column Layout', {
    w: 1152,
    gap: 48,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'MIN'
  });

  const feeLeft = box(feeRow, 'Biaya Left Column', { w: 460, gap: 18 });
  txt(feeLeft, '03 · BIAYA PENDIDIKAN', {
    size: 11,
    weight: 'Bold',
    color: 'primary',
    ls: 1.8,
    lh: 16
  });
  txt(feeLeft, 'Investasi pendidikan yang transparan & terjangkau.', {
    w: 450,
    size: 36,
    weight: 'Bold',
    color: 'ink',
    lh: 44,
    ls: -0.8,
    highlights: [{ word: 'transparan & terjangkau.', color: 'primary' }]
  });
  txt(
    feeLeft,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    { w: 450, size: 15, color: 'muted', lh: 25 }
  );
  photoBox(feeLeft, 'Biaya Photo', 'img_32', 460, 260, 24);

  const feeRight = box(feeRow, 'Biaya Right Column', { w: 644, gap: 20 });
  const feeCard = box(feeRight, 'Rincian Biaya Masuk Card', {
    w: 644,
    pad: 28,
    gap: 14,
    radius: 24,
    fill: 'white',
    stroke: 'borderSoft',
    effects: shadowCard(0.05, 10, 24)
  });
  const fcTop = row(feeCard, 'Header', {
    w: 588,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER'
  });
  txt(fcTop, 'Rincian Biaya Masuk', { size: 18, weight: 'Bold', color: 'ink', lh: 24 });
  pillBadge(fcTop, 'TA 2026/2027', { pad: [4, 12], size: 11 });

  for (const item of [
    'Formulir Pendaftaran',
    'Uang Gedung / Pengembangan',
    'SPP Bulanan',
    'Seragam Sekolah (4 Stel)',
    'Buku Paket & Modul',
    'Kegiatan Siswa & MPLS'
  ]) {
    const fr = row(feeCard, item, {
      w: 588,
      pad: [8, 12],
      radius: 12,
      alignMain: 'SPACE_BETWEEN',
      alignCross: 'CENTER',
      fill: 'bg'
    });
    txt(fr, item, { size: 14, weight: 'Medium', color: 'ink', lh: 20 });
    txt(fr, 'Lorem ipsum', { size: 14, weight: 'Bold', color: 'primary', lh: 20 });
  }

  const beasiswaBox = row(feeRight, 'Program Beasiswa Banner', {
    w: 644,
    pad: 24,
    radius: 24,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER',
    fills: [gradLinear('primary', 1, 'primaryDark', 1)]
  });
  const bLeft = box(beasiswaBox, 'Text', { w: 420, gap: 4 });
  txt(bLeft, 'PROGRAM BEASISWA PRESTASI & YATIM', {
    size: 11,
    weight: 'Bold',
    color: 'sky300',
    ls: 1.5,
    lh: 16
  });
  txt(bLeft, 'Tersedia potongan biaya gedung & beasiswa SPP bagi calon siswa berprestasi.', {
    w: 410,
    size: 14,
    weight: 'Medium',
    color: 'white',
    lh: 21
  });
  const bBtn = actionPill(beasiswaBox, 'Pelajari alur', {
    fill: 'white',
    color: 'primary',
    icon: 'arrowUp',
    pad: [10, 18],
    size: 12
  });
  onClickScroll(bBtn, () => sec02);

  const ctaWrap = box(s, 'Section 05 / CTA Banner', {
    w: 1440,
    pad: [24, 144, 88, 144],
    alignCross: 'CENTER',
    fill: 'bg'
  });
  const ctaCard = box(ctaWrap, 'CTA Card (1152)', {
    w: 1152,
    pad: [56, 64],
    gap: 20,
    radius: 32,
    alignCross: 'CENTER',
    fills: [gradLinear('primary', 1, 'primaryDark', 1)],
    effects: shadowCard(0.16, 18, 40)
  });
  pillBadge(ctaCard, 'Pendaftaran Sedang Dibuka', {
    fill: 'white',
    opacity: 0.14,
    stroke: 'white',
    strokeOpacity: 0.3,
    color: 'white',
    dotColor: 'emerald500'
  });
  txt(ctaCard, 'Jangan lewatkan kesempatan bergabung bersama kami.', {
    w: 780,
    size: 36,
    weight: 'Bold',
    color: 'white',
    align: 'CENTER',
    lh: 44
  });
  const ctaBtns = row(ctaCard, 'CTA Buttons', { gap: 16, alignCross: 'CENTER' });
  const daftarNowBtn = actionPill(ctaBtns, 'Daftar Sekarang', {
    fill: 'white',
    color: 'primary',
    icon: 'arrowUp'
  });
  onClickScroll(daftarNowBtn, () => sec01);
  const tanyaAiSpmb = actionPill(ctaBtns, 'Tanya AI seputar SPMB', {
    fill: 'primaryDark',
    stroke: 'white',
    strokeOpacity: 0.35,
    color: 'white',
    icon: 'sparkle'
  });
  onClickNavigate(tanyaAiSpmb, 'ai');

  buildFooter(s);
}

// ===========================================================================
// SCREEN 05: 05 · Galeri Kegiatan / Desktop
// ===========================================================================
{
  const s = createScreenFrame('publications', '05 · Galeri Kegiatan / Desktop');

  const hero = box(s, 'Publikasi Hero (Full-Bleed)', {
    w: 1440,
    h: 620,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER',
    clip: true,
    fill: 'navyBot'
  });
  photoBox(
    hero,
    'Publikasi Hero Bg',
    'img_48',
    1440,
    620,
    0,
    gradLinear('black', 0.35, 'black', 0.74),
    { abs: true, x: 0, y: 0 }
  );
  buildNavbar(hero, 'publications', 'hero');

  const heroBot = box(hero, 'Hero Bottom Content', {
    w: 1280,
    pad: [0, 64, 56, 64],
    gap: 16
  });
  pillBadge(heroBot, 'CERITA SEKOLAH', {
    fill: 'white',
    opacity: 0.15,
    stroke: 'white',
    strokeOpacity: 0.3,
    color: 'white',
    dotColor: 'sky300'
  });
  txt(heroBot, 'Publikasi & Galeri', {
    size: 56,
    weight: 'Bold',
    color: 'white',
    lh: 64,
    ls: -1.5,
    highlights: [{ word: 'Galeri', color: 'sky300' }]
  });
  txt(
    heroBot,
    'Dokumentasi kegiatan akademik, ekstrakurikuler, karya siswa, dan capaian prestasi SMA Widya Darma Surabaya.',
    { w: 620, size: 16, color: 'white', opacity: 0.85, lh: 26 }
  );
  const exploreBtn = actionPill(heroBot, 'Jelajahi galeri', {
    fill: 'white',
    color: 'ink',
    icon: 'arrowDown'
  });

  const mosaicSec = box(s, 'Section / PublicationMosaic (#galeri)', {
    w: 1440,
    pad: [72, 80, 48, 80],
    gap: 32,
    alignCross: 'CENTER',
    fill: 'bg'
  });
  onClickScroll(exploreBtn, () => mosaicSec);

  const mHead = box(mosaicSec, 'Mosaic Header', {
    w: 760,
    gap: 10,
    alignCross: 'CENTER'
  });
  pillBadge(mHead, 'Publikasi & Galeri');
  txt(mHead, 'Momen belajar, berkarya, dan berprestasi', {
    w: 760,
    size: 40,
    weight: 'Bold',
    color: 'ink',
    align: 'CENTER',
    lh: 48,
    ls: -1,
    highlights: [{ word: 'berprestasi', color: 'primary' }]
  });

  const mosaicRow = row(mosaicSec, 'Mosaic 6-Column Grid', {
    w: 1280,
    gap: 16,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER'
  });
  const mosaicCols = [
    [
      ['img_01', 180],
      ['img_02', 220]
    ],
    [
      ['img_03', 230],
      ['img_05', 170]
    ],
    [
      ['img_09', 170],
      ['img_11', 230]
    ],
    [
      ['img_14', 220],
      ['img_31', 180]
    ],
    [
      ['img_32', 185],
      ['img_33', 215]
    ],
    [
      ['img_34', 215],
      ['img_35', 185]
    ]
  ];
  for (let c = 0; c < mosaicCols.length; c++) {
    const col = box(mosaicRow, 'Mosaic Col ' + (c + 1), {
      w: 200,
      gap: 16,
      pad: [c % 2 === 1 ? 24 : 0, 0, 0, 0]
    });
    for (const [mImg, mH] of mosaicCols[c]) {
      const mp = photoBox(col, 'Mosaic Photo', mImg, 200, mH, 20, null, {
        effects: shadowCard(0.06, 8, 20)
      });
      onClickNavigate(mp, 'article');
    }
  }

  const gridSec = box(s, 'Section / PublicationGrid (#kegiatan)', {
    w: 1440,
    pad: [48, 144, 96, 144],
    gap: 36,
    alignCross: 'CENTER',
    fill: 'bg'
  });

  const filterBar = row(gridSec, 'Category Filter Pills', {
    gap: 10,
    alignMain: 'CENTER',
    alignCross: 'CENTER'
  });
  for (const [idx, catName] of [
    'Semua',
    'Berita',
    'Jurnal',
    'Karya',
    'Prestasi',
    'Ekstrakurikuler'
  ].entries()) {
    const active = idx === 0;
    const pillNode = row(filterBar, 'Filter / ' + catName, {
      pad: [9, 20],
      radius: 999,
      fill: active ? 'primary' : 'white',
      stroke: active ? undefined : 'border'
    });
    txt(pillNode, catName, {
      size: 13,
      weight: 'SemiBold',
      color: active ? 'white' : 'muted',
      lh: 18
    });
  }

  const cardsGrid = box(gridSec, '6 Publication Cards (3x2)', {
    w: 1152,
    gap: 24
  });
  const r1 = row(cardsGrid, 'Row 1', { w: 1152, gap: 24, alignMain: 'SPACE_BETWEEN' });
  for (let i = 0; i < 3; i++) buildPubCard(r1, PUBLICATIONS[i]);
  const r2 = row(cardsGrid, 'Row 2', { w: 1152, gap: 24, alignMain: 'SPACE_BETWEEN' });
  for (let i = 3; i < 6; i++) buildPubCard(r2, PUBLICATIONS[i]);

  buildFooter(s);
}

// ===========================================================================
// SCREEN 06: 06 · Detail Kegiatan / Desktop
// ===========================================================================
{
  const s = createScreenFrame('article', '06 · Detail Kegiatan / Desktop');
  buildNavbar(s, 'publications', 'default');

  const artSec = box(s, 'Article Detail Container', {
    w: 1440,
    pad: [32, 230, 96, 230],
    gap: 36,
    alignCross: 'CENTER',
    fill: 'bg'
  });

  const artHead = box(artSec, 'Article Header', { w: 760, gap: 14 });
  const backLink = row(artHead, 'Back Link / Kembali ke galeri', {
    gap: 8,
    alignCross: 'CENTER'
  });
  iconBox(backLink, 'arrowLeft', 16, 'primary');
  txt(backLink, 'Kembali ke galeri', {
    size: 13,
    weight: 'SemiBold',
    color: 'primary',
    lh: 18
  });
  onClickNavigate(backLink, 'publications');

  pillBadge(artHead, 'BERITA SEKOLAH');
  txt(artHead, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', {
    w: 760,
    size: 42,
    weight: 'Bold',
    color: 'ink',
    lh: 50,
    ls: -1
  });
  txt(artHead, '1 Oktober 2026   ·   Ditulis oleh Tim Dokumentasi Sekolah (contoh)', {
    size: 13,
    weight: 'Medium',
    color: 'muted',
    lh: 20
  });

  const slider = photoBox(
    artSec,
    'ActivitySlider Photo',
    'img_01',
    980,
    520,
    28,
    gradLinear('black', 0, 'black', 0.5),
    { effects: shadowCard(0.1, 16, 36) }
  );
  const slideMeta = row(slider, 'Slider Controls Overlay', {
    x: 28,
    y: 456,
    w: 924,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER'
  });
  txt(slideMeta, 'Dokumentasi Kegiatan Siswa SMA Widya Darma Surabaya (Foto 1 / 3)', {
    size: 13,
    weight: 'Medium',
    color: 'white',
    lh: 18
  });
  pillBadge(slideMeta, '1 / 3 Foto', {
    fill: 'black',
    opacity: 0.45,
    stroke: 'white',
    strokeOpacity: 0.25,
    color: 'white'
  });

  const artBody = box(artSec, 'Article Body (680px)', { w: 680, gap: 22 });
  txt(
    artBody,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    { w: 680, size: 18, weight: 'Medium', color: 'ink', lh: 30 }
  );
  for (let i = 0; i < 3; i++) {
    txt(
      artBody,
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      { w: 680, size: 16, color: 'slate600', lh: 28 }
    );
  }

  const botRow = row(artBody, 'Bottom Article CTA', {
    w: 680,
    pad: [24, 0, 0, 0],
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER'
  });
  const moreActBtn = actionPill(botRow, 'Jelajahi kegiatan lainnya', {
    fill: 'blue50',
    stroke: 'blue200',
    color: 'primary',
    icon: 'arrowUpRight'
  });
  onClickNavigate(moreActBtn, 'publications');

  buildFooter(s);
}

// ===========================================================================
// SCREEN 07: 07 · Tanya AI / Desktop
// ===========================================================================
{
  const s = createScreenFrame('ai', '07 · Tanya AI / Desktop', 960);

  photoBox(
    s,
    'Tanya AI Grayscale Bg',
    'img_31_gray',
    1440,
    960,
    0,
    gradLinear('bg', 0.68, 'bg', 0.95),
    { abs: true, x: 0, y: 0 }
  );

  buildNavbar(s, 'ai', 'default');

  const stage = box(s, 'Tanya AI Empty State Stage', {
    w: 1440,
    h: 860,
    pad: [96, 340],
    gap: 24,
    alignMain: 'CENTER',
    alignCross: 'CENTER'
  });

  const orbAs = nextAs('orb');
  commands.push({
    command: 'node.create',
    as: orbAs,
    params: {
      type: 'ellipse',
      name: 'AI Orb (64x64)',
      parent: ref(stage),
      width: 64,
      height: 64,
      props: {
        fills: [gradLinear('sky400', 1, 'primary', 1)],
        effects: shadowCard(0.28, 10, 28)
      }
    }
  });

  txt(stage, 'SMA WIDYA DARMA', {
    size: 11,
    weight: 'Bold',
    color: 'primary',
    ls: 2.4,
    align: 'CENTER',
    lh: 16
  });
  txt(stage, 'Selamat datang.\nApa yang ingin kamu ketahui?', {
    w: 680,
    size: 38,
    weight: 'Bold',
    color: 'ink',
    align: 'CENTER',
    lh: 46,
    ls: -0.9
  });

  const composer = box(stage, 'Composer Card (Klik untuk kirim pesan)', {
    w: 760,
    pad: 20,
    gap: 28,
    radius: 24,
    fill: 'white',
    stroke: 'blue100',
    effects: shadowCard(0.1, 16, 36)
  });
  const compTop = row(composer, 'Input Row', {
    w: 720,
    gap: 12,
    alignCross: 'CENTER'
  });
  iconBox(compTop, 'sparkle', 18, 'primary');
  txt(compTop, 'Tanyakan apa saja seputar SMA Widya Darma...', {
    w: 670,
    size: 15,
    color: 'slate400',
    lh: 22
  });

  const compBot = row(composer, 'Bottom Toolbar', {
    w: 720,
    pad: [14, 0, 0, 0],
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER'
  });
  const infoBadge = row(compBot, 'Info Badge', {
    pad: [6, 12],
    gap: 6,
    radius: 999,
    alignCross: 'CENTER',
    fill: 'blue50'
  });
  iconBox(infoBadge, 'globe', 14, 'primary');
  txt(infoBadge, 'Informasi sekolah', {
    size: 12,
    weight: 'SemiBold',
    color: 'primary',
    lh: 16
  });

  const sendRight = row(compBot, 'Send Controls', {
    gap: 14,
    alignCross: 'CENTER'
  });
  txt(sendRight, 'Ctrl + Enter untuk kirim', {
    size: 12,
    color: 'slate400',
    lh: 16
  });
  const sendBtn = row(sendRight, 'Send Button', {
    w: 40,
    h: 40,
    radius: 999,
    alignMain: 'CENTER',
    alignCross: 'CENTER',
    fill: 'primary',
    effects: shadowCard(0.18, 4, 12)
  });
  iconBox(sendBtn, 'arrowUp', 18, 'white');

  const quickRow = row(stage, 'Quick Suggestion Pills', {
    gap: 12,
    alignMain: 'CENTER',
    alignCross: 'CENTER'
  });
  for (const q of [
    'Jadwal & syarat SPMB 2026/2027',
    'Profil & akreditasi SMA Widya Darma',
    'Daftar guru & tenaga pendidik'
  ]) {
    const qp = pillBadge(quickRow, q, {
      fill: 'white',
      stroke: 'border',
      color: 'muted',
      pad: [8, 16]
    });
    onClickNavigate(qp, 'aiActive');
  }

  onClickNavigate(composer, 'aiActive');
  onClickNavigate(sendBtn, 'aiActive');
}

// ===========================================================================
// SCREEN 08: 08 · Tanya AI (Percakapan Aktif) / Desktop
// ===========================================================================
{
  const s = createScreenFrame('aiActive', '08 · Tanya AI (Percakapan Aktif) / Desktop', 960);

  photoBox(
    s,
    'Tanya AI Active Grayscale Bg',
    'img_31_gray',
    1440,
    960,
    0,
    gradLinear('bg', 0.74, 'bg', 0.96),
    { abs: true, x: 0, y: 0 }
  );

  buildNavbar(s, 'ai', 'default');

  const chatStage = box(s, 'Active Chat Stage', {
    w: 820,
    h: 840,
    pad: [24, 0, 32, 0],
    gap: 22,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER'
  });

  const topBar = row(chatStage, 'Chat Header Bar', {
    w: 760,
    pad: [10, 16],
    radius: 16,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER',
    fill: 'white',
    stroke: 'borderSoft'
  });
  txt(topBar, 'Asisten AI SMA Widya Darma · Online', {
    size: 13,
    weight: 'SemiBold',
    color: 'ink',
    lh: 18
  });
  const resetBtn = actionPill(topBar, 'Percakapan baru', {
    fill: 'blue50',
    stroke: 'blue200',
    color: 'primary',
    pad: [6, 14],
    size: 12
  });
  onClickNavigate(resetBtn, 'ai');

  const msgList = box(chatStage, 'Messages Stream', {
    w: 760,
    gap: 20
  });

  const userRow = row(msgList, 'User Message Row', {
    w: 760,
    alignMain: 'MAX'
  });
  const userBubble = box(userRow, 'User Bubble', {
    w: 480,
    pad: [14, 20],
    radius: [20, 20, 4, 20],
    fill: 'primary',
    effects: shadowCard(0.1, 6, 16)
  });
  txt(
    userBubble,
    'Bagaimana informasi pendaftaran SPMB 2026/2027 dan profil SMA Widya Darma Surabaya?',
    { w: 440, size: 14, weight: 'Medium', color: 'white', lh: 22 }
  );

  const botCard = box(msgList, 'AI Assistant Response Card', {
    w: 680,
    pad: 24,
    gap: 14,
    radius: [20, 20, 20, 4],
    fill: 'white',
    stroke: 'borderSoft',
    effects: shadowCard(0.07, 10, 28)
  });
  const botHead = row(botCard, 'Bot Header', { gap: 10, alignCross: 'CENTER' });
  commands.push({
    command: 'node.create',
    params: {
      type: 'ellipse',
      name: 'Mini Orb',
      parent: ref(botHead),
      width: 24,
      height: 24,
      props: { fills: [gradLinear('sky400', 1, 'primary', 1)] }
    }
  });
  txt(botHead, 'Asisten AI SMA Widya Darma', {
    size: 13,
    weight: 'Bold',
    color: 'primary',
    lh: 18
  });

  txt(
    botCard,
    'Pendaftaran Peserta Didik Baru (SPMB) SMA Widya Darma Surabaya Tahun Ajaran 2026/2027 saat ini sedang dibuka untuk Gelombang 1 (Januari – Maret 2026) pada jalur Reguler & Prestasi.\n\nSMA Widya Darma berlokasi di Jl. Ketintang No. 147-151, Surabaya, terakreditasi A+ (Unggul), didukung oleh 20 guru berdedikasi serta lingkungan belajar modern.',
    { w: 632, size: 14, color: 'ink', lh: 24 }
  );

  const botLinks = row(botCard, 'Deep-Link Action Pills', {
    gap: 10,
    alignCross: 'CENTER'
  });
  const lSpmb = actionPill(botLinks, 'Buka Informasi SPMB', {
    fill: 'blue50',
    stroke: 'blue200',
    color: 'primary',
    icon: 'arrowRight',
    pad: [8, 16],
    size: 12
  });
  onClickNavigate(lSpmb, 'spmb');
  const lProf = actionPill(botLinks, 'Buka Profil Sekolah', {
    fill: 'blue50',
    stroke: 'blue200',
    color: 'primary',
    icon: 'arrowRight',
    pad: [8, 16],
    size: 12
  });
  onClickNavigate(lProf, 'profile');
  const lGuru = actionPill(botLinks, 'Lihat 20 Guru', {
    fill: 'blue50',
    stroke: 'blue200',
    color: 'primary',
    icon: 'arrowRight',
    pad: [8, 16],
    size: 12
  });
  onClickNavigate(lGuru, 'teachers');

  const botComp = row(chatStage, 'Bottom Composer Bar', {
    w: 760,
    pad: [14, 20],
    radius: 20,
    alignMain: 'SPACE_BETWEEN',
    alignCross: 'CENTER',
    fill: 'white',
    stroke: 'blue100',
    effects: shadowCard(0.08, 10, 24)
  });
  txt(botComp, 'Tulis pertanyaan lanjutan...', {
    size: 14,
    color: 'slate400',
    lh: 20
  });
  const bSend = row(botComp, 'Send', {
    w: 36,
    h: 36,
    radius: 999,
    alignMain: 'CENTER',
    alignCross: 'CENTER',
    fill: 'primary'
  });
  iconBox(bSend, 'arrowUp', 16, 'white');
}

// ===========================================================================
// WIRE PROTOTYPE INTERACTIONS & ANIMATIONS IN FIGCRAFT
// ===========================================================================
let protoCount = 0;

function addNavInteraction(sourceAs, destScreenAs) {
  if (!sourceAs || !destScreenAs) return;
  commands.push({
    command: 'proto.interaction.add',
    params: {
      id: ref(sourceAs),
      trigger: { type: 'onClick' },
      action: { type: 'navigate', dest: ref(destScreenAs) },
      transition: { type: 'smartAnimate' },
      durationMs: 360,
      easing: 'easeInOut'
    }
  });
  protoCount++;
}

for (const nav of navRegistry) {
  addNavInteraction(nav.brand, screens.home);
  for (const [k, pillAs] of Object.entries(nav.linkNodes)) {
    if (k !== nav.activeKey && screens[k]) {
      addNavInteraction(pillAs, screens[k]);
    } else if (k === 'profile' && nav.activeKey === 'profile') {
      addNavInteraction(pillAs, screens.teachers);
    }
  }
  if (nav.activeKey !== 'ai') {
    addNavInteraction(nav.aiBtn, screens.ai);
  }
}

for (const fLinks of footerRegistry) {
  for (const [k, txtAs] of Object.entries(fLinks)) {
    if (screens[k]) {
      addNavInteraction(txtAs, screens[k]);
    }
  }
}

for (const task of linkTasks) {
  if (task.kind === 'NAVIGATE') {
    const dest = screens[task.targetKey];
    if (dest) addNavInteraction(task.nodeAs, dest);
  } else if (task.kind === 'SCROLL_TO') {
    const destSec = task.targetNodeFn();
    if (destSec) {
      commands.push({
        command: 'proto.interaction.add',
        params: {
          id: ref(task.nodeAs),
          trigger: { type: 'onClick' },
          action: { type: 'scrollTo', dest: ref(destSec) },
          transition: { type: 'smartAnimate' },
          durationMs: 500,
          easing: 'easeInOut'
        }
      });
      protoCount++;
    }
  }
}

// Add Prototype Flows
commands.push({
  command: 'proto.flow.add',
  params: {
    start: ref(screens.home),
    name: 'Website SMA Widya Darma (Desktop 1440px)'
  }
});
commands.push({
  command: 'proto.flow.add',
  params: {
    start: ref(screens.spmb),
    name: 'Flow SPMB & Tiket Pendaftaran'
  }
});
commands.push({
  command: 'proto.flow.add',
  params: {
    start: ref(screens.ai),
    name: 'Flow Tanya AI Interaktif'
  }
});

// Execute batch in FigCraft CLI
const scriptJsonPath = `${WORK_DIR}/sma-widya-darma-figcraft-batch.json`;
const outFigcraftPath = `${ROOT}/SMA-Widya-Darma.figcraft`;
const outFigPath = `${ROOT}/SMA-Widya-Darma.fig`;
const outPngPath = `${ROOT}/frontend/preview/figcraft-sma-widya-darma-overview.png`;

const fullScript = [
  // Load Plus Jakarta Sans font from frontend/public/fonts if available
  ...(fs.existsSync(`${ROOT}/frontend/public/fonts/PlusJakartaSans.ttf`)
    ? [
        {
          command: 'text.loadFont',
          params: { path: `${ROOT}/frontend/public/fonts/PlusJakartaSans.ttf` }
        }
      ]
    : []),
  {
    command: 'command.batch',
    params: {
      label: 'Build SMA Widya Darma 1:1 Desktop + Prototype',
      commands
    }
  }
];

fs.writeFileSync(scriptJsonPath, JSON.stringify(fullScript));
console.log(`Generated ${commands.length} FigCraft commands (${protoCount} prototype interactions)...`);

execFileSync(
  'D:/Programs/FigCraft/figcraft-cli.exe',
  [
    'run',
    '--automation-read-root',
    ROOT,
    '--automation-write-root',
    ROOT,
    '--out',
    outFigcraftPath,
    scriptJsonPath
  ],
  { encoding: 'utf8', stdio: 'inherit' }
);

// Also export overview PNG and .fig file!
execFileSync(
  'D:/Programs/FigCraft/figcraft-cli.exe',
  ['render', outFigcraftPath, outPngPath],
  { encoding: 'utf8', stdio: 'inherit' }
);

try {
  execFileSync(
    'D:/Programs/FigCraft/figcraft-cli.exe',
    ['convert', outFigcraftPath, outFigPath],
    { encoding: 'utf8', stdio: 'inherit' }
  );
} catch (e) {
  console.log('Note on .fig convert:', e.message);
}

console.log('Done! Built:', {
  figcraft: outFigcraftPath,
  fig: outFigPath,
  preview: outPngPath,
  totalCommands: commands.length,
  protoInteractions: protoCount
});
