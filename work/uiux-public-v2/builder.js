/* 1:1 Desktop Figma Builder + Interactive Prototype for SMA Widya Darma */
(async () => {
  try {
    // 1. Resolve target page & node 148:371
    let targetNode = await figma.getNodeByIdAsync('148:371');
    let page = figma.currentPage;
    let startX = 0;
    let startY = 0;
    let reuseFirstFrame = null;

    if (targetNode) {
      if (targetNode.type === 'PAGE') {
        page = targetNode;
        await figma.setCurrentPageAsync(page);
      } else {
        let p = targetNode.parent;
        while (p && p.type !== 'PAGE') p = p.parent;
        if (p && p.type === 'PAGE') {
          page = p;
          await figma.setCurrentPageAsync(page);
        }
        if ('x' in targetNode && 'y' in targetNode) {
          startX = Math.round(targetNode.x);
          startY = Math.round(targetNode.y);
        }
        if (targetNode.type === 'FRAME' && targetNode.parent === page) {
          reuseFirstFrame = targetNode;
        }
      }
    }

    // Load Plus Jakarta Sans fonts
    await Promise.all(
      ['Regular', 'Medium', 'SemiBold', 'Bold'].map(style =>
        figma.loadFontAsync({ family: 'Plus Jakarta Sans', style })
      )
    );

    // Decode embedded base64 images using Figma's fast native C++ base64Decode
    const IMG = {};
    for (const key of Object.keys(ASSETS)) {
      IMG[key] = figma.createImage(figma.base64Decode(ASSETS[key])).hash;
    }

    // Remove any old Mobile frames and old versions of our Desktop frames on this page
    const screenNames = [
      '01 · Beranda / Desktop',
      '02 · Profil Sekolah / Desktop',
      '03 · Profil Guru / Desktop',
      '04 · Informasi SPMB / Desktop',
      '05 · Galeri Kegiatan / Desktop',
      '06 · Detail Kegiatan / Desktop',
      '07 · Tanya AI / Desktop',
      '08 · Tanya AI (Percakapan Aktif) / Desktop',
      '03 · Guru dan Staf / Desktop',
      '08 · Kontak Sekolah / Desktop'
    ];
    for (const child of [...page.children]) {
      if (child === reuseFirstFrame) continue;
      if (
        child.type === 'FRAME' &&
        (child.name.endsWith('/ Mobile') ||
          child.name.endsWith('/ Desktop') ||
          screenNames.includes(child.name))
      ) {
        child.remove();
      }
    }

    // Color & Paint Helpers (matching globals.css 1:1)
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

    function rgb(hex) {
      const h = (HEX[hex] || hex).replace('#', '');
      return {
        r: parseInt(h.slice(0, 2), 16) / 255,
        g: parseInt(h.slice(2, 4), 16) / 255,
        b: parseInt(h.slice(4, 6), 16) / 255
      };
    }

    function solid(colorKey, opacity = 1) {
      return { type: 'SOLID', color: rgb(colorKey), opacity };
    }

    function gradLinear(c1, o1, c2, o2, dir = 'VERTICAL') {
      const transform =
        dir === 'VERTICAL'
          ? [
              [0, 1, 0],
              [-1, 0, 1]
            ]
          : [
              [1, 0, 0],
              [0, 1, 0]
            ];
      return {
        type: 'GRADIENT_LINEAR',
        gradientTransform: transform,
        gradientStops: [
          { position: 0, color: { ...rgb(c1), a: o1 } },
          { position: 1, color: { ...rgb(c2), a: o2 } }
        ]
      };
    }

    function imgFill(assetKey, opacity = 1, scaleMode = 'FILL') {
      return {
        type: 'IMAGE',
        imageHash: IMG[assetKey] || IMG.img_01,
        scaleMode,
        opacity
      };
    }

    function shadowCard(alpha = 0.07, y = 12, blur = 32) {
      return [
        {
          type: 'DROP_SHADOW',
          color: { r: 0.03, g: 0.16, b: 0.3, a: alpha },
          offset: { x: 0, y },
          radius: blur,
          spread: 0,
          visible: true,
          blendMode: 'NORMAL'
        }
      ];
    }

    function corner(node, r) {
      if (Array.isArray(r)) {
        node.topLeftRadius = r[0];
        node.topRightRadius = r[1];
        node.bottomRightRadius = r[2];
        node.bottomLeftRadius = r[3];
      } else if (typeof r === 'number') {
        node.cornerRadius = r;
      }
    }

    function pad(node, p) {
      if (typeof p === 'number') {
        node.paddingTop = node.paddingRight = node.paddingBottom = node.paddingLeft = p;
      } else if (Array.isArray(p)) {
        if (p.length === 2) {
          node.paddingTop = node.paddingBottom = p[0];
          node.paddingLeft = node.paddingRight = p[1];
        } else if (p.length === 4) {
          node.paddingTop = p[0];
          node.paddingRight = p[1];
          node.paddingBottom = p[2];
          node.paddingLeft = p[3];
        }
      }
    }

    function box(parent, name, opts = {}) {
      const f = figma.createFrame();
      f.name = name;
      f.clipsContent = Boolean(opts.clip);
      f.fills = opts.fills !== undefined ? opts.fills : opts.fill ? [solid(opts.fill, opts.opacity ?? 1)] : [];
      if (opts.stroke) {
        f.strokes = [solid(opts.stroke, opts.strokeOpacity ?? 1)];
        f.strokeWeight = opts.strokeWeight || 1;
        if (opts.dash) f.dashPattern = opts.dash;
      }
      if (opts.radius !== undefined) corner(f, opts.radius);
      if (opts.effects) f.effects = opts.effects;

      const mode = opts.layout || 'VERTICAL';
      if (mode !== 'NONE') {
        f.layoutMode = mode;
        f.itemSpacing = opts.gap ?? 0;
        f.primaryAxisAlignItems = opts.alignMain || 'MIN';
        f.counterAxisAlignItems = opts.alignCross || 'MIN';
        if (opts.pad !== undefined) pad(f, opts.pad);
        if (opts.w && opts.h) {
          f.resize(opts.w, opts.h);
          f.primaryAxisSizingMode = 'FIXED';
          f.counterAxisSizingMode = 'FIXED';
        } else if (opts.w) {
          f.resize(opts.w, 100);
          f.primaryAxisSizingMode = mode === 'HORIZONTAL' ? 'FIXED' : 'AUTO';
          f.counterAxisSizingMode = mode === 'HORIZONTAL' ? 'AUTO' : 'FIXED';
        } else if (opts.h) {
          f.resize(100, opts.h);
          f.primaryAxisSizingMode = mode === 'VERTICAL' ? 'FIXED' : 'AUTO';
          f.counterAxisSizingMode = mode === 'VERTICAL' ? 'AUTO' : 'FIXED';
        } else {
          f.primaryAxisSizingMode = 'AUTO';
          f.counterAxisSizingMode = 'AUTO';
        }
      } else {
        f.resize(opts.w || 100, opts.h || 100);
      }

      if (parent) {
        parent.appendChild(f);
        if (opts.abs) {
          f.layoutPositioning = 'ABSOLUTE';
          if (opts.x !== undefined) f.x = opts.x;
          if (opts.y !== undefined) f.y = opts.y;
        }
      }
      return f;
    }

    function row(parent, name, opts = {}) {
      return box(parent, name, { ...opts, layout: 'HORIZONTAL' });
    }

    function photoBox(parent, name, assetKey, w, h, radius = 24, extraFills = []) {
      const f = box(parent, name, {
        layout: 'NONE',
        w,
        h,
        radius,
        clip: true,
        fills: [imgFill(assetKey), ...extraFills]
      });
      return f;
    }

    function txt(parent, value, opts = {}) {
      const t = figma.createText();
      const style = opts.weight || 'Regular';
      const size = opts.size || 14;
      t.name = opts.name || String(value).slice(0, 36);
      t.fontName = { family: 'Plus Jakarta Sans', style };
      t.fontSize = size;
      t.lineHeight = {
        unit: 'PIXELS',
        value: opts.lh || Math.round(size * (size >= 36 ? 1.18 : 1.55))
      };
      if (opts.ls) t.letterSpacing = { unit: 'PIXELS', value: opts.ls };
      t.textAlignHorizontal = opts.align || 'LEFT';
      t.characters = String(value);
      t.fills = [solid(opts.color || 'ink', opts.opacity ?? 1)];

      if (opts.highlights && Array.isArray(opts.highlights)) {
        for (const hl of opts.highlights) {
          const i = t.characters.indexOf(hl.word);
          if (i >= 0) {
            t.setRangeFills(i, i + hl.word.length, [solid(hl.color || 'primary', hl.opacity ?? 1)]);
          }
        }
      }

      parent.appendChild(t);
      if (opts.abs) {
        t.layoutPositioning = 'ABSOLUTE';
        if (opts.x !== undefined) t.x = opts.x;
        if (opts.y !== undefined) t.y = opts.y;
      }
      if (opts.w) {
        t.resize(opts.w, Math.max(20, t.height));
        t.textAutoResize = 'HEIGHT';
      } else {
        t.textAutoResize = 'WIDTH_AND_HEIGHT';
      }
      return t;
    }

    function svgIcon(parent, kind, size = 18, hexColor = '#07528c') {
      const c = HEX[hexColor] || hexColor;
      const paths = {
        ticket: `<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>`,
        sparkle: `<path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/>`,
        chevronDown: `<path d="m6 9 6 6 6-6"/>`,
        arrowRight: `<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`,
        arrowUpRight: `<path d="M7 17 17 7"/><path d="M7 7h10v10"/>`,
        arrowDown: `<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>`,
        arrowLeft: `<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>`,
        arrowUp: `<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>`,
        check: `<path d="M20 6 9 17l-5-5"/>`,
        pin: `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`,
        mail: `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`,
        phone: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/>`,
        globe: `<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>`,
        download: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>`
      };
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[kind] || paths.arrowRight}</svg>`;
      const node = figma.createNodeFromSvg(svg);
      node.name = 'Icon / ' + kind;
      parent.appendChild(node);
      return node;
    }

    function pillBadge(parent, label, opts = {}) {
      const p = row(parent, 'Badge / ' + label, {
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
        const dot = figma.createEllipse();
        dot.name = 'Dot';
        dot.resize(7, 7);
        dot.fills = [solid(opts.dotColor)];
        p.appendChild(dot);
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

    function actionPill(parent, label, opts = {}) {
      const btn = row(parent, 'Button / ' + label, {
        pad: opts.pad || [11, 22],
        gap: 8,
        radius: 999,
        alignMain: 'CENTER',
        alignCross: 'CENTER',
        fill: opts.fill || 'primary',
        opacity: opts.opacity ?? 1,
        stroke: opts.stroke,
        strokeOpacity: opts.strokeOpacity ?? 1,
        effects: opts.shadow ? shadowCard(0.12, 8, 20) : undefined
      });
      txt(btn, label, {
        size: opts.size || 13,
        weight: 'SemiBold',
        color: opts.color || 'white',
        lh: 18
      });
      if (opts.icon) {
        svgIcon(btn, opts.icon, 15, opts.color || 'white');
      }
      return btn;
    }

    // Track all interactive elements to wire prototype reactions after frames exist
    const navRegistry = [];
    const footerRegistry = [];
    const linkTasks = [];
    function onClickNavigate(node, targetKey, transitionType = 'SMART_ANIMATE') {
      if (!node) return;
      linkTasks.push({ node, kind: 'NAVIGATE', targetKey, transitionType });
    }
    function onClickScroll(node, targetNodeFn) {
      if (!node) return;
      linkTasks.push({ node, kind: 'SCROLL_TO', targetNodeFn });
    }

    // ---------------------------------------------------------------------------
    // SHARED NAVBAR (Exact match to src/components/layout/Navbar.tsx)
    // ---------------------------------------------------------------------------
    function buildNavbar(parent, activeKey, mode = 'default') {
      const isHero = mode === 'hero';
      const wrap = box(parent, 'Navbar', {
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
        fills: isHero ? [] : [solid('bg', 0.92)]
      });

      // Brand
      const brand = row(bar, 'Brand / SMA Widya Darma', {
        gap: 8,
        alignCross: 'CENTER',
        pad: [4, 4]
      });
      svgIcon(brand, 'ticket', 20, isHero ? 'white' : 'ink');
      txt(brand, 'SMA Widya Darma', {
        size: 13,
        weight: 'Bold',
        color: isHero ? 'white' : 'ink',
        lh: 18
      });

      // Center Links (Beranda, Profil ▾, Guru, SPMB, Galeri Kegiatan)
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
          fills: isActive ? [solid('pillActive')] : []
        });
        txt(pill, item.label, {
          size: 12,
          weight: isActive ? 'SemiBold' : 'Medium',
          color: isActive ? 'primary' : isHero ? 'white' : 'muted',
          opacity: isActive ? 1 : isHero ? 0.88 : 1,
          lh: 18
        });
        if (item.chevron) {
          svgIcon(pill, 'chevronDown', 13, isActive ? 'primary' : isHero ? 'white' : 'muted');
        }
        linkNodes[item.key] = pill;
      }

      // Right CTA: Tanya AI
      const aiBtn = row(bar, 'Nav / Tanya AI Button', {
        pad: [10, 20],
        gap: 8,
        radius: 999,
        alignCross: 'CENTER',
        fills: isHero ? [solid('white', 0.2)] : [solid('primary')],
        stroke: isHero ? 'white' : undefined,
        strokeOpacity: isHero ? 0.45 : 1,
        effects: isHero ? undefined : shadowCard(0.16, 6, 16)
      });
      svgIcon(aiBtn, 'sparkle', 16, 'white');
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
    // SHARED FOOTER (Exact match to src/components/layout/Footer.tsx)
    // ---------------------------------------------------------------------------
    function buildFooter(parent) {
      const foot = box(parent, 'Footer', {
        w: 1440,
        pad: [64, 80, 40, 80],
        gap: 44,
        alignCross: 'CENTER',
        fills: [gradLinear('navyTop', 1, 'navyBot', 1, 'VERTICAL')],
        stroke: 'white',
        strokeOpacity: 0.1
      });

      const grid = row(foot, 'Footer / 4-Column Grid', {
        w: 1280,
        gap: 48,
        alignMain: 'SPACE_BETWEEN',
        alignCross: 'MIN'
      });

      // Col 1: Brand & Description (360px)
      const col1 = box(grid, 'Footer / Col 1 Brand', { w: 360, gap: 16 });
      const brandRow = row(col1, 'Brand Row', { gap: 12, alignCross: 'CENTER' });
      const iconBox = row(brandRow, 'Icon Box', {
        w: 36,
        h: 36,
        radius: 10,
        alignMain: 'CENTER',
        alignCross: 'CENTER',
        fills: [solid('white', 0.1)],
        stroke: 'white',
        strokeOpacity: 0.18
      });
      svgIcon(iconBox, 'ticket', 18, 'sky300');
      txt(brandRow, 'SMA Widya Darma', { size: 16, weight: 'Bold', color: 'white', lh: 22 });
      txt(
        col1,
        'Mewujudkan generasi berkarakter unggul, berwawasan luas, dan siap menghadapi tantangan masa depan melalui pendidikan berkualitas.',
        { w: 340, size: 13, color: 'white', opacity: 0.72, lh: 22 }
      );

      // Col 2: Navigasi (180px)
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
        const l = txt(navList, label, { size: 13, color: 'white', opacity: 0.75, lh: 20 });
        fLinks[key] = l;
      }

      // Col 3: Kontak Sekolah (300px)
      const col3 = box(grid, 'Footer / Col 3 Kontak Sekolah', { w: 300, gap: 14 });
      txt(col3, 'KONTAK SEKOLAH', { size: 11, weight: 'Bold', color: 'sky300', ls: 1.8, lh: 16 });
      for (const [ic, title, val] of [
        ['pin', 'Alamat', 'Jl. Ketintang No. 147-151, Surabaya'],
        ['mail', 'Email', 'smawdsby@gmail.com'],
        ['phone', 'WhatsApp', '085921095353']
      ]) {
        const item = row(col3, 'Kontak / ' + title, { gap: 12, alignCross: 'MIN' });
        svgIcon(item, ic, 16, 'sky300');
        const info = box(item, 'Text', { gap: 2 });
        txt(info, title, { size: 12, weight: 'SemiBold', color: 'white', opacity: 0.9, lh: 16 });
        txt(info, val, { w: 250, size: 13, color: 'white', opacity: 0.7, lh: 19 });
      }

      // Col 4: Pusat Layanan & Media Sosial (296px)
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

      // Bottom Copyright Bar
      const div = box(foot, 'Divider', { w: 1280, h: 1, fills: [solid('white', 0.12)] });
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
    function buildSchoolIntro(parent, isProfile = false) {
      const sec = box(parent, 'Section / Sekilas Sekolah', {
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
        // Beranda version: Left 640px text+stats, Right 456px Kampus Utama photo card
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

        // Right: Kampus Utama Photo Card
        const right = photoBox(topRow, 'Kampus Utama Card', 'img_14', 456, 480, 32, [
          gradLinear('black', 0.05, 'black', 0.65, 'VERTICAL')
        ]);
        right.effects = shadowCard(0.1, 16, 36);
        const topBadge = pillBadge(right, 'KAMPUS UTAMA', {
          fill: 'black',
          opacity: 0.45,
          stroke: 'white',
          strokeOpacity: 0.25,
          color: 'white',
          dotColor: 'sky300',
          size: 11
        });
        topBadge.layoutPositioning = 'ABSOLUTE';
        topBadge.x = 24;
        topBadge.y = 24;

        const glassCard = box(right, 'Suasana Belajar Glass Card', {
          abs: true,
          x: 24,
          y: 352,
          w: 408,
          pad: [18, 20],
          gap: 6,
          radius: 20,
          fills: [solid('white', 0.16)],
          stroke: 'white',
          strokeOpacity: 0.28
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
        // Profile version (profile=true): Left heading + stats, Right 3 paragraphs
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

      // Bottom 3 Pillars Row
      const divider = box(sec, 'Pillars Divider', { w: 1152, h: 1, fill: 'border' });
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
    // SHARED SECTION: StaffSection (src/components/sections/StaffSection.tsx)
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

    function buildStaffSection(parent, showPrincipal = true) {
      const sec = box(parent, 'Section / Profil Guru', {
        w: 1440,
        pad: [88, 144],
        gap: 56,
        alignCross: 'CENTER',
        fill: 'bg'
      });

      // Header
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

      // Sambutan Kepala Sekolah (Leaf-shaped photo + quote)
      if (showPrincipal) {
        const principalRow = row(sec, 'Sambutan Kepala Sekolah', {
          w: 1080,
          gap: 56,
          alignMain: 'CENTER',
          alignCross: 'CENTER'
        });

        const leafPhoto = photoBox(
          principalRow,
          'Principal Leaf Photo',
          'img_02',
          340,
          400,
          [50, 0, 50, 0]
        );
        leafPhoto.strokes = [solid('white')];
        leafPhoto.strokeWeight = 4;
        leafPhoto.effects = shadowCard(0.1, 16, 36);

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

      // StaffMarquee Row (6 StaffCards matching StaffCard.tsx leaf + pedestal design)
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
        const avatar = photoBox(sc, 'Portrait Leaf', 'staff', 155, 180, [24, 0, 24, 0]);
        avatar.strokes = [solid('white')];
        avatar.strokeWeight = 3;
        avatar.effects = shadowCard(0.06, 8, 20);

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

      // Button: Lihat semua guru
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

    // ---------------------------------------------------------------------------
    // SHARED CARD: PublicationCard (PublicationPreview & PublicationGrid)
    // ---------------------------------------------------------------------------
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

    function buildPubCard(parent, item) {
      const card = box(parent, 'PublicationCard / ' + item.title, {
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
      svgIcon(more, 'arrowRight', 14, 'primary');
      onClickNavigate(card, 'article');
      return card;
    }

    // ---------------------------------------------------------------------------
    // CREATE TOP-LEVEL DESKTOP SCREEN FRAME (1440px ONLY)
    // ---------------------------------------------------------------------------
    const screens = {};
    let screenIndex = 0;

    function createScreenFrame(key, title) {
      const col = screenIndex % 4;
      const r = Math.floor(screenIndex / 4);
      const x = startX + col * 1640;
      const y = startY + r * 4400;
      screenIndex++;

      let f;
      if (key === 'home' && reuseFirstFrame) {
        f = reuseFirstFrame;
        for (const c of [...f.children]) c.remove();
      } else {
        f = figma.createFrame();
        page.appendChild(f);
      }

      f.name = title;
      f.x = x;
      f.y = y;
      f.clipsContent = true;
      f.fills = [solid('bg')];
      f.layoutMode = 'VERTICAL';
      f.itemSpacing = 0;
      f.primaryAxisAlignItems = 'MIN';
      f.counterAxisAlignItems = 'CENTER';
      f.resize(1440, 1000);
      f.primaryAxisSizingMode = 'AUTO';
      f.counterAxisSizingMode = 'FIXED';

      screens[key] = f;
      return f;
    }

    // ===========================================================================
    // SCREEN 01: 01 · Beranda / Desktop (page.tsx)
    // ===========================================================================
    {
      const s = createScreenFrame('home', '01 · Beranda / Desktop');

      // Hero + Showcase Section with grayscale campus background & radial blue glow
      const heroWrap = box(s, 'Hero + Showcase Section', {
        w: 1440,
        gap: 32,
        pad: [0, 0, 72, 0],
        alignCross: 'CENTER',
        clip: true,
        fills: [
          solid('bg'),
          imgFill('img_14_gray', 0.34),
          gradLinear('bg', 0.55, 'bg', 0.96, 'VERTICAL')
        ]
      });

      buildNavbar(heroWrap, 'home', 'default');

      // Hero Headline + Inline Pill Badge ("consectetur.")
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
        fills: [solid('primary', 0.1)],
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

      // Showcase 3 Cards Stage (ShowcaseSection.tsx)
      const showcaseRow = row(heroWrap, 'Showcase 3-Card Stage', {
        w: 1200,
        pad: [16, 0, 0, 0],
        gap: 28,
        alignMain: 'CENTER',
        alignCross: 'CENTER'
      });

      const showcaseData = [
        {
          img: 'img_03',
          cat: 'PROFIL SEKOLAH',
          title: 'Lorem ipsum dolor',
          target: 'profile',
          topPad: 24
        },
        {
          img: 'img_01',
          cat: 'INFORMASI SPMB',
          title: 'Lorem ipsum dolor',
          target: 'spmb',
          topPad: 0
        },
        {
          img: 'img_31',
          cat: 'PUBLIKASI & GALERI',
          title: 'Lorem ipsum dolor',
          target: 'publications',
          topPad: 24
        }
      ];

      for (const item of showcaseData) {
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
        const media = photoBox(card, 'Photo', item.img, 352, 320, 20, [
          gradLinear('black', 0.02, 'black', 0.62, 'VERTICAL')
        ]);
        const bottomBar = row(media, 'Caption Overlay', {
          abs: true,
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
          fills: [solid('black', 0.42)],
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
        svgIcon(circleBtn, 'arrowUpRight', 18, 'ink');
        onClickNavigate(card, item.target);
      }

      // Section 2: SchoolIntro
      buildSchoolIntro(s, false);

      // Section 3: StaffSection
      buildStaffSection(s, true);

      // Section 4: PublicationPreview
      const pubSec = box(s, 'Section / PublicationPreview', {
        w: 1440,
        pad: [88, 144],
        gap: 44,
        alignCross: 'CENTER',
        fill: 'blue50',
        opacity: 0.55
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

      // Footer
      buildFooter(s);
    }

    // ===========================================================================
    // SCREEN 02: 02 · Profil Sekolah / Desktop (profil/page.tsx)
    // ===========================================================================
    {
      const s = createScreenFrame('profile', '02 · Profil Sekolah / Desktop');

      // Full-bleed Photo Hero (img_01) with Hero Navbar & bottom white fade
      const hero = box(s, 'Profile Hero (Full-Bleed)', {
        w: 1440,
        h: 640,
        alignMain: 'SPACE_BETWEEN',
        alignCross: 'CENTER',
        clip: true,
        fills: [
          imgFill('img_01'),
          gradLinear('black', 0.45, 'black', 0.55, 'VERTICAL')
        ]
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
        fills: [gradLinear('bg', 0, 'bg', 1, 'VERTICAL')]
      });
      const subSwitch = row(bottomFade, 'Profile Sub-Switcher', {
        pad: 6,
        gap: 6,
        radius: 999,
        fill: 'white',
        stroke: 'border',
        effects: shadowCard(0.08, 6, 18)
      });
      const tab1 = actionPill(subSwitch, 'Profil Sekolah', {
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

      // Editorial Intro Paragraphs
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

      // SchoolIntro (profile=true)
      buildSchoolIntro(s, true);

      // Visi & Misi Section (#visi-misi)
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

      // Row 1: 3 Staggered Vertical Pill Photos + Visi Sekolah
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
        const p = photoBox(slot, 'Pill Photo', imgKey, 156, 330, 32);
        p.strokes = [solid('white')];
        p.strokeWeight = 4;
        p.effects = shadowCard(0.08, 10, 24);
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
        pad: [8, 0, 8, 20],
        gap: 16,
        stroke: 'primary'
      });
      txt(
        quoteBox,
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."',
        { w: 500, size: 16, weight: 'Medium', color: 'ink', lh: 26 }
      );
      txt(
        visiText,
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
        { w: 540, size: 15, color: 'muted', lh: 25 }
      );

      // Row 2: Misi Sekolah + 3 Staggered Vertical Pill Photos
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
        const p = photoBox(slot, 'Pill Photo', imgKey, 156, 330, 32);
        p.strokes = [solid('white')];
        p.strokeWeight = 4;
        p.effects = shadowCard(0.08, 10, 24);
      }

      // StaffSection Preview + Footer
      buildStaffSection(s, true);
      buildFooter(s);
    }

    // ===========================================================================
    // SCREEN 03: 03 · Profil Guru / Desktop (guru/page.tsx)
    // ===========================================================================
    {
      const s = createScreenFrame('teachers', '03 · Profil Guru / Desktop');

      // Full-bleed Dark Hero (img_50)
      const hero = box(s, 'Guru Hero (Full-Bleed)', {
        w: 1440,
        h: 560,
        gap: 36,
        alignCross: 'CENTER',
        clip: true,
        fills: [
          imgFill('img_50'),
          gradLinear('navyBot', 0.68, 'navyBot', 0.86, 'VERTICAL')
        ]
      });
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

      // Directory Section: All 20 Teachers in 3-Column Grid (StaffDirectoryCard)
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
        alignCross: 'CENTER',
        stroke: 'border'
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
            gap: 4,
            stroke: 'borderSoft'
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
    // SCREEN 04: 04 · Informasi SPMB / Desktop (spmb/page.tsx)
    // ===========================================================================
    {
      const s = createScreenFrame('spmb', '04 · Informasi SPMB / Desktop');

      // Hero + Admission Pass Ticket
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

      // Line 1 with inline rounded pill photo ("Tiket menuju [photo] masa")
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
      const inlinePillPhoto = photoBox(hLine1, 'Inline Pill Photo', 'img_32', 112, 48, 999);
      inlinePillPhoto.strokes = [solid('white')];
      inlinePillPhoto.strokeWeight = 3;
      inlinePillPhoto.effects = shadowCard(0.12, 6, 16);
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

      // ADMISSION PASS BOARDING TICKET CARD (1152 x 430)
      const ticketCard = row(hero, 'Admission Pass Ticket Card', {
        w: 1152,
        h: 430,
        radius: 32,
        clip: true,
        fill: 'white',
        stroke: 'borderSoft',
        effects: shadowCard(0.1, 20, 44)
      });

      // Left Photo Panel (756 x 430)
      const ticketLeft = photoBox(
        ticketCard,
        'Ticket Left Photo Panel',
        'img_33',
        756,
        430,
        0,
        [gradLinear('black', 0.1, 'black', 0.72, 'VERTICAL')]
      );
      const tTopRow = row(ticketLeft, 'Ticket Top Pills', {
        abs: true,
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
        abs: true,
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

      // Center Perforated Divider (36 x 430)
      const perf = box(ticketCard, 'Perforated Divider', {
        layout: 'NONE',
        w: 36,
        h: 430,
        fill: 'white'
      });
      const notchTop = figma.createEllipse();
      notchTop.resize(28, 28);
      notchTop.x = 4;
      notchTop.y = -14;
      notchTop.fills = [solid('bg')];
      perf.appendChild(notchTop);
      const notchBot = figma.createEllipse();
      notchBot.resize(28, 28);
      notchBot.x = 4;
      notchBot.y = 416;
      notchBot.fills = [solid('bg')];
      perf.appendChild(notchBot);
      const dashLine = box(perf, 'Dashed Line', {
        abs: true,
        x: 17,
        y: 24,
        w: 2,
        h: 382,
        stroke: 'border',
        dash: [6, 6]
      });

      // Right Ticket Stub (360 x 430)
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

      // 2x2 Pass Meta Grid
      const metaGrid = box(stub, 'Pass Details 2x2', {
        w: 304,
        pad: [14, 0],
        gap: 12,
        stroke: 'border',
        dash: [4, 4]
      });
      const mg1 = row(metaGrid, 'Row 1', { w: 304, alignMain: 'SPACE_BETWEEN' });
      for (const [k, v] of [
        ['JENJANG', 'SMA (Kelas X)'],
        ['AKREDITASI', 'A+ (Unggul)']
      ]) {
        const cell = box(mg1, k, { w: 140, gap: 2 });
        txt(cell, k, { size: 10, weight: 'Bold', color: 'slate400', ls: 1.2, lh: 14 });
        txt(cell, v, { size: 13, weight: 'Bold', color: 'ink', lh: 18 });
      }
      const mg2 = row(metaGrid, 'Row 2', { w: 304, alignMain: 'SPACE_BETWEEN' });
      for (const [k, v] of [
        ['KUOTA', 'Terbatas'],
        ['JALUR', 'Reguler & Prestasi']
      ]) {
        const cell = box(mg2, k, { w: 140, gap: 2 });
        txt(cell, k, { size: 10, weight: 'Bold', color: 'slate400', ls: 1.2, lh: 14 });
        txt(cell, v, { size: 13, weight: 'Bold', color: 'ink', lh: 18 });
      }

      // Barcode + Serial
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
      const widths = [3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4, 2, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2];
      for (const bw of widths) {
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
        fill: 'primary',
        color: 'white',
        icon: 'arrowDown',
        pad: [12, 24],
        shadow: true
      });
      scrollJadwalBtn.resize(304, 42);
      scrollJadwalBtn.primaryAxisSizingMode = 'FIXED';

      // Section 01: Jadwal & Persyaratan (#jadwal-syarat)
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

      // Card 1: Jadwal Penerimaan
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

      // Card 2: Persyaratan Calon Siswa
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

      // Card 3: Dokumen Pendaftaran
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
      const docs = [
        'Fotokopi Ijazah / SKL SMP/MTs dilegalisir',
        'Fotokopi Kartu Keluarga (KK) & Akta Kelahiran',
        'Pas foto berwarna ukuran 3×4 (4 lembar)',
        'Fotokopi Rapor semester 1–5',
        'Surat Keterangan Kelakuan Baik dari sekolah asal'
      ];
      for (const d of docs) {
        const dr = row(cDok, d, { w: 312, gap: 10, alignCross: 'CENTER' });
        const cb = row(dr, 'Check', {
          w: 22,
          h: 22,
          radius: 999,
          alignMain: 'CENTER',
          alignCross: 'CENTER',
          fill: 'emerald50'
        });
        svgIcon(cb, 'check', 13, 'emerald500');
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
      svgIcon(dlBtn, 'download', 15, 'primary');
      txt(dlBtn, 'Unduh Formulir Pendaftaran', {
        size: 12,
        weight: 'SemiBold',
        color: 'primary',
        lh: 18
      });

      // Section 02: Alur Pendaftaran (#alur-pendaftaran)
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
          svgIcon(ib, 'ticket', 18, 'primary');
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

      // Section 03: Biaya Pendidikan (#biaya-pendidikan)
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
          pad: [8, 0],
          alignMain: 'SPACE_BETWEEN',
          alignCross: 'CENTER',
          stroke: 'borderSoft'
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
        fills: [gradLinear('primary', 1, 'primaryDark', 1, 'HORIZONTAL')]
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

      // Section 05: CTA Banner
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
        fills: [gradLinear('primary', 1, 'primaryDark', 1, 'HORIZONTAL')],
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
    // SCREEN 05: 05 · Galeri Kegiatan / Desktop (publikasi/page.tsx)
    // ===========================================================================
    {
      const s = createScreenFrame('publications', '05 · Galeri Kegiatan / Desktop');

      // Full-Bleed Dark Photo Hero (img_48)
      const hero = box(s, 'Publikasi Hero (Full-Bleed)', {
        w: 1440,
        h: 620,
        alignMain: 'SPACE_BETWEEN',
        alignCross: 'CENTER',
        clip: true,
        fills: [
          imgFill('img_48'),
          gradLinear('black', 0.35, 'black', 0.72, 'VERTICAL')
        ]
      });
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

      // Section: PublicationMosaic (#galeri)
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

      // 6-Column Staggered Photo Mosaic Grid (1280px)
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
          const mp = photoBox(col, 'Mosaic Photo', mImg, 200, mH, 20);
          mp.effects = shadowCard(0.06, 8, 20);
          onClickNavigate(mp, 'article');
        }
      }

      // Section: PublicationGrid (#kegiatan) with Category Filter Pills + 6 Cards
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
        row(filterBar, 'Filter / ' + catName, {
          pad: [9, 20],
          radius: 999,
          fill: active ? 'primary' : 'white',
          stroke: active ? undefined : 'border'
        });
        const pillNode = filterBar.children[filterBar.children.length - 1];
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
    // SCREEN 06: 06 · Detail Kegiatan / Desktop (publikasi/[slug]/page.tsx)
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

      // Header (760px)
      const artHead = box(artSec, 'Article Header', { w: 760, gap: 14 });
      const backLink = row(artHead, 'Back Link / Kembali ke galeri', {
        gap: 8,
        alignCross: 'CENTER'
      });
      svgIcon(backLink, 'arrowLeft', 16, 'primary');
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

      // ActivitySlider Photo Viewer (980 x 520)
      const slider = photoBox(artSec, 'ActivitySlider Photo', 'img_01', 980, 520, 28, [
        gradLinear('black', 0, 'black', 0.45, 'VERTICAL')
      ]);
      slider.effects = shadowCard(0.1, 16, 36);
      const slideMeta = row(slider, 'Slider Controls Overlay', {
        abs: true,
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

      // Article Body Copy (680px)
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
        alignCross: 'CENTER',
        stroke: 'border'
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
    // SCREEN 07: 07 · Tanya AI / Desktop (tanya-ai/page.tsx + SchoolChat.tsx)
    // ===========================================================================
    {
      const s = createScreenFrame('ai', '07 · Tanya AI / Desktop');
      s.resize(1440, 960);
      s.primaryAxisSizingMode = 'FIXED';
      s.fills = [
        solid('bg'),
        imgFill('img_31_gray', 0.36),
        gradLinear('bg', 0.65, 'bg', 0.94, 'VERTICAL')
      ];

      buildNavbar(s, 'ai', 'default');

      const stage = box(s, 'Tanya AI Empty State Stage', {
        w: 1440,
        h: 860,
        pad: [96, 340],
        gap: 24,
        alignMain: 'CENTER',
        alignCross: 'CENTER'
      });

      // Glowing 64x64 AI Orb
      const orb = figma.createEllipse();
      orb.name = 'AI Orb (64x64)';
      orb.resize(64, 64);
      orb.fills = [gradLinear('sky400', 1, 'primary', 1, 'VERTICAL')];
      orb.effects = shadowCard(0.28, 10, 28);
      stage.appendChild(orb);

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

      // Composer Card (760px)
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
      svgIcon(compTop, 'sparkle', 18, 'primary');
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
        alignCross: 'CENTER',
        stroke: 'borderSoft'
      });
      const infoBadge = row(compBot, 'Info Badge', {
        pad: [6, 12],
        gap: 6,
        radius: 999,
        alignCross: 'CENTER',
        fill: 'blue50'
      });
      svgIcon(infoBadge, 'globe', 14, 'primary');
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
      svgIcon(sendBtn, 'arrowUp', 18, 'white');

      // Quick Prompt Pills
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
      const s = createScreenFrame('aiActive', '08 · Tanya AI (Percakapan Aktif) / Desktop');
      s.resize(1440, 960);
      s.primaryAxisSizingMode = 'FIXED';
      s.fills = [
        solid('bg'),
        imgFill('img_31_gray', 0.36),
        gradLinear('bg', 0.72, 'bg', 0.96, 'VERTICAL')
      ];

      buildNavbar(s, 'ai', 'default');

      const chatStage = box(s, 'Active Chat Stage', {
        w: 820,
        h: 840,
        pad: [24, 0, 32, 0],
        gap: 22,
        alignMain: 'SPACE_BETWEEN',
        alignCross: 'CENTER'
      });

      // Top Header Bar with "Percakapan baru" reset button
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

      // Messages Stream
      const msgList = box(chatStage, 'Messages Stream', {
        w: 760,
        gap: 20
      });

      // User Message Row (Right-aligned)
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

      // Assistant Response Card (Left-aligned)
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
      const miniOrb = figma.createEllipse();
      miniOrb.resize(24, 24);
      miniOrb.fills = [gradLinear('sky400', 1, 'primary', 1, 'VERTICAL')];
      botHead.appendChild(miniOrb);
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

      // Bottom Composer Bar
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
      svgIcon(bSend, 'arrowUp', 16, 'white');
    }

    // ===========================================================================
    // WIRE ALL INTERACTIVE PROTOTYPE REACTIONS & ANIMATIONS
    // ===========================================================================
    const TRANSITION_SMART = {
      type: 'SMART_ANIMATE',
      easing: { type: 'EASE_IN_AND_OUT' },
      duration: 0.35
    };
    const TRANSITION_SCROLL = {
      type: 'SCROLL_ANIMATE',
      easing: { type: 'EASE_IN_AND_OUT' },
      duration: 0.5
    };

    const reactionPromises = [];

    function bindNavReaction(node, destFrame, resetScroll = true) {
      if (!node || !destFrame) return;
      reactionPromises.push(
        node.setReactionsAsync([
          {
            trigger: { type: 'ON_CLICK' },
            actions: [
              {
                type: 'NODE',
                destinationId: destFrame.id,
                navigation: 'NAVIGATE',
                transition: TRANSITION_SMART,
                resetScrollPosition: resetScroll
              }
            ]
          }
        ])
      );
    }

    // 1. Wire Navbar items across all 8 screens
    for (const nav of navRegistry) {
      bindNavReaction(nav.brand, screens.home);
      for (const [k, pillNode] of Object.entries(nav.linkNodes)) {
        if (k !== nav.activeKey && screens[k]) {
          bindNavReaction(pillNode, screens[k]);
        } else if (k === 'profile' && nav.activeKey === 'profile') {
          bindNavReaction(pillNode, screens.teachers);
        }
      }
      if (nav.activeKey !== 'ai') {
        bindNavReaction(nav.aiBtn, screens.ai);
      }
    }

    // 2. Wire Footer links across all screens
    for (const fLinks of footerRegistry) {
      for (const [k, txtNode] of Object.entries(fLinks)) {
        if (screens[k]) {
          bindNavReaction(txtNode, screens[k]);
        }
      }
    }

    // 3. Wire all section buttons, cards, and smooth scroll targets
    for (const task of linkTasks) {
      if (task.kind === 'NAVIGATE') {
        const dest = screens[task.targetKey];
        if (dest) {
          bindNavReaction(task.node, dest, task.targetKey !== 'aiActive');
        }
      } else if (task.kind === 'SCROLL_TO') {
        const destSec = task.targetNodeFn();
        if (destSec) {
          reactionPromises.push(
            task.node.setReactionsAsync([
              {
                trigger: { type: 'ON_CLICK' },
                actions: [
                  {
                    type: 'NODE',
                    destinationId: destSec.id,
                    navigation: 'SCROLL_TO',
                    transition: TRANSITION_SCROLL,
                    resetScrollPosition: false
                  }
                ]
              }
            ])
          );
        }
      }
    }

    await Promise.all(reactionPromises);
    const reactionCount = reactionPromises.length;

    // 4. Configure Prototype Flow Starting Points on the Page
    page.flowStartingPoints = [
      {
        nodeId: screens.home.id,
        name: 'Website SMA Widya Darma (Desktop Browser)'
      },
      {
        nodeId: screens.spmb.id,
        name: 'Flow SPMB & Tiket Pendaftaran'
      },
      {
        nodeId: screens.ai.id,
        name: 'Flow Tanya AI Interaktif'
      }
    ];

    // Focus viewport on the Desktop screens
    const allDesktopFrames = Object.values(screens);
    figma.currentPage.selection = [screens.home];
    figma.viewport.scrollAndZoomIntoView(allDesktopFrames);

    figma.notify(
      `Berhasil membuat ${allDesktopFrames.length} layar Desktop (1440px) + ${reactionCount} interaksi prototype & animasi!`,
      { timeout: 5000 }
    );
    figma.closePlugin(
      `Selesai! ${allDesktopFrames.length} layar Desktop & ${reactionCount} interaksi Prototype siap di-Play.`
    );
  } catch (err) {
    console.error(err);
    figma.notify('Error: ' + (err && err.message ? err.message : String(err)), {
      error: true,
      timeout: 8000
    });
    figma.closePlugin('Gagal: ' + (err && err.message ? err.message : String(err)));
  }
})();
