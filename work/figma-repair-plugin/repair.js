/* Embedded assets are prepended by build.cjs. Run only in SMA Widya Darma. */
(async function repairDesktopPages() {
  try {
    const page = await figma.getNodeByIdAsync('59:2');
    const home = await figma.getNodeByIdAsync('59:3');
    const profile = await figma.getNodeByIdAsync('59:4');
    if (!page || page.type !== 'PAGE' || !home || home.type !== 'FRAME' ||
        !profile || profile.type !== 'FRAME' ||
        home.parent !== page || profile.parent !== page ||
        home.name !== 'Beranda · Desktop 1440' ||
        profile.name !== 'Profil Sekolah · Desktop 1440') {
      throw new Error('Buka file SMA Widya Darma yang memiliki draf Beranda dan Profil.');
    }
    await figma.setCurrentPageAsync(page);
    const components = page.children.filter(n => n.type === 'COMPONENT');
    const scopes = [...components, home, profile];
    const descendants = () => scopes.flatMap(n => n.findAll(() => true));
    const texts = descendants().filter(n => n.type === 'TEXT');
    const fonts = new Map();
    for (const text of texts) {
      for (const segment of text.getStyledTextSegments(['fontName'])) {
        fonts.set(JSON.stringify(segment.fontName), segment.fontName);
      }
    }
    fonts.set('link', { family: 'Plus Jakarta Sans', style: 'SemiBold' });
    await Promise.all(Array.from(fonts.values()).map(f => figma.loadFontAsync(f)));

    // A real canvas reference is set in this same run for every imported image.
    const hashes = {};
    function decodeBase64(value) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      const clean = value.replace(/=+$/, '');
      const bytes = [];
      let buffer = 0, bits = 0;
      for (let i = 0; i < clean.length; i++) {
        const part = chars.indexOf(clean[i]);
        if (part < 0) throw new Error('Data foto tidak valid.');
        buffer = (buffer << 6) | part;
        bits += 6;
        if (bits >= 8) { bits -= 8; bytes.push((buffer >> bits) & 255); }
      }
      return new Uint8Array(bytes);
    }
    for (const asset of Object.keys(ASSETS)) {
      hashes[asset] = figma.createImage(decodeBase64(ASSETS[asset])).hash;
    }
    const coverOverrides = {
      'I62:1637;60:59': 'students',
      'I62:1650;60:59': 'library',
      'I62:1663;60:59': 'library'
    };
    let photoCount = 0;
    for (const node of descendants()) {
      if (node.type !== 'RECTANGLE' || !node.name.startsWith('Photo / ')) continue;
      const asset = coverOverrides[node.id] || node.name.slice('Photo / '.length);
      if (!hashes[asset]) continue;
      node.fills = [{ type: 'IMAGE', imageHash: hashes[asset], scaleMode: 'FILL' }];
      photoCount++;
    }
    const hero = profile.findOne(n => n.type === 'FRAME' && n.name === 'Profile hero');
    if (!hero || hero.type !== 'FRAME') throw new Error('Bagian hero Profil tidak ditemukan.');
    hero.fills = [{ type: 'IMAGE', imageHash: hashes.campus, scaleMode: 'FILL' }];
    let shade = hero.findOne(n => n.name === 'Profile hero / photo shade');
    if (!shade) {
      shade = figma.createRectangle();
      shade.name = 'Profile hero / photo shade';
      hero.insertChild(0, shade);
      shade.layoutPositioning = 'ABSOLUTE';
    }
    if (shade.type !== 'RECTANGLE') throw new Error('Layer bayangan hero bukan kotak foto.');
    shade.resize(hero.width, hero.height);
    shade.x = shade.y = 0;
    shade.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' };
    shade.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.4 }];

    // resize() turns text into fixed-height boxes. Set auto-resize LAST.
    let textCount = 0;
    for (const text of texts) {
      if (text.textAutoResize === 'WIDTH_AND_HEIGHT') continue;
      const width = text.width;
      text.resize(width, Math.max(1, text.height));
      text.textAutoResize = 'HEIGHT';
      if (text.parent && 'layoutMode' in text.parent && text.parent.layoutMode !== 'NONE' &&
          text.layoutPositioning !== 'ABSOLUTE') {
        text.layoutSizingHorizontal = 'FIXED';
        text.layoutSizingVertical = 'HUG';
      }
      textCount++;
    }
    for (const node of descendants()) {
      if (node.type === 'INSTANCE' &&
          (node.name === 'StaffCard' || node.name === 'PublicationCard')) {
        node.layoutSizingVertical = 'HUG';
      }
    }

    const variables = await figma.variables.getLocalVariablesAsync();
    function tokenPaint(name, hex) {
      const color = { r: parseInt(hex.slice(1, 3), 16) / 255,
        g: parseInt(hex.slice(3, 5), 16) / 255, b: parseInt(hex.slice(5, 7), 16) / 255 };
      /** @type {SolidPaint} */
      const paint = { type: 'SOLID', color };
      const variable = variables.find(v => v.name === 'color/' + name && v.resolvedType === 'COLOR');
      return variable ? figma.variables.setBoundVariableForPaint(paint, 'color', variable) : paint;
    }
    const ink = tokenPaint('foreground', '#24272d');
    const blue = tokenPaint('primary', '#2563eb');
    for (const text of texts) {
      const value = text.characters;
      if (value.startsWith('Membangun generasi unggul')) {
        text.fills = [ink];
        const start = value.indexOf('pendidikan berkualitas.');
        if (start >= 0) text.setRangeFills(start, value.length, [blue]);
      } else if (value === 'Lorem ipsum dolor sit\namet, consectetur.') {
        text.fills = [ink];
        text.setRangeFills(value.indexOf('consectetur.'), value.length, [blue]);
      } else if (['Lorem ipsum\ndolor sit amet.', 'Lorem ipsum.\nDolor sit amet.',
                  'Lorem ipsum\ndolor sit amet?'].includes(value)) {
        text.fills = [ink];
        text.setRangeFills(value.indexOf('\n') + 1, value.length, [blue]);
      }
    }

    // Add the source website's missing navigation links without replacing nodes.
    /** @param {FrameNode} root @param {string} sectionName @param {string[]} labelValues */
    function addLinks(root, sectionName, labelValues) {
      const section = root.findOne(n => n.type === 'FRAME' && n.name === sectionName);
      if (!section || section.type !== 'FRAME') return;
      const container = section.children.find(n => n.type === 'FRAME');
      if (!container || container.findOne(n => n.name === sectionName + ' / more links')) return;
      const heading = container.children.find(n => n.type === 'TEXT' && n.fontSize === 52);
      if (!heading) return;
      const row = figma.createFrame();
      row.name = sectionName + ' / more links';
      row.layoutMode = 'HORIZONTAL';
      row.resize(container.width, 18);
      row.primaryAxisSizingMode = 'FIXED';
      row.counterAxisSizingMode = 'AUTO';
      row.primaryAxisAlignItems = 'MAX';
      row.counterAxisAlignItems = 'CENTER';
      row.itemSpacing = 24;
      row.fills = [];
      container.insertChild(container.children.indexOf(heading) + 1, row);
      for (const value of labelValues) {
        const group = figma.createFrame();
        group.name = 'Link / ' + value;
        group.layoutMode = 'HORIZONTAL';
        group.primaryAxisSizingMode = group.counterAxisSizingMode = 'AUTO';
        group.counterAxisAlignItems = 'CENTER';
        group.itemSpacing = 8;
        group.fills = [];
        row.appendChild(group);
        const label = figma.createText();
        label.name = value;
        label.fontName = { family: 'Plus Jakarta Sans', style: 'SemiBold' };
        label.fontSize = 12;
        label.lineHeight = { unit: 'PIXELS', value: 18 };
        label.characters = value;
        label.textAutoResize = 'WIDTH_AND_HEIGHT';
        label.fills = [blue];
        group.appendChild(label);
        const arrow = figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>');
        arrow.name = 'Icon / arrow up right';
        group.appendChild(arrow);
      }
    }
    addLinks(home, 'StaffPreview', ['Struktur organisasi', 'Semua guru']);
    addLinks(home, 'PublicationPreview', ['Semua publikasi']);
    for (const root of [home, profile]) root.layoutSizingVertical = 'HUG';
    figma.currentPage.selection = [home, profile];
    figma.viewport.scrollAndZoomIntoView([home, profile]);
    console.log({ photoCount, textCount, frames: [home.id, profile.id] });
    figma.closePlugin('Foto dan ukuran teks Beranda & Profil diperbaiki. Periksa tampilan kedua halaman.');
  } catch (error) {
    console.error(error);
    figma.closePlugin('Perbaikan berhenti: ' + (error.message || String(error)));
  }
})();
