(function(THREE2) {
  "use strict";
  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
    if (e) {
      for (const k in e) {
        if (k !== "default") {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }
  const THREE__namespace = /* @__PURE__ */ _interopNamespaceDefault(THREE2);
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const ScrollSmoother = window.ScrollSmoother;
  const ScrollToPlugin = window.ScrollToPlugin;
  function initMagicCursor() {
    const magicCursor = document.querySelector("#magic-cursor");
    const ball = document.querySelector("#ball");
    const body = document.body;
    if (!magicCursor || !ball || !body.classList.contains("at-magic-cursor")) {
      return;
    }
    const isTouchOrSmall = window.matchMedia("(max-width: 991.98px), (hover: none), (pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouchOrSmall) {
      magicCursor.remove();
      return;
    }
    document.querySelectorAll(".at-magnetic-item").forEach((item) => {
      var _a, _b;
      if ((_a = item.parentElement) == null ? void 0 : _a.classList.contains("at-magnetic-wrap")) return;
      const wrap2 = document.createElement("div");
      wrap2.className = "at-magnetic-wrap";
      (_b = item.parentNode) == null ? void 0 : _b.insertBefore(wrap2, item);
      wrap2.appendChild(item);
    });
    const mouse = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    const ratio = 0.12;
    let active = false;
    const ballWidth = 14;
    const ballHeight = 14;
    const ballScale = 1;
    const ballOpacity = 1;
    const ballBorderWidth = 1;
    gsap.set(ball, {
      xPercent: -50,
      yPercent: -50,
      width: ballWidth,
      height: ballHeight,
      borderWidth: ballBorderWidth,
      autoAlpha: 0
    });
    document.addEventListener("mousemove", (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    });
    gsap.ticker.add(() => {
      if (active) return;
      pos.x += (mouse.x - pos.x) * ratio;
      pos.y += (mouse.y - pos.y) * ratio;
      gsap.set(ball, { x: pos.x, y: pos.y });
    });
    function showBall() {
      gsap.to(ball, {
        duration: 0.3,
        autoAlpha: 1,
        scale: ballScale,
        ease: "power2.out",
        overwrite: "auto"
      });
    }
    function hideBall() {
      gsap.to(ball, {
        duration: 0.3,
        autoAlpha: 0,
        ease: "power2.out",
        overwrite: "auto"
      });
    }
    function parallaxIt(event, parent, target, movement) {
      if (!target) return;
      const boundingRect = parent.getBoundingClientRect();
      const relX = event.clientX - boundingRect.left;
      const relY = event.clientY - boundingRect.top;
      gsap.to(target, {
        duration: 0.3,
        x: (relX - boundingRect.width / 2) / boundingRect.width * movement,
        y: (relY - boundingRect.height / 2) / boundingRect.height * movement,
        ease: "power2.out"
      });
    }
    function parallaxCursor(event, parent, movement) {
      const rect = parent.getBoundingClientRect();
      const relX = event.clientX - rect.left;
      const relY = event.clientY - rect.top;
      pos.x = rect.left + rect.width / 2 + (relX - rect.width / 2) / movement;
      pos.y = rect.top + rect.height / 2 + (relY - rect.height / 2) / movement;
      gsap.to(ball, { duration: 0.3, x: pos.x, y: pos.y });
    }
    document.querySelectorAll(".at-magnetic-wrap").forEach((wrap2) => {
      wrap2.addEventListener("mousemove", (event) => {
        parallaxCursor(event, wrap2, 2);
        parallaxIt(event, wrap2, wrap2.querySelector(".at-magnetic-item"), 25);
      });
      wrap2.addEventListener("mouseenter", () => {
        gsap.to(ball, {
          duration: 0.3,
          scale: 2,
          borderWidth: 1,
          opacity: ballOpacity
        });
        active = true;
      });
      wrap2.addEventListener("mouseleave", () => {
        gsap.to(ball, {
          duration: 0.3,
          scale: ballScale,
          borderWidth: ballBorderWidth,
          opacity: ballOpacity
        });
        const magneticItem = wrap2.querySelector(".at-magnetic-item");
        if (magneticItem) {
          gsap.to(magneticItem, { duration: 0.3, x: 0, y: 0, clearProps: "all" });
        }
        active = false;
      });
    });
    function bindDataCursor(color = "#000") {
      const isRtl = document.documentElement.getAttribute("dir") === "rtl";
      document.querySelectorAll("[data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", () => {
          ball.classList.add("with-blur");
          const view = document.createElement("div");
          view.className = "ball-view";
          view.textContent = el.getAttribute("data-cursor") || "";
          ball.appendChild(view);
          gsap.to(ball, {
            duration: 0.3,
            xPercent: isRtl ? 50 : -50,
            yPercent: -60,
            width: 110,
            height: 110,
            opacity: 1,
            borderWidth: 0,
            zIndex: 1,
            backdropFilter: "blur(14px)",
            backgroundColor: color
          });
          gsap.to(view, { duration: 0.3, scale: 1, autoAlpha: 1 });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(ball, {
            duration: 0.3,
            yPercent: -50,
            width: ballWidth,
            height: ballHeight,
            opacity: ballOpacity,
            borderWidth: ballBorderWidth,
            backgroundColor: "#ffffff"
          });
          const views = ball.querySelectorAll(".ball-view");
          views.forEach((view) => {
            gsap.to(view, {
              duration: 0.3,
              scale: 0,
              autoAlpha: 0,
              clearProps: "all",
              onComplete: () => view.remove()
            });
          });
          ball.classList.remove("with-blur");
        });
      });
    }
    if (document.querySelector(".cursor-bg-red")) {
      bindDataCursor("#ff6d00");
    } else if (document.querySelector(".cursor-bg-red-2")) {
      bindDataCursor("#FF481F");
    } else if (document.querySelector(".cursor-white-bg")) {
      bindDataCursor("#FFF");
    } else {
      bindDataCursor("#ffffff");
    }
    document.querySelectorAll("a").forEach((el) => {
      if (el.target === "_blank" || el.classList.contains("cursor-hide") || (el.getAttribute("href") || "").startsWith("#") || (el.getAttribute("href") || "").startsWith("mailto:") || (el.getAttribute("href") || "").startsWith("tel:")) {
        return;
      }
      el.addEventListener("click", () => {
        gsap.to(ball, { duration: 0.3, scale: 1.3, autoAlpha: 0 });
      });
    });
    body.addEventListener("mouseleave", hideBall);
    body.addEventListener("mouseenter", showBall);
    body.addEventListener("mousemove", showBall);
  }
  const MIN_INTRO_MS = 1400;
  const ASSET_TIMEOUT_MS = 1e4;
  function collectFirstViewportAssetUrls() {
    const urls = /* @__PURE__ */ new Set();
    const roots = document.querySelectorAll(".hero-1, .about-1");
    roots.forEach((root) => {
      root.querySelectorAll("img").forEach((img) => {
        const src = img.currentSrc || img.getAttribute("src");
        if (src) urls.add(src);
      });
      root.querySelectorAll("[data-hero-embed][data-images]").forEach((embed) => {
        try {
          const frames = JSON.parse(embed.getAttribute("data-images") || "[]");
          if (!Array.isArray(frames)) return;
          frames.forEach((src) => {
            if (typeof src === "string" && src) urls.add(src);
          });
        } catch {
        }
      });
    });
    return [...urls];
  }
  function preloadUrls(urls, onProgress) {
    if (!urls.length) {
      onProgress(1);
      return Promise.resolve();
    }
    let settled = 0;
    const total = urls.length;
    const bump = () => {
      settled += 1;
      onProgress(Math.min(1, settled / total));
    };
    return Promise.all(
      urls.map(
        (url) => new Promise((resolve) => {
          const img = new Image();
          let done = false;
          const finishOne = () => {
            if (done) return;
            done = true;
            bump();
            resolve();
          };
          img.onload = finishOne;
          img.onerror = finishOne;
          img.src = url;
          if (img.complete) finishOne();
        })
      )
    ).then(() => void 0);
  }
  function initPreLoader() {
    const root = document.querySelector("#pre-loader-1");
    if (!root) {
      document.body.classList.remove("is-preloading");
      return;
    }
    const logoEl = root.querySelector(".pre-loader-1__logo");
    const counterEl = root.querySelector(".pre-loader-1__count p");
    const bar = root.querySelector(".pre-loader-1__bar");
    const content = root.querySelector(".pre-loader-1__content");
    const door1 = root.querySelector(".pre-loader-1__door--1");
    const door2 = root.querySelector(".pre-loader-1__door--2");
    const door3 = root.querySelector(".pre-loader-1__door--3");
    const door4 = root.querySelector(".pre-loader-1__door--4");
    const seams = root.querySelectorAll(".pre-loader-1__seam");
    if (!logoEl || !counterEl || !bar || !content || !door1 || !door2 || !door3 || !door4 || seams.length < 3) {
      document.body.classList.remove("is-preloading");
      return;
    }
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function finish() {
      root.classList.add("is-done");
      root.setAttribute("aria-busy", "false");
      root.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-preloading");
    }
    if (prefersReducedMotion2) {
      finish();
      return;
    }
    const display = { value: 0 };
    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(logoEl, { opacity: 0, y: 12 });
    function paintProgress() {
      const n = Math.round(display.value);
      counterEl.textContent = String(n).padStart(2, "0");
      gsap.set(bar, { scaleX: display.value / 100 });
    }
    function setProgress(ratio, opts = {}) {
      const target = Math.max(0, Math.min(100, ratio * 100));
      if (opts.snap) {
        gsap.killTweensOf(display);
        display.value = target;
        paintProgress();
        return;
      }
      gsap.to(display, {
        value: target,
        duration: opts.duration ?? 0.4,
        ease: "power1.out",
        overwrite: true,
        onUpdate: paintProgress
      });
    }
    const doors = [
      { el: door1, x: "-101vw" },
      { el: door2, x: "-101vw" },
      { el: door3, x: "101vw" },
      { el: door4, x: "101vw" }
    ];
    const introTl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    introTl.to(
      logoEl,
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out"
      },
      0.1
    );
    function playReveal() {
      const revealTl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: finish
      });
      revealTl.to(
        content,
        {
          y: -28,
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.5,
          ease: "power2.in"
        },
        0
      );
      revealTl.fromTo(
        seams,
        { height: 0, opacity: 0 },
        {
          height: "100vh",
          opacity: 0.95,
          duration: 0.4,
          ease: "power2.in",
          stagger: 0.05
        },
        0.45
      );
      doors.forEach(({ el, x }, i) => {
        revealTl.to(
          el,
          {
            x,
            duration: 1.05,
            ease: "power4.inOut"
          },
          0.8 + i * 0.05
        );
      });
      revealTl.to(
        seams,
        {
          opacity: 0,
          duration: 0.35,
          ease: "power1.out"
        },
        1.15
      );
    }
    const urls = collectFirstViewportAssetUrls();
    const assetsReady = Promise.race([
      preloadUrls(urls, (ratio) => setProgress(ratio)),
      new Promise((resolve) => {
        window.setTimeout(() => {
          setProgress(1, { duration: 0.25 });
          resolve();
        }, ASSET_TIMEOUT_MS);
      })
    ]);
    const minIntroReady = new Promise((resolve) => {
      window.setTimeout(resolve, MIN_INTRO_MS);
    });
    Promise.all([assetsReady, minIntroReady]).then(() => {
      setProgress(1, { duration: 0.2 });
      gsap.delayedCall(0.22, playReveal);
    });
  }
  const SplitText = window.SplitText;
  gsap.registerPlugin(SplitText);
  function initHeaderNavTextRoll() {
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    const labels = document.querySelectorAll(".header-1__nav-label");
    if (!labels.length) return;
    labels.forEach((label) => {
      var _a;
      const link = label.closest(".header-1__nav-link");
      if (!link || label.dataset.split === "true") return;
      const originalText = ((_a = label.textContent) == null ? void 0 : _a.trim()) ?? "";
      if (!originalText) return;
      label.setAttribute("aria-label", originalText);
      const split = new SplitText(label, {
        type: "chars",
        charsClass: "header-1__nav-char",
        tag: "span"
      });
      split.chars.forEach((char) => {
        const letter = char.textContent ?? "";
        if (!letter.trim()) {
          char.classList.add("header-1__nav-char--space");
          return;
        }
        char.textContent = "";
        const stack = document.createElement("span");
        stack.className = "header-1__nav-char-stack";
        stack.setAttribute("aria-hidden", "true");
        const top = document.createElement("span");
        top.className = "header-1__nav-char-letter";
        top.textContent = letter;
        const bottom = document.createElement("span");
        bottom.className = "header-1__nav-char-letter";
        bottom.textContent = letter;
        stack.append(top, bottom);
        char.appendChild(stack);
      });
      label.dataset.split = "true";
      const stacks = label.querySelectorAll(".header-1__nav-char-stack");
      gsap.set(stacks, { yPercent: 0 });
      link.addEventListener("mouseenter", () => {
        gsap.to(stacks, {
          yPercent: -50,
          duration: 0.35,
          stagger: 0.03,
          ease: "power2.out",
          overwrite: "auto"
        });
      });
      link.addEventListener("mouseleave", () => {
        gsap.to(stacks, {
          yPercent: 0,
          duration: 0.35,
          stagger: 0.02,
          ease: "power2.out",
          overwrite: "auto"
        });
      });
    });
  }
  function initHeader1Sub() {
    const shell = document.querySelector(".header-1-shell");
    if (!shell) return;
    const items = shell.querySelectorAll(".header-1__nav-item--has-sub");
    items.forEach((item) => {
      const trigger = item.querySelector(".header-1__nav-link");
      const subId = trigger == null ? void 0 : trigger.getAttribute("aria-controls");
      const sub = subId ? document.getElementById(subId) : null;
      if (!trigger || !sub) return;
      let closeTimer = 0;
      const position = () => {
        const triggerRect = trigger.getBoundingClientRect();
        const shellRect = shell.getBoundingClientRect();
        const gapRaw = getComputedStyle(document.documentElement).getPropertyValue("--space-2").trim();
        const gap = Number.parseFloat(gapRaw) || 16;
        sub.style.setProperty(
          "--header-submenu-top",
          `${triggerRect.bottom - shellRect.top + gap}px`
        );
        sub.style.setProperty(
          "--header-submenu-left",
          `${triggerRect.left - shellRect.left}px`
        );
      };
      const open = () => {
        window.clearTimeout(closeTimer);
        position();
        sub.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      };
      const close = () => {
        sub.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      };
      const scheduleClose = () => {
        window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(close, 120);
      };
      const isInside = (node) => Boolean(node) && (item.contains(node) || sub.contains(node));
      item.addEventListener("mouseenter", open);
      item.addEventListener("mouseleave", scheduleClose);
      sub.addEventListener("mouseenter", open);
      sub.addEventListener("mouseleave", scheduleClose);
      trigger.addEventListener("focus", open);
      item.addEventListener("focusout", (event) => {
        if (isInside(event.relatedTarget)) return;
        scheduleClose();
      });
      sub.addEventListener("focusout", (event) => {
        if (isInside(event.relatedTarget)) return;
        scheduleClose();
      });
      window.addEventListener("resize", () => {
        if (sub.classList.contains("is-open")) position();
      });
    });
  }
  function rasterizeElement(el, pixelRatio = 1) {
    const dpr = Math.max(1, pixelRatio);
    const origin = el.getBoundingClientRect();
    const width = Math.max(1, Math.round(el.clientWidth || origin.width));
    const height = Math.max(1, Math.round(el.clientHeight || origin.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    const painted = paintLaidOutText(ctx, el, origin);
    if (!painted) paintWrappedFallback(ctx, el, width, height);
    return canvas;
  }
  function paintLaidOutText(ctx, el, origin) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let painted = false;
    let node = walker.nextNode();
    while (node) {
      const parent = node.parentElement;
      const raw = node.textContent || "";
      if (parent && raw && !shouldSkipNode(parent)) {
        applyFillStyle(ctx, parent);
        const range = document.createRange();
        const length = raw.length;
        for (let i = 0; i < length; i += 1) {
          const ch = raw[i];
          if (!ch.trim()) continue;
          range.setStart(node, i);
          range.setEnd(node, i + 1);
          const rect = range.getBoundingClientRect();
          if (rect.width < 0.25 || rect.height < 0.25) continue;
          ctx.fillText(ch, rect.left - origin.left, rect.top - origin.top);
          painted = true;
        }
      }
      node = walker.nextNode();
    }
    return painted;
  }
  function shouldSkipNode(el) {
    if (el.closest("canvas")) return true;
    if (el.closest(".grid-deform__canvas")) return true;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") return true;
    return false;
  }
  function resolvePaintColor(el) {
    let node = el;
    while (node && node !== document.documentElement) {
      const color = getComputedStyle(node).color;
      if (color && !isFullyTransparent(color)) return color;
      node = node.parentElement;
    }
    return "#000";
  }
  function isFullyTransparent(color) {
    if (color === "transparent") return true;
    const match = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);
    if (!match) return false;
    return match[4] != null && Number.parseFloat(match[4]) === 0;
  }
  function applyFillStyle(ctx, el) {
    const style = getComputedStyle(el);
    const fontSize = Number.parseFloat(style.fontSize) || 16;
    ctx.font = [
      style.fontStyle,
      style.fontVariant,
      style.fontWeight,
      `${fontSize}px`,
      style.fontFamily
    ].filter(Boolean).join(" ");
    ctx.fillStyle = resolvePaintColor(el);
    if (typeof ctx.letterSpacing !== "undefined") {
      ctx.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
    }
  }
  function paintWrappedFallback(ctx, el, width, height) {
    const style = getComputedStyle(el);
    applyFillStyle(ctx, el);
    ctx.textAlign = canvasAlign(style.textAlign || "start");
    const padL = Number.parseFloat(style.paddingLeft) || 0;
    const padR = Number.parseFloat(style.paddingRight) || 0;
    const padT = Number.parseFloat(style.paddingTop) || 0;
    const contentW = Math.max(1, width - padL - padR);
    const fontSize = Number.parseFloat(style.fontSize) || 16;
    const lineHeight = parseLineHeight(style.lineHeight, fontSize);
    const whiteSpace = style.whiteSpace || "normal";
    const nowrap = whiteSpace === "nowrap" || whiteSpace === "pre";
    const raw = applyTextTransform(readPlainText(el), style.textTransform);
    const paragraphs = whiteSpace.startsWith("pre") ? raw.split("\n") : [collapseWhitespace(raw)];
    const lines = [];
    paragraphs.forEach((paragraph) => {
      if (nowrap) lines.push(paragraph);
      else lines.push(...wrapLines(ctx, paragraph, contentW));
    });
    if (!lines.length) return;
    let x = padL;
    if (style.textAlign === "center") x = padL + contentW / 2;
    else if (style.textAlign === "right" || style.textAlign === "end") x = padL + contentW;
    const halfLeading = Math.max(0, (lineHeight - fontSize) / 2);
    let y = padT + halfLeading;
    lines.forEach((line) => {
      if (line) ctx.fillText(line, x, y, nowrap ? void 0 : contentW);
      y += lineHeight;
      if (y > height) return;
    });
  }
  function readPlainText(el) {
    const parts = [];
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        parts.push(node.textContent || "");
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.tagName === "BR") {
        parts.push("\n");
        return;
      }
      node.childNodes.forEach(walk);
    };
    walk(el);
    return parts.join("");
  }
  function applyTextTransform(text, transform) {
    if (transform === "uppercase") return text.toUpperCase();
    if (transform === "lowercase") return text.toLowerCase();
    if (transform === "capitalize") {
      return text.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
    }
    return text;
  }
  function collapseWhitespace(text) {
    return text.replace(/\s+/g, " ").trim();
  }
  function parseLineHeight(value, fontSize) {
    if (!value || value === "normal") return fontSize * 1.2;
    if (value.endsWith("px")) return Number.parseFloat(value) || fontSize * 1.2;
    const numeric = Number.parseFloat(value);
    if (!Number.isFinite(numeric)) return fontSize * 1.2;
    if (value.endsWith("%")) return numeric / 100 * fontSize;
    if (numeric > 0 && numeric < 8) return numeric * fontSize;
    return numeric;
  }
  function canvasAlign(align) {
    if (align === "center") return "center";
    if (align === "right" || align === "end") return "right";
    return "left";
  }
  function wrapLines(ctx, text, maxWidth) {
    if (!text) return [""];
    if (maxWidth <= 0) return [text];
    const words = text.split(" ");
    const lines = [];
    let current = "";
    words.forEach((word) => {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width <= maxWidth || !current) {
        current = test;
        return;
      }
      lines.push(current);
      current = word;
    });
    if (current) lines.push(current);
    return lines.length ? lines : [""];
  }
  const vertexShader$1 = (
    /* glsl */
    `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`
  );
  const fragmentShader$1 = (
    /* glsl */
    `
uniform sampler2D uTexture;
uniform sampler2D uDataTexture;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform float uFit;
uniform float uDisplacement;
uniform float uAberration;

varying vec2 vUv;

vec2 getFitUV(vec2 uv, vec2 textureSize) {
    if (uFit < 0.5 || textureSize.x < 1.0 || textureSize.y < 1.0) return uv;

    vec2 s = uResolution / textureSize;
    float scale = uFit < 1.5 ? max(s.x, s.y) : min(s.x, s.y);
    vec2 scaledSize = textureSize * scale;
    vec2 offset = (uResolution - scaledSize) * 0.5;

    return (uv * uResolution - offset) / scaledSize;
}

void main() {
    vec4 offset = texture2D(uDataTexture, vUv);
    vec2 shift = uDisplacement * offset.rg;
    vec2 split = shift * uAberration;
    vec2 base = getFitUV(vUv, uTextureSize);

    vec4 sampleG = texture2D(uTexture, base - shift);
    float r = texture2D(uTexture, base - shift + split).r;
    float b = texture2D(uTexture, base - shift - split).b;

    gl_FragColor = vec4(r, sampleG.g, b, sampleG.a);
}
`
  );
  const GRID_DEFORM_DEFAULTS = {
    gridSize: 25,
    mouseRadius: 0.25,
    strength: 0.1,
    relaxation: 0.925,
    displacement: 0.015,
    aberration: 0.15,
    velocityDecay: 0.9,
    /** `cover` | `contain` | `fill`. Media defaults to cover; text defaults to fill. */
    fit: "",
    /** `local` = pointer vs container; `window` = pointer vs viewport. */
    pointerMode: "local",
    maxPixelRatio: 2
  };
  const FIT_VALUE = {
    fill: 0,
    cover: 1,
    contain: 2
  };
  class GridDeform {
    /**
     * @param {HTMLElement} container
     * @param {HTMLElement} source
     * @param {Partial<typeof GRID_DEFORM_DEFAULTS>} [options]
     */
    constructor(container, source, options = {}) {
      this.container = container;
      this.source = source;
      this.config = { ...GRID_DEFORM_DEFAULTS, ...options };
      this.kind = sourceKind(source);
      this._autoFit = !options.fit;
      if (this._autoFit) {
        this.config.fit = this.kind === "image" || this.kind === "video" ? "cover" : "fill";
      }
      this._running = true;
      this._paused = false;
      this._disposed = false;
      this._raf = 0;
      this._readyResolvers = [];
      this._mediaCleanup = [];
      this._loadGen = 0;
      this._hasPointer = false;
      this.mouse = { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 };
      this.gridX = 1;
      this.gridY = 1;
      this._setupCanvas();
      this.container.classList.add("grid-deform", `grid-deform--${this.kind}`);
      this._setupRenderer();
      this._setupScene();
      this._setupResize();
      this._setupInput();
      this._loadSource();
      this._loop();
    }
    setPaused(paused) {
      this._paused = Boolean(paused);
    }
    /**
     * Re-read the current source (needed after text / layout changes).
     * @returns {Promise<void>}
     */
    refresh() {
      return this._loadSource();
    }
    /**
     * Swap the sampled image, video, canvas, or text node.
     * @param {HTMLElement} source
     * @returns {Promise<void>}
     */
    setSource(source) {
      this.source = source;
      this.container.classList.remove("grid-deform--image", "grid-deform--video", "grid-deform--canvas", "grid-deform--text");
      this.kind = sourceKind(source);
      this.container.classList.add(`grid-deform--${this.kind}`);
      if (this._autoFit) {
        this.config.fit = this.kind === "image" || this.kind === "video" ? "cover" : "fill";
        this._syncFitUniform();
      }
      return this._loadSource();
    }
    /**
     * @returns {Promise<void>}
     */
    whenReady() {
      if (this.texture) return Promise.resolve();
      return new Promise((resolve) => {
        this._readyResolvers.push(resolve);
      });
    }
    destroy() {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      if (this._disposed) return;
      this._disposed = true;
      this._running = false;
      cancelAnimationFrame(this._raf);
      (_a = this._ro) == null ? void 0 : _a.disconnect();
      (_b = this._removeInput) == null ? void 0 : _b.call(this);
      this._clearMediaListeners();
      (_c = this.material) == null ? void 0 : _c.dispose();
      (_d = this.geometry) == null ? void 0 : _d.dispose();
      (_e = this.texture) == null ? void 0 : _e.dispose();
      (_f = this.dataTexture) == null ? void 0 : _f.dispose();
      (_g = this.renderer) == null ? void 0 : _g.dispose();
      (_h = this.canvas) == null ? void 0 : _h.remove();
      this.container.classList.remove("is-ready");
      this.container.removeAttribute("data-grid-deform-ready");
      delete this.container._gridDeform;
    }
    _setupCanvas() {
      const canvas = document.createElement("canvas");
      canvas.className = "grid-deform__canvas";
      canvas.setAttribute("aria-hidden", "true");
      this.container.appendChild(canvas);
      this.canvas = canvas;
    }
    _measure() {
      const rect = this.container.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      return { w, h, rect };
    }
    _setupRenderer() {
      this.renderer = new THREE__namespace.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.config.maxPixelRatio));
      this.renderer.outputColorSpace = THREE__namespace.SRGBColorSpace;
      const { w, h } = this._measure();
      this.renderer.setSize(w, h, false);
    }
    _setupScene() {
      this.scene = new THREE__namespace.Scene();
      this.camera = new THREE__namespace.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      this.geometry = new THREE__namespace.PlaneGeometry(2, 2);
      this.dataTexture = this._createDataTexture();
      this.material = new THREE__namespace.ShaderMaterial({
        uniforms: {
          uTexture: { value: null },
          uDataTexture: { value: this.dataTexture },
          uResolution: { value: new THREE__namespace.Vector2() },
          uTextureSize: { value: new THREE__namespace.Vector2(1, 1) },
          uFit: { value: 1 },
          uDisplacement: { value: this.config.displacement },
          uAberration: { value: this.config.aberration }
        },
        vertexShader: vertexShader$1,
        fragmentShader: fragmentShader$1,
        transparent: true
      });
      this.mesh = new THREE__namespace.Mesh(this.geometry, this.material);
      this.scene.add(this.mesh);
      this._syncFitUniform();
      this._syncResolution();
    }
    _syncFitUniform() {
      this.material.uniforms.uFit.value = FIT_VALUE[this.config.fit] ?? FIT_VALUE.cover;
    }
    _syncResolution() {
      const { w, h } = this._measure();
      this.material.uniforms.uResolution.value.set(w, h);
      this.material.uniforms.uDisplacement.value = this.config.displacement;
      this.material.uniforms.uAberration.value = this.config.aberration;
    }
    _createDataTexture() {
      const { w, h } = this._measure();
      const aspect = w / h;
      const size = Math.max(2, Math.round(this.config.gridSize));
      this.gridX = aspect >= 1 ? Math.round(size * aspect) : size;
      this.gridY = aspect >= 1 ? size : Math.round(size / aspect);
      const data = new Float32Array(this.gridX * this.gridY * 4);
      const texture = new THREE__namespace.DataTexture(data, this.gridX, this.gridY, THREE__namespace.RGBAFormat, THREE__namespace.FloatType);
      texture.magFilter = THREE__namespace.NearestFilter;
      texture.minFilter = THREE__namespace.NearestFilter;
      texture.wrapS = THREE__namespace.ClampToEdgeWrapping;
      texture.wrapT = THREE__namespace.ClampToEdgeWrapping;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
      return texture;
    }
    _rebuildDataTexture() {
      var _a;
      (_a = this.dataTexture) == null ? void 0 : _a.dispose();
      this.dataTexture = this._createDataTexture();
      this.material.uniforms.uDataTexture.value = this.dataTexture;
    }
    _setupResize() {
      let resizeTimer = 0;
      const resize = () => {
        if (this._disposed) return;
        const { w, h } = this._measure();
        this.renderer.setSize(w, h, false);
        this._syncResolution();
        this._rebuildDataTexture();
        if (this.kind === "text" || this.kind === "canvas") {
          this._loadSource();
        }
      };
      this._ro = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resize, 80);
      });
      this._ro.observe(this.container);
    }
    _setPointer(clientX, clientY) {
      let x;
      let y;
      if (this.config.pointerMode === "window") {
        x = clientX / Math.max(1, window.innerWidth);
        y = clientY / Math.max(1, window.innerHeight);
      } else {
        const rect = this.container.getBoundingClientRect();
        x = rect.width ? (clientX - rect.left) / rect.width : 0.5;
        y = rect.height ? (clientY - rect.top) / rect.height : 0.5;
      }
      x = Math.min(1, Math.max(0, x));
      y = Math.min(1, Math.max(0, y));
      if (!this._hasPointer) {
        this._hasPointer = true;
        this.mouse.x = x;
        this.mouse.y = y;
        this.mouse.prevX = x;
        this.mouse.prevY = y;
        this.mouse.vX = 0;
        this.mouse.vY = 0;
        return;
      }
      this.mouse.vX = x - this.mouse.prevX;
      this.mouse.vY = y - this.mouse.prevY;
      this.mouse.prevX = this.mouse.x;
      this.mouse.prevY = this.mouse.y;
      this.mouse.x = x;
      this.mouse.y = y;
    }
    _setupInput() {
      const onMouseMove = (event) => this._setPointer(event.clientX, event.clientY);
      const onTouchMove = (event) => {
        const touch = event.touches[0];
        if (touch) this._setPointer(touch.clientX, touch.clientY);
      };
      const pointerTarget = this.config.pointerMode === "window" ? window : this.container;
      pointerTarget.addEventListener("mousemove", onMouseMove, { passive: true });
      pointerTarget.addEventListener("touchmove", onTouchMove, { passive: true });
      this._removeInput = () => {
        pointerTarget.removeEventListener("mousemove", onMouseMove);
        pointerTarget.removeEventListener("touchmove", onTouchMove);
      };
    }
    _clearMediaListeners() {
      this._mediaCleanup.forEach((fn) => fn());
      this._mediaCleanup = [];
    }
    _configureTexture(texture) {
      texture.colorSpace = THREE__namespace.SRGBColorSpace;
      texture.minFilter = THREE__namespace.LinearFilter;
      texture.magFilter = THREE__namespace.LinearFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
      return texture;
    }
    _applyTexture(texture, width, height) {
      var _a;
      if (this._disposed || !texture || !width || !height) return;
      (_a = this.texture) == null ? void 0 : _a.dispose();
      this.texture = texture;
      this.material.uniforms.uTexture.value = texture;
      this.material.uniforms.uTextureSize.value.set(width, height);
      this._markReady();
    }
    _markReady() {
      this.container.classList.add("is-ready");
      this._readyResolvers.forEach((resolve) => resolve());
      this._readyResolvers = [];
    }
    /**
     * @returns {Promise<void>}
     */
    async _loadSource() {
      var _a;
      if (this._disposed) return;
      const loadId = this._loadGen += 1;
      this._clearMediaListeners();
      const { source } = this;
      this.kind = sourceKind(source);
      const stillCurrent = () => !this._disposed && this._loadGen === loadId;
      if (this.kind === "image") {
        const img = (
          /** @type {HTMLImageElement} */
          resolveImage(source)
        );
        if (!img) return;
        if (!(img.complete && img.naturalWidth > 0)) {
          await new Promise((resolve) => {
            const onLoad = () => resolve();
            img.addEventListener("load", onLoad, { once: true });
            img.addEventListener("error", onLoad, { once: true });
            this._mediaCleanup.push(() => {
              img.removeEventListener("load", onLoad);
              img.removeEventListener("error", onLoad);
            });
          });
        }
        if (!stillCurrent() || !img.naturalWidth) return;
        this._applyTexture(this._configureTexture(new THREE__namespace.Texture(img)), img.naturalWidth, img.naturalHeight);
        return;
      }
      if (this.kind === "video") {
        const video = (
          /** @type {HTMLVideoElement} */
          source
        );
        if (!(video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.videoWidth)) {
          await new Promise((resolve) => {
            const onReady = () => resolve();
            video.addEventListener("loadeddata", onReady, { once: true });
            video.addEventListener("error", onReady, { once: true });
            this._mediaCleanup.push(() => {
              video.removeEventListener("loadeddata", onReady);
              video.removeEventListener("error", onReady);
            });
          });
        }
        if (!stillCurrent() || !video.videoWidth || !video.videoHeight) return;
        this._applyTexture(
          this._configureTexture(new THREE__namespace.VideoTexture(video)),
          video.videoWidth,
          video.videoHeight
        );
        return;
      }
      if (this.kind === "canvas") {
        const canvas2 = (
          /** @type {HTMLCanvasElement} */
          source
        );
        const width = canvas2.width || canvas2.clientWidth;
        const height = canvas2.height || canvas2.clientHeight;
        if (!stillCurrent() || !width || !height) return;
        this._applyTexture(this._configureTexture(new THREE__namespace.CanvasTexture(canvas2)), width, height);
        return;
      }
      if ((_a = document.fonts) == null ? void 0 : _a.ready) {
        try {
          await document.fonts.ready;
        } catch {
        }
      }
      if (!stillCurrent()) return;
      const dpr = Math.min(window.devicePixelRatio || 1, this.config.maxPixelRatio);
      const canvas = rasterizeElement(source, dpr);
      this._applyTexture(
        this._configureTexture(new THREE__namespace.CanvasTexture(canvas)),
        canvas.width / dpr,
        canvas.height / dpr
      );
    }
    _updateDataTexture() {
      var _a, _b;
      const data = (_b = (_a = this.dataTexture) == null ? void 0 : _a.image) == null ? void 0 : _b.data;
      if (!data) return;
      const { relaxation, mouseRadius, strength, velocityDecay, gridSize } = this.config;
      for (let i = 0; i < data.length; i += 4) {
        data[i] *= relaxation;
        data[i + 1] *= relaxation;
      }
      const gridMouseX = this.gridX * this.mouse.x;
      const gridMouseY = this.gridY * (1 - this.mouse.y);
      const maxDist = Math.max(1, gridSize * mouseRadius);
      const maxDistSq = maxDist * maxDist;
      for (let i = 0; i < this.gridX; i += 1) {
        for (let j = 0; j < this.gridY; j += 1) {
          const distanceSq = (gridMouseX - i) ** 2 + (gridMouseY - j) ** 2;
          if (distanceSq >= maxDistSq) continue;
          const index = 4 * (i + this.gridX * j);
          const power = Math.min(10, maxDist / Math.sqrt(Math.max(distanceSq, 1e-4)));
          data[index] += strength * 100 * this.mouse.vX * power;
          data[index + 1] -= strength * 100 * this.mouse.vY * power;
        }
      }
      this.mouse.vX *= velocityDecay;
      this.mouse.vY *= velocityDecay;
      this.dataTexture.needsUpdate = true;
    }
    _loop() {
      const tick = () => {
        if (!this._running) return;
        this._raf = requestAnimationFrame(tick);
        if (this._paused || !this.texture) return;
        this._updateDataTexture();
        this.renderer.render(this.scene, this.camera);
      };
      tick();
    }
  }
  function sourceKind(el) {
    if (el instanceof HTMLVideoElement) return "video";
    if (el instanceof HTMLCanvasElement) return "canvas";
    if (el instanceof HTMLImageElement || el instanceof HTMLPictureElement) return "image";
    return "text";
  }
  function resolveImage(el) {
    if (el instanceof HTMLImageElement) return el;
    if (el instanceof HTMLPictureElement) return el.querySelector("img");
    return null;
  }
  function isIOSWebKit() {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || "";
    if (/iP(hone|ad|od)/.test(ua)) return true;
    return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  }
  function prepareInlineVideo(video) {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.disableRemotePlayback = true;
  }
  function isFileProtocol() {
    return window.location.protocol === "file:";
  }
  function canUseLocalWebGlTextures() {
    if (!isFileProtocol()) return true;
    return !/\b(?:Firefox|FxiOS)\//.test(navigator.userAgent);
  }
  const instances$1 = /* @__PURE__ */ new WeakMap();
  function getGridDeform(el) {
    return instances$1.get(el) || (el == null ? void 0 : el._gridDeform);
  }
  const DATA_KEYS$1 = {
    "data-grid-size": "gridSize",
    "data-mouse-radius": "mouseRadius",
    "data-strength": "strength",
    "data-relaxation": "relaxation",
    "data-displacement": "displacement",
    "data-aberration": "aberration",
    "data-velocity-decay": "velocityDecay"
  };
  function optionsFromElement$1(el) {
    const options = {};
    for (const [attr, key] of Object.entries(DATA_KEYS$1)) {
      const raw = el.getAttribute(attr);
      if (raw == null || raw === "") continue;
      const value = Number.parseFloat(raw);
      if (Number.isFinite(value)) options[key] = value;
    }
    const fit = el.getAttribute("data-fit");
    if (fit === "cover" || fit === "contain" || fit === "fill") {
      options.fit = fit;
    }
    const pointer = el.getAttribute("data-pointer");
    if (pointer === "window" || pointer === "local") {
      options.pointerMode = pointer;
    }
    return options;
  }
  function resolveRoot$1(el) {
    if (el.dataset.gridDeformReady === "true") return null;
    if (el instanceof HTMLImageElement || el instanceof HTMLVideoElement) {
      const parent = el.parentElement;
      if (parent == null ? void 0 : parent.classList.contains("grid-deform")) {
        el.classList.add("grid-deform__source");
        return parent.dataset.gridDeformReady === "true" ? null : parent;
      }
      const wrap2 = document.createElement("div");
      wrap2.className = "grid-deform";
      el.classList.forEach((name) => {
        if (name.startsWith("grid-deform") && name !== "grid-deform") {
          wrap2.classList.add(name);
        }
      });
      for (const attr of [...el.attributes]) {
        if (attr.name in DATA_KEYS$1 || attr.name === "data-fit" || attr.name === "data-pointer") {
          wrap2.setAttribute(attr.name, attr.value);
          el.removeAttribute(attr.name);
        }
      }
      el.classList.remove("grid-deform");
      el.classList.add("grid-deform__source");
      parent == null ? void 0 : parent.insertBefore(wrap2, el);
      wrap2.appendChild(el);
      return wrap2;
    }
    return el;
  }
  function findSource$1(root) {
    const explicit = root.querySelector(":scope > .grid-deform__source");
    if (explicit instanceof HTMLElement) return explicit;
    const media = root.querySelector(":scope > img, :scope > video, :scope > canvas, :scope > picture");
    if (media instanceof HTMLElement) {
      media.classList.add("grid-deform__source");
      return media;
    }
    if (root instanceof HTMLImageElement || root instanceof HTMLVideoElement) return root;
    return wrapTextSource(root);
  }
  function wrapTextSource(root) {
    const source = document.createElement("span");
    source.className = "grid-deform__source";
    const nodes = [...root.childNodes];
    let moved = false;
    nodes.forEach((node) => {
      if (node instanceof HTMLElement && node.classList.contains("grid-deform__canvas")) return;
      source.appendChild(node);
      moved = true;
    });
    if (!moved) {
      source.textContent = root.textContent || "";
      root.textContent = "";
    }
    root.insertBefore(source, root.firstChild);
    return source;
  }
  function initGridDeform() {
    const nodes = document.querySelectorAll(".grid-deform");
    if (!nodes.length) return () => {
    };
    if (isFileProtocol()) return () => {
    };
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return () => {
    };
    const mounts = [];
    nodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.dataset.gridDeform === "manual") return;
      const root = resolveRoot$1(node);
      if (!root || root.dataset.gridDeformReady === "true") return;
      const source = findSource$1(root);
      if (!(source instanceof HTMLElement)) return;
      const kind = sourceKind(source);
      if (kind === "video" && isIOSWebKit()) return;
      const options = optionsFromElement$1(root);
      const idleAttr = root.getAttribute("data-grid-deform-idle");
      const destroyWhenIdle = idleAttr !== "keep" && (idleAttr === "destroy" || nodes.length > 4);
      root.classList.add(`grid-deform--${kind}`);
      root.dataset.gridDeformReady = "true";
      let instance = null;
      const unmount = () => {
        if (!instance) return;
        instance.destroy();
        instances$1.delete(root);
        instance = null;
      };
      const mount = () => {
        var _a;
        if (instance) return;
        try {
          instance = new GridDeform(root, source, options);
        } catch {
          (_a = root.querySelector(".grid-deform__canvas")) == null ? void 0 : _a.remove();
          return;
        }
        instances$1.set(root, instance);
        root._gridDeform = instance;
      };
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            mount();
            instance == null ? void 0 : instance.setPaused(false);
            return;
          }
          if (destroyWhenIdle) {
            unmount();
            return;
          }
          instance == null ? void 0 : instance.setPaused(true);
        },
        { threshold: 0.05, rootMargin: "80px" }
      );
      whenTextMarkReady(root).then(() => io.observe(root));
      mounts.push({ unmount, io });
    });
    return () => {
      mounts.forEach(({ unmount, io }) => {
        io.disconnect();
        unmount();
      });
    };
  }
  function whenTextMarkReady(root) {
    if (!root.classList.contains("text-mark") || root.classList.contains("is-mark-done")) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        mo.disconnect();
        window.clearTimeout(timer);
        resolve();
      };
      const mo = new MutationObserver(() => {
        if (root.classList.contains("is-mark-done")) finish();
      });
      mo.observe(root, { attributes: true, attributeFilter: ["class"] });
      const timer = window.setTimeout(finish, 2500);
    });
  }
  function initMenuOverlay() {
    var _a;
    const menuToggles = document.querySelectorAll(".header-1__toggle, .header-2__toggle, .header-3__toggle, .header-4__toggle, .header-5__toggle");
    const menuOverlay = document.querySelector("#menu-overlay-1");
    const menuContent = menuOverlay == null ? void 0 : menuOverlay.querySelector(".menu-overlay-1__content");
    const menuPreviewImg = menuOverlay == null ? void 0 : menuOverlay.querySelector(".menu-overlay-1__preview");
    const previewCol = menuOverlay == null ? void 0 : menuOverlay.querySelector(".menu-overlay-1__preview-col");
    const pageShell = document.querySelector("#smooth-wrapper");
    const linkEls = (menuOverlay == null ? void 0 : menuOverlay.querySelectorAll(".menu-overlay-1__link-a")) ?? [];
    const subLinkEls = (menuOverlay == null ? void 0 : menuOverlay.querySelectorAll(".menu-overlay-1__sub-a")) ?? [];
    const socialEls = (menuOverlay == null ? void 0 : menuOverlay.querySelectorAll(".menu-overlay-1__social-a")) ?? [];
    const riseEls = [...linkEls, ...socialEls];
    const previewEls = [...linkEls, ...subLinkEls];
    const subItems = (menuOverlay == null ? void 0 : menuOverlay.querySelectorAll(".menu-overlay-1__link--has-sub")) ?? [];
    if (!menuToggles.length || !menuOverlay || !menuContent || !menuPreviewImg) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const defaultPreview = ((_a = menuPreviewImg.querySelector("img")) == null ? void 0 : _a.getAttribute("src")) || "assets/imgs/service-card-1/service-01.webp";
    let isOpen = false;
    let isAnimating = false;
    let previewSrc = defaultPreview;
    gsap.set(riseEls, { y: "120%", opacity: 0.25 });
    function isPreviewVisible() {
      return Boolean(previewCol && getComputedStyle(previewCol).display !== "none");
    }
    function getPreviewSource() {
      return menuPreviewImg.querySelector(":scope > img.grid-deform__source") || menuPreviewImg.querySelector(":scope > img");
    }
    function mountPreviewDeform() {
      var _a2;
      if (prefersReducedMotion2 || isFileProtocol() || !isPreviewVisible()) return;
      if (getGridDeform(menuPreviewImg)) return;
      const source = getPreviewSource();
      if (!source) return;
      source.classList.add("grid-deform__source");
      try {
        const fx = new GridDeform(menuPreviewImg, source, {
          fit: "cover",
          pointerMode: "window"
        });
        menuPreviewImg._gridDeform = fx;
      } catch {
        (_a2 = menuPreviewImg.querySelector(".grid-deform__canvas")) == null ? void 0 : _a2.remove();
      }
    }
    function unmountPreviewDeform() {
      var _a2;
      (_a2 = getGridDeform(menuPreviewImg)) == null ? void 0 : _a2.destroy();
    }
    function resetPreviewImage() {
      let img = getPreviewSource();
      if (!img) {
        img = document.createElement("img");
        img.className = "grid-deform__source";
        img.alt = "";
        img.width = 640;
        img.height = 800;
        img.decoding = "async";
        menuPreviewImg.appendChild(img);
      }
      if (img.getAttribute("src") !== defaultPreview) {
        img.src = defaultPreview;
      }
      previewSrc = defaultPreview;
      gsap.set(menuPreviewImg, { scale: 1, rotation: 0 });
    }
    function showPreview(imgSrc) {
      if (!imgSrc || imgSrc === previewSrc) return;
      previewSrc = imgSrc;
      const img = getPreviewSource();
      if (!img) return;
      const apply = () => {
        const fx = getGridDeform(menuPreviewImg);
        if (fx) fx.setSource(img);
        if (prefersReducedMotion2) return;
        gsap.fromTo(
          menuPreviewImg,
          { scale: 1.08, rotation: 6 },
          { scale: 1, rotation: 0, duration: 0.55, ease: "power2.out", overwrite: true }
        );
      };
      if (img.getAttribute("src") === imgSrc && img.complete && img.naturalWidth) {
        apply();
        return;
      }
      img.src = imgSrc;
      if (img.complete && img.naturalWidth) {
        apply();
        return;
      }
      img.addEventListener("load", apply, { once: true });
    }
    function setOpenState(open) {
      isOpen = open;
      menuOverlay.classList.toggle("is-open", open);
      menuOverlay.setAttribute("aria-hidden", String(!open));
      if (open) {
        menuOverlay.removeAttribute("inert");
      } else {
        menuOverlay.setAttribute("inert", "");
      }
      document.body.classList.toggle("is-menu-open", open);
      menuToggles.forEach((toggle) => {
        toggle.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });
      const floatToggle = document.querySelector(".header-1__toggle--float");
      if (floatToggle) {
        const floatVisible = open || floatToggle.classList.contains("is-visible");
        floatToggle.setAttribute("aria-hidden", String(!floatVisible));
        floatToggle.tabIndex = floatVisible ? 0 : -1;
      }
      const smoother2 = window.smoother;
      if (smoother2 == null ? void 0 : smoother2.paused) {
        smoother2.paused(open);
      }
    }
    function setSubOpen(item, open, immediate = false) {
      const trigger = item.querySelector(".menu-overlay-1__link-a");
      const panel = item.querySelector(".menu-overlay-1__sub");
      const links = (panel == null ? void 0 : panel.querySelectorAll(".menu-overlay-1__sub-a")) ?? [];
      const alreadyOpen = item.classList.contains("is-open");
      if (open === alreadyOpen && !immediate) return;
      item.classList.toggle("is-open", open);
      trigger == null ? void 0 : trigger.setAttribute("aria-expanded", String(open));
      if (!panel) return;
      gsap.killTweensOf(panel);
      gsap.killTweensOf(links);
      if (immediate || prefersReducedMotion2) {
        gsap.set(panel, {
          height: open ? "auto" : 0,
          visibility: open ? "visible" : "hidden"
        });
        gsap.set(links, { y: open ? "0%" : "80%", opacity: open ? 1 : 0 });
        if (open) panel.removeAttribute("inert");
        else panel.setAttribute("inert", "");
        return;
      }
      if (open) {
        panel.removeAttribute("inert");
        gsap.set(panel, { visibility: "visible" });
        gsap.set(links, { y: "80%", opacity: 0 });
        gsap.to(panel, {
          height: "auto",
          duration: 0.9,
          ease: "power3.inOut"
        });
        gsap.to(links, {
          y: "0%",
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          delay: 0.16,
          ease: "power3.out"
        });
        return;
      }
      gsap.to(links, {
        y: "-35%",
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: "power2.in"
      });
      gsap.to(panel, {
        height: 0,
        duration: 0.75,
        delay: 0.12,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(panel, { visibility: "hidden" });
          gsap.set(links, { y: "80%", opacity: 0 });
          panel.setAttribute("inert", "");
        }
      });
    }
    function resetSubmenus() {
      subItems.forEach((item) => setSubOpen(item, false, true));
    }
    function openMenu() {
      if (isAnimating || isOpen) return;
      isAnimating = true;
      setOpenState(true);
      mountPreviewDeform();
      if (prefersReducedMotion2) {
        gsap.set(pageShell, { clearProps: "all" });
        gsap.set(menuContent, { clearProps: "transform", opacity: 1 });
        gsap.set(menuOverlay, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
        });
        gsap.set(riseEls, { y: "0%", opacity: 1 });
        isAnimating = false;
        return;
      }
      gsap.to(pageShell, {
        rotation: 10,
        x: 300,
        y: 450,
        scale: 1.5,
        duration: 1.25,
        ease: "power4.inOut"
      });
      gsap.to(menuContent, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.25,
        ease: "power4.inOut"
      });
      gsap.to(riseEls, {
        y: "0%",
        opacity: 1,
        delay: 0.75,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      });
      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)",
        duration: 1.25,
        ease: "power4.inOut",
        onComplete: () => {
          isAnimating = false;
        }
      });
    }
    function closeMenu() {
      var _a2;
      if (isAnimating || !isOpen) return;
      isAnimating = true;
      (_a2 = getGridDeform(menuPreviewImg)) == null ? void 0 : _a2.setPaused(true);
      if (prefersReducedMotion2) {
        gsap.set(pageShell, { clearProps: "all" });
        gsap.set(menuContent, {
          rotation: -15,
          x: -100,
          y: -100,
          scale: 1.5,
          opacity: 0.25
        });
        gsap.set(menuOverlay, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
        });
        gsap.set(riseEls, { y: "120%", opacity: 0.25 });
        unmountPreviewDeform();
        resetPreviewImage();
        resetSubmenus();
        setOpenState(false);
        isAnimating = false;
        return;
      }
      gsap.to(pageShell, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.25,
        ease: "power4.inOut"
      });
      gsap.to(menuContent, {
        rotation: -15,
        x: -100,
        y: -100,
        scale: 1.5,
        opacity: 0.25,
        duration: 1.25,
        ease: "power4.inOut"
      });
      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.set(riseEls, { y: "120%", opacity: 0.25 });
          unmountPreviewDeform();
          resetPreviewImage();
          resetSubmenus();
          setOpenState(false);
          isAnimating = false;
        }
      });
    }
    menuToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        if (!isOpen) openMenu();
        else closeMenu();
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen && !isAnimating) {
        closeMenu();
      }
    });
    menuOverlay.querySelectorAll("a[href]").forEach((anchor) => {
      anchor.addEventListener("click", () => {
        if (isOpen && !isAnimating) closeMenu();
      });
    });
    menuOverlay.addEventListener("click", (event) => {
      const trigger = event.target.closest(".menu-overlay-1__link--has-sub .menu-overlay-1__link-a");
      if (!trigger || !isOpen) return;
      const item = trigger.closest(".menu-overlay-1__link--has-sub");
      if (!item) return;
      const willOpen = !item.classList.contains("is-open");
      if (willOpen) {
        subItems.forEach((other) => {
          if (other !== item) setSubOpen(other, false);
        });
      }
      setSubOpen(item, willOpen);
    });
    previewEls.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        if (!isOpen || isAnimating) return;
        showPreview(link.getAttribute("data-img") || "");
      });
    });
  }
  const SHOW_AT = 200;
  const DIRECTION_DELTA = 10;
  function initBottomNav() {
    const nav = document.querySelector("#bottom-nav-1");
    if (!nav) return;
    let lastY = getPageScrollY2();
    let direction = "down";
    function getPageScrollY2() {
      const smoother3 = window.smoother;
      if (smoother3) return smoother3.scrollTop();
      return window.scrollY || document.documentElement.scrollTop || 0;
    }
    function setVisible(visible) {
      nav.classList.toggle("is-visible", visible);
      nav.setAttribute("aria-hidden", String(!visible));
      if (visible) {
        nav.removeAttribute("inert");
      } else {
        nav.setAttribute("inert", "");
      }
    }
    function sync() {
      const y = getPageScrollY2();
      const delta = y - lastY;
      if (Math.abs(delta) >= DIRECTION_DELTA) {
        direction = delta < 0 ? "up" : "down";
        lastY = y;
      }
      const menuOpen = document.body.classList.contains("is-menu-open");
      setVisible(!menuOpen && y > SHOW_AT && direction === "up");
    }
    setVisible(false);
    sync();
    window.addEventListener("resize", sync);
    const smoother2 = window.smoother;
    if (smoother2) {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: sync,
        onRefresh: sync
      });
    } else {
      window.addEventListener("scroll", sync, { passive: true });
    }
    new MutationObserver(sync).observe(document.body, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }
  function initFadeInUp() {
    const elements = gsap.utils.toArray(".fade-in-up");
    if (!elements.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) {
      gsap.set(elements, { opacity: 1, y: 0, "--fade-y": "0px", clearProps: "transform" });
      return;
    }
    elements.forEach((el) => {
      const keep3d = Boolean(el.querySelector(".box-3d"));
      if (keep3d) {
        gsap.set(el, { opacity: 0, "--fade-y": "40px", clearProps: "transform" });
      } else {
        gsap.set(el, { opacity: 0, y: 40 });
      }
      const delay = Math.max(0, parseFloat(el.getAttribute("data-delay") || "0") || 0);
      ScrollTrigger.create({
        trigger: el,
        // Fire the moment the top of the element crosses into the viewport.
        start: "top bottom",
        once: true,
        onEnter: () => {
          if (keep3d) {
            gsap.to(el, {
              opacity: 1,
              "--fade-y": "0px",
              duration: 1,
              delay,
              ease: "power3.out",
              overwrite: "auto"
            });
            return;
          }
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay,
            ease: "power3.out",
            overwrite: "auto"
          });
        }
      });
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function initFadeInDown() {
    const elements = gsap.utils.toArray(".fade-in-down");
    if (!elements.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) {
      gsap.set(elements, { opacity: 1, y: 0, clearProps: "transform" });
      return;
    }
    gsap.set(elements, { opacity: 0, y: -40 });
    elements.forEach((el) => {
      if (!(el instanceof Element) || el.closest("[hidden]")) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            overwrite: "auto"
          });
        }
      });
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function initFadeInLeft() {
    const elements = gsap.utils.toArray(".fade-in-left");
    if (!elements.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) {
      gsap.set(elements, { opacity: 1, x: 0, clearProps: "transform" });
      return;
    }
    gsap.set(elements, { opacity: 0, x: -40 });
    elements.forEach((el) => {
      const delay = Math.max(0, parseFloat(el.getAttribute("data-delay") || "0") || 0);
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            x: 0,
            duration: 1,
            delay,
            ease: "power3.out",
            overwrite: "auto"
          });
        }
      });
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function initFadeInRight() {
    const elements = gsap.utils.toArray(".fade-in-right");
    if (!elements.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) {
      gsap.set(elements, { opacity: 1, x: 0, clearProps: "transform" });
      return;
    }
    gsap.set(elements, { opacity: 0, x: 40 });
    elements.forEach((el) => {
      const delay = Math.max(0, parseFloat(el.getAttribute("data-delay") || "0") || 0);
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            x: 0,
            duration: 1,
            delay,
            ease: "power3.out",
            overwrite: "auto"
          });
        }
      });
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function initAnimZoomIn() {
    const elements = gsap.utils.toArray(".anim-zoomin");
    if (!elements.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    elements.forEach((el) => {
      var _a, _b;
      if ((_a = el.parentElement) == null ? void 0 : _a.classList.contains("anim-zoomin-wrap")) return;
      const wrap2 = document.createElement("div");
      wrap2.className = "anim-zoomin-wrap";
      (_b = el.parentNode) == null ? void 0 : _b.insertBefore(wrap2, el);
      wrap2.appendChild(el);
      if (prefersReducedMotion2) {
        gsap.set(el, { clearProps: "all" });
        return;
      }
      gsap.from(el, {
        duration: 2,
        autoAlpha: 0,
        scale: 1.2,
        ease: "power2.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: wrap2,
          start: "top 100%",
          once: true
        }
      });
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  const CLIP_OPEN$2 = "inset(0% 0% 0% 0%)";
  const CLIP_LEFT_HIDDEN = "inset(0% 0% 100% 0%)";
  const CLIP_RIGHT_HIDDEN = "inset(100% 0% 0% 0%)";
  const ROOT_CLASS$2 = "split-wipe";
  const PANE_CLASS$1 = "split-wipe__pane";
  function initSplitWipe() {
    const nodes = gsap.utils.toArray(`.${ROOT_CLASS$2}`);
    if (!nodes.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node.closest("[hidden]")) return;
      if (node.dataset.splitWipe === "manual") return;
      const root = ensureSplitWipe(node);
      if (!root) return;
      syncSplitWipeVideos(root);
      if (prefersReducedMotion2) {
        root.classList.add("is-split-wipe-ready", "is-split-wipe-in");
        return;
      }
      setupSplitWipe(root);
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function ensureSplitWipe(node) {
    var _a;
    if (node.querySelector(`:scope > .${PANE_CLASS$1}`)) {
      return node;
    }
    const img = node.matches("img") ? node : node.querySelector("img");
    if (!(img instanceof HTMLImageElement)) return null;
    let wrap2 = node;
    if (node.matches("img")) {
      wrap2 = document.createElement("div");
      wrap2.className = ROOT_CLASS$2;
      node.classList.remove(ROOT_CLASS$2);
      (_a = node.parentNode) == null ? void 0 : _a.insertBefore(wrap2, node);
    }
    const left = document.createElement("span");
    left.className = `${PANE_CLASS$1} ${PANE_CLASS$1}--left`;
    const right = document.createElement("span");
    right.className = `${PANE_CLASS$1} ${PANE_CLASS$1}--right`;
    right.setAttribute("aria-hidden", "true");
    const clone = (
      /** @type {HTMLImageElement} */
      img.cloneNode(true)
    );
    clone.alt = "";
    left.appendChild(img);
    right.appendChild(clone);
    wrap2.append(left, right);
    wrap2.classList.add(ROOT_CLASS$2);
    return wrap2;
  }
  function syncSplitWipeVideos(root) {
    const videos = [...root.querySelectorAll("video")];
    if (videos.length < 2) return;
    const master = videos[0];
    const clone = videos[1];
    const DRIFT_S = 0.08;
    const sync = () => {
      if (Math.abs(clone.currentTime - master.currentTime) > DRIFT_S) {
        clone.currentTime = master.currentTime;
      }
    };
    master.addEventListener("play", () => {
      var _a;
      (_a = clone.play()) == null ? void 0 : _a.catch(() => {
      });
      sync();
    });
    master.addEventListener("pause", () => clone.pause());
    master.addEventListener("seeked", sync);
    master.addEventListener("timeupdate", sync);
  }
  function setupSplitWipe(root) {
    const paneLeft = root.querySelector(`.${PANE_CLASS$1}--left`);
    const paneRight = root.querySelector(`.${PANE_CLASS$1}--right`);
    if (!paneLeft || !paneRight) return;
    gsap.set(paneLeft, { clipPath: CLIP_LEFT_HIDDEN, webkitClipPath: CLIP_LEFT_HIDDEN });
    gsap.set(paneRight, { clipPath: CLIP_RIGHT_HIDDEN, webkitClipPath: CLIP_RIGHT_HIDDEN });
    root.classList.add("is-split-wipe-ready");
    const duration = Math.max(0.2, parseFloat(root.getAttribute("data-duration") || "1.25") || 1.25);
    const delay = Math.max(0, parseFloat(root.getAttribute("data-delay") || "0") || 0);
    const start = root.getAttribute("data-start") || "top 82%";
    gsap.timeline({
      delay,
      defaults: { ease: "power3.inOut", duration },
      scrollTrigger: {
        trigger: root,
        start,
        once: true
      },
      onComplete: () => {
        root.classList.add("is-split-wipe-in");
      }
    }).to(
      paneLeft,
      { clipPath: CLIP_OPEN$2, webkitClipPath: CLIP_OPEN$2 },
      0
    ).to(
      paneRight,
      { clipPath: CLIP_OPEN$2, webkitClipPath: CLIP_OPEN$2 },
      0
    );
  }
  const CLIP_OPEN$1 = "inset(0% 0% 0% 0%)";
  const CLIP_HIDDEN = "inset(0% 0% 100% 0%)";
  const ROOT_CLASS$1 = "split-wipe-2";
  const PANE_CLASS = "split-wipe-2__pane";
  const DEFAULT_STAGGER = 0.1;
  function initSplitWipe2() {
    const nodes = gsap.utils.toArray(`.${ROOT_CLASS$1}`);
    if (!nodes.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node.closest("[hidden]")) return;
      if (node.dataset.splitWipe2 === "manual") return;
      const root = ensureSplitWipe2(node);
      if (!root) return;
      syncSplitWipe2Videos(root);
      if (prefersReducedMotion2) {
        root.classList.add("is-split-wipe-2-ready", "is-split-wipe-2-in");
        return;
      }
      setupSplitWipe2(root);
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function ensureSplitWipe2(node) {
    var _a;
    if (node.querySelector(`:scope > .${PANE_CLASS}`)) {
      return node;
    }
    const img = node.matches("img") ? node : node.querySelector("img");
    if (!(img instanceof HTMLImageElement)) return null;
    let wrap2 = node;
    if (node.matches("img")) {
      wrap2 = document.createElement("div");
      wrap2.className = ROOT_CLASS$1;
      node.classList.remove(ROOT_CLASS$1);
      (_a = node.parentNode) == null ? void 0 : _a.insertBefore(wrap2, node);
    }
    const left = document.createElement("span");
    left.className = `${PANE_CLASS} ${PANE_CLASS}--left`;
    const right = document.createElement("span");
    right.className = `${PANE_CLASS} ${PANE_CLASS}--right`;
    right.setAttribute("aria-hidden", "true");
    const clone = (
      /** @type {HTMLImageElement} */
      img.cloneNode(true)
    );
    clone.alt = "";
    left.appendChild(img);
    right.appendChild(clone);
    wrap2.append(left, right);
    wrap2.classList.add(ROOT_CLASS$1);
    return wrap2;
  }
  function syncSplitWipe2Videos(root) {
    const videos = [...root.querySelectorAll("video")];
    if (videos.length < 2) return;
    const master = videos[0];
    const clone = videos[1];
    const DRIFT_S = 0.08;
    const sync = () => {
      if (Math.abs(clone.currentTime - master.currentTime) > DRIFT_S) {
        clone.currentTime = master.currentTime;
      }
    };
    master.addEventListener("play", () => {
      var _a;
      (_a = clone.play()) == null ? void 0 : _a.catch(() => {
      });
      sync();
    });
    master.addEventListener("pause", () => clone.pause());
    master.addEventListener("seeked", sync);
    master.addEventListener("timeupdate", sync);
  }
  function setupSplitWipe2(root) {
    const paneLeft = root.querySelector(`.${PANE_CLASS}--left`);
    const paneRight = root.querySelector(`.${PANE_CLASS}--right`);
    if (!paneLeft || !paneRight) return;
    gsap.set(paneLeft, { clipPath: CLIP_HIDDEN, webkitClipPath: CLIP_HIDDEN });
    gsap.set(paneRight, { clipPath: CLIP_HIDDEN, webkitClipPath: CLIP_HIDDEN });
    root.classList.add("is-split-wipe-2-ready");
    const duration = Math.max(0.2, parseFloat(root.getAttribute("data-duration") || "1.25") || 1.25);
    const delay = Math.max(0, parseFloat(root.getAttribute("data-delay") || "0") || 0);
    const stagger = Math.max(0, parseFloat(root.getAttribute("data-stagger") || String(DEFAULT_STAGGER)) || DEFAULT_STAGGER);
    const start = root.getAttribute("data-start") || "top 82%";
    gsap.timeline({
      delay,
      defaults: { ease: "power3.inOut", duration },
      scrollTrigger: {
        trigger: root,
        start,
        once: true
      },
      onComplete: () => {
        root.classList.add("is-split-wipe-2-in");
      }
    }).to(
      paneLeft,
      { clipPath: CLIP_OPEN$1, webkitClipPath: CLIP_OPEN$1 },
      0
    ).to(
      paneRight,
      { clipPath: CLIP_OPEN$1, webkitClipPath: CLIP_OPEN$1 },
      stagger
    );
  }
  const CLIP_OPEN = "inset(0% 0% 0% 0%)";
  const CLIP_FROM_TOP = "inset(0% 0% 100% 0%)";
  const CLIP_FROM_BOTTOM = "inset(100% 0% 0% 0%)";
  const ROOT_CLASS = "grid-wipe";
  const GRID_CLASS = "grid-wipe__grid";
  const CELL_CLASS = "grid-wipe__cell";
  const CELL_FROM_TOP = `${CELL_CLASS}--from-top`;
  const CELL_FROM_BOTTOM = `${CELL_CLASS}--from-bottom`;
  const DEFAULT_COLS = 6;
  const DEFAULT_ROWS = 5;
  function initGridWipe() {
    const nodes = gsap.utils.toArray(`.${ROOT_CLASS}`);
    if (!nodes.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node.dataset.gridWipe === "manual") return;
      const root = ensureGridWipe(node);
      if (!root) return;
      if (prefersReducedMotion2) {
        root.classList.add("is-grid-wipe-ready", "is-grid-wipe-in");
        return;
      }
      setupGridWipe(root);
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function ensureGridWipe(node) {
    var _a;
    const source = node.matches("img") ? node : node.querySelector(":scope > img, :scope > video");
    if (!source) return null;
    let wrap2 = node;
    if (node.matches("img")) {
      wrap2 = document.createElement("figure");
      wrap2.className = ROOT_CLASS;
      node.classList.remove(ROOT_CLASS);
      (_a = node.parentNode) == null ? void 0 : _a.insertBefore(wrap2, node);
      wrap2.appendChild(node);
    }
    wrap2.classList.add(ROOT_CLASS);
    const cols = clampInt(wrap2.getAttribute("data-cols"), DEFAULT_COLS, 1, 12);
    const rows = clampInt(wrap2.getAttribute("data-rows"), DEFAULT_ROWS, 1, 12);
    wrap2.style.setProperty("--grid-wipe-cols", String(cols));
    wrap2.style.setProperty("--grid-wipe-rows", String(rows));
    bindSliceImage(wrap2, source);
    let grid = wrap2.querySelector(`:scope > .${GRID_CLASS}`);
    if (!grid) {
      grid = document.createElement("span");
      grid.className = GRID_CLASS;
      grid.setAttribute("aria-hidden", "true");
      wrap2.appendChild(grid);
    }
    const total = cols * rows;
    const needsBuild = grid.childElementCount !== total || !grid.querySelector(`.${CELL_FROM_TOP}`);
    if (needsBuild) {
      grid.replaceChildren();
      for (let i = 0; i < total; i += 1) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cell = document.createElement("span");
        const fromTop = (col + row) % 2 === 0;
        cell.className = `${CELL_CLASS} ${fromTop ? CELL_FROM_TOP : CELL_FROM_BOTTOM}`;
        cell.style.setProperty("--grid-wipe-col", String(col));
        cell.style.setProperty("--grid-wipe-row", String(row));
        grid.appendChild(cell);
      }
    }
    return wrap2;
  }
  function bindSliceImage(wrap2, source) {
    const apply = () => {
      const src = mediaUrl(source);
      if (!src) return;
      wrap2.style.setProperty("--grid-wipe-image", `url(${JSON.stringify(src)})`);
    };
    apply();
    if (source instanceof HTMLImageElement && !source.complete) {
      source.addEventListener("load", apply, { once: true });
    }
  }
  function mediaUrl(source) {
    if (source instanceof HTMLVideoElement) {
      return source.getAttribute("poster") || source.currentSrc || "";
    }
    if (source instanceof HTMLImageElement) {
      return source.currentSrc || source.getAttribute("src") || "";
    }
    return "";
  }
  function setupGridWipe(root) {
    const grid = root.querySelector(`:scope > .${GRID_CLASS}`);
    const cells = grid ? [...grid.children] : [];
    if (!cells.length) return;
    const cols = clampInt(root.getAttribute("data-cols"), DEFAULT_COLS, 1, 12);
    const rows = clampInt(root.getAttribute("data-rows"), DEFAULT_ROWS, 1, 12);
    const duration = Math.max(0.2, parseFloat(root.getAttribute("data-duration") || "1.25") || 1.25);
    const start = root.getAttribute("data-start") || "top 82%";
    const fromTop = cells.filter((cell) => cell.classList.contains(CELL_FROM_TOP));
    const fromBottom = cells.filter((cell) => cell.classList.contains(CELL_FROM_BOTTOM));
    gsap.set(fromTop, { clipPath: CLIP_FROM_TOP, webkitClipPath: CLIP_FROM_TOP });
    gsap.set(fromBottom, { clipPath: CLIP_FROM_BOTTOM, webkitClipPath: CLIP_FROM_BOTTOM });
    root.classList.add("is-grid-wipe-ready");
    gsap.to(cells, {
      clipPath: CLIP_OPEN,
      webkitClipPath: CLIP_OPEN,
      duration,
      ease: "power3.inOut",
      stagger: {
        amount: 0.55,
        from: "center",
        grid: [rows, cols]
      },
      scrollTrigger: {
        trigger: root,
        start,
        once: true
      },
      onComplete: () => {
        var _a;
        root.classList.add("is-grid-wipe-in");
        const video = root.querySelector(":scope > video");
        if (video instanceof HTMLVideoElement && !isIOSWebKit()) {
          prepareInlineVideo(video);
          const playPromise = video.play();
          (_a = playPromise == null ? void 0 : playPromise.catch) == null ? void 0 : _a.call(playPromise, () => {
          });
        }
      }
    });
  }
  function clampInt(raw, fallback, min, max) {
    const value = Number.parseInt(raw ?? "", 10);
    if (!Number.isFinite(value)) return fallback;
    return Math.min(max, Math.max(min, value));
  }
  gsap.registerPlugin(SplitText);
  function initTextMark() {
    var _a;
    const marks = gsap.utils.toArray(".text-mark");
    if (!marks.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const setup = () => {
      const inners = [];
      marks.forEach((mark) => {
        if (!(mark instanceof Element) || mark.closest("[hidden]")) return;
        let lines = Array.from(mark.querySelectorAll(":scope > .text-mark__line"));
        if (!lines.length) {
          const split = new SplitText(mark, {
            type: "lines",
            linesClass: "text-mark__line",
            tag: "span"
          });
          lines = split.lines;
        }
        lines.forEach((line) => {
          line.classList.add("text-mark__line");
          let inner = line.querySelector(":scope > .text-mark__line-inner");
          if (!inner) {
            inner = document.createElement("span");
            inner.className = "text-mark__line-inner";
            while (line.firstChild) {
              inner.appendChild(line.firstChild);
            }
            line.appendChild(inner);
          }
          inners.push(inner);
        });
      });
      if (!inners.length) return;
      if (prefersReducedMotion2) {
        gsap.set(inners, { y: "0%", opacity: 1, clearProps: "transform" });
        marks.forEach((mark) => mark.classList.add("is-mark-done"));
        return;
      }
      gsap.set(inners, { y: "120%", opacity: 0.25 });
      requestAnimationFrame(() => {
        marks.forEach((mark) => {
          if (!(mark instanceof Element) || mark.closest("[hidden]")) return;
          const lineInners = mark.querySelectorAll(".text-mark__line-inner");
          if (!lineInners.length) return;
          try {
            gsap.to(lineInners, {
              y: "0%",
              opacity: 1,
              duration: 1,
              delay: 0.15,
              stagger: 0.1,
              ease: "power3.out",
              overwrite: "auto",
              immediateRender: false,
              scrollTrigger: {
                trigger: mark,
                start: "top bottom",
                once: true,
                toggleActions: "play none none none"
              },
              onComplete: () => {
                mark.classList.add("is-mark-done");
              }
            });
          } catch {
            gsap.set(lineInners, { y: "0%", opacity: 1, clearProps: "transform" });
            mark.classList.add("is-mark-done");
          }
        });
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
    };
    if ((_a = document.fonts) == null ? void 0 : _a.ready) {
      document.fonts.ready.then(setup).catch(setup);
    } else {
      setup();
    }
  }
  gsap.registerPlugin(SplitText);
  function initTextMarkTop() {
    var _a;
    const marks = gsap.utils.toArray(".text-mark-top");
    if (!marks.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const setup = () => {
      const inners = [];
      marks.forEach((mark) => {
        if (!(mark instanceof Element) || mark.closest("[hidden]")) return;
        let lines = Array.from(mark.querySelectorAll(":scope > .text-mark-top__line"));
        if (!lines.length) {
          const split = new SplitText(mark, {
            type: "lines",
            linesClass: "text-mark-top__line",
            tag: "span"
          });
          lines = split.lines;
        }
        lines.forEach((line) => {
          line.classList.add("text-mark-top__line");
          let inner = line.querySelector(":scope > .text-mark-top__line-inner");
          if (!inner) {
            inner = document.createElement("span");
            inner.className = "text-mark-top__line-inner";
            while (line.firstChild) {
              inner.appendChild(line.firstChild);
            }
            line.appendChild(inner);
          }
          inners.push(inner);
        });
      });
      if (!inners.length) return;
      if (prefersReducedMotion2) {
        gsap.set(inners, { y: "0%", opacity: 1, clearProps: "transform" });
        marks.forEach((mark) => mark.classList.add("is-mark-done"));
        return;
      }
      gsap.set(inners, { y: "-120%", opacity: 0.25 });
      requestAnimationFrame(() => {
        marks.forEach((mark) => {
          if (!(mark instanceof Element) || mark.closest("[hidden]")) return;
          const lineInners = mark.querySelectorAll(".text-mark-top__line-inner");
          if (!lineInners.length) return;
          try {
            gsap.to(lineInners, {
              y: "0%",
              opacity: 1,
              duration: 1,
              delay: 0.15,
              stagger: 0.1,
              ease: "power3.out",
              overwrite: "auto",
              immediateRender: false,
              scrollTrigger: {
                trigger: mark,
                start: "top bottom",
                once: true,
                toggleActions: "play none none none"
              },
              onComplete: () => {
                mark.classList.add("is-mark-done");
              }
            });
          } catch {
            gsap.set(lineInners, { y: "0%", opacity: 1, clearProps: "transform" });
            mark.classList.add("is-mark-done");
          }
        });
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
    };
    if ((_a = document.fonts) == null ? void 0 : _a.ready) {
      document.fonts.ready.then(setup).catch(setup);
    } else {
      setup();
    }
  }
  const INTERVAL_MS = 2600;
  const FADE_DURATION = 0.65;
  const HOVER_SCALE = 2.85;
  function initHeroEmbedCycle() {
    const hero = document.querySelector(".hero-1");
    const embeds = document.querySelectorAll("[data-hero-embed]");
    if (!hero || !embeds.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    embeds.forEach((embed, embedIndex) => {
      const stage = embed.querySelector(".hero-1__embed-stage");
      const activeImg = stage == null ? void 0 : stage.querySelector(".hero-1__embed-img");
      if (!stage || !activeImg) return;
      let images = [];
      try {
        images = JSON.parse(embed.getAttribute("data-images") || "[]");
      } catch {
        images = [];
      }
      if (!images.length) {
        const src = activeImg.getAttribute("src");
        if (src) images = [src];
      }
      if (images.length < 2) return;
      images.forEach((src) => {
        const preload = new Image();
        preload.src = src;
      });
      let index = 0;
      let fading = false;
      let kickoffId = 0;
      let intervalId = 0;
      const nextImg = document.createElement("img");
      nextImg.className = "hero-1__embed-img";
      nextImg.alt = "";
      nextImg.decoding = "async";
      nextImg.width = activeImg.width || 0;
      nextImg.height = activeImg.height || 0;
      gsap.set(nextImg, { opacity: 0 });
      stage.appendChild(nextImg);
      const swap = () => {
        if (fading || document.hidden) return;
        fading = true;
        const incoming = index % 2 === 0 ? nextImg : activeImg;
        const outgoing = index % 2 === 0 ? activeImg : nextImg;
        const nextIndex = (index + 1) % images.length;
        incoming.src = images[nextIndex];
        incoming.classList.add("is-active");
        outgoing.classList.remove("is-active");
        gsap.timeline({
          onComplete: () => {
            index = nextIndex;
            fading = false;
          }
        }).to(outgoing, { opacity: 0, duration: FADE_DURATION, ease: "power2.inOut" }, 0).to(incoming, { opacity: 1, duration: FADE_DURATION, ease: "power2.inOut" }, 0);
      };
      const startCycle = () => {
        if (prefersReducedMotion2 || kickoffId || intervalId) return;
        const kickoff = embedIndex * 700 + 400;
        kickoffId = window.setTimeout(() => {
          kickoffId = 0;
          swap();
          intervalId = window.setInterval(swap, INTERVAL_MS);
        }, kickoff);
      };
      const stopCycle = () => {
        window.clearTimeout(kickoffId);
        window.clearInterval(intervalId);
        kickoffId = 0;
        intervalId = 0;
      };
      if (canHover && !prefersReducedMotion2) {
        const line = embed.closest(".text-mark__line");
        const onEnter = () => {
          hero.classList.add("has-embed-hover");
          embed.classList.add("is-hover");
          line == null ? void 0 : line.classList.add("is-embed-hover");
          gsap.to(stage, {
            scale: HOVER_SCALE,
            duration: 0.55,
            ease: "power3.out",
            overwrite: "auto"
          });
        };
        const onLeave = () => {
          embed.classList.remove("is-hover");
          line == null ? void 0 : line.classList.remove("is-embed-hover");
          if (!hero.querySelector("[data-hero-embed].is-hover")) {
            hero.classList.remove("has-embed-hover");
          }
          gsap.to(stage, {
            scale: 1,
            duration: 0.45,
            ease: "power3.inOut",
            overwrite: "auto"
          });
        };
        embed.addEventListener("mouseenter", onEnter);
        embed.addEventListener("mouseleave", onLeave);
        embed.addEventListener("focusin", onEnter);
        embed.addEventListener("focusout", (event) => {
          if (!embed.contains(event.relatedTarget)) onLeave();
        });
      }
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stopCycle();
        else startCycle();
      });
      startCycle();
    });
  }
  const HOLD_S$4 = 3.6;
  const REVEAL_S = 1.35;
  const KEN_BURNS_SCALE = 1.055;
  const REVEALS = [
    {
      from: "inset(0% 100% 0% 0%)",
      to: "inset(0% 0% 0% 0%)",
      origin: "100% 50%"
    },
    {
      from: "inset(100% 0% 0% 0%)",
      to: "inset(0% 0% 0% 0%)",
      origin: "50% 0%"
    },
    {
      from: "inset(0% 0% 0% 100%)",
      to: "inset(0% 0% 0% 0%)",
      origin: "0% 50%"
    }
  ];
  const OPEN_CLIP = "inset(0% 0% 0% 0%)";
  function initHero2Slider() {
    const root = document.querySelector("[data-hero-2-slider]");
    if (!root || root.dataset.hero2Ready) return;
    root.dataset.hero2Ready = "true";
    const slides = [...root.querySelectorAll(".hero-2__slide")];
    const progressBar = root.querySelector("[data-hero-2-progress]");
    if (!slides.length) return;
    slides.forEach((slide) => {
      if (slide instanceof HTMLImageElement && slide.src) {
        const preload = new Image();
        preload.src = slide.src;
      }
    });
    let index = slides.findIndex((slide) => slide.classList.contains("is-active"));
    if (index < 0) index = 0;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2 || slides.length < 2) {
      gsap.set(slides, { opacity: 0, clipPath: OPEN_CLIP, webkitClipPath: OPEN_CLIP, scale: 1 });
      gsap.set(slides[index], { opacity: 1, zIndex: 2 });
      if (progressBar) gsap.set(progressBar, { scaleX: 1 });
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
      return;
    }
    slides.forEach((slide, i) => {
      const isActive = i === index;
      gsap.set(slide, {
        opacity: isActive ? 1 : 0,
        scale: 1,
        zIndex: isActive ? 2 : 1,
        clipPath: OPEN_CLIP,
        webkitClipPath: OPEN_CLIP,
        transformOrigin: "50% 50%",
        force3D: true
      });
      slide.classList.toggle("is-active", isActive);
    });
    let kenBurns = null;
    let progress = null;
    let reveal = null;
    let busy = false;
    let revealPass = 0;
    const stopKenBurns = () => {
      kenBurns == null ? void 0 : kenBurns.kill();
      kenBurns = null;
    };
    const startKenBurns = (slide) => {
      stopKenBurns();
      kenBurns = gsap.fromTo(
        slide,
        { scale: 1 },
        {
          scale: KEN_BURNS_SCALE,
          duration: HOLD_S$4 + 0.4,
          ease: "sine.out",
          overwrite: "auto"
        }
      );
    };
    const playNext = () => {
      if (busy || document.hidden) return;
      busy = true;
      stopKenBurns();
      stopProgress();
      const outgoing = slides[index];
      const nextIndex = (index + 1) % slides.length;
      const incoming = slides[nextIndex];
      const dir = REVEALS[revealPass % REVEALS.length];
      revealPass += 1;
      gsap.set(incoming, {
        opacity: 1,
        zIndex: 3,
        scale: 1.1,
        transformOrigin: dir.origin,
        clipPath: dir.from,
        webkitClipPath: dir.from
      });
      gsap.set(outgoing, { zIndex: 2, transformOrigin: "50% 50%" });
      reveal == null ? void 0 : reveal.kill();
      reveal = gsap.timeline({
        defaults: { duration: REVEAL_S, ease: "expo.inOut" },
        onComplete: () => {
          gsap.set(outgoing, {
            opacity: 0,
            scale: 1,
            zIndex: 1,
            clipPath: OPEN_CLIP,
            webkitClipPath: OPEN_CLIP
          });
          gsap.set(incoming, { zIndex: 2, transformOrigin: "50% 50%" });
          outgoing.classList.remove("is-active");
          incoming.classList.add("is-active");
          index = nextIndex;
          busy = false;
          startKenBurns(incoming);
          startHold();
        }
      });
      reveal.to(
        incoming,
        {
          clipPath: dir.to,
          webkitClipPath: dir.to,
          scale: 1
        },
        0
      ).to(
        outgoing,
        {
          scale: 1.07,
          opacity: 0.55
        },
        0
      );
    };
    const stopProgress = () => {
      progress == null ? void 0 : progress.kill();
      progress = null;
      if (progressBar) gsap.set(progressBar, { scaleX: 0 });
    };
    const startHold = () => {
      if (!progressBar) {
        progress == null ? void 0 : progress.kill();
        progress = gsap.delayedCall(HOLD_S$4, playNext);
        return;
      }
      progress == null ? void 0 : progress.kill();
      progress = gsap.fromTo(
        progressBar,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: HOLD_S$4,
          ease: "none",
          onComplete: playNext
        }
      );
    };
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        progress == null ? void 0 : progress.pause();
        kenBurns == null ? void 0 : kenBurns.pause();
        reveal == null ? void 0 : reveal.pause();
        return;
      }
      reveal == null ? void 0 : reveal.resume();
      kenBurns == null ? void 0 : kenBurns.resume();
      progress == null ? void 0 : progress.resume();
    });
    startKenBurns(slides[index]);
    startHold();
  }
  const SETTINGS = {
    scrollSensitivity: 1200,
    smoothness: 0.05,
    bufferSlides: 3,
    imageShift: 25,
    copyShift: 15,
    titleHold: 0.1,
    /** Scale at slide enter (progress 0). */
    imageZoomStart: 1.05,
    /** Scale at slide exit (progress 2) — zooms while scrolling through the slide. */
    imageZoomEnd: 1.28,
    revealOverlap: 0.5
  };
  function getImageZoom(slideProgress) {
    const t = Math.max(0, Math.min(2, slideProgress)) / 2;
    return SETTINGS.imageZoomStart + t * (SETTINGS.imageZoomEnd - SETTINGS.imageZoomStart);
  }
  function readSlides$2(root) {
    return [...root.querySelectorAll(".showcase-1__source article")].map((el) => {
      var _a, _b, _c, _d, _e;
      return {
        title: ((_a = el.querySelector("h2")) == null ? void 0 : _a.textContent.trim()) || "",
        tag: ((_b = el.querySelector("[data-showcase-tag]")) == null ? void 0 : _b.textContent.trim()) || "",
        description: ((_c = el.querySelector("[data-showcase-desc]")) == null ? void 0 : _c.textContent.trim()) || "",
        link: el.dataset.link || "project-details.html",
        tone: el.dataset.tone || "1",
        imgLeft: ((_d = el.querySelector(".img-left")) == null ? void 0 : _d.getAttribute("src")) || "",
        imgRight: ((_e = el.querySelector(".img-right")) == null ? void 0 : _e.getAttribute("src")) || ""
      };
    });
  }
  function getRevealShape(side, revealAmount) {
    const d = Math.max(0, Math.min(1, revealAmount)) * (100 + SETTINGS.revealOverlap);
    return side === "left" ? `polygon(0% ${100 - d}%, 100% ${100 - d}%, 100% 100%, 0% 100%)` : `polygon(0% 0%, 100% 0%, 100% ${d}%, 0% ${d}%)`;
  }
  function getTitlePosition(slideProgress) {
    const fromCenter = slideProgress - 1;
    const past = Math.abs(fromCenter) - SETTINGS.titleHold;
    if (past <= 0) return 1;
    const t = past / (1 - SETTINGS.titleHold);
    return 1 + Math.sign(fromCenter) * t * t * (3 - 2 * t);
  }
  function motionDurationMs$2() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--motion-duration-instant").trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : 400;
  }
  function initShowcase1() {
    const root = document.querySelector("[data-showcase-1]");
    if (!root || root.dataset.showcase1Ready) return;
    root.dataset.showcase1Ready = "true";
    const stage = root.querySelector(".showcase-1__stage");
    const paginationEl = root.querySelector("[data-showcase-1-pagination]");
    const tensEl = root.querySelector(".showcase-1__pagination-tens");
    const onesEl = root.querySelector(".showcase-1__pagination-ones");
    const totalEl = root.querySelector("[data-showcase-1-total]");
    const slides = readSlides$2(root);
    if (!stage || !slides.length) return;
    const totalLabel = String(slides.length).padStart(2, "0");
    if (totalEl) {
      totalEl.textContent = totalLabel;
    }
    const columns = {
      left: {
        el: (
          /** @type {HTMLElement} */
          root.querySelector('[data-showcase-1-column="left"]')
        ),
        visibleSlides: /* @__PURE__ */ new Map()
      },
      right: {
        el: (
          /** @type {HTMLElement} */
          root.querySelector('[data-showcase-1-column="right"]')
        ),
        visibleSlides: /* @__PURE__ */ new Map()
      }
    };
    if (!columns.left.el || !columns.right.el) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const Odometer = window.Odometer;
    const odometerDuration = motionDurationMs$2();
    const wheels = { tens: null, ones: null };
    if (!prefersReducedMotion2 && Odometer && tensEl && onesEl) {
      wheels.tens = new Odometer({
        el: tensEl,
        value: 0,
        format: "d",
        duration: odometerDuration
      }) || tensEl.odometer;
      wheels.ones = new Odometer({
        el: onesEl,
        value: 1,
        format: "d",
        duration: odometerDuration
      }) || onesEl.odometer;
    }
    let lastCurrent = 1;
    const createSlide = (side, index) => {
      const slideIndex = (index % slides.length + slides.length) % slides.length;
      const data = slides[slideIndex];
      const imgSrc = side === "left" ? data.imgLeft : data.imgRight;
      const el = document.createElement("div");
      el.className = "showcase-1__slide";
      el.innerHTML = `
            <img class="showcase-1__img" src="${imgSrc}" alt="" width="1920" height="1840" decoding="async">
            <div class="showcase-1__overlay" aria-hidden="true"></div>
            <div class="showcase-1__content showcase-1__content--${data.tone}">
                <p class="showcase-1__tag">${data.tag}</p>
                <p class="showcase-1__title">
                    <a class="showcase-1__title-link" href="${data.link}">${data.title}</a>
                </p>
                <p class="showcase-1__desc">${data.description}</p>
            </div>
        `;
      columns[side].el.appendChild(el);
      columns[side].visibleSlides.set(index, el);
    };
    const setCurrent = (current) => {
      if (current === lastCurrent) return;
      lastCurrent = current;
      const padded = String(current).padStart(2, "0");
      if (paginationEl) {
        paginationEl.setAttribute("aria-label", `${padded}/${totalLabel}`);
      }
      if (wheels.tens && wheels.ones) {
        wheels.tens.update(Number(padded[0]));
        wheels.ones.update(Number(padded[1]));
        return;
      }
      if (tensEl) tensEl.textContent = padded[0];
      if (onesEl) onesEl.textContent = padded[1];
    };
    const setPagination = (scrollPos) => {
      const idx = ((Math.round(scrollPos) - 1) % slides.length + slides.length) % slides.length;
      setCurrent(idx + 1);
    };
    const updateSlider = (scrollPosition2) => {
      const first = Math.floor(scrollPosition2) - SETTINGS.bufferSlides;
      const last = Math.floor(scrollPosition2) + SETTINGS.bufferSlides + 1;
      for (
        const side of
        /** @type {const} */
        ["left", "right"]
      ) {
        const { visibleSlides } = columns[side];
        const driftDirection = side === "left" ? 1 : -1;
        for (let i = first; i <= last; i += 1) {
          if (!visibleSlides.has(i)) createSlide(side, i);
        }
        for (const [index, el] of visibleSlides) {
          if (index < first || index > last) {
            el.remove();
            visibleSlides.delete(index);
            continue;
          }
          el.style.zIndex = String(index - first + 1);
          const revealAmount = scrollPosition2 - index;
          const slideProgress = Math.max(0, Math.min(2, revealAmount));
          el.style.clipPath = getRevealShape(side, revealAmount);
          const image = el.querySelector(".showcase-1__img");
          if (image instanceof HTMLElement) {
            const imageDrift = (1 - slideProgress) * SETTINGS.imageShift * driftDirection;
            const imageZoom = getImageZoom(slideProgress);
            image.style.transform = `translateY(${imageDrift}%) scale(${imageZoom})`;
          }
          const content = el.querySelector(".showcase-1__content");
          if (content instanceof HTMLElement) {
            const titleDrift = (1 - getTitlePosition(slideProgress)) * SETTINGS.copyShift * driftDirection;
            content.style.transform = `translateY(${titleDrift}%)`;
          }
        }
      }
      setPagination(scrollPosition2);
    };
    if (prefersReducedMotion2 || slides.length < 2) {
      createSlide("left", 0);
      createSlide("right", 0);
      for (
        const side of
        /** @type {const} */
        ["left", "right"]
      ) {
        const el = columns[side].visibleSlides.get(0);
        if (!el) continue;
        el.style.clipPath = getRevealShape(side, 1);
        const image = el.querySelector(".showcase-1__img");
        if (image instanceof HTMLElement) {
          image.style.transform = `translateY(0%) scale(${SETTINGS.imageZoomEnd})`;
        }
      }
      setPagination(1);
      return;
    }
    let scrollPosition = 1;
    let scrollTarget = 1;
    let lastTouchY = 0;
    let rafId = null;
    const onWheel = (e) => {
      e.preventDefault();
      scrollTarget += e.deltaY / SETTINGS.scrollSensitivity;
    };
    const onTouchStart = (e) => {
      if (!e.touches[0]) return;
      lastTouchY = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (!e.touches[0]) return;
      e.preventDefault();
      scrollTarget += (lastTouchY - e.touches[0].clientY) * 8 / SETTINGS.scrollSensitivity;
      lastTouchY = e.touches[0].clientY;
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchmove", onTouchMove, { passive: false });
    const tick = () => {
      scrollPosition += (scrollTarget - scrollPosition) * SETTINGS.smoothness;
      updateSlider(scrollPosition);
      rafId = requestAnimationFrame(tick);
    };
    tick();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (rafId != null) cancelAnimationFrame(rafId);
        rafId = null;
        return;
      }
      if (rafId == null) tick();
    });
  }
  const v = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.); }`;
  const p = `precision highp float;`;
  const s = `precision mediump sampler2D;`;
  const shaders = {
    splat: [
      v,
      `${p} ${s}
    uniform sampler2D uTarget; uniform float aspectRatio,radius; uniform vec3 color; uniform vec2 point; varying vec2 vUv;
    void main(){ vec2 p=vUv-point; p.x*=aspectRatio; gl_FragColor=vec4(texture2D(uTarget,vUv).xyz+exp(-dot(p,p)/radius)*color,1.); }`
    ],
    advection: [
      v,
      `${p} ${s}
    uniform sampler2D uVelocity,uSource; uniform vec2 texelSize; uniform float dt,dissipation; varying vec2 vUv;
    void main(){ gl_FragColor=vec4(dissipation*texture2D(uSource,vUv-dt*texture2D(uVelocity,vUv).xy*texelSize).rgb,1.); }`
    ],
    divergence: [
      v,
      `${p} ${s}
    uniform sampler2D uVelocity; uniform vec2 texelSize; varying vec2 vUv;
    vec2 vel(vec2 uv){ vec2 e=vec2(1.); if(uv.x<0.){uv.x=0.;e.x=-1.;} if(uv.x>1.){uv.x=1.;e.x=-1.;} if(uv.y<0.){uv.y=0.;e.y=-1.;} if(uv.y>1.){uv.y=1.;e.y=-1.;} return e*texture2D(uVelocity,uv).xy; }
    void main(){ vec2 L=vUv-vec2(texelSize.x,0.),R=vUv+vec2(texelSize.x,0.),T=vUv+vec2(0.,texelSize.y),B=vUv-vec2(0.,texelSize.y); gl_FragColor=vec4(.5*(vel(R).x-vel(L).x+vel(T).y-vel(B).y),0.,0.,1.); }`
    ],
    curl: [
      v,
      `${p} ${s}
    uniform sampler2D uVelocity; uniform vec2 texelSize; varying vec2 vUv;
    void main(){ vec2 L=vUv-vec2(texelSize.x,0.),R=vUv+vec2(texelSize.x,0.),T=vUv+vec2(0.,texelSize.y),B=vUv-vec2(0.,texelSize.y); gl_FragColor=vec4(texture2D(uVelocity,R).y-texture2D(uVelocity,L).y-texture2D(uVelocity,T).x+texture2D(uVelocity,B).x,0.,0.,1.); }`
    ],
    vorticity: [
      v,
      `${p} ${s}
    uniform sampler2D uVelocity,uCurl; uniform vec2 texelSize; uniform float curlStrength,dt; varying vec2 vUv;
    void main(){ vec2 L=vUv-vec2(texelSize.x,0.),R=vUv+vec2(texelSize.x,0.),T=vUv+vec2(0.,texelSize.y),B=vUv-vec2(0.,texelSize.y); vec2 f=normalize(vec2(abs(texture2D(uCurl,T).x)-abs(texture2D(uCurl,B).x),abs(texture2D(uCurl,R).x)-abs(texture2D(uCurl,L).x))+.0001)*curlStrength*texture2D(uCurl,vUv).x; gl_FragColor=vec4(texture2D(uVelocity,vUv).xy+f*dt,0.,1.); }`
    ],
    pressure: [
      v,
      `${p} ${s}
    uniform sampler2D uPressure,uDivergence; uniform vec2 texelSize; varying vec2 vUv;
    void main(){ vec2 L=clamp(vUv-vec2(texelSize.x,0.),0.,1.),R=clamp(vUv+vec2(texelSize.x,0.),0.,1.),T=clamp(vUv+vec2(0.,texelSize.y),0.,1.),B=clamp(vUv-vec2(0.,texelSize.y),0.,1.); gl_FragColor=vec4((texture2D(uPressure,L).x+texture2D(uPressure,R).x+texture2D(uPressure,T).x+texture2D(uPressure,B).x-texture2D(uDivergence,vUv).x)*.25,0.,0.,1.); }`
    ],
    gradientSubtract: [
      v,
      `${p} ${s}
    uniform sampler2D uPressure,uVelocity; uniform vec2 texelSize; varying vec2 vUv;
    void main(){ float pL=texture2D(uPressure,clamp(vUv-vec2(texelSize.x,0.),0.,1.)).x,pR=texture2D(uPressure,clamp(vUv+vec2(texelSize.x,0.),0.,1.)).x,pT=texture2D(uPressure,clamp(vUv+vec2(0.,texelSize.y),0.,1.)).x,pB=texture2D(uPressure,clamp(vUv-vec2(0.,texelSize.y),0.,1.)).x; gl_FragColor=vec4(texture2D(uVelocity,vUv).xy-vec2(pR-pL,pT-pB),0.,1.); }`
    ],
    clear: [
      v,
      `${p} ${s}
    uniform sampler2D uTexture; uniform float value; varying vec2 vUv;
    void main(){ gl_FragColor=value*texture2D(uTexture,vUv); }`
    ],
    display: [
      v,
      `${p}
    uniform sampler2D uTexture; uniform float threshold,edgeSoftness; uniform vec3 inkColor; varying vec2 vUv;
    void main(){ float d=clamp(length(texture2D(uTexture,vUv).rgb),0.,1.); float a=edgeSoftness>0.?smoothstep(threshold-edgeSoftness*.5,threshold+edgeSoftness*.5,d):step(threshold,d); gl_FragColor=vec4(inkColor,a); }`
    ]
  };
  class FluidSimulation {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {object} config
     * @param {HTMLElement} [container]
     */
    constructor(canvas, config, container) {
      this.canvas = canvas;
      this.config = config;
      this.container = container || canvas.parentElement || document.body;
      this._running = true;
      this._raf = 0;
      this._setupRenderer(canvas);
      this._setupScene();
      this._setupTargets();
      this._setupMaterials();
      this._setupInput();
      this._setupResize();
      this._loop();
    }
    destroy() {
      var _a, _b, _c;
      this._running = false;
      cancelAnimationFrame(this._raf);
      (_a = this._ro) == null ? void 0 : _a.disconnect();
      (_b = this._removeInput) == null ? void 0 : _b.call(this);
      (_c = this.renderer) == null ? void 0 : _c.dispose();
    }
    setPaused(paused) {
      this._paused = Boolean(paused);
    }
    _measure() {
      const rect = this.container.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      return { w, h, rect };
    }
    _setupRenderer(canvas) {
      this.renderer = new THREE__namespace.WebGLRenderer({ canvas, alpha: true, antialias: false });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.dpr = this.renderer.getPixelRatio();
      const { w, h } = this._measure();
      this.renderer.setSize(w, h, false);
      this.width = w * this.dpr;
      this.height = h * this.dpr;
    }
    _setupScene() {
      this.scene = new THREE__namespace.Scene();
      this.camera = new THREE__namespace.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      this.quad = new THREE__namespace.Mesh(new THREE__namespace.PlaneGeometry(2, 2));
      this.scene.add(this.quad);
    }
    _setupTargets() {
      const { simResolution: simRes, dyeResolution: dyeRes } = this.config;
      const aspect = this.width / this.height;
      const options = { type: THREE__namespace.HalfFloatType, depthBuffer: false };
      const single = (w, h) => new THREE__namespace.WebGLRenderTarget(w, h, options);
      const double = (w, h) => ({
        read: single(w, h),
        write: single(w, h),
        swap() {
          [this.read, this.write] = [this.write, this.read];
        }
      });
      this._disposeTargets();
      this.simSize = { w: simRes, h: Math.max(1, Math.round(simRes / aspect)) };
      this.dyeSize = { w: dyeRes, h: Math.max(1, Math.round(dyeRes / aspect)) };
      this.velocity = double(this.simSize.w, this.simSize.h);
      this.dye = double(this.dyeSize.w, this.dyeSize.h);
      this.divergence = single(this.simSize.w, this.simSize.h);
      this.curl = single(this.simSize.w, this.simSize.h);
      this.pressure = double(this.simSize.w, this.simSize.h);
    }
    _disposeTargets() {
      const disposeRT = (rt) => {
        var _a;
        return (_a = rt == null ? void 0 : rt.dispose) == null ? void 0 : _a.call(rt);
      };
      const disposePair = (pair) => {
        disposeRT(pair == null ? void 0 : pair.read);
        disposeRT(pair == null ? void 0 : pair.write);
      };
      disposePair(this.velocity);
      disposePair(this.dye);
      disposePair(this.pressure);
      disposeRT(this.divergence);
      disposeRT(this.curl);
    }
    _setupMaterials() {
      const make = ([vert, frag], uniforms) => new THREE__namespace.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false
      });
      const tex = () => ({ value: null });
      const num = (v2 = 0) => ({ value: v2 });
      const vec2 = () => ({ value: new THREE__namespace.Vector2() });
      this.material = {
        splat: make(shaders.splat, {
          uTarget: tex(),
          aspectRatio: num(),
          radius: num(),
          color: { value: new THREE__namespace.Vector3() },
          point: { value: new THREE__namespace.Vector2() }
        }),
        advection: make(shaders.advection, {
          uVelocity: tex(),
          uSource: tex(),
          texelSize: vec2(),
          dt: num(),
          dissipation: num()
        }),
        divergence: make(shaders.divergence, {
          uVelocity: tex(),
          texelSize: vec2()
        }),
        curl: make(shaders.curl, { uVelocity: tex(), texelSize: vec2() }),
        vorticity: make(shaders.vorticity, {
          uVelocity: tex(),
          uCurl: tex(),
          texelSize: vec2(),
          curlStrength: num(),
          dt: num()
        }),
        pressure: make(shaders.pressure, {
          uPressure: tex(),
          uDivergence: tex(),
          texelSize: vec2()
        }),
        gradientSubtract: make(shaders.gradientSubtract, {
          uPressure: tex(),
          uVelocity: tex(),
          texelSize: vec2()
        }),
        clear: make(shaders.clear, { uTexture: tex(), value: num() }),
        display: make(shaders.display, {
          uTexture: tex(),
          threshold: num(),
          edgeSoftness: num(),
          inkColor: { value: new THREE__namespace.Color() }
        })
      };
    }
    _setupInput() {
      this.mouse = { x: 0, y: 0, velocityX: 0, velocityY: 0, moved: false };
      this._paused = false;
      const onMove = (clientX, clientY) => {
        if (this._paused) return;
        const { rect } = this._measure();
        const localX = clientX - rect.left;
        const localY = clientY - rect.top;
        if (localX < 0 || localY < 0 || localX > rect.width || localY > rect.height) {
          return;
        }
        const x = localX * this.dpr;
        const y = localY * this.dpr;
        this.mouse.velocityX = (x - this.mouse.x) * this.config.forceStrength;
        this.mouse.velocityY = (y - this.mouse.y) * this.config.forceStrength;
        this.mouse.x = x;
        this.mouse.y = y;
        this.mouse.moved = true;
      };
      const onMouseMove = (e) => onMove(e.clientX, e.clientY);
      const onTouchMove = (e) => {
        var _a;
        if (!((_a = e.touches) == null ? void 0 : _a[0])) return;
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      this._removeInput = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchmove", onTouchMove);
      };
    }
    _setupResize() {
      let resizeTimer = 0;
      const resize = () => {
        const { w, h } = this._measure();
        this.renderer.setSize(w, h, false);
        this.width = w * this.dpr;
        this.height = h * this.dpr;
        this._setupTargets();
      };
      this._ro = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resize, 80);
      });
      this._ro.observe(this.container);
    }
    _pass(material, target) {
      this.quad.material = material;
      this.renderer.setRenderTarget(target ?? null);
      this.renderer.render(this.scene, this.camera);
    }
    _set(material, values) {
      Object.entries(values).forEach(([key, val]) => {
        material.uniforms[key].value = val;
      });
      return material;
    }
    _splat(x, y, velocityX, velocityY) {
      const { material: m, velocity: vel, dye, width, height, config: c } = this;
      this._set(m.splat, {
        aspectRatio: width / height,
        point: new THREE__namespace.Vector2(x / width, 1 - y / height),
        radius: c.splatRadius / 100
      });
      this._set(m.splat, {
        uTarget: vel.read.texture,
        color: new THREE__namespace.Vector3(velocityX, -velocityY, 0)
      });
      this._pass(m.splat, vel.write);
      vel.swap();
      this._set(m.splat, {
        uTarget: dye.read.texture,
        color: new THREE__namespace.Vector3(3, 3, 3)
      });
      this._pass(m.splat, dye.write);
      dye.swap();
    }
    _simulate(dt) {
      const {
        material: m,
        velocity: vel,
        dye,
        divergence: div,
        curl,
        pressure: pres,
        simSize,
        dyeSize,
        config: c
      } = this;
      const simTexel = new THREE__namespace.Vector2(1 / simSize.w, 1 / simSize.h);
      this._pass(this._set(m.curl, { uVelocity: vel.read.texture, texelSize: simTexel }), curl);
      this._pass(
        this._set(m.vorticity, {
          uVelocity: vel.read.texture,
          uCurl: curl.texture,
          texelSize: simTexel,
          curlStrength: c.curl,
          dt
        }),
        vel.write
      );
      vel.swap();
      this._pass(
        this._set(m.divergence, {
          uVelocity: vel.read.texture,
          texelSize: simTexel
        }),
        div
      );
      this._pass(
        this._set(m.clear, {
          uTexture: pres.read.texture,
          value: c.pressureDecay
        }),
        pres.write
      );
      pres.swap();
      this._set(m.pressure, { uDivergence: div.texture, texelSize: simTexel });
      for (let i = 0; i < c.pressureIterations; i += 1) {
        m.pressure.uniforms.uPressure.value = pres.read.texture;
        this._pass(m.pressure, pres.write);
        pres.swap();
      }
      this._pass(
        this._set(m.gradientSubtract, {
          uPressure: pres.read.texture,
          uVelocity: vel.read.texture,
          texelSize: simTexel
        }),
        vel.write
      );
      vel.swap();
      this._set(m.advection, {
        uVelocity: vel.read.texture,
        uSource: vel.read.texture,
        texelSize: simTexel,
        dt,
        dissipation: c.velocityDissipation
      });
      this._pass(m.advection, vel.write);
      vel.swap();
      this._set(m.advection, {
        uSource: dye.read.texture,
        texelSize: new THREE__namespace.Vector2(1 / dyeSize.w, 1 / dyeSize.h),
        dissipation: c.dyeDissipation
      });
      this._pass(m.advection, dye.write);
      dye.swap();
    }
    _render() {
      this._pass(
        this._set(this.material.display, {
          uTexture: this.dye.read.texture,
          threshold: this.config.threshold,
          edgeSoftness: this.config.edgeSoftness,
          inkColor: this.config.inkColor
        }),
        null
      );
    }
    _loop() {
      let lastTime = Date.now();
      const tick = () => {
        if (!this._running) return;
        this._raf = requestAnimationFrame(tick);
        if (this._paused) return;
        const dt = Math.min((Date.now() - lastTime) / 1e3, 0.016);
        lastTime = Date.now();
        if (this.mouse.moved) {
          this._splat(
            this.mouse.x,
            this.mouse.y,
            this.mouse.velocityX,
            this.mouse.velocityY
          );
          this.mouse.moved = false;
        }
        this._simulate(dt);
        this._render();
      };
      tick();
    }
  }
  function initHeroFluid() {
    const hero = document.querySelector(".hero-1");
    const canvas = hero == null ? void 0 : hero.querySelector("canvas#fluid, .hero-1__fluid");
    if (!hero || !canvas) return null;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) {
      canvas.hidden = true;
      return null;
    }
    const isNarrow = window.matchMedia("(max-width: 575px)").matches;
    const dyeResolution = isNarrow ? 512 : 1024;
    const simResolution = isNarrow ? 128 : 256;
    const config = {
      simResolution,
      dyeResolution,
      curl: 50,
      pressureIterations: 40,
      velocityDissipation: 0.95,
      dyeDissipation: 0.95,
      splatRadius: 0.3,
      forceStrength: 8.5,
      pressureDecay: 0.75,
      threshold: 1,
      edgeSoftness: 0,
      inkColor: new THREE__namespace.Color(1, 1, 1)
    };
    let sim;
    try {
      sim = new FluidSimulation(canvas, config, hero);
    } catch {
      canvas.hidden = true;
      return null;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        sim.setPaused(!entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    io.observe(hero);
    return () => {
      io.disconnect();
      sim.destroy();
    };
  }
  const vertexShader = (
    /* glsl */
    `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`
  );
  const fragmentShader = (
    /* glsl */
    `
uniform sampler2D uTexture;
uniform sampler2D uTextureB;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform vec2 uTextureSizeB;
uniform float uMix;
uniform vec2 uMouse;
uniform float uParallaxStrength;
uniform float uDistortionMultiplier;
uniform float uGlassStrength;
uniform float uStripesFrequency;
uniform float uGlassSmoothness;
uniform float uEdgePadding;

varying vec2 vUv;

vec2 getCoverUV(vec2 uv, vec2 textureSize) {
    if (textureSize.x < 1.0 || textureSize.y < 1.0) return uv;

    vec2 s = uResolution / textureSize;
    float scale = max(s.x, s.y);
    vec2 scaledSize = textureSize * scale;
    vec2 offset = (uResolution - scaledSize) * 0.5;

    return (uv * uResolution - offset) / scaledSize;
}

float displacement(float x, float numStripes, float strength) {
    float modulus = 1.0 / numStripes;
    return mod(x, modulus) * strength;
}

float fractalGlass(float x) {
    float d = 0.0;
    for (int i = -5; i <= 5; i++) {
        d += displacement(
            x + float(i) * uGlassSmoothness,
            uStripesFrequency,
            uGlassStrength
        );
    }
    return x + d / 11.0;
}

float smoothEdge(float x, float padding) {
    if (x < padding) {
        return smoothstep(0.0, padding, x);
    }
    if (x > 1.0 - padding) {
        return smoothstep(1.0, 1.0 - padding, x);
    }
    return 1.0;
}

void main() {
    vec2 uv = vUv;
    float originalX = uv.x;
    float edgeFactor = smoothEdge(originalX, uEdgePadding);
    float distortedX = fractalGlass(originalX);

    uv.x = mix(originalX, distortedX, edgeFactor);

    float distortionFactor = uv.x - originalX;
    float parallaxDirection = -sign(0.5 - uMouse.x);

    vec2 parallaxOffset = vec2(
        parallaxDirection * abs(uMouse.x - 0.5) * uParallaxStrength
            * (1.0 + abs(distortionFactor) * uDistortionMultiplier),
        0.0
    );

    uv += parallaxOffset * edgeFactor;

    vec2 coverA = clamp(getCoverUV(uv, uTextureSize), 0.0, 1.0);
    vec2 coverB = clamp(getCoverUV(uv, uTextureSizeB), 0.0, 1.0);
    vec4 colorA = texture2D(uTexture, coverA);
    vec4 colorB = texture2D(uTextureB, coverB);
    gl_FragColor = mix(colorA, colorB, clamp(uMix, 0.0, 1.0));
}
`
  );
  const GLASS_TEXTURE_DEFAULTS = {
    lerpFactor: 0.035,
    parallaxStrength: 0.1,
    distortionMultiplier: 10,
    glassStrength: 2,
    glassSmoothness: 1e-4,
    stripesFrequency: 35,
    edgePadding: 0.1,
    /** `local` = pointer vs container; `window` = pointer vs viewport (hero). */
    pointerMode: "local"
  };
  class GlassTexture {
    /**
     * @param {HTMLElement} container
     * @param {HTMLImageElement} source
     * @param {Partial<typeof GLASS_TEXTURE_DEFAULTS>} [options]
     */
    constructor(container, source, options = {}) {
      this.container = container;
      this.source = source;
      this.config = { ...GLASS_TEXTURE_DEFAULTS, ...options };
      this._running = true;
      this._paused = false;
      this._disposed = false;
      this._raf = 0;
      this._fading = false;
      this._readyResolvers = [];
      this.mouse = { x: 0.5, y: 0.5 };
      this.targetMouse = { x: 0.5, y: 0.5 };
      this._setupCanvas();
      this._setupRenderer();
      this._setupScene();
      this._setupResize();
      this._setupInput();
      this._loadTexture();
      this._loop();
    }
    setPaused(paused) {
      this._paused = Boolean(paused);
    }
    destroy() {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      if (this._disposed) return;
      this._disposed = true;
      this._running = false;
      cancelAnimationFrame(this._raf);
      (_a = this._ro) == null ? void 0 : _a.disconnect();
      (_b = this._removeInput) == null ? void 0 : _b.call(this);
      (_e = window.gsap) == null ? void 0 : _e.killTweensOf((_d = (_c = this.material) == null ? void 0 : _c.uniforms) == null ? void 0 : _d.uMix);
      (_f = this.material) == null ? void 0 : _f.dispose();
      (_g = this.geometry) == null ? void 0 : _g.dispose();
      (_h = this.texture) == null ? void 0 : _h.dispose();
      (_i = this.textureB) == null ? void 0 : _i.dispose();
      (_j = this.renderer) == null ? void 0 : _j.dispose();
      (_k = this.canvas) == null ? void 0 : _k.remove();
      this.container.classList.remove("is-ready");
      this.container.removeAttribute("data-glass-ready");
      delete this.container._glassTexture;
    }
    _setupCanvas() {
      const canvas = document.createElement("canvas");
      canvas.className = "glass-texture__canvas";
      canvas.setAttribute("aria-hidden", "true");
      this.container.appendChild(canvas);
      this.canvas = canvas;
    }
    _measure() {
      const rect = this.container.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      return { w, h, rect };
    }
    _setupRenderer() {
      this.renderer = new THREE__namespace.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.outputColorSpace = THREE__namespace.SRGBColorSpace;
      const { w, h } = this._measure();
      this.renderer.setSize(w, h, false);
    }
    _setupScene() {
      this.scene = new THREE__namespace.Scene();
      this.camera = new THREE__namespace.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      this.geometry = new THREE__namespace.PlaneGeometry(2, 2);
      this.material = new THREE__namespace.ShaderMaterial({
        uniforms: {
          uTexture: { value: null },
          uTextureB: { value: null },
          uResolution: { value: new THREE__namespace.Vector2() },
          uTextureSize: { value: new THREE__namespace.Vector2(1, 1) },
          uTextureSizeB: { value: new THREE__namespace.Vector2(1, 1) },
          uMix: { value: 0 },
          uMouse: { value: new THREE__namespace.Vector2(0.5, 0.5) },
          uParallaxStrength: { value: this.config.parallaxStrength },
          uDistortionMultiplier: { value: this.config.distortionMultiplier },
          uGlassStrength: { value: this.config.glassStrength },
          uStripesFrequency: { value: this.config.stripesFrequency },
          uGlassSmoothness: { value: this.config.glassSmoothness },
          uEdgePadding: { value: this.config.edgePadding }
        },
        vertexShader,
        fragmentShader
      });
      this.mesh = new THREE__namespace.Mesh(this.geometry, this.material);
      this.scene.add(this.mesh);
      this._syncResolution();
    }
    _syncResolution() {
      const { w, h } = this._measure();
      this.material.uniforms.uResolution.value.set(w, h);
    }
    _setupResize() {
      let resizeTimer = 0;
      const resize = () => {
        if (this._disposed) return;
        const { w, h } = this._measure();
        this.renderer.setSize(w, h, false);
        this._syncResolution();
      };
      this._ro = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resize, 80);
      });
      this._ro.observe(this.container);
    }
    _setPointer(clientX, clientY) {
      if (this.config.pointerMode === "window") {
        this.targetMouse.x = clientX / Math.max(1, window.innerWidth);
        this.targetMouse.y = 1 - clientY / Math.max(1, window.innerHeight);
        return;
      }
      const rect = this.container.getBoundingClientRect();
      this.targetMouse.x = rect.width ? (clientX - rect.left) / rect.width : 0.5;
      this.targetMouse.y = rect.height ? 1 - (clientY - rect.top) / rect.height : 0.5;
      this.targetMouse.x = Math.min(1, Math.max(0, this.targetMouse.x));
      this.targetMouse.y = Math.min(1, Math.max(0, this.targetMouse.y));
    }
    _setupInput() {
      const onMouseMove = (event) => this._setPointer(event.clientX, event.clientY);
      const onTouchMove = (event) => {
        const touch = event.touches[0];
        if (touch) this._setPointer(touch.clientX, touch.clientY);
      };
      const onLeave = () => {
        this.targetMouse.x = 0.5;
        this.targetMouse.y = 0.5;
      };
      const pointerTarget = this.config.pointerMode === "window" ? window : this.container;
      pointerTarget.addEventListener("mousemove", onMouseMove, { passive: true });
      pointerTarget.addEventListener("touchmove", onTouchMove, { passive: true });
      if (this.config.pointerMode === "local") {
        this.container.addEventListener("mouseleave", onLeave);
      }
      this._removeInput = () => {
        pointerTarget.removeEventListener("mousemove", onMouseMove);
        pointerTarget.removeEventListener("touchmove", onTouchMove);
        this.container.removeEventListener("mouseleave", onLeave);
      };
    }
    /**
     * @param {THREE.Texture} texture
     * @returns {THREE.Texture}
     */
    _configureTexture(texture) {
      texture.colorSpace = THREE__namespace.SRGBColorSpace;
      texture.minFilter = THREE__namespace.LinearFilter;
      texture.magFilter = THREE__namespace.LinearFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
      return texture;
    }
    /**
     * @param {HTMLImageElement} img
     * @returns {THREE.Texture | null}
     */
    _makeTexture(img) {
      if (!(img == null ? void 0 : img.naturalWidth)) return null;
      return this._configureTexture(new THREE__namespace.Texture(img));
    }
    /**
     * @param {HTMLImageElement | string} imgOrSrc
     * @returns {Promise<{ texture: THREE.Texture, width: number, height: number } | null>}
     */
    async _loadNextTexture(imgOrSrc) {
      if (typeof imgOrSrc === "string") {
        const loader = new THREE__namespace.TextureLoader();
        const texture2 = this._configureTexture(await loader.loadAsync(imgOrSrc));
        const image = texture2.image;
        const width = (image == null ? void 0 : image.naturalWidth) || (image == null ? void 0 : image.width) || 0;
        const height = (image == null ? void 0 : image.naturalHeight) || (image == null ? void 0 : image.height) || 0;
        if (!width || !height) {
          texture2.dispose();
          return null;
        }
        return { texture: texture2, width, height };
      }
      const texture = this._makeTexture(imgOrSrc);
      if (!texture) return null;
      return { texture, width: imgOrSrc.naturalWidth, height: imgOrSrc.naturalHeight };
    }
    /**
     * @returns {Promise<void>}
     */
    whenReady() {
      if (this.texture) return Promise.resolve();
      return new Promise((resolve) => {
        this._readyResolvers = this._readyResolvers || [];
        this._readyResolvers.push(resolve);
      });
    }
    _markReady() {
      var _a;
      this.container.classList.add("is-ready");
      (_a = this._readyResolvers) == null ? void 0 : _a.forEach((resolve) => resolve());
      this._readyResolvers = [];
    }
    /**
     * Crossfade the glass sample from the current texture to `img` or a URL.
     * @param {HTMLImageElement | string} imgOrSrc
     * @param {number} [duration=0.8]
     * @returns {Promise<void>}
     */
    async crossfadeTo(imgOrSrc, duration = 0.8) {
      var _a;
      if (this._disposed || this._fading) return;
      this._fading = true;
      try {
        const next = await this._loadNextTexture(imgOrSrc);
        if (!next || this._disposed) {
          this._fading = false;
          return;
        }
        (_a = this.textureB) == null ? void 0 : _a.dispose();
        this.textureB = next.texture;
        this.material.uniforms.uTextureB.value = next.texture;
        this.material.uniforms.uTextureSizeB.value.set(next.width, next.height);
        this.material.uniforms.uMix.value = 0;
        const gsap2 = window.gsap;
        const finish = () => {
          var _a2;
          (_a2 = this.texture) == null ? void 0 : _a2.dispose();
          this.texture = next.texture;
          this.textureB = null;
          this.material.uniforms.uTexture.value = next.texture;
          this.material.uniforms.uTextureSize.value.set(next.width, next.height);
          this.material.uniforms.uTextureB.value = next.texture;
          this.material.uniforms.uMix.value = 0;
          this._fading = false;
        };
        if (!gsap2 || duration <= 0) {
          finish();
          return;
        }
        const mix = { value: 0 };
        await new Promise((resolve) => {
          gsap2.to(mix, {
            value: 1,
            duration,
            ease: "power2.inOut",
            overwrite: true,
            onUpdate: () => {
              this.material.uniforms.uMix.value = mix.value;
            },
            onComplete: () => {
              finish();
              resolve();
            }
          });
        });
      } catch {
        this._fading = false;
      }
    }
    _loadTexture() {
      const apply = () => {
        var _a;
        if (this._disposed) return;
        const { source: img } = this;
        const texture = this._makeTexture(img);
        if (!texture) return;
        (_a = this.texture) == null ? void 0 : _a.dispose();
        this.texture = texture;
        this.material.uniforms.uTexture.value = texture;
        this.material.uniforms.uTextureB.value = texture;
        this.material.uniforms.uTextureSize.value.set(img.naturalWidth, img.naturalHeight);
        this.material.uniforms.uTextureSizeB.value.set(img.naturalWidth, img.naturalHeight);
        this.material.uniforms.uMix.value = 0;
        this._markReady();
      };
      if (this.source.complete && this.source.naturalWidth > 0) {
        apply();
        return;
      }
      this.source.addEventListener("load", apply, { once: true });
    }
    _loop() {
      const lerp = (start, end, factor) => start + (end - start) * factor;
      const tick = () => {
        if (!this._running) return;
        this._raf = requestAnimationFrame(tick);
        if (this._paused || !this.texture) return;
        this.mouse.x = lerp(this.mouse.x, this.targetMouse.x, this.config.lerpFactor);
        this.mouse.y = lerp(this.mouse.y, this.targetMouse.y, this.config.lerpFactor);
        this.material.uniforms.uMouse.value.set(this.mouse.x, this.mouse.y);
        this.renderer.render(this.scene, this.camera);
      };
      tick();
    }
  }
  const instances = /* @__PURE__ */ new WeakMap();
  const DATA_KEYS = {
    "data-glass-lerp": "lerpFactor",
    "data-glass-parallax": "parallaxStrength",
    "data-glass-distortion": "distortionMultiplier",
    "data-glass-strength": "glassStrength",
    "data-glass-smoothness": "glassSmoothness",
    "data-glass-stripes": "stripesFrequency",
    "data-glass-edge": "edgePadding"
  };
  function optionsFromElement(el) {
    const options = {};
    for (const [attr, key] of Object.entries(DATA_KEYS)) {
      const raw = el.getAttribute(attr);
      if (raw == null || raw === "") continue;
      const value = Number.parseFloat(raw);
      if (Number.isFinite(value)) options[key] = value;
    }
    const pointer = el.getAttribute("data-glass-pointer");
    if (pointer === "window" || pointer === "local") {
      options.pointerMode = pointer;
    }
    return options;
  }
  function resolveRoot(el) {
    if (el.dataset.glassReady === "true") return null;
    if (el instanceof HTMLImageElement) {
      const parent = el.parentElement;
      if (parent == null ? void 0 : parent.classList.contains("glass-texture")) {
        el.classList.add("glass-texture__source");
        return parent.dataset.glassReady === "true" ? null : parent;
      }
      const wrap2 = document.createElement("div");
      wrap2.className = "glass-texture";
      el.classList.forEach((name) => {
        if (name.startsWith("glass-texture") && name !== "glass-texture") {
          wrap2.classList.add(name);
        }
      });
      for (const attr of [...el.attributes]) {
        if (attr.name.startsWith("data-glass-")) {
          wrap2.setAttribute(attr.name, attr.value);
          el.removeAttribute(attr.name);
        }
      }
      el.classList.remove("glass-texture");
      el.classList.add("glass-texture__source");
      parent == null ? void 0 : parent.insertBefore(wrap2, el);
      wrap2.appendChild(el);
      return wrap2;
    }
    return el;
  }
  function findSource(root) {
    return root.querySelector(":scope > img.glass-texture__source") || root.querySelector(":scope > img") || (root instanceof HTMLImageElement ? root : null);
  }
  function initGlassTexture() {
    const nodes = document.querySelectorAll(".glass-texture");
    if (!nodes.length) return () => {
    };
    if (isFileProtocol()) return () => {
    };
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return () => {
    };
    const mounts = [];
    nodes.forEach((node) => {
      var _a;
      const root = resolveRoot(
        /** @type {HTMLElement} */
        node
      );
      if (!root || root.dataset.glassReady === "true") return;
      const source = findSource(root);
      if (!(source instanceof HTMLImageElement)) return;
      root.dataset.glassReady = "true";
      let instance;
      try {
        instance = new GlassTexture(root, source, optionsFromElement(root));
      } catch {
        root.removeAttribute("data-glass-ready");
        (_a = root.querySelector(".glass-texture__canvas")) == null ? void 0 : _a.remove();
        return;
      }
      const io = new IntersectionObserver(
        ([entry]) => {
          instance.setPaused(!entry.isIntersecting);
        },
        { threshold: 0.05 }
      );
      io.observe(root);
      instances.set(root, instance);
      root._glassTexture = instance;
      mounts.push({ instance, io });
    });
    return () => {
      mounts.forEach(({ instance, io }) => {
        io.disconnect();
        instance.destroy();
      });
    };
  }
  function initHero3() {
    const section = document.querySelector(".hero-3");
    if (!section) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    gsap.matchMedia().add("(min-width: 1024px)", () => {
      const photos = gsap.utils.toArray(section.querySelectorAll(".hero-3__photo"));
      const cleanups = [];
      if (photos.length) {
        cleanups.push(bindParallax(section, photos));
      }
      const logoCleanup = bindLogoShrink(section);
      if (logoCleanup) {
        cleanups.push(logoCleanup);
      }
      const studioCleanup = bindStudioShrink(section);
      if (studioCleanup) {
        cleanups.push(studioCleanup);
      }
      return () => {
        cleanups.forEach((fn) => fn());
      };
    });
  }
  function bindParallax(section, photos) {
    const cursorMax = tokenNumber$5("--layout-hero3-parallax-cursor", 16);
    const items = photos.map((el) => {
      var _a;
      const slot = (_a = [...el.classList].find((name) => name.startsWith("hero-3__photo--"))) == null ? void 0 : _a.replace("hero-3__photo--", "");
      return {
        el,
        scroll: tokenNumber$5(`--layout-hero3-parallax-scroll-${slot}`, -120),
        depth: tokenNumber$5(`--layout-hero3-parallax-depth-${slot}`, 1),
        scrollY: 0,
        cursorX: 0,
        cursorY: 0,
        destX: 0,
        destY: 0
      };
    });
    const apply = (item) => {
      gsap.set(item.el, {
        x: item.cursorX,
        y: item.scrollY + item.cursorY,
        force3D: true
      });
    };
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      // Finish the travel while the hero is still on screen so layers
      // separate while the photos are visible (cursor offset stays separate).
      end: "center top",
      scrub: 0.8,
      onUpdate: (self) => {
        items.forEach((item) => {
          item.scrollY = item.scroll * self.progress;
        });
      }
    });
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMove = (event) => {
      const rect = section.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      items.forEach((item) => {
        item.destX = relX * cursorMax * item.depth * 2;
        item.destY = relY * cursorMax * item.depth * 2;
      });
    };
    const onLeave = () => {
      items.forEach((item) => {
        item.destX = 0;
        item.destY = 0;
      });
    };
    const onTick = () => {
      items.forEach((item) => {
        if (finePointer) {
          item.cursorX += (item.destX - item.cursorX) * 0.12;
          item.cursorY += (item.destY - item.cursorY) * 0.12;
        }
        apply(item);
      });
    };
    if (finePointer) {
      section.addEventListener("mousemove", onMove);
      section.addEventListener("mouseleave", onLeave);
    }
    gsap.ticker.add(onTick);
    return () => {
      st.kill();
      gsap.ticker.remove(onTick);
      if (finePointer) {
        section.removeEventListener("mousemove", onMove);
        section.removeEventListener("mouseleave", onLeave);
      }
      gsap.set(photos, { clearProps: "transform" });
    };
  }
  function bindLogoShrink(section) {
    const logo = section.querySelector(".hero-3__logo");
    if (!logo) return;
    const startW = tokenNumber$5("--layout-hero3-logo-width", 802);
    const startH = tokenNumber$5("--layout-hero3-logo-height", 286);
    const endW = tokenNumber$5("--layout-hero3-logo-shrink-width", 88);
    const endH = startW ? startH * (endW / startW) : endW;
    const tween = gsap.fromTo(
      logo,
      { width: startW, height: startH },
      {
        width: endW,
        height: endH,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "center top",
          scrub: 0.8
        }
      }
    );
    return () => {
      var _a;
      (_a = tween.scrollTrigger) == null ? void 0 : _a.kill();
      tween.kill();
      gsap.set(logo, { clearProps: "width,height" });
    };
  }
  function bindStudioShrink(section) {
    const studio = section.querySelector(".hero-3__studio");
    if (!studio) return;
    const startSize = Number.parseFloat(getComputedStyle(studio).fontSize) || 278;
    const endSize = tokenNumber$5("--layout-hero3-word-shrink-size", 42);
    const tween = gsap.fromTo(
      studio,
      { fontSize: startSize },
      {
        fontSize: endSize,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "center top",
          scrub: 0.8
        }
      }
    );
    return () => {
      var _a;
      (_a = tween.scrollTrigger) == null ? void 0 : _a.kill();
      tween.kill();
      gsap.set(studio, { clearProps: "fontSize" });
    };
  }
  function tokenNumber$5(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  const CHARS = "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const pickChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];
  const finalTextMap = /* @__PURE__ */ new WeakMap();
  function scramble(el, finalText, duration = 1.2) {
    if (el._scrambling) return;
    el._scrambling = true;
    const original = finalText;
    const length = original.length;
    const queue = [];
    for (let i = 0; i < length; i += 1) {
      const start = Math.floor(Math.random() * (duration * 0.4) * 60);
      const end = start + Math.floor(Math.random() * (duration * 0.6) * 60) + 6;
      queue.push({ from: original[i], to: original[i], start, end, char: "" });
    }
    let frame = 0;
    const update = () => {
      let output = "";
      let complete = 0;
      for (let i = 0; i < queue.length; i += 1) {
        const q = queue[i];
        if (frame >= q.end) {
          complete += 1;
          output += q.to;
        } else if (frame >= q.start) {
          if (/\s/.test(q.to) || q.to === "," || q.to === ".") {
            output += q.to;
          } else {
            if (!q.char || Math.random() < 0.28) {
              q.char = pickChar();
            }
            output += q.char;
          }
        } else {
          output += q.from;
        }
      }
      el.textContent = output;
      if (complete === queue.length) {
        gsap.ticker.remove(update);
        el._scrambling = false;
      } else {
        frame += 1;
      }
    };
    gsap.ticker.add(update);
  }
  function initTextScramble() {
    const targets = gsap.utils.toArray(".text-scramble");
    if (!targets.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    targets.forEach((el) => {
      const finalText = (el.dataset.scrambleText || el.textContent || "").trim();
      if (!finalText) return;
      finalTextMap.set(el, finalText);
      el.textContent = finalText;
      if (prefersReducedMotion2) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => scramble(el, finalTextMap.get(el) || finalText, 1.2)
      });
      el.addEventListener("mouseenter", () => {
        scramble(el, finalTextMap.get(el) || finalText, 0.9);
      });
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function initOdometerCounter() {
    const Odometer = window.Odometer;
    const targets = document.querySelectorAll(".has-odometer");
    if (!Odometer || !targets.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    targets.forEach((el) => {
      const raw = el.getAttribute("data-count") || el.textContent || "0";
      const count = String(raw).replace(/[^\d.-]/g, "");
      if (!count) return;
      el.setAttribute("data-count", count);
      el.classList.add("odometer");
      if (prefersReducedMotion2) {
        el.textContent = count;
        return;
      }
      el.textContent = "0";
      if (!el.odometer) {
        new Odometer({
          el,
          value: 0,
          format: "d",
          duration: 2e3
        });
      } else {
        el.odometer.update(0);
      }
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          if (el.classList.contains("odometer-animated")) return;
          el.classList.add("odometer-animated");
          window.setTimeout(() => {
            el.odometer.update(count);
          }, 100);
        }
      });
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function initAboutThumbMarquee() {
    const rows = document.querySelectorAll("[data-thumb-marquee]");
    if (!rows.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rows.forEach((row) => {
      const track = row.querySelector("[data-thumb-marquee-track]") || row.querySelector(".about-1__thumb-track");
      const group = row.querySelector("[data-thumb-marquee-group]") || row.querySelector(".about-1__thumb-group");
      if (!track || !group) return;
      const direction = (row.getAttribute("data-direction") || "left").toLowerCase();
      const speed = Math.max(12, parseFloat(row.getAttribute("data-marquee-speed") || "28"));
      const canDrag = row.getAttribute("data-marquee-drag") !== "false";
      const dirSign = direction === "right" ? 1 : -1;
      let groupWidth = 0;
      let x = 0;
      let dragging = false;
      let dragOriginX = 0;
      let dragStartX = 0;
      let tickerFn = null;
      const wrapX = (value) => {
        if (!groupWidth) return value;
        return gsap.utils.wrap(-groupWidth, 0, value);
      };
      const render = () => {
        gsap.set(track, { x: wrapX(x) });
      };
      const fillTrack = () => {
        const source = group.cloneNode(true);
        track.replaceChildren(source);
        const unit = source.offsetWidth || source.getBoundingClientRect().width || 0;
        if (!unit) {
          track.replaceChildren(group);
          groupWidth = 0;
          return 0;
        }
        const minWidth = Math.max((row.offsetWidth || unit) * 2, unit * 2);
        let guard = 0;
        while (track.scrollWidth < minWidth && guard < 12) {
          track.appendChild(source.cloneNode(true));
          guard += 1;
        }
        groupWidth = unit;
        return unit;
      };
      const stopTicker = () => {
        if (tickerFn) {
          gsap.ticker.remove(tickerFn);
          tickerFn = null;
        }
      };
      const startTicker = () => {
        stopTicker();
        if (prefersReducedMotion2 || !groupWidth) return;
        tickerFn = (_time, delta) => {
          if (!dragging) {
            x += dirSign * speed * (delta / 1e3);
          }
          render();
        };
        gsap.ticker.add(tickerFn);
      };
      const setup = () => {
        const unit = fillTrack();
        if (!unit) {
          gsap.set(track, { clearProps: "transform" });
          stopTicker();
          return;
        }
        x = wrapX(x);
        render();
        startTicker();
      };
      const onPointerMove = (event) => {
        if (!dragging) return;
        const dx = event.clientX - dragOriginX;
        x = dragStartX + dx;
        render();
      };
      const onPointerUp = () => {
        if (!dragging) return;
        dragging = false;
        row.classList.remove("is-dragging");
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
        x = wrapX(x);
        render();
      };
      const onPointerDown = (event) => {
        if (event.button != null && event.button !== 0) return;
        event.preventDefault();
        dragging = true;
        row.classList.add("is-dragging");
        dragOriginX = event.clientX;
        dragStartX = x;
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);
      };
      if (canDrag) {
        row.addEventListener("pointerdown", onPointerDown);
      }
      setup();
      window.setTimeout(setup, 100);
      window.setTimeout(setup, 400);
      row.querySelectorAll("img").forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", setup, { once: true });
        }
      });
      let resizeTimer = 0;
      window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(setup, 150);
      });
    });
  }
  function initAbout2Mark() {
    const frames = gsap.utils.toArray(".about-2__mark, .about-2__portrait");
    if (!frames.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    frames.forEach((frame) => {
      const media = frame.querySelector("img");
      if (!media) return;
      if (prefersReducedMotion2) {
        gsap.set(media, { yPercent: 0, y: 0, clearProps: "transform" });
        frame.classList.add("is-risen");
        return;
      }
      gsap.set(media, { yPercent: 110, y: 0 });
      ScrollTrigger.create({
        trigger: frame,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(media, {
            yPercent: 0,
            y: 0,
            duration: 1.15,
            ease: "power3.out",
            overwrite: "auto",
            onComplete: () => {
              frame.classList.add("is-risen");
            }
          });
        }
      });
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function initAbout2Pin() {
    const section = document.querySelector(".about-2");
    const layout = section == null ? void 0 : section.querySelector(".about-2__layout");
    const intro = section == null ? void 0 : section.querySelector(".about-2__intro");
    const recognition = section == null ? void 0 : section.querySelector(".about-2__recognition");
    if (!section || !layout || !intro || !recognition) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    const pinOffset = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--layout-about2-pin-offset").trim();
      const value = Number.parseFloat(raw);
      return Number.isFinite(value) ? value : 50;
    };
    gsap.matchMedia().add("(min-width: 1024px)", () => {
      if (!window.smoother) {
        layout.classList.add("is-css-sticky");
        return () => layout.classList.remove("is-css-sticky");
      }
      const extra = () => Math.max(0, recognition.offsetHeight - intro.offsetHeight);
      if (extra() <= 0) return void 0;
      layout.classList.add("is-js-pin");
      const st = ScrollTrigger.create({
        trigger: intro,
        start: () => `top top+=${pinOffset()}`,
        end: () => `+=${extra()}`,
        pin: intro,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true
      });
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return () => {
        st.kill();
        layout.classList.remove("is-js-pin");
      };
    });
  }
  function initSectionTitleRule() {
    const rules = gsap.utils.toArray(".section-title-1__rule");
    if (!rules.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rules.forEach((rule) => {
      if (prefersReducedMotion2) {
        gsap.set(rule, { "--rule-draw": "100%" });
        return;
      }
      gsap.fromTo(
        rule,
        { "--rule-draw": "0%" },
        {
          "--rule-draw": "100%",
          ease: "none",
          scrollTrigger: {
            trigger: rule,
            start: "top 90%",
            end: "top 55%",
            scrub: true
          }
        }
      );
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function initCursorParallax() {
    const items = gsap.utils.toArray(".cursor-parallax, [data-cursor-parallax]");
    if (!items.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (prefersReducedMotion2 || !finePointer) return;
    items.forEach((el) => {
      if (el.dataset.cursorParallaxReady === "true") return;
      const strength = Math.max(0, parseFloat(el.getAttribute("data-cursor-parallax") || "20") || 20);
      const boundSel = el.getAttribute("data-cursor-parallax-bound");
      const bound = boundSel && el.closest(boundSel) || el.parentElement;
      el.dataset.cursorParallaxReady = "true";
      if (!bound || !strength) return;
      const onMove = (event) => {
        const rect = bound.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        const relY = (event.clientY - rect.top) / rect.height - 0.5;
        gsap.to(el, {
          x: relX * strength * 2,
          y: relY * strength * 2,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto"
        });
      };
      const onLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          overwrite: "auto"
        });
      };
      bound.addEventListener("mousemove", onMove);
      bound.addEventListener("mouseleave", onLeave);
    });
  }
  function initBox3D() {
    const cardWrappers = document.querySelectorAll(".box-3d");
    if (!cardWrappers.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (prefersReducedMotion2 || !finePointer) return;
    const cardCubes = [];
    cardWrappers.forEach((cardWrapper) => {
      if (!(cardWrapper instanceof HTMLElement)) return;
      if (cardWrapper.getAttribute("data-box-3d-ready") === "true") return;
      const content = resolveContent(cardWrapper);
      const cube = document.createElement("div");
      cube.className = "box-3d__cube";
      const front = createFace("front");
      front.appendChild(content);
      cube.append(front);
      ["back", "right", "left", "top", "bottom"].forEach((name) => {
        cube.appendChild(createFace(name, true));
      });
      const scene = document.createElement("div");
      scene.className = "box-3d__scene";
      scene.appendChild(cube);
      cardWrapper.appendChild(scene);
      const hit = document.createElement("div");
      hit.className = "box-3d__hit";
      hit.setAttribute("aria-hidden", "true");
      cardWrapper.appendChild(hit);
      cardWrapper.setAttribute("data-box-3d-ready", "true");
      syncCubeMetrics(cardWrapper);
      requestAnimationFrame(() => syncCubeMetrics(cardWrapper));
      const cardDepth = readDepth(cardWrapper);
      cardCubes.push({ cardCube: cube, cardDepth, cardWrapper });
    });
    cardCubes.forEach(({ cardCube, cardDepth, cardWrapper }) => {
      bindMotion(cardCube, cardDepth, cardWrapper);
      const resizeObserver = new ResizeObserver(() => syncCubeMetrics(cardWrapper));
      resizeObserver.observe(cardWrapper);
    });
  }
  function syncCubeMetrics(root) {
    const width = root.offsetWidth;
    const height = root.offsetHeight;
    if (width) root.style.setProperty("--box-3d-width", `${width}px`);
    if (height) root.style.setProperty("--box-3d-height", `${height}px`);
  }
  function readDepth(root) {
    const fromRoot = parseFloat(getComputedStyle(root).getPropertyValue("--layout-box3d-depth"));
    const fromLayout = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--layout-box3d-depth")
    );
    if (Number.isFinite(fromRoot) && fromRoot > 0) return fromRoot;
    if (Number.isFinite(fromLayout) && fromLayout > 0) return fromLayout;
    return 340;
  }
  function resolveContent(root) {
    const existing = root.querySelector(":scope > .box-3d__content");
    if (existing instanceof HTMLElement) return existing;
    const content = document.createElement("div");
    content.className = "box-3d__content";
    while (root.firstChild) content.appendChild(root.firstChild);
    return content;
  }
  function createFace(name, hidden = false) {
    const face = document.createElement("div");
    face.className = `box-3d__face box-3d__face--${name}`;
    if (hidden) face.setAttribute("aria-hidden", "true");
    return face;
  }
  function bindMotion(cardCube, cardDepth, cardWrapper) {
    const rotation = { tiltX: 0, tiltY: 0 };
    const hit = cardWrapper.querySelector(":scope > .box-3d__hit") || cardWrapper;
    const strengthAttr = parseFloat(cardWrapper.getAttribute("data-box-3d-strength") || "");
    const strength = Number.isFinite(strengthAttr) ? Math.max(0, strengthAttr) : parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--layout-box3d-strength")) || 40;
    function render() {
      cardCube.style.transform = `translateZ(${-cardDepth / 2}px) rotateX(${rotation.tiltX}deg) rotateY(${rotation.tiltY}deg)`;
    }
    gsap.ticker.add(render);
    render();
    hit.addEventListener("mouseleave", () => {
      gsap.to(rotation, {
        tiltX: 0,
        tiltY: 0,
        duration: 0.6,
        ease: "power3.out",
        overwrite: true
      });
    });
    hit.addEventListener("mousemove", (event) => {
      const bounds = hit.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const offsetX = (event.clientX - centerX) / bounds.width;
      const offsetY = (event.clientY - centerY) / bounds.height;
      gsap.to(rotation, {
        tiltY: offsetX * strength,
        tiltX: -offsetY * strength,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto"
      });
    });
  }
  function initScrollParallax() {
    const items = gsap.utils.toArray(".scroll-parallax, [data-scroll-parallax]");
    if (!items.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    items.forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      if (el.dataset.scrollParallaxReady === "true") return;
      const travel = readTravel(el);
      const boundSel = el.getAttribute("data-scroll-parallax-bound");
      const bound = boundSel && el.closest(boundSel) || el.parentElement;
      el.dataset.scrollParallaxReady = "true";
      if (!bound || !travel) return;
      gsap.fromTo(
        el,
        { y: travel },
        {
          y: -travel,
          ease: "none",
          force3D: true,
          immediateRender: false,
          scrollTrigger: {
            trigger: bound,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true
          }
        }
      );
    });
  }
  function readTravel(el) {
    const attr = el.getAttribute("data-scroll-parallax");
    if (attr != null && attr !== "") {
      const value = Number.parseFloat(attr);
      if (Number.isFinite(value)) return value;
    }
    const fromCss = Number.parseFloat(
      getComputedStyle(el).getPropertyValue("--scroll-parallax-travel")
    );
    if (Number.isFinite(fromCss) && fromCss !== 0) return fromCss;
    return 80;
  }
  function initScrollMoveUp() {
    const items = gsap.utils.toArray(".scroll-move-up");
    if (!items.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    gsap.matchMedia().add("(min-width: 992px)", () => {
      const triggers = items.map(
        (el) => gsap.to(el, {
          y: -100,
          duration: 1.5,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            scrub: 1
          }
        })
      );
      return () => {
        triggers.forEach((tween) => {
          var _a;
          (_a = tween.scrollTrigger) == null ? void 0 : _a.kill();
          tween.kill();
        });
        gsap.set(items, { clearProps: "transform" });
      };
    });
  }
  function initCoverReveal() {
    const covers = gsap.utils.toArray(".cover-reveal, [data-cover-reveal]");
    if (!covers.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    covers.forEach((cover) => {
      if (cover.classList.contains("is-js-cover-reveal")) return;
      const reveal = resolveReveal(cover);
      if (!reveal || reveal === cover) return;
      cover.classList.add("cover-reveal", "is-js-cover-reveal");
      reveal.classList.add("cover-reveal-base");
      if (reveal instanceof HTMLElement) {
        reveal.removeAttribute("data-cover-reveal-scale");
        gsap.set(reveal, { clearProps: "scale,transform" });
      }
      const overlap = () => Math.min(
        tokenLength$2("--layout-cover-reveal-overlap", window.innerHeight),
        cover.offsetHeight,
        reveal.offsetHeight
      );
      const applyOverlap = () => {
        gsap.set(cover, { marginBottom: -overlap() });
      };
      applyOverlap();
      ScrollTrigger.create({
        trigger: reveal,
        start: "top top",
        end: () => `+=${overlap()}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: applyOverlap
      });
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function resolveReveal(cover) {
    var _a;
    const selector = cover.getAttribute("data-cover-reveal");
    if (selector) {
      const scoped = (_a = cover.parentElement) == null ? void 0 : _a.querySelector(selector);
      return scoped || document.querySelector(selector);
    }
    const next = cover.nextElementSibling;
    if (!next) return null;
    if (next.classList.contains("pin-spacer")) {
      return next.querySelector(":scope > *");
    }
    return next;
  }
  function tokenLength$2(name, fallbackPx) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (!raw) return fallbackPx;
    const value = Number.parseFloat(raw);
    if (!Number.isFinite(value)) return fallbackPx;
    if (raw.endsWith("vh")) return value / 100 * window.innerHeight;
    if (raw.endsWith("vw")) return value / 100 * window.innerWidth;
    return value;
  }
  gsap.registerPlugin(SplitText);
  function initTextRoll() {
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    const labels = document.querySelectorAll(".text-roll");
    if (!labels.length) return;
    labels.forEach((label) => {
      var _a;
      if (label.dataset.split === "true") return;
      const trigger = label.closest(".text-roll-trigger") || label.closest("a") || label.closest("button") || label.parentElement;
      if (!trigger) return;
      const originalText = ((_a = label.textContent) == null ? void 0 : _a.trim()) ?? "";
      if (!originalText) return;
      label.setAttribute("aria-label", originalText);
      const split = new SplitText(label, {
        type: "chars",
        charsClass: "text-roll__char",
        tag: "span"
      });
      split.chars.forEach((char) => {
        const letter = char.textContent ?? "";
        if (!letter.trim()) {
          char.classList.add("text-roll__char--space");
          return;
        }
        char.textContent = "";
        const stack = document.createElement("span");
        stack.className = "text-roll__char-stack";
        stack.setAttribute("aria-hidden", "true");
        const top = document.createElement("span");
        top.className = "text-roll__char-letter";
        top.textContent = letter;
        const bottom = document.createElement("span");
        bottom.className = "text-roll__char-letter";
        bottom.textContent = letter;
        stack.append(top, bottom);
        char.appendChild(stack);
      });
      label.dataset.split = "true";
      const stacks = label.querySelectorAll(".text-roll__char-stack");
      gsap.set(stacks, { yPercent: 0 });
      trigger.addEventListener("mouseenter", () => {
        gsap.to(stacks, {
          yPercent: -50,
          duration: 0.35,
          stagger: 0.03,
          ease: "power2.out",
          overwrite: "auto"
        });
      });
      trigger.addEventListener("mouseleave", () => {
        gsap.to(stacks, {
          yPercent: 0,
          duration: 0.35,
          stagger: 0.02,
          ease: "power2.out",
          overwrite: "auto"
        });
      });
    });
  }
  gsap.registerPlugin(SplitText);
  function initTextMarkRoll() {
    var _a;
    const marks = gsap.utils.toArray(".text-mark-roll");
    if (!marks.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const setup = () => {
      marks.forEach((mark) => {
        var _a2;
        if (!(mark instanceof Element) || mark.closest("[hidden]")) return;
        if (mark.dataset.split === "true") return;
        const originalText = ((_a2 = mark.textContent) == null ? void 0 : _a2.trim()) ?? "";
        if (!originalText) return;
        mark.setAttribute("aria-label", originalText);
        const split = new SplitText(mark, {
          type: "lines,chars",
          linesClass: "text-mark-roll__line",
          charsClass: "text-mark-roll__char",
          tag: "span"
        });
        split.chars.forEach((char) => {
          const letter = char.textContent ?? "";
          if (!letter.trim()) {
            char.classList.add("text-mark-roll__char--space");
            return;
          }
          char.textContent = "";
          const stack = document.createElement("span");
          stack.className = "text-mark-roll__char-stack";
          stack.setAttribute("aria-hidden", "true");
          const top = document.createElement("span");
          top.className = "text-mark-roll__char-letter";
          top.textContent = letter;
          const bottom = document.createElement("span");
          bottom.className = "text-mark-roll__char-letter";
          bottom.textContent = letter;
          stack.append(top, bottom);
          char.appendChild(stack);
        });
        split.lines.forEach((line) => {
          line.classList.add("text-mark-roll__line");
          let inner = line.querySelector(":scope > .text-mark-roll__line-inner");
          if (!inner) {
            inner = document.createElement("span");
            inner.className = "text-mark-roll__line-inner";
            while (line.firstChild) {
              inner.appendChild(line.firstChild);
            }
            line.appendChild(inner);
          }
        });
        mark.dataset.split = "true";
        const inners = mark.querySelectorAll(".text-mark-roll__line-inner");
        const stacks = mark.querySelectorAll(".text-mark-roll__char-stack");
        if (prefersReducedMotion2) {
          gsap.set(inners, { y: "0%", opacity: 1, clearProps: "transform" });
          gsap.set(stacks, { yPercent: 0, clearProps: "transform" });
          mark.classList.add("is-mark-roll-ready", "is-mark-roll-done");
          return;
        }
        gsap.set(inners, { y: "120%", opacity: 0.25 });
        gsap.set(stacks, { yPercent: 50 });
        mark.classList.add("is-mark-roll-ready");
        ScrollTrigger.create({
          trigger: mark,
          start: "top bottom",
          once: true,
          onEnter: () => {
            const lines = mark.querySelectorAll(".text-mark-roll__line");
            const tl = gsap.timeline({
              delay: 0.15,
              onComplete: () => {
                mark.classList.add("is-mark-roll-done");
              }
            });
            lines.forEach((line, index) => {
              const inner = line.querySelector(".text-mark-roll__line-inner");
              const lineStacks = line.querySelectorAll(".text-mark-roll__char-stack");
              const at = index * 0.1;
              if (inner) {
                tl.to(
                  inner,
                  {
                    y: "0%",
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    overwrite: "auto"
                  },
                  at
                );
              }
              if (lineStacks.length) {
                tl.to(
                  lineStacks,
                  {
                    yPercent: 0,
                    duration: 0.55,
                    stagger: { amount: 0.35, from: "start" },
                    ease: "power2.out",
                    overwrite: "auto"
                  },
                  at
                );
              }
            });
          }
        });
      });
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };
    if ((_a = document.fonts) == null ? void 0 : _a.ready) {
      document.fonts.ready.then(setup).catch(setup);
    } else {
      setup();
    }
  }
  gsap.registerPlugin(ScrollTrigger);
  const LETTER_CLASS = "text-blur-stagger__letter";
  function splitTextBlurStagger(el) {
    if (!(el instanceof Element)) return [];
    if (!el.querySelector(`.${LETTER_CLASS}`)) {
      const text = el.textContent ?? "";
      el.innerHTML = text.replace(/\S/g, `<span class="${LETTER_CLASS}">$&</span>`);
    }
    return el.querySelectorAll(`.${LETTER_CLASS}`);
  }
  function shouldTweenAsWord(el) {
    if (el.dataset.blurStagger === "word") return true;
    const style = getComputedStyle(el);
    return style.backgroundClip === "text" || style.webkitBackgroundClip === "text";
  }
  function createTextBlurStaggerTween(el, vars = {}) {
    const {
      x = 28,
      blur = 8,
      duration = 0.9,
      ease = "power2.out",
      stagger = { each: 0.045, from: "start" },
      onComplete,
      ...rest
    } = vars;
    const finish = () => {
      el.classList.add("is-blur-stagger-done");
      onComplete == null ? void 0 : onComplete();
    };
    if (shouldTweenAsWord(el)) {
      return gsap.fromTo(
        el,
        { x, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration,
          ease,
          clearProps: "transform",
          ...rest,
          onComplete: finish
        }
      );
    }
    const letters = splitTextBlurStagger(el);
    if (!letters.length) return null;
    return gsap.fromTo(
      letters,
      {
        x,
        opacity: 0,
        filter: `blur(${blur}px)`
      },
      {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration,
        ease,
        stagger,
        ...rest,
        onComplete: finish
      }
    );
  }
  function initTextBlurStagger() {
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = document.querySelectorAll(".text-blur-stagger");
    if (!nodes.length) return;
    nodes.forEach((el) => {
      if (el.dataset.blurStagger === "manual") return;
      if (el.closest("#pre-loader-1")) return;
      if (prefersReducedMotion2) {
        if (!shouldTweenAsWord(el)) {
          splitTextBlurStagger(el);
        }
        el.classList.add("is-blur-stagger-done");
        return;
      }
      const tween = createTextBlurStaggerTween(el, { paused: true });
      if (!tween) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          tween.play(0);
        }
      });
    });
  }
  const ROOT$1 = "text-scale-anim";
  const WORD$1 = "text-scale-anim__word";
  const LETTER$1 = "text-scale-anim__letter";
  const DURATION$1 = 0.4;
  const EASE$1 = "sine.out";
  const CENTER_SCALE$1 = 1.6;
  const NEIGHBOR_SCALE$1 = 1.3;
  const CENTER_Y = "-24%";
  const NEIGHBOR_Y = "-12%";
  function initTextScaleAnim() {
    const nodes = document.querySelectorAll(`.${ROOT$1}`);
    if (!nodes.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nodes.forEach((root) => {
      if (!(root instanceof Element)) return;
      if (root.dataset.textScaleAnimReady) return;
      root.dataset.textScaleAnimReady = "true";
      splitTextScaleAnim(root);
      if (prefersReducedMotion2) return;
      bindLetterWave$1(root);
    });
  }
  function splitTextScaleAnim(root) {
    if (root.querySelector(`.${LETTER$1}`)) return;
    const fragment = document.createDocumentFragment();
    [...root.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        String(node.textContent ?? "").split(" ").forEach((word, index, words) => {
          if (word) {
            const wordEl = document.createElement("span");
            wordEl.className = WORD$1;
            [...word].forEach((char) => {
              const letterEl = document.createElement("span");
              letterEl.className = LETTER$1;
              letterEl.textContent = char;
              wordEl.appendChild(letterEl);
            });
            fragment.appendChild(wordEl);
          }
          if (index < words.length - 1) {
            fragment.appendChild(document.createTextNode(" "));
          }
        });
        return;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        fragment.appendChild(node.cloneNode(true));
      }
    });
    root.replaceChildren(fragment);
  }
  function bindLetterWave$1(root) {
    const letters = [...root.querySelectorAll(`.${LETTER$1}`)];
    if (!letters.length) return;
    const tweenTo = (letter, scaleY, y) => {
      gsap.to(letter, {
        scaleY,
        y,
        duration: DURATION$1,
        ease: EASE$1,
        overwrite: "auto"
      });
    };
    const applyWave = (center) => {
      letters.forEach((letter, index) => {
        const dist = center < 0 ? -1 : Math.abs(index - center);
        if (dist === 0) {
          tweenTo(letter, CENTER_SCALE$1, CENTER_Y);
          return;
        }
        if (dist === 1) {
          tweenTo(letter, NEIGHBOR_SCALE$1, NEIGHBOR_Y);
          return;
        }
        tweenTo(letter, 1, "0%");
      });
    };
    letters.forEach((letter, index) => {
      letter.addEventListener("pointerenter", () => applyWave(index));
    });
    root.addEventListener("pointerleave", () => applyWave(-1));
  }
  const ROOT = "text-scale-anim-2";
  const WORD = "text-scale-anim-2__word";
  const LETTER = "text-scale-anim-2__letter";
  const DURATION = 0.4;
  const EASE = "sine.out";
  const CENTER_SCALE = 1.6;
  const NEIGHBOR_SCALE = 1.3;
  const NEIGHBOR_X = 12;
  function initTextScaleAnim2() {
    const nodes = document.querySelectorAll(`.${ROOT}`);
    if (!nodes.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nodes.forEach((root) => {
      if (!(root instanceof Element)) return;
      if (root.dataset.textScaleAnim2Ready) return;
      root.dataset.textScaleAnim2Ready = "true";
      splitTextScaleAnim2(root);
      if (prefersReducedMotion2) return;
      bindLetterWave(root);
    });
  }
  function splitTextScaleAnim2(root) {
    if (root.querySelector(`.${LETTER}`)) return;
    const fragment = document.createDocumentFragment();
    [...root.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        String(node.textContent ?? "").split(" ").forEach((word, index, words) => {
          if (word) {
            const wordEl = document.createElement("span");
            wordEl.className = WORD;
            [...word].forEach((char) => {
              const letterEl = document.createElement("span");
              letterEl.className = LETTER;
              letterEl.textContent = char;
              wordEl.appendChild(letterEl);
            });
            fragment.appendChild(wordEl);
          }
          if (index < words.length - 1) {
            fragment.appendChild(document.createTextNode(" "));
          }
        });
        return;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        fragment.appendChild(node.cloneNode(true));
      }
    });
    root.replaceChildren(fragment);
  }
  function bindLetterWave(root) {
    const letters = [...root.querySelectorAll(`.${LETTER}`)];
    if (!letters.length) return;
    const tweenTo = (letter, scaleX, x) => {
      gsap.to(letter, {
        scaleX,
        x,
        duration: DURATION,
        ease: EASE,
        overwrite: "auto"
      });
    };
    const applyWave = (center) => {
      letters.forEach((letter, index) => {
        const dist = center < 0 ? -1 : Math.abs(index - center);
        if (dist === 0) {
          tweenTo(letter, CENTER_SCALE, "0%");
          return;
        }
        if (dist === 1) {
          const side = index > center ? 1 : -1;
          tweenTo(letter, NEIGHBOR_SCALE, `${side * NEIGHBOR_X}%`);
          return;
        }
        tweenTo(letter, 1, "0%");
      });
    };
    letters.forEach((letter, index) => {
      letter.addEventListener("pointerenter", () => applyWave(index));
    });
    root.addEventListener("pointerleave", () => applyWave(-1));
  }
  const PIN_TOP = 80;
  const PIN_BOTTOM_GAP = 80;
  const ROTATE_Y_BY_INDEX = [-32, 0, 32];
  function initTestimonialsSticky() {
    const section = document.querySelector(".testimonials-1");
    const grid = section == null ? void 0 : section.querySelector(".testimonials-1__grid");
    if (!section || !grid) return;
    const tracks = gsap.utils.toArray(grid.querySelectorAll(".testimonials-1__track"));
    const cards = tracks.map((track) => track.querySelector(".testimonial-card-1")).filter(Boolean);
    if (!cards.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    cards.forEach((card, index) => {
      const rotateY = isDesktop ? ROTATE_Y_BY_INDEX[index % 3] ?? 0 : 0;
      const track = tracks[index];
      gsap.set(card, {
        transformPerspective: 900,
        transformOrigin: "50% 100%",
        force3D: true
      });
      gsap.fromTo(
        card,
        {
          rotateX: isDesktop ? 58 : 32,
          rotateY,
          y: isDesktop ? 120 : 64,
          z: isDesktop ? -180 : -80,
          scale: 0.82
        },
        {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          z: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top 85%",
            end: `top top+=${PIN_TOP}`,
            scrub: 0.35,
            invalidateOnRefresh: true
          }
        }
      );
    });
    if (!isDesktop || !window.smoother || tracks.length < 2) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }
    grid.classList.add("is-js-pin");
    const stats = section.querySelector(".testimonials-1__stats");
    const maxCardHeight = Math.max(...cards.map((card) => card.offsetHeight));
    const pinEndTrigger = stats || grid;
    const pinEnd = stats ? `top top+=${PIN_TOP + maxCardHeight + PIN_BOTTOM_GAP}` : `bottom top+=${PIN_TOP + maxCardHeight + PIN_BOTTOM_GAP}`;
    tracks.forEach((track) => {
      ScrollTrigger.create({
        trigger: track,
        start: `top top+=${PIN_TOP}`,
        endTrigger: pinEndTrigger,
        end: pinEnd,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1
      });
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function initProcessBarFill() {
    const fills = gsap.utils.toArray(".process-1__bar-fill");
    if (!fills.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) {
      gsap.set(fills, { width: "100%" });
      return;
    }
    gsap.set(fills, { width: "10%" });
    fills.forEach((fill, index) => {
      const bar = fill.closest(".process-1__bar") || fill;
      ScrollTrigger.create({
        trigger: bar,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(fill, {
            width: "100%",
            duration: 1.15,
            delay: index * 0.12,
            ease: "power3.out",
            overwrite: "auto"
          });
        }
      });
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function initLazyVideo() {
    const videos = document.querySelectorAll("video[data-src]");
    if (!videos.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const skipAutoplay = prefersReducedMotion2 || isIOSWebKit();
    const ensureSource = (video) => {
      const src = video.getAttribute("data-src");
      if (!src || video.dataset.lazyLoaded === "true") return;
      video.dataset.lazyLoaded = "true";
      prepareInlineVideo(video);
      video.src = src;
      video.load();
    };
    const playVideo = (video) => {
      if (skipAutoplay) return;
      prepareInlineVideo(video);
      ensureSource(video);
      const tryPlay = () => {
        const playPromise = video.play();
        if (playPromise == null ? void 0 : playPromise.catch) {
          playPromise.catch(() => {
          });
        }
      };
      if (video.readyState >= 2) {
        tryPlay();
        return;
      }
      video.addEventListener("canplay", tryPlay, { once: true });
    };
    const pauseVideo = (video) => {
      video.pause();
    };
    videos.forEach((node) => {
      if (!(node instanceof HTMLVideoElement)) return;
      prepareInlineVideo(node);
      if (skipAutoplay) return;
      ScrollTrigger.create({
        trigger: node,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => playVideo(node),
        onEnterBack: () => playVideo(node),
        onLeave: () => pauseVideo(node),
        onLeaveBack: () => pauseVideo(node)
      });
    });
  }
  const START_HEIGHTS = [12, 8, 4, 2];
  const CLOSE_DISTANCES = [180, 320, 240, 420];
  function initPricingLines() {
    const section = document.querySelector(".pricing-1");
    const lines = section == null ? void 0 : section.querySelector(".pricing-1__lines");
    if (!section || !lines) return;
    const spans = gsap.utils.toArray(lines.querySelectorAll(":scope > span"));
    if (!spans.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) {
      gsap.set(spans, { height: 0, clearProps: "transform" });
      return;
    }
    spans.forEach((span, index) => {
      const startHeight = START_HEIGHTS[index] ?? START_HEIGHTS[START_HEIGHTS.length - 1];
      const distance = CLOSE_DISTANCES[index % CLOSE_DISTANCES.length];
      gsap.set(span, {
        height: startHeight,
        transformOrigin: "50% 50%"
      });
      gsap.to(span, {
        height: 0,
        ease: "none",
        scrollTrigger: {
          trigger: lines,
          start: "top 50%",
          end: () => `+=${distance}`,
          scrub: 0.35 + index * 0.2,
          invalidateOnRefresh: true
        }
      });
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function initAwardsSlider() {
    const section = document.querySelector(".awards-1");
    const slider = section == null ? void 0 : section.querySelector(".awards-1__slider");
    if (!section || !slider) return;
    const slides = gsap.utils.toArray(slider.querySelectorAll(".awards-1__slide"));
    if (!slides.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    const restY = slides.map((_, index) => {
      const pattern = [-12, 16, -4, 10, -18, 8, -6, 14];
      return pattern[index % pattern.length];
    });
    const state = slides.map(() => ({ y1: 0, y2: 0, rot: 0, drift: 0 }));
    const floatTweens = [];
    let scrubTween = null;
    let depthTrigger = null;
    const renderSlide = (index) => {
      const s2 = state[index];
      gsap.set(slides[index], {
        y: restY[index] + s2.y1 + s2.y2 + s2.drift,
        rotate: s2.rot,
        force3D: true
      });
    };
    const getTravel = () => {
      const sliderWidth = slider.scrollWidth;
      const view = window.innerWidth;
      const startX = view * 0.12;
      const fullEnd = -(sliderWidth - view * 0.55);
      const endX = gsap.utils.interpolate(startX, fullEnd, 0.62);
      return { startX, endX };
    };
    const killFloat = () => {
      floatTweens.splice(0).forEach((tween) => tween.kill());
    };
    const startFloat = () => {
      killFloat();
      slides.forEach((slide, index) => {
        const ampY = 10 + index % 4 * 5;
        const ampRot = 1.2 + index % 3 * 0.55;
        const duration = 2.4 + index % 5 * 0.35;
        const phase = index * 0.28 % 1;
        state[index].y1 = gsap.utils.interpolate(-ampY * 0.35, ampY * 0.35, phase);
        state[index].y2 = 0;
        state[index].rot = gsap.utils.interpolate(-ampRot * 0.4, ampRot * 0.4, 1 - phase);
        renderSlide(index);
        gsap.set(slide, { transformOrigin: "50% 50%" });
        floatTweens.push(
          gsap.to(state[index], {
            y1: `+=${ampY}`,
            rot: `+=${index % 2 === 0 ? ampRot : -ampRot}`,
            duration,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.12,
            onUpdate: () => renderSlide(index)
          })
        );
        floatTweens.push(
          gsap.to(state[index], {
            y2: ampY * 0.35,
            duration: duration * 1.45,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.08 + 0.4,
            onUpdate: () => renderSlide(index)
          })
        );
      });
    };
    const setupScrub = () => {
      var _a;
      (_a = scrubTween == null ? void 0 : scrubTween.scrollTrigger) == null ? void 0 : _a.kill();
      scrubTween == null ? void 0 : scrubTween.kill();
      depthTrigger == null ? void 0 : depthTrigger.kill();
      const { startX, endX } = getTravel();
      gsap.set(slider, { x: startX, force3D: true });
      scrubTween = gsap.fromTo(
        slider,
        { x: startX },
        {
          x: endX,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.75,
            invalidateOnRefresh: true
          }
        }
      );
      depthTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.1,
        onUpdate: (self) => {
          const wave = Math.sin(self.progress * Math.PI);
          slides.forEach((_, index) => {
            const depth = 0.55 + index % 3 * 0.22;
            state[index].drift = wave * (6 + index % 4 * 3) * depth;
            renderSlide(index);
          });
        }
      });
    };
    const setup = () => {
      setupScrub();
      startFloat();
      ScrollTrigger.refresh();
    };
    setup();
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (img && !img.complete) {
        img.addEventListener("load", setup, { once: true });
      }
    });
    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setup, 180);
    });
  }
  function initImageSlider2() {
    const section = document.querySelector(".image-slider-2");
    const slider = section == null ? void 0 : section.querySelector(".image-slider-2__slider");
    if (!section || !slider) return;
    const slides = gsap.utils.toArray(slider.querySelectorAll(".image-slider-2__slide"));
    if (!slides.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    let scrubTween = null;
    const getTravel = () => {
      const sliderWidth = slider.scrollWidth;
      const view = window.innerWidth;
      const startX = view * 0.12;
      const fullEnd = -(sliderWidth - view * 0.55);
      const endX = gsap.utils.interpolate(startX, fullEnd, 0.62);
      return { startX, endX };
    };
    const setupScrub = () => {
      var _a;
      (_a = scrubTween == null ? void 0 : scrubTween.scrollTrigger) == null ? void 0 : _a.kill();
      scrubTween == null ? void 0 : scrubTween.kill();
      const { startX, endX } = getTravel();
      gsap.set(slider, { x: startX, force3D: true });
      scrubTween = gsap.fromTo(
        slider,
        { x: startX },
        {
          x: endX,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.75,
            invalidateOnRefresh: true
          }
        }
      );
    };
    const setup = () => {
      setupScrub();
      ScrollTrigger.refresh();
    };
    setup();
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (img && !img.complete) {
        img.addEventListener("load", setup, { once: true });
      }
    });
    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setup, 180);
    });
  }
  function initImageSlider3() {
    const section = document.querySelector(".image-slider-3");
    const slider = section == null ? void 0 : section.querySelector(".image-slider-3__slider");
    if (!section || !slider) return;
    const slides = gsap.utils.toArray(slider.querySelectorAll(".image-slider-3__slide"));
    if (!slides.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    let scrubTween = null;
    const getTravel = () => {
      const sliderWidth = slider.scrollWidth;
      const view = window.innerWidth;
      const startX = view * 0.12;
      const fullEnd = -(sliderWidth - view * 0.55);
      const endX = gsap.utils.interpolate(startX, fullEnd, 0.62);
      return { startX, endX };
    };
    const setupScrub = () => {
      var _a;
      (_a = scrubTween == null ? void 0 : scrubTween.scrollTrigger) == null ? void 0 : _a.kill();
      scrubTween == null ? void 0 : scrubTween.kill();
      const { startX, endX } = getTravel();
      gsap.set(slider, { x: startX, force3D: true });
      scrubTween = gsap.fromTo(
        slider,
        { x: startX },
        {
          x: endX,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.75,
            invalidateOnRefresh: true
          }
        }
      );
    };
    const setup = () => {
      setupScrub();
      ScrollTrigger.refresh();
    };
    setup();
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (img && !img.complete) {
        img.addEventListener("load", setup, { once: true });
      }
    });
    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setup, 180);
    });
  }
  function createTextureLoader() {
    const loader = new THREE__namespace.TextureLoader();
    if (isFileProtocol()) {
      loader.crossOrigin = void 0;
    }
    return loader;
  }
  function textureFromImage(image) {
    const width = image.naturalWidth || image.width || 0;
    const height = image.naturalHeight || image.height || 0;
    if (!width || !height) return null;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(image, 0, 0);
    const texture = new THREE__namespace.CanvasTexture(canvas);
    texture.colorSpace = THREE__namespace.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }
  function loadTextureFromSafeUrl(src, onLoad, onError) {
    const image = new Image();
    image.onload = () => {
      const texture = textureFromImage(image);
      if (!texture) {
        onError == null ? void 0 : onError(new Error(`Texture has no dimensions: ${src.slice(0, 64)}`));
        return;
      }
      onLoad(texture);
    };
    image.onerror = (event) => onError == null ? void 0 : onError(event);
    image.src = src;
  }
  function loadTextureViaBlob(src, onLoad, onError) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", src, true);
    xhr.responseType = "blob";
    xhr.onload = () => {
      if (xhr.status !== 0 && xhr.status !== 200) {
        onError == null ? void 0 : onError(new Error(`Texture XHR ${xhr.status}: ${src}`));
        return;
      }
      const blob = xhr.response;
      if (!(blob instanceof Blob) || blob.size === 0) {
        onError == null ? void 0 : onError(new Error(`Empty texture blob: ${src}`));
        return;
      }
      const objectUrl = URL.createObjectURL(blob);
      loadTextureFromSafeUrl(
        objectUrl,
        (texture) => {
          URL.revokeObjectURL(objectUrl);
          onLoad(texture);
        },
        (err) => {
          URL.revokeObjectURL(objectUrl);
          onError == null ? void 0 : onError(err);
        }
      );
    };
    xhr.onerror = () => onError == null ? void 0 : onError(new Error(`Texture XHR failed: ${src}`));
    xhr.send();
  }
  function loadTexture(src, onLoad, onError, imageEl) {
    const url = (src || (imageEl == null ? void 0 : imageEl.getAttribute("src")) || (imageEl == null ? void 0 : imageEl.src) || "").trim();
    if (!url) {
      return;
    }
    const reportError = (err) => {
      if (typeof console !== "undefined") {
        console.warn("[norio] texture load failed", url.slice(0, 96), err);
      }
    };
    if (isFileProtocol()) {
      if (/^(?:data|blob):/i.test(url)) {
        loadTextureFromSafeUrl(url, onLoad, reportError);
        return;
      }
      loadTextureViaBlob(url, onLoad, reportError);
      return;
    }
    const finish = (image) => {
      const texture = new THREE__namespace.Texture(image);
      const w = image.naturalWidth || image.width || 0;
      if (!w) {
        reportError(new Error(`Texture has no dimensions: ${url}`));
        return;
      }
      texture.colorSpace = THREE__namespace.SRGBColorSpace;
      texture.needsUpdate = true;
      onLoad(texture);
    };
    if (imageEl instanceof HTMLImageElement) {
      if (imageEl.complete && imageEl.naturalWidth > 0) {
        finish(imageEl);
        return;
      }
      imageEl.addEventListener("load", () => finish(imageEl), { once: true });
      imageEl.addEventListener("error", (event) => reportError(event), { once: true });
      return;
    }
    if (/^(?:data|blob):/i.test(url)) {
      loadTextureFromSafeUrl(url, onLoad, reportError);
      return;
    }
    createTextureLoader().load(url, onLoad, void 0, reportError);
  }
  const CONFIG$2 = {
    minHeight: 1.35,
    maxHeight: 1.6,
    aspectRatio: 430 / 544,
    gap: 0.22,
    stackX: 0,
    stepAmount: 1.85,
    smoothing: 0.05,
    distortionStrength: 2.5,
    distortionSmoothing: 0.1,
    momentumFriction: 0.95,
    momentumThreshold: 1e-3,
    wheelSpeed: 0.01,
    wheelMax: 150,
    dragSpeed: 0.01,
    dragMomentum: 0.01,
    touchSpeed: 0.01,
    touchMomentum: 0.1
  };
  const wrap$1 = (value, range) => (value % range + range) % range;
  const zeroPad$1 = (n) => String(n).padStart(2, "0");
  function slideHeight(index) {
    const wave = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
    const t = wave - Math.floor(wave);
    return CONFIG$2.minHeight + t * (CONFIG$2.maxHeight - CONFIG$2.minHeight);
  }
  function motionDurationMs$1() {
    return readCssDuration("--motion-duration-instant", 400);
  }
  function readCssDuration(name, fallbackMs) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallbackMs;
  }
  function readSlides$1(root) {
    return [...root.querySelectorAll(".projects-2__source article")].map((el) => {
      var _a, _b;
      const img = el.querySelector("img");
      return {
        title: ((_a = el.querySelector("h2")) == null ? void 0 : _a.textContent.trim()) || "",
        text: ((_b = el.querySelector("[data-projects-2-text]")) == null ? void 0 : _b.textContent.trim()) || "",
        href: el.dataset.href || "project-details.html",
        indexLabel: el.dataset.index || "",
        image: (img == null ? void 0 : img.getAttribute("src")) || "",
        imageEl: img instanceof HTMLImageElement ? img : null,
        imageAlt: (img == null ? void 0 : img.getAttribute("alt")) || "",
        tags: [...el.querySelectorAll("li")].map((item) => item.textContent.trim()).filter(Boolean)
      };
    });
  }
  function applyDistortion$2(mesh, positionY, strength) {
    const positions = mesh.geometry.attributes.position;
    const original = mesh.userData.originalVertices;
    for (let i = 0; i < positions.count; i += 1) {
      const x = original[i * 3];
      const y = original[i * 3 + 1];
      const distance = Math.sqrt(x * x + (positionY + y) ** 2);
      const falloff = Math.max(0, 1 - distance / 2);
      const bend = Math.pow(Math.sin(falloff * Math.PI / 2), 1.5);
      positions.setZ(i, bend * strength);
    }
    positions.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  }
  function initProjects2() {
    const root = document.querySelector("[data-projects-2]");
    if (!root || root.dataset.projects2Ready) return;
    root.dataset.projects2Ready = "true";
    const stage = root.querySelector("[data-projects-2-stage]");
    const canvas = root.querySelector("[data-projects-2-canvas]");
    const fallback = root.querySelector("[data-projects-2-fallback]");
    const slides = readSlides$1(root);
    if (!(stage instanceof HTMLElement) || !(canvas instanceof HTMLCanvasElement) || !slides.length) {
      return;
    }
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2 || !canUseLocalWebGlTextures()) {
      root.classList.add("is-static");
      return;
    }
    const hud = {
      copy: root.querySelector(".projects-2__copy"),
      index: root.querySelector("[data-projects-2-index]"),
      link: root.querySelector("[data-projects-2-link]"),
      lead: root.querySelector("[data-projects-2-lead]"),
      tags: root.querySelector("[data-projects-2-tags]"),
      pagination: root.querySelector("[data-projects-2-pagination]"),
      tens: root.querySelector(".projects-2__pagination-tens"),
      ones: root.querySelector(".projects-2__pagination-ones"),
      total: root.querySelector("[data-projects-2-total]")
    };
    const totalLabel = zeroPad$1(slides.length);
    if (hud.total) hud.total.textContent = totalLabel;
    const Odometer = window.Odometer;
    const odometerDuration = motionDurationMs$1();
    const wheels = { tens: null, ones: null };
    if (Odometer && hud.tens && hud.ones) {
      wheels.tens = new Odometer({
        el: hud.tens,
        value: 0,
        format: "d",
        duration: odometerDuration
      }) || hud.tens.odometer;
      wheels.ones = new Odometer({
        el: hud.ones,
        value: 1,
        format: "d",
        duration: odometerDuration
      }) || hud.ones.odometer;
    }
    let renderer = null;
    try {
      renderer = new THREE__namespace.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false
      });
    } catch {
      root.classList.add("is-static");
      return;
    }
    if (!renderer.getContext()) {
      renderer.dispose();
      root.classList.add("is-static");
      return;
    }
    root.classList.add("is-webgl");
    if (fallback instanceof HTMLElement) fallback.hidden = true;
    renderer.outputColorSpace = THREE__namespace.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE__namespace.Scene();
    const camera = new THREE__namespace.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5;
    const applyBackground = () => {
      const cssColor = getComputedStyle(root).backgroundColor;
      scene.background = new THREE__namespace.Color(cssColor);
    };
    applyBackground();
    const slideHeights = slides.map((_, index) => slideHeight(index));
    const slideOffsets = [];
    let stackPosition = 0;
    for (let i = 0; i < slides.length; i += 1) {
      if (i === 0) {
        slideOffsets.push(0);
        stackPosition = slideHeights[0] / 2;
      } else {
        stackPosition += CONFIG$2.gap + slideHeights[i] / 2;
        slideOffsets.push(stackPosition);
        stackPosition += slideHeights[i] / 2;
      }
    }
    const loopLength = stackPosition + CONFIG$2.gap + slideHeights[0] / 2;
    const halfLoop = loopLength / 2;
    const meshes = [];
    slides.forEach((slide, i) => {
      const height = slideHeights[i];
      const width = height * CONFIG$2.aspectRatio;
      const geometry = new THREE__namespace.PlaneGeometry(width, height, 32, 16);
      const material = new THREE__namespace.MeshBasicMaterial({
        side: THREE__namespace.DoubleSide,
        color: 10066329
      });
      const mesh = new THREE__namespace.Mesh(geometry, material);
      mesh.userData = {
        originalVertices: [...geometry.attributes.position.array],
        offset: slideOffsets[i],
        index: i
      };
      if (slide.image || slide.imageEl) {
        loadTexture(
          slide.image,
          (texture) => {
            texture.colorSpace = THREE__namespace.SRGBColorSpace;
            material.map = texture;
            material.color.set(16777215);
            material.needsUpdate = true;
            const imageAspect = texture.image.width / texture.image.height;
            const planeAspect = width / height;
            const ratio = imageAspect / planeAspect;
            if (ratio > 1) mesh.scale.y = 1 / ratio;
            else mesh.scale.x = ratio;
          },
          void 0,
          slide.imageEl
        );
      }
      scene.add(mesh);
      meshes.push(mesh);
    });
    let scrollPosition = 0;
    let scrollTarget = 0;
    let scrollMomentum = 0;
    let isScrolling = false;
    let lastFrameTime = 0;
    let distortionAmount = 0;
    let distortionTarget = 0;
    let velocityPeak = 0;
    let scrollDirection = 0;
    let directionTarget = 0;
    const velocityHistory = [0, 0, 0, 0, 0];
    let isDragging = false;
    let dragStartY = 0;
    let dragDelta = 0;
    let touchStartY = 0;
    let touchLastY = 0;
    let activeSlideIndex = -1;
    let lastCurrent = 1;
    let rafId = 0;
    let isPaused = false;
    let scrollIdleTimer = 0;
    const addDistortionBurst = (amount) => {
      distortionTarget = Math.min(1, distortionTarget + amount);
    };
    const markScrolling = (idleMs = 150) => {
      isScrolling = true;
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        isScrolling = false;
      }, idleMs);
    };
    const setCurrent = (current) => {
      if (current === lastCurrent) return;
      lastCurrent = current;
      const padded = zeroPad$1(current);
      if (hud.pagination) {
        hud.pagination.setAttribute("aria-label", `${padded}/${totalLabel}`);
      }
      if (wheels.tens && wheels.ones) {
        wheels.tens.update(Number(padded[0]));
        wheels.ones.update(Number(padded[1]));
        return;
      }
      if (hud.tens) hud.tens.textContent = padded[0];
      if (hud.ones) hud.ones.textContent = padded[1];
    };
    const hudPanels = [hud.copy, hud.tags].filter((el) => el instanceof HTMLElement);
    const hudFadeOut = readCssDuration("--layout-projects2-hud-out", 560) / 1e3;
    const hudFadeIn = readCssDuration("--layout-projects2-hud-in", 1100) / 1e3;
    let hudShown = -1;
    let hudBusy = false;
    let hudQueued = -1;
    let hudDrift = 0;
    const writeHud = (index) => {
      const slide = slides[index];
      if (!slide) return;
      if (hud.index) hud.index.textContent = slide.indexLabel || zeroPad$1(index + 1);
      if (hud.link instanceof HTMLAnchorElement) {
        hud.link.textContent = slide.title;
        hud.link.href = slide.href;
      }
      if (hud.lead) hud.lead.textContent = slide.text;
      if (hud.tags) {
        hud.tags.replaceChildren();
        slide.tags.forEach((tag) => {
          const item = document.createElement("li");
          item.className = "projects-2__tag";
          item.textContent = tag;
          hud.tags.appendChild(item);
        });
      }
    };
    const playHudIn = (index) => {
      writeHud(index);
      hudShown = index;
      gsap.fromTo(
        hudPanels,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: hudFadeIn,
          ease: "power3.out",
          overwrite: "auto",
          onComplete: () => {
            hudBusy = false;
            if (hudQueued !== -1 && hudQueued !== hudShown) {
              const next = hudQueued;
              hudQueued = -1;
              fadeHudTo(next);
            }
          }
        }
      );
    };
    const fadeHudTo = (index) => {
      if (index === hudShown) return;
      if (hudBusy) {
        hudQueued = index;
        return;
      }
      hudBusy = true;
      gsap.to(hudPanels, {
        autoAlpha: 0,
        duration: hudFadeOut,
        ease: "power2.inOut",
        overwrite: "auto",
        onComplete: () => playHudIn(index)
      });
    };
    const setActiveSlide = (index) => {
      if (index === activeSlideIndex) return;
      activeSlideIndex = index;
      setCurrent(index + 1);
      if (hudShown === -1) {
        writeHud(index);
        hudShown = index;
        return;
      }
      fadeHudTo(index);
    };
    const setHudDrift = (el, value) => {
      if (!(el instanceof HTMLElement)) return;
      el.style.setProperty("--projects-2-drift", `${value}px`);
    };
    const resize = () => {
      const width = stage.clientWidth || window.innerWidth;
      const height = stage.clientHeight || window.innerHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const onWheel = (event) => {
      event.preventDefault();
      const clampedDelta = Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY), CONFIG$2.wheelMax);
      addDistortionBurst(Math.abs(clampedDelta) * 1e-3);
      scrollTarget += clampedDelta * CONFIG$2.wheelSpeed;
      markScrolling();
    };
    const onTouchStart = (event) => {
      if (!event.touches[0]) return;
      touchStartY = touchLastY = event.touches[0].clientY;
      isScrolling = false;
      scrollMomentum = 0;
    };
    const onTouchMove = (event) => {
      if (!event.touches[0]) return;
      event.preventDefault();
      const deltaY = event.touches[0].clientY - touchLastY;
      touchLastY = event.touches[0].clientY;
      addDistortionBurst(Math.abs(deltaY) * 0.02);
      scrollTarget -= deltaY * CONFIG$2.touchSpeed;
      markScrolling();
    };
    const onTouchEnd = () => {
      const swipeVelocity = (touchLastY - touchStartY) * 5e-3;
      if (Math.abs(swipeVelocity) > 0.5) {
        scrollMomentum = -swipeVelocity * CONFIG$2.touchMomentum;
        addDistortionBurst(Math.abs(swipeVelocity) * 0.45);
        markScrolling(800);
      }
    };
    const onPointerDown = (event) => {
      if (event.target instanceof Element && event.target.closest("a")) return;
      isDragging = true;
      dragStartY = event.clientY;
      dragDelta = 0;
      scrollMomentum = 0;
      root.classList.add("is-dragging");
    };
    const onPointerMove = (event) => {
      if (!isDragging) return;
      const deltaY = event.clientY - dragStartY;
      dragStartY = event.clientY;
      dragDelta = deltaY;
      addDistortionBurst(Math.abs(deltaY) * 0.02);
      scrollTarget -= deltaY * CONFIG$2.dragSpeed;
      markScrolling();
    };
    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      root.classList.remove("is-dragging");
      if (Math.abs(dragDelta) > 2) {
        scrollMomentum = -dragDelta * CONFIG$2.dragMomentum;
        addDistortionBurst(Math.abs(dragDelta) * 5e-3);
        markScrolling(800);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === "j") {
        event.preventDefault();
        scrollTarget += CONFIG$2.stepAmount;
        addDistortionBurst(0.35);
        markScrolling();
      }
      if (event.key === "ArrowUp" || event.key === "PageUp" || event.key === "k") {
        event.preventDefault();
        scrollTarget -= CONFIG$2.stepAmount;
        addDistortionBurst(0.35);
        markScrolling();
      }
    };
    const tick = (time) => {
      rafId = requestAnimationFrame(tick);
      if (isPaused) return;
      const deltaTime = lastFrameTime ? (time - lastFrameTime) / 1e3 : 0.016;
      lastFrameTime = time;
      const previousScroll = scrollPosition;
      if (isScrolling) {
        scrollTarget += scrollMomentum;
        scrollMomentum *= CONFIG$2.momentumFriction;
        if (Math.abs(scrollMomentum) < CONFIG$2.momentumThreshold) scrollMomentum = 0;
      }
      scrollPosition += (scrollTarget - scrollPosition) * CONFIG$2.smoothing;
      const frameDelta = scrollPosition - previousScroll;
      if (Math.abs(frameDelta) > 1e-5) {
        directionTarget = frameDelta > 0 ? 1 : -1;
      }
      scrollDirection += (directionTarget - scrollDirection) * 0.08;
      const velocity = Math.abs(frameDelta) / Math.max(deltaTime, 1e-3);
      velocityHistory.push(velocity);
      velocityHistory.shift();
      const averageVelocity = velocityHistory.reduce((a, b) => a + b, 0) / velocityHistory.length;
      if (averageVelocity > velocityPeak) velocityPeak = averageVelocity;
      const isDecelerating = averageVelocity / (velocityPeak + 1e-3) < 0.7 && velocityPeak > 0.5;
      velocityPeak *= 0.99;
      if (velocity > 0.05) {
        distortionTarget = Math.max(distortionTarget, Math.min(1, velocity * 0.1));
      }
      if (isDecelerating || averageVelocity < 0.2) {
        distortionTarget *= isDecelerating ? 0.95 : 0.855;
      }
      distortionAmount += (distortionTarget - distortionAmount) * CONFIG$2.distortionSmoothing;
      const signedDistortion = distortionAmount * scrollDirection;
      const driftTarget = signedDistortion * 20;
      hudDrift += (driftTarget - hudDrift) * 0.028;
      setHudDrift(hud.copy, hudDrift);
      setHudDrift(hud.tags, hudDrift * 0.72);
      let closestDistance = Infinity;
      let closestIndex = 0;
      meshes.forEach((mesh) => {
        const { offset } = mesh.userData;
        let y = -(offset - wrap$1(scrollPosition, loopLength));
        y = wrap$1(y + halfLoop, loopLength) - halfLoop;
        mesh.position.x = CONFIG$2.stackX;
        mesh.position.y = y;
        if (Math.abs(y) < closestDistance) {
          closestDistance = Math.abs(y);
          closestIndex = mesh.userData.index;
        }
        if (Math.abs(y) < halfLoop + CONFIG$2.maxHeight) {
          applyDistortion$2(mesh, y, CONFIG$2.distortionStrength * signedDistortion);
        }
      });
      setActiveSlide(closestIndex);
      renderer.render(scene, camera);
    };
    resize();
    setActiveSlide(0);
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchmove", onTouchMove, { passive: false });
    stage.addEventListener("touchend", onTouchEnd);
    stage.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("keydown", onKeyDown);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    const themeObserver = new MutationObserver(applyBackground);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-color-scheme", "class"]
    });
    const io = new IntersectionObserver(
      ([entry]) => {
        isPaused = !entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(root);
    const onVisibility = () => {
      isPaused = document.hidden;
      if (!document.hidden && !rafId) {
        lastFrameTime = 0;
        rafId = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    rafId = requestAnimationFrame(tick);
  }
  const CONFIG$1 = {
    smoothing: 0.05,
    distortionStrength: 2,
    distortionSmoothing: 0.1,
    momentumFriction: 0.95,
    momentumThreshold: 1e-3,
    wheelSpeed: 0.01,
    wheelMax: 150,
    dragSpeed: 0.01,
    dragMomentum: 0.01,
    touchSpeed: 0.01,
    touchMomentum: 0.1
  };
  const wrap = (value, range) => (value % range + range) % range;
  const zeroPad = (n) => String(n).padStart(2, "0");
  function motionDurationMs() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--motion-duration-instant").trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : 400;
  }
  function readTokenPx(name, fallback) {
    const probe = document.createElement("div");
    probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;width:var(${name})`;
    document.documentElement.appendChild(probe);
    const width = probe.getBoundingClientRect().width;
    probe.remove();
    return width || fallback;
  }
  function readSlides(root) {
    return [...root.querySelectorAll(".projects-3__source article")].map((el) => {
      var _a;
      const img = el.querySelector("img");
      return {
        title: ((_a = el.querySelector("h2")) == null ? void 0 : _a.textContent.trim()) || "",
        href: el.dataset.href || "project-details.html",
        indexLabel: el.dataset.index || "",
        image: (img == null ? void 0 : img.getAttribute("src")) || "",
        imageEl: img instanceof HTMLImageElement ? img : null,
        imageAlt: (img == null ? void 0 : img.getAttribute("alt")) || ""
      };
    });
  }
  function applyCover$1(texture, planeAspect) {
    texture.colorSpace = THREE__namespace.SRGBColorSpace;
    texture.wrapS = THREE__namespace.ClampToEdgeWrapping;
    texture.wrapT = THREE__namespace.ClampToEdgeWrapping;
    const imageAspect = texture.image.width / texture.image.height;
    if (imageAspect > planeAspect) {
      const rx = planeAspect / imageAspect;
      texture.repeat.set(rx, 1);
      texture.offset.set((1 - rx) / 2, 0);
    } else {
      const ry = imageAspect / planeAspect;
      texture.repeat.set(1, ry);
      texture.offset.set(0, (1 - ry) / 2);
    }
    texture.needsUpdate = true;
  }
  function applyDistortion$1(mesh, positionX, strength, radius) {
    const positions = mesh.geometry.attributes.position;
    const original = mesh.userData.originalVertices;
    const safeRadius = Math.max(radius, 1e-3);
    for (let i = 0; i < positions.count; i += 1) {
      const x = original[i * 3];
      const y = original[i * 3 + 1];
      const distance = Math.sqrt((positionX + x) ** 2 + y * y);
      const falloff = Math.max(0, 1 - distance / safeRadius);
      const bend = Math.pow(Math.sin(falloff * Math.PI / 2), 1.5);
      positions.setZ(i, bend * strength);
    }
    positions.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  }
  function createPagination(root, slideCount) {
    const pagination = {
      root: root.querySelector("[data-projects-3-pagination]"),
      tens: root.querySelector(".projects-3__pagination-tens"),
      ones: root.querySelector(".projects-3__pagination-ones"),
      total: root.querySelector("[data-projects-3-total]")
    };
    const totalLabel = zeroPad(slideCount);
    if (pagination.total) pagination.total.textContent = totalLabel;
    const Odometer = window.Odometer;
    const odometerDuration = motionDurationMs();
    const wheels = { tens: null, ones: null };
    if (Odometer && pagination.tens && pagination.ones) {
      wheels.tens = new Odometer({
        el: pagination.tens,
        value: 0,
        format: "d",
        duration: odometerDuration
      }) || pagination.tens.odometer;
      wheels.ones = new Odometer({
        el: pagination.ones,
        value: 1,
        format: "d",
        duration: odometerDuration
      }) || pagination.ones.odometer;
    }
    let lastCurrent = 1;
    const setCurrent = (current) => {
      if (current === lastCurrent) return;
      lastCurrent = current;
      const padded = zeroPad(current);
      if (pagination.root) {
        pagination.root.setAttribute("aria-label", `${padded}/${totalLabel}`);
      }
      if (wheels.tens && wheels.ones) {
        wheels.tens.update(Number(padded[0]));
        wheels.ones.update(Number(padded[1]));
        return;
      }
      if (pagination.tens) pagination.tens.textContent = padded[0];
      if (pagination.ones) pagination.ones.textContent = padded[1];
    };
    return { setCurrent };
  }
  function initDomStrip(root, list, slideCount) {
    root.classList.add("is-dom-strip");
    const viewport = root.querySelector(".projects-3__viewport");
    const track = viewport instanceof HTMLElement ? viewport : list;
    const cards = [...list.querySelectorAll(".project-card-3")];
    const { setCurrent } = createPagination(root, slideCount);
    let scrollPosition = 0;
    let scrollTarget = 0;
    let scrollMomentum = 0;
    let isScrolling = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragDelta = 0;
    let dragTravel = 0;
    let touchStartX = 0;
    let touchLastX = 0;
    let maxScroll = 0;
    let cardStep = 1;
    let isPaused = false;
    let scrollIdleTimer = 0;
    const measure = () => {
      var _a;
      const gap = readTokenPx("--layout-projects3-card-gap", 30);
      const cardW = ((_a = cards[0]) == null ? void 0 : _a.getBoundingClientRect().width) || readTokenPx("--layout-projects3-card-width", 430);
      cardStep = cardW + gap;
      maxScroll = Math.max(0, list.scrollWidth - track.clientWidth);
      scrollTarget = Math.max(0, Math.min(maxScroll, scrollTarget));
      scrollPosition = Math.max(0, Math.min(maxScroll, scrollPosition));
      list.style.transform = `translate3d(${-scrollPosition}px, 0, 0)`;
    };
    const markScrolling = (idleMs = 150) => {
      isScrolling = true;
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        isScrolling = false;
      }, idleMs);
    };
    const clampTarget = () => {
      scrollTarget = Math.max(0, Math.min(maxScroll, scrollTarget));
    };
    const onWheel = (event) => {
      event.preventDefault();
      const primary = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const clampedDelta = Math.sign(primary) * Math.min(Math.abs(primary), CONFIG$1.wheelMax);
      scrollTarget += clampedDelta * (CONFIG$1.wheelSpeed * 100);
      clampTarget();
      markScrolling();
    };
    const onTouchStart = (event) => {
      if (!event.touches[0]) return;
      touchStartX = touchLastX = event.touches[0].clientX;
      isScrolling = false;
      scrollMomentum = 0;
    };
    const onTouchMove = (event) => {
      if (!event.touches[0]) return;
      event.preventDefault();
      const deltaX = event.touches[0].clientX - touchLastX;
      touchLastX = event.touches[0].clientX;
      scrollTarget -= deltaX;
      clampTarget();
      markScrolling();
    };
    const onTouchEnd = () => {
      const swipeVelocity = (touchLastX - touchStartX) * 0.5;
      if (Math.abs(swipeVelocity) > 8) {
        scrollMomentum = -swipeVelocity * CONFIG$1.touchMomentum;
        markScrolling(800);
      }
    };
    const onPointerDown = (event) => {
      var _a;
      if (event.target instanceof Element && event.target.closest("a") && event.pointerType === "mouse") ;
      isDragging = true;
      dragStartX = event.clientX;
      dragDelta = 0;
      dragTravel = 0;
      scrollMomentum = 0;
      root.classList.add("is-dragging");
      (_a = track.setPointerCapture) == null ? void 0 : _a.call(track, event.pointerId);
    };
    const onPointerMove = (event) => {
      if (!isDragging) return;
      const deltaX = event.clientX - dragStartX;
      dragStartX = event.clientX;
      dragDelta = deltaX;
      dragTravel += Math.abs(deltaX);
      scrollTarget -= deltaX;
      clampTarget();
      markScrolling();
    };
    const onPointerUp = (event) => {
      if (!isDragging) return;
      isDragging = false;
      root.classList.remove("is-dragging");
      if (Math.abs(dragDelta) > 2) {
        scrollMomentum = -dragDelta * (CONFIG$1.dragMomentum * 40);
        markScrolling(800);
      }
      if (dragTravel > 8) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    const onClickCapture = (event) => {
      if (dragTravel > 8) {
        event.preventDefault();
        event.stopPropagation();
        dragTravel = 0;
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === "l") {
        event.preventDefault();
        scrollTarget += cardStep;
        clampTarget();
        markScrolling();
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp" || event.key === "h") {
        event.preventDefault();
        scrollTarget -= cardStep;
        clampTarget();
        markScrolling();
      }
    };
    const tick = () => {
      requestAnimationFrame(tick);
      if (isPaused) return;
      if (isScrolling) {
        scrollTarget += scrollMomentum;
        clampTarget();
        scrollMomentum *= CONFIG$1.momentumFriction;
        if (Math.abs(scrollMomentum) < CONFIG$1.momentumThreshold) scrollMomentum = 0;
      }
      scrollPosition += (scrollTarget - scrollPosition) * Math.min(1, CONFIG$1.smoothing * 4);
      list.style.transform = `translate3d(${-scrollPosition}px, 0, 0)`;
      const index = Math.max(
        0,
        Math.min(slideCount - 1, Math.round(scrollPosition / Math.max(cardStep, 1)))
      );
      setCurrent(index + 1);
    };
    measure();
    setCurrent(1);
    track.addEventListener("wheel", onWheel, { passive: false });
    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove", onTouchMove, { passive: false });
    track.addEventListener("touchend", onTouchEnd);
    track.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    list.addEventListener("click", onClickCapture, true);
    track.setAttribute("tabindex", "0");
    track.addEventListener("keydown", onKeyDown);
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    resizeObserver.observe(list);
    const io = new IntersectionObserver(
      ([entry]) => {
        isPaused = !entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(root);
    requestAnimationFrame(tick);
  }
  function initProjects3() {
    const root = document.querySelector("[data-projects-3]");
    if (!root || root.dataset.projects3Ready) return;
    root.dataset.projects3Ready = "true";
    const stage = root.querySelector("[data-projects-3-stage]");
    const canvas = root.querySelector("[data-projects-3-canvas]");
    const fallback = root.querySelector("[data-projects-3-fallback]");
    const captions = [...root.querySelectorAll(".projects-3__caption")];
    const slides = readSlides(root);
    if (!slides.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) {
      root.classList.add("is-static");
      return;
    }
    if (!canUseLocalWebGlTextures() || !(stage instanceof HTMLElement) || !(canvas instanceof HTMLCanvasElement)) {
      if (fallback instanceof HTMLElement) {
        initDomStrip(root, fallback, slides.length);
      } else {
        root.classList.add("is-static");
      }
      return;
    }
    let renderer = null;
    try {
      renderer = new THREE__namespace.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false
      });
    } catch {
      if (fallback instanceof HTMLElement) {
        initDomStrip(root, fallback, slides.length);
      } else {
        root.classList.add("is-static");
      }
      return;
    }
    if (!renderer.getContext()) {
      renderer.dispose();
      if (fallback instanceof HTMLElement) {
        initDomStrip(root, fallback, slides.length);
      } else {
        root.classList.add("is-static");
      }
      return;
    }
    const { setCurrent } = createPagination(root, slides.length);
    root.classList.add("is-webgl");
    if (fallback instanceof HTMLElement) fallback.hidden = true;
    renderer.outputColorSpace = THREE__namespace.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE__namespace.Scene();
    const camera = new THREE__namespace.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5;
    const applyBackground = () => {
      const cssColor = getComputedStyle(root).backgroundColor;
      scene.background = new THREE__namespace.Color(cssColor);
    };
    applyBackground();
    const projectVector = new THREE__namespace.Vector3();
    const pointerNdc = new THREE__namespace.Vector2();
    const raycaster = new THREE__namespace.Raycaster();
    const meshes = [];
    slides.forEach((slide, i) => {
      const geometry = new THREE__namespace.PlaneGeometry(1, 1, 32, 16);
      const material = new THREE__namespace.MeshBasicMaterial({
        side: THREE__namespace.DoubleSide,
        color: 10066329
      });
      const mesh = new THREE__namespace.Mesh(geometry, material);
      mesh.userData = {
        originalVertices: [...geometry.attributes.position.array],
        offset: 0,
        index: i,
        planeW: 1,
        planeH: 1
      };
      if (slide.image || slide.imageEl) {
        loadTexture(
          slide.image,
          (texture) => {
            applyCover$1(texture, mesh.userData.planeW / mesh.userData.planeH);
            material.map = texture;
            material.color.set(16777215);
            material.needsUpdate = true;
          },
          void 0,
          slide.imageEl
        );
      }
      scene.add(mesh);
      meshes.push(mesh);
    });
    let planeW = 1;
    let planeH = 1;
    let planeGap = 0.2;
    let focusX = 0;
    let stackY = 0;
    let loopLength = 1;
    let halfLoop = 0.5;
    let metaGapPx = 28;
    let scrollPosition = 0;
    let scrollTarget = 0;
    let scrollMomentum = 0;
    let isScrolling = false;
    let lastFrameTime = 0;
    let distortionAmount = 0;
    let distortionTarget = 0;
    let velocityPeak = 0;
    let scrollDirection = 0;
    let directionTarget = 0;
    const velocityHistory = [0, 0, 0, 0, 0];
    let isDragging = false;
    let dragStartX = 0;
    let dragDelta = 0;
    let dragTravel = 0;
    let touchStartX = 0;
    let touchLastX = 0;
    let activeSlideIndex = -1;
    let rafId = 0;
    let isPaused = false;
    let lastLayoutKey = "";
    let scrollIdleTimer = 0;
    const addDistortionBurst = (amount) => {
      distortionTarget = Math.min(1, distortionTarget + amount);
    };
    const markScrolling = (idleMs = 150) => {
      isScrolling = true;
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        isScrolling = false;
      }, idleMs);
    };
    const setActiveSlide = (index) => {
      if (index === activeSlideIndex) return;
      activeSlideIndex = index;
      setCurrent(index + 1);
    };
    const layoutPlanes = () => {
      const width = canvas.clientWidth || stage.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || stage.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      const viewH = 2 * Math.tan(camera.fov * Math.PI / 360) * camera.position.z;
      const viewW = viewH * camera.aspect;
      const pxToWorld = viewH / height;
      const layoutKey = `${width}x${height}`;
      const cardW = readTokenPx("--layout-projects3-card-width", 430);
      const cardH = readTokenPx("--layout-projects3-card-height", 544);
      const cardGap = readTokenPx("--layout-projects3-card-gap", 30);
      const inset = readTokenPx("--layout-projects3-slider-inset", 111);
      const bleed = readTokenPx("--layout-projects3-stage-bleed", 280);
      metaGapPx = readTokenPx("--layout-projects3-card-meta-gap", 28);
      if (layoutKey === lastLayoutKey && planeW > 1) return;
      lastLayoutKey = layoutKey;
      planeW = cardW * pxToWorld;
      planeH = cardH * pxToWorld;
      planeGap = cardGap * pxToWorld;
      const insetWorld = inset / width * viewW - viewW / 2;
      focusX = insetWorld + planeW / 2;
      stackY = viewH / 2 - bleed * pxToWorld - planeH / 2;
      loopLength = slides.length * (planeW + planeGap);
      halfLoop = loopLength / 2;
      meshes.forEach((mesh, i) => {
        const old = mesh.geometry;
        const geometry = new THREE__namespace.PlaneGeometry(planeW, planeH, 32, 16);
        mesh.geometry = geometry;
        mesh.userData.originalVertices = [...geometry.attributes.position.array];
        mesh.userData.offset = i * (planeW + planeGap);
        mesh.userData.planeW = planeW;
        mesh.userData.planeH = planeH;
        old.dispose();
        if (mesh.material.map) {
          applyCover$1(mesh.material.map, planeW / planeH);
        }
      });
    };
    const placeCaption = (mesh, caption) => {
      if (!(caption instanceof HTMLElement)) return;
      projectVector.set(-planeW / 2, -planeH / 2, 0);
      projectVector.applyMatrix4(mesh.matrixWorld);
      projectVector.project(camera);
      const canvasW = canvas.clientWidth;
      const canvasH = canvas.clientHeight;
      const stageW = stage.clientWidth;
      const stageH = stage.clientHeight;
      const x = (projectVector.x * 0.5 + 0.5) * canvasW;
      const y = (-projectVector.y * 0.5 + 0.5) * canvasH + canvas.offsetTop + metaGapPx;
      const w = planeW / (2 * Math.tan(camera.fov * Math.PI / 360) * camera.position.z * camera.aspect) * canvasW;
      const on = x < stageW && x + w * 0.35 > 0 && y < stageH + 80 && y > -80;
      caption.style.setProperty("--projects-3-x", `${x}px`);
      caption.style.setProperty("--projects-3-y", `${y}px`);
      caption.style.setProperty("--projects-3-w", `${w}px`);
      caption.classList.toggle("is-on", on);
    };
    const onWheel = (event) => {
      event.preventDefault();
      const primary = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const clampedDelta = Math.sign(primary) * Math.min(Math.abs(primary), CONFIG$1.wheelMax);
      addDistortionBurst(Math.abs(clampedDelta) * 1e-3);
      scrollTarget += clampedDelta * CONFIG$1.wheelSpeed;
      markScrolling();
    };
    const onTouchStart = (event) => {
      if (!event.touches[0]) return;
      touchStartX = touchLastX = event.touches[0].clientX;
      isScrolling = false;
      scrollMomentum = 0;
    };
    const onTouchMove = (event) => {
      if (!event.touches[0]) return;
      event.preventDefault();
      const deltaX = event.touches[0].clientX - touchLastX;
      touchLastX = event.touches[0].clientX;
      addDistortionBurst(Math.abs(deltaX) * 0.02);
      scrollTarget -= deltaX * CONFIG$1.touchSpeed;
      markScrolling();
    };
    const onTouchEnd = () => {
      const swipeVelocity = (touchLastX - touchStartX) * 5e-3;
      if (Math.abs(swipeVelocity) > 0.5) {
        scrollMomentum = -swipeVelocity * CONFIG$1.touchMomentum;
        addDistortionBurst(Math.abs(swipeVelocity) * 0.45);
        markScrolling(800);
      }
    };
    const onPointerDown = (event) => {
      if (event.target instanceof Element && event.target.closest("a")) return;
      isDragging = true;
      dragStartX = event.clientX;
      dragDelta = 0;
      dragTravel = 0;
      scrollMomentum = 0;
      root.classList.add("is-dragging");
    };
    const onPointerMove = (event) => {
      if (!isDragging) return;
      const deltaX = event.clientX - dragStartX;
      dragStartX = event.clientX;
      dragDelta = deltaX;
      dragTravel += Math.abs(deltaX);
      addDistortionBurst(Math.abs(deltaX) * 0.02);
      scrollTarget -= deltaX * CONFIG$1.dragSpeed;
      markScrolling();
    };
    const onPointerUp = (event) => {
      if (!isDragging) return;
      isDragging = false;
      root.classList.remove("is-dragging");
      if (Math.abs(dragDelta) > 2) {
        scrollMomentum = -dragDelta * CONFIG$1.dragMomentum;
        addDistortionBurst(Math.abs(dragDelta) * 5e-3);
        markScrolling(800);
      }
      if (dragTravel > 8) return;
      if (event.target instanceof Element && event.target.closest("a")) return;
      const rect = canvas.getBoundingClientRect();
      pointerNdc.x = (event.clientX - rect.left) / Math.max(rect.width, 1) * 2 - 1;
      pointerNdc.y = -((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hit = raycaster.intersectObjects(meshes)[0];
      if (!hit) return;
      const slide = slides[hit.object.userData.index];
      if (slide == null ? void 0 : slide.href) window.location.assign(slide.href);
    };
    const onKeyDown = (event) => {
      const step = planeW + planeGap;
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === "l") {
        event.preventDefault();
        scrollTarget += step;
        addDistortionBurst(0.35);
        markScrolling();
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp" || event.key === "h") {
        event.preventDefault();
        scrollTarget -= step;
        addDistortionBurst(0.35);
        markScrolling();
      }
    };
    const tick = (time) => {
      rafId = requestAnimationFrame(tick);
      if (isPaused) return;
      const deltaTime = lastFrameTime ? (time - lastFrameTime) / 1e3 : 0.016;
      lastFrameTime = time;
      const previousScroll = scrollPosition;
      if (isScrolling) {
        scrollTarget += scrollMomentum;
        scrollMomentum *= CONFIG$1.momentumFriction;
        if (Math.abs(scrollMomentum) < CONFIG$1.momentumThreshold) scrollMomentum = 0;
      }
      scrollPosition += (scrollTarget - scrollPosition) * CONFIG$1.smoothing;
      const frameDelta = scrollPosition - previousScroll;
      if (Math.abs(frameDelta) > 1e-5) {
        directionTarget = frameDelta > 0 ? 1 : -1;
      }
      scrollDirection += (directionTarget - scrollDirection) * 0.08;
      const velocity = Math.abs(frameDelta) / Math.max(deltaTime, 1e-3);
      velocityHistory.push(velocity);
      velocityHistory.shift();
      const averageVelocity = velocityHistory.reduce((a, b) => a + b, 0) / velocityHistory.length;
      if (averageVelocity > velocityPeak) velocityPeak = averageVelocity;
      const isDecelerating = averageVelocity / (velocityPeak + 1e-3) < 0.7 && velocityPeak > 0.5;
      velocityPeak *= 0.99;
      if (velocity > 0.05) {
        distortionTarget = Math.max(distortionTarget, Math.min(1, velocity * 0.1));
      }
      if (isDecelerating || averageVelocity < 0.2) {
        distortionTarget *= isDecelerating ? 0.95 : 0.855;
      }
      distortionAmount += (distortionTarget - distortionAmount) * CONFIG$1.distortionSmoothing;
      const signedDistortion = distortionAmount * scrollDirection;
      const radius = Math.max(planeW, planeH) * 1.15;
      let closestDistance = Infinity;
      let closestIndex = 0;
      meshes.forEach((mesh) => {
        const { offset, index } = mesh.userData;
        let x = offset - wrap(scrollPosition, loopLength);
        x = wrap(x + planeW, loopLength) - planeW;
        mesh.position.x = focusX + x;
        mesh.position.y = stackY;
        const slotDistance = Math.abs(x);
        if (slotDistance < closestDistance) {
          closestDistance = slotDistance;
          closestIndex = index;
        }
        if (Math.abs(mesh.position.x) < halfLoop + planeW) {
          applyDistortion$1(
            mesh,
            mesh.position.x,
            CONFIG$1.distortionStrength * signedDistortion,
            radius
          );
        }
        placeCaption(mesh, captions[index]);
      });
      setActiveSlide(closestIndex);
      renderer.render(scene, camera);
    };
    layoutPlanes();
    setActiveSlide(0);
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchmove", onTouchMove, { passive: false });
    stage.addEventListener("touchend", onTouchEnd);
    stage.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("keydown", onKeyDown);
    const resizeObserver = new ResizeObserver(layoutPlanes);
    resizeObserver.observe(stage);
    resizeObserver.observe(canvas);
    const themeObserver = new MutationObserver(applyBackground);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-color-scheme", "class"]
    });
    const io = new IntersectionObserver(
      ([entry]) => {
        isPaused = !entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(root);
    const onVisibility = () => {
      isPaused = document.hidden;
      if (!document.hidden && !rafId) {
        lastFrameTime = 0;
        rafId = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    rafId = requestAnimationFrame(tick);
  }
  const CONFIG = {
    lerp: 0.05,
    buffer: 5,
    snapDuration: 500,
    wheelLockMs: 400,
    wheelDeadZone: 5,
    dragGain: 1,
    touchGain: 1.5,
    dragClickThreshold: 8,
    distortionStrength: 2,
    distortionSmoothing: 0.1,
    distortionBurst: 0.45
  };
  function createEl(tag, className) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }
  function readCssNumber$1(root, name, fallback) {
    const raw = getComputedStyle(root).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function isMenuOpen() {
    return Boolean(document.querySelector(".menu-overlay-1.is-open"));
  }
  function isEditableTarget(target) {
    if (!(target instanceof HTMLElement)) return false;
    if (target.isContentEditable) return true;
    const tag = target.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
  }
  function readProjects(root) {
    return [...root.querySelectorAll(".projects-4__source article")].map((article) => {
      var _a, _b;
      const img = article.querySelector("img");
      return {
        title: ((_a = article.querySelector("h2")) == null ? void 0 : _a.textContent.trim()) || "",
        category: ((_b = article.querySelector("[data-projects-4-category]")) == null ? void 0 : _b.textContent.trim()) || "",
        year: article.dataset.year || "",
        link: article.dataset.href || "project-details.html",
        image: (img == null ? void 0 : img.currentSrc) || (img == null ? void 0 : img.src) || (img == null ? void 0 : img.getAttribute("src")) || "",
        imageEl: img instanceof HTMLImageElement ? img : null,
        imageAlt: (img == null ? void 0 : img.getAttribute("alt")) || ""
      };
    });
  }
  function applyCover(texture, planeAspect) {
    texture.colorSpace = THREE__namespace.SRGBColorSpace;
    texture.wrapS = THREE__namespace.ClampToEdgeWrapping;
    texture.wrapT = THREE__namespace.ClampToEdgeWrapping;
    const imageAspect = texture.image.width / texture.image.height;
    if (imageAspect > planeAspect) {
      const rx = planeAspect / imageAspect;
      texture.repeat.set(rx, 1);
      texture.offset.set((1 - rx) / 2, 0);
    } else {
      const ry = imageAspect / planeAspect;
      texture.repeat.set(1, ry);
      texture.offset.set(0, (1 - ry) / 2);
    }
    texture.needsUpdate = true;
  }
  function applyDistortion(mesh, positionX, strength, radius) {
    const positions = mesh.geometry.attributes.position;
    const original = mesh.userData.originalVertices;
    const safeRadius = Math.max(radius, 1e-3);
    for (let i = 0; i < positions.count; i += 1) {
      const x = original[i * 3];
      const y = original[i * 3 + 1];
      const distance = Math.sqrt((positionX + x) ** 2 + y * y);
      const falloff = Math.max(0, 1 - distance / safeRadius);
      const bend = Math.sin(falloff * Math.PI / 2) ** 1.5;
      positions.setZ(i, bend * strength);
    }
    positions.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  }
  function createWebgl(stage, canvas, projects, wrapIndex) {
    let renderer = null;
    try {
      renderer = new THREE__namespace.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
      });
    } catch {
      return null;
    }
    if (!renderer.getContext()) {
      renderer.dispose();
      return null;
    }
    renderer.outputColorSpace = THREE__namespace.SRGBColorSpace;
    renderer.setClearColor(0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE__namespace.Scene();
    const camera = new THREE__namespace.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5;
    const meshes = [];
    projects.forEach((project, index) => {
      const geometry = new THREE__namespace.PlaneGeometry(1, 1, 32, 16);
      const material = new THREE__namespace.MeshBasicMaterial({
        side: THREE__namespace.DoubleSide,
        color: 10066329
      });
      const mesh = new THREE__namespace.Mesh(geometry, material);
      mesh.userData = {
        originalVertices: [...geometry.attributes.position.array],
        index,
        planeW: 1,
        planeH: 1
      };
      if (project.image || project.imageEl) {
        loadTexture(
          project.image,
          (texture) => {
            applyCover(texture, mesh.userData.planeW / mesh.userData.planeH);
            material.map = texture;
            material.color.set(16777215);
            material.needsUpdate = true;
          },
          void 0,
          project.imageEl
        );
      }
      scene.add(mesh);
      meshes.push(mesh);
    });
    let planeW = 1;
    let planeH = 1;
    let frameOffsetX = 0;
    let frameOffsetY = 0;
    let stageW = 1;
    let stageH = 1;
    let viewW = 1;
    let viewH = 1;
    let lastLayoutKey = "";
    let distortionAmount = 0;
    let distortionTarget = 0;
    let velocityPeak = 0;
    let scrollDirection = 0;
    let directionTarget = 0;
    const velocityHistory = [0, 0, 0, 0, 0];
    let lastFrameTime = 0;
    const nearestVirtual = (projectIndex, currentVirtual) => {
      let best = Math.round(currentVirtual);
      let bestDist = Infinity;
      const length = projects.length;
      const start = Math.floor(currentVirtual) - length;
      const end = Math.ceil(currentVirtual) + length;
      for (let virtual = start; virtual <= end; virtual += 1) {
        if (wrapIndex(virtual, length) !== projectIndex) continue;
        const distance = Math.abs(virtual - currentVirtual);
        if (distance < bestDist || distance === bestDist && virtual > best) {
          best = virtual;
          bestDist = distance;
        }
      }
      return best;
    };
    const layout = (list) => {
      if (!(list instanceof HTMLElement)) return;
      const sample = list.querySelector(".projects-4__slide");
      const frame = sample == null ? void 0 : sample.querySelector(".projects-4__frame");
      if (!(sample instanceof HTMLElement) || !(frame instanceof HTMLElement)) return;
      const slideRect = sample.getBoundingClientRect();
      const frameRect = frame.getBoundingClientRect();
      const width = canvas.clientWidth || stage.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || stage.clientHeight || 1;
      if (width < 2 || height < 2 || frameRect.width < 2 || frameRect.height < 2) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      viewH = 2 * Math.tan(camera.fov * Math.PI / 360) * camera.position.z;
      viewW = viewH * camera.aspect;
      const pxToWorld = viewH / height;
      frameOffsetX = frameRect.left - slideRect.left;
      frameOffsetY = frameRect.top - slideRect.top;
      stageW = width;
      stageH = height;
      const nextW = frameRect.width * pxToWorld;
      const nextH = frameRect.height * pxToWorld;
      const layoutKey = `${Math.round(frameRect.width)}x${Math.round(frameRect.height)}x${width}x${height}`;
      if (layoutKey === lastLayoutKey && planeW > 1) return;
      lastLayoutKey = layoutKey;
      planeW = nextW;
      planeH = nextH;
      meshes.forEach((mesh) => {
        const old = mesh.geometry;
        const geometry = new THREE__namespace.PlaneGeometry(planeW, planeH, 32, 16);
        mesh.geometry = geometry;
        mesh.userData.originalVertices = [...geometry.attributes.position.array];
        mesh.userData.planeW = planeW;
        mesh.userData.planeH = planeH;
        old.dispose();
        if (mesh.material.map) {
          applyCover(mesh.material.map, planeW / planeH);
        }
      });
    };
    const burst = (amount = CONFIG.distortionBurst) => {
      distortionTarget = Math.min(1, distortionTarget + amount);
    };
    const update = (currentX, previousX, projectWidth, time) => {
      const deltaTime = lastFrameTime ? (time - lastFrameTime) / 1e3 : 0.016;
      lastFrameTime = time;
      const frameDelta = currentX - previousX;
      if (Math.abs(frameDelta) > 0.01) {
        directionTarget = frameDelta < 0 ? 1 : -1;
      }
      scrollDirection += (directionTarget - scrollDirection) * 0.08;
      const velocity = Math.abs(frameDelta) / Math.max(deltaTime, 1e-3);
      velocityHistory.push(velocity);
      velocityHistory.shift();
      const averageVelocity = velocityHistory.reduce((sum, value) => sum + value, 0) / velocityHistory.length;
      if (averageVelocity > velocityPeak) velocityPeak = averageVelocity;
      const isDecelerating = averageVelocity / (velocityPeak + 1e-3) < 0.7 && velocityPeak > 80;
      velocityPeak *= 0.99;
      if (velocity > 40) {
        distortionTarget = Math.max(distortionTarget, Math.min(1, velocity / 4200));
      }
      if (isDecelerating || averageVelocity < 60) {
        distortionTarget *= isDecelerating ? 0.95 : 0.855;
      }
      distortionAmount += (distortionTarget - distortionAmount) * CONFIG.distortionSmoothing;
      const signedDistortion = distortionAmount * scrollDirection;
      const radius = Math.max(planeW, planeH) * 1.15;
      const currentVirtual = -currentX / projectWidth;
      meshes.forEach((mesh) => {
        const virtual = nearestVirtual(mesh.userData.index, currentVirtual);
        const slideLeft = virtual * projectWidth + currentX;
        const frameWpx = planeW / (viewH / stageH);
        const frameHpx = planeH / (viewH / stageH);
        mesh.position.x = ((slideLeft + frameOffsetX + frameWpx / 2) / stageW - 0.5) * viewW;
        mesh.position.y = (0.5 - (frameOffsetY + frameHpx / 2) / stageH) * viewH;
        applyDistortion(
          mesh,
          mesh.position.x,
          CONFIG.distortionStrength * signedDistortion,
          radius
        );
      });
      renderer.render(scene, camera);
    };
    return {
      layout,
      update,
      burst,
      dispose() {
        meshes.forEach((mesh) => {
          mesh.geometry.dispose();
          if (mesh.material.map) mesh.material.map.dispose();
          mesh.material.dispose();
        });
        renderer.dispose();
      }
    };
  }
  function initProjects4() {
    const root = document.querySelector("[data-projects-4]");
    if (!(root instanceof HTMLElement) || root.dataset.projects4Ready) return;
    const list = root.querySelector("[data-projects-4-list]");
    const railTrack = root.querySelector("[data-projects-4-rail]");
    const stage = root.querySelector("[data-projects-4-stage]");
    const canvas = root.querySelector("[data-projects-4-canvas]");
    const fallback = root.querySelector("[data-projects-4-fallback]");
    const projects = readProjects(root);
    if (!(list instanceof HTMLElement) || !(railTrack instanceof HTMLElement) || !(stage instanceof HTMLElement) || projects.length === 0) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("is-static");
      return;
    }
    root.dataset.projects4Ready = "true";
    root.classList.add("is-cinema");
    if (fallback instanceof HTMLElement) fallback.hidden = true;
    if (window.smoother) {
      window.smoother.paused(true);
    }
    const totalLabel = String(projects.length).padStart(2, "0");
    let imgScale = readCssNumber$1(root, "--layout-projects4-img-scale", 1.5);
    let wheelLockUntil = 0;
    const useWebgl = canvas instanceof HTMLCanvasElement && canUseLocalWebGlTextures();
    const wrapIndex = (index, length) => (Math.abs(index) % length + length) % length;
    const webgl = useWebgl ? createWebgl(stage, canvas, projects, wrapIndex) : null;
    if (webgl) root.classList.add("is-webgl");
    const state = {
      currentX: 0,
      targetX: 0,
      isDragging: false,
      slides: /* @__PURE__ */ new Map(),
      rail: /* @__PURE__ */ new Map(),
      projectWidth: window.innerWidth,
      railItemWidth: readCssNumber$1(root, "--layout-projects4-rail-item", 88),
      isSnapping: false,
      snapStart: { time: 0, x: 0, target: 0 },
      lastScrollTime: Date.now(),
      dragStart: { x: 0, scrollX: 0, gain: 1 },
      dragTravel: 0,
      dragPointerId: null
    };
    const lerp = (start, end, factor) => start + (end - start) * factor;
    const getData = (index) => projects[wrapIndex(index, projects.length)];
    const formatNum = (index) => String(wrapIndex(index, projects.length) + 1).padStart(2, "0");
    const createParallaxX = (img, span) => {
      let current = 0;
      return {
        update: (scroll, index) => {
          if (webgl) return;
          const target = (-scroll - index * span) * 0.2;
          current = lerp(current, target, 0.1);
          if (Math.abs(current - target) > 0.01) {
            img.style.transform = `translateX(${current}px) scale(${imgScale})`;
          }
        }
      };
    };
    const createSlide = (index) => {
      if (state.slides.has(index)) return;
      const data = getData(index);
      const num = formatNum(index);
      const slide = createEl("a", "projects-4__slide");
      slide.href = data.link;
      slide.draggable = false;
      slide.setAttribute("aria-label", `View project: ${data.title}`);
      const frame = createEl("div", "projects-4__frame");
      const img = createEl("img", "projects-4__image");
      img.src = data.image;
      img.alt = data.imageAlt || data.title;
      img.draggable = false;
      frame.append(img);
      const meta = createEl("div", "projects-4__meta");
      const top = createEl("div", "projects-4__meta-top");
      const number = createEl("span", "projects-4__num");
      number.textContent = `${num} / ${totalLabel}`;
      top.append(number);
      const title = createEl("h2", "projects-4__name");
      title.textContent = data.title;
      const bottom = createEl("div", "projects-4__meta-bottom");
      const category = createEl("span", "projects-4__cat");
      category.textContent = data.category;
      const year = createEl("span", "projects-4__year");
      year.textContent = data.year;
      bottom.append(category, year);
      meta.append(top, title, bottom);
      slide.append(frame, meta);
      list.append(slide);
      state.slides.set(index, {
        el: slide,
        parallax: createParallaxX(img, state.projectWidth)
      });
    };
    const createRail = (index) => {
      if (state.rail.has(index)) return;
      const data = getData(index);
      const num = formatNum(index);
      const item = createEl("button", "projects-4__rail-item");
      item.type = "button";
      item.dataset.index = String(index);
      item.setAttribute("aria-label", `Go to project ${num} ${data.title}`);
      const thumb = createEl("span", "projects-4__rail-thumb");
      const img = createEl("img");
      img.src = data.image;
      img.alt = "";
      thumb.append(img);
      const label = createEl("span", "projects-4__rail-index");
      label.textContent = num;
      item.append(thumb, label);
      railTrack.append(item);
      state.rail.set(index, { el: item });
    };
    for (let i = -5; i <= CONFIG.buffer; i += 1) {
      createSlide(i);
      createRail(i);
    }
    const syncElements = () => {
      const current = Math.round(-state.targetX / state.projectWidth);
      const min = current - CONFIG.buffer;
      const max = current + CONFIG.buffer;
      for (let i = min; i <= max; i += 1) {
        createSlide(i);
        createRail(i);
      }
      [state.slides, state.rail].forEach((map) => {
        map.forEach((item, index) => {
          if (index < min || index > max) {
            item.el.remove();
            map.delete(index);
          }
        });
      });
    };
    const snapToProject = () => {
      state.isSnapping = true;
      state.snapStart.time = Date.now();
      state.snapStart.x = state.targetX;
      state.snapStart.target = -Math.round(-state.targetX / state.projectWidth) * state.projectWidth;
    };
    const updateSnap = () => {
      const progress = Math.min((Date.now() - state.snapStart.time) / CONFIG.snapDuration, 1);
      const eased = 1 - (1 - progress) ** 3;
      state.targetX = state.snapStart.x + (state.snapStart.target - state.snapStart.x) * eased;
      if (progress >= 1) state.isSnapping = false;
    };
    const updatePositions = () => {
      const railX = state.currentX * state.railItemWidth / state.projectWidth;
      const activeIndex = Math.round(-state.currentX / state.projectWidth);
      state.slides.forEach((item, index) => {
        const x = index * state.projectWidth + state.currentX;
        item.el.style.transform = `translateX(${x}px)`;
        item.parallax.update(state.currentX, index);
      });
      state.rail.forEach((item, index) => {
        const x = index * state.railItemWidth + railX;
        item.el.style.transform = `translateX(${x}px)`;
        item.el.classList.toggle("is-active", index === activeIndex);
      });
    };
    const navigateTo = (index) => {
      state.isSnapping = true;
      state.snapStart.time = Date.now();
      state.snapStart.x = state.targetX;
      state.snapStart.target = -index * state.projectWidth;
      state.lastScrollTime = Date.now();
      webgl == null ? void 0 : webgl.burst();
    };
    const animate = (time = performance.now()) => {
      const now = Date.now();
      const previousX = state.currentX;
      if (!state.isSnapping && !state.isDragging && now - state.lastScrollTime > 100) {
        const snapPoint = -Math.round(-state.targetX / state.projectWidth) * state.projectWidth;
        if (Math.abs(state.targetX - snapPoint) > 1) snapToProject();
      }
      if (state.isSnapping) updateSnap();
      if (!state.isDragging) {
        state.currentX += (state.targetX - state.currentX) * CONFIG.lerp;
      }
      syncElements();
      updatePositions();
      webgl == null ? void 0 : webgl.update(state.currentX, previousX, state.projectWidth, time);
      requestAnimationFrame(animate);
    };
    const currentIndex = () => Math.round(-state.targetX / state.projectWidth);
    window.addEventListener(
      "wheel",
      (event) => {
        if (isMenuOpen()) return;
        event.preventDefault();
        state.lastScrollTime = Date.now();
        const raw = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
        if (Math.abs(raw) < CONFIG.wheelDeadZone) return;
        const now = Date.now();
        if (now < wheelLockUntil) return;
        wheelLockUntil = now + CONFIG.wheelLockMs;
        navigateTo(currentIndex() + (raw > 0 ? 1 : -1));
      },
      { passive: false }
    );
    const isRailTarget = (target) => target instanceof Element && Boolean(target.closest(".projects-4__rail"));
    const pointerGain = (pointerType) => pointerType === "touch" ? CONFIG.touchGain : CONFIG.dragGain;
    const onPointerDown = (event) => {
      if (isMenuOpen() || !event.isPrimary || event.button !== 0) return;
      if (isRailTarget(event.target)) return;
      state.isDragging = true;
      state.isSnapping = false;
      state.dragPointerId = event.pointerId;
      state.dragTravel = 0;
      state.dragStart = {
        x: event.clientX,
        scrollX: state.currentX,
        gain: pointerGain(event.pointerType)
      };
      state.lastScrollTime = Date.now();
      root.classList.add("is-dragging");
    };
    const onPointerMove = (event) => {
      if (!state.isDragging || event.pointerId !== state.dragPointerId) return;
      const previous = state.targetX;
      const next = state.dragStart.scrollX + (event.clientX - state.dragStart.x) * state.dragStart.gain;
      state.targetX = next;
      state.currentX = next;
      state.dragTravel = Math.abs(event.clientX - state.dragStart.x);
      state.lastScrollTime = Date.now();
      webgl == null ? void 0 : webgl.burst(Math.min(0.35, Math.abs(next - previous) * 2e-3));
    };
    const onPointerUp = (event) => {
      if (!state.isDragging) return;
      if (event.pointerId !== state.dragPointerId) return;
      state.isDragging = false;
      state.dragPointerId = null;
      root.classList.remove("is-dragging");
    };
    const onClickCapture = (event) => {
      if (state.dragTravel <= CONFIG.dragClickThreshold) return;
      event.preventDefault();
      event.stopPropagation();
      state.dragTravel = 0;
    };
    stage.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    stage.addEventListener("click", onClickCapture, true);
    railTrack.addEventListener("click", (event) => {
      const button = event.target instanceof Element ? event.target.closest(".projects-4__rail-item") : null;
      if (!button) return;
      const index = Number.parseInt(button.dataset.index || "", 10);
      if (Number.isNaN(index)) return;
      navigateTo(index);
    });
    window.addEventListener("keydown", (event) => {
      if (isMenuOpen() || isEditableTarget(event.target)) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        navigateTo(currentIndex() + 1);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        navigateTo(currentIndex() - 1);
      }
    });
    const relayout = () => {
      const oldWidth = state.projectWidth;
      const newWidth = window.innerWidth;
      if (newWidth !== oldWidth) {
        const ratio = newWidth / oldWidth;
        state.currentX *= ratio;
        state.targetX *= ratio;
        state.projectWidth = newWidth;
      }
      imgScale = readCssNumber$1(root, "--layout-projects4-img-scale", 1.5);
      state.railItemWidth = readCssNumber$1(root, "--layout-projects4-rail-item", 88);
      if (!webgl) {
        state.slides.forEach((item) => {
          const img = item.el.querySelector("img");
          if (img) item.parallax = createParallaxX(img, state.projectWidth);
        });
      }
      webgl == null ? void 0 : webgl.layout(list);
    };
    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(relayout, 200);
    });
    if (webgl) {
      const resizeObserver = new ResizeObserver(() => webgl.layout(list));
      resizeObserver.observe(stage);
      requestAnimationFrame(() => webgl.layout(list));
    }
    animate();
  }
  const LERP = 0.14;
  const PARALLAX = 18;
  function readCssNumber(root, name, fallback) {
    const raw = getComputedStyle(root).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function prefersReducedMotion$1() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function isCoarsePointer() {
    return window.matchMedia("(hover: none), (pointer: coarse)").matches;
  }
  function initFilters(root) {
    const items = [...root.querySelectorAll("[data-projects-5-item]")];
    const empty = root.querySelector("[data-projects-5-empty]");
    const state = { category: "all", year: "all" };
    const apply = () => {
      var _a;
      let visible = 0;
      items.forEach((item) => {
        const matchCategory = state.category === "all" || item.dataset.category === state.category;
        const matchYear = state.year === "all" || item.dataset.year === state.year;
        const show = matchCategory && matchYear;
        item.hidden = !show;
        item.classList.toggle("is-active", false);
        if (show) visible += 1;
      });
      if (empty) empty.hidden = visible > 0;
      (_a = root.querySelector("[data-projects-5-list]")) == null ? void 0 : _a.classList.remove("is-hot");
    };
    root.querySelectorAll("[data-projects-5-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        var _a;
        const group = button.getAttribute("data-projects-5-filter");
        const value = button.getAttribute("data-projects-5-value") || "all";
        if (!group || !(group in state)) return;
        state[group] = value;
        root.querySelectorAll(`[data-projects-5-filter="${group}"]`).forEach((el) => {
          const on = el === button;
          el.classList.toggle("is-active", on);
          el.setAttribute("aria-pressed", String(on));
        });
        apply();
        (_a = root.querySelector("[data-projects-5-preview]")) == null ? void 0 : _a.classList.remove("is-visible");
        root.querySelectorAll("[data-projects-5-image].is-active").forEach((img) => {
          img.classList.remove("is-active");
        });
      });
    });
  }
  function initPreview(root) {
    const list = root.querySelector("[data-projects-5-list]");
    const preview = root.querySelector("[data-projects-5-preview]");
    const frame = root.querySelector("[data-projects-5-frame]");
    const images = [...root.querySelectorAll("[data-projects-5-image]")];
    if (!list || !preview || !frame || images.length === 0) return;
    if (prefersReducedMotion$1() || isCoarsePointer()) return;
    const mouse = { x: window.innerWidth * 0.4, y: window.innerHeight * 0.45 };
    const pos = { x: mouse.x, y: mouse.y };
    const parallax = { x: 0, y: 0 };
    const zoomOut = readCssNumber(root, "--layout-projects5-preview-scale", 1.2);
    const zoomIn = readCssNumber(root, "--layout-projects5-preview-zoom", 1.05);
    const zoomDuration = readCssNumber(root, "--layout-projects5-preview-zoom-duration", 0.75);
    const kenDuration = readCssNumber(root, "--layout-projects5-preview-ken-duration", 5.5);
    root.classList.add("is-preview");
    gsap.set(images, { scale: zoomOut, opacity: 0 });
    const startKenBurns = (img) => {
      gsap.to(img, {
        scale: zoomOut,
        duration: kenDuration,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    };
    const zoomInImage = (img) => {
      gsap.killTweensOf(img);
      gsap.fromTo(
        img,
        { scale: zoomOut, opacity: 0 },
        {
          scale: zoomIn,
          opacity: 1,
          duration: zoomDuration,
          ease: "power2.out",
          overwrite: true,
          onComplete: () => startKenBurns(img)
        }
      );
    };
    const zoomOutImage = (img) => {
      gsap.killTweensOf(img);
      gsap.to(img, {
        scale: zoomOut,
        opacity: 0,
        duration: zoomDuration * 0.6,
        ease: "power2.in",
        overwrite: true
      });
    };
    const setActive = (index) => {
      images.forEach((img) => {
        const on = img.dataset.index === index;
        const was = img.classList.contains("is-active");
        if (on === was) return;
        img.classList.toggle("is-active", on);
        if (on) zoomInImage(img);
        else zoomOutImage(img);
      });
    };
    const showPreview = (item) => {
      setActive(item.dataset.index);
      list.classList.add("is-hot");
      item.classList.add("is-active");
      preview.classList.add("is-visible");
    };
    const hidePreview = () => {
      list.classList.remove("is-hot");
      list.querySelectorAll("[data-projects-5-item].is-active").forEach((item) => {
        item.classList.remove("is-active");
      });
      preview.classList.remove("is-visible");
      images.forEach((img) => {
        if (!img.classList.contains("is-active")) return;
        img.classList.remove("is-active");
        zoomOutImage(img);
      });
    };
    list.addEventListener("pointermove", (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    });
    list.querySelectorAll("[data-projects-5-item]").forEach((item) => {
      item.addEventListener("pointerenter", () => {
        list.querySelectorAll("[data-projects-5-item].is-active").forEach((other) => {
          if (other !== item) other.classList.remove("is-active");
        });
        showPreview(item);
      });
    });
    list.addEventListener("pointerleave", hidePreview);
    gsap.ticker.add(() => {
      pos.x += (mouse.x - pos.x) * LERP;
      pos.y += (mouse.y - pos.y) * LERP;
      const dx = (mouse.x - pos.x) / 40;
      const dy = (mouse.y - pos.y) / 40;
      parallax.x += (dx * PARALLAX - parallax.x) * LERP;
      parallax.y += (dy * PARALLAX - parallax.y) * LERP;
      gsap.set(preview, {
        x: pos.x,
        y: pos.y,
        xPercent: -50,
        yPercent: -50
      });
      gsap.set(frame, {
        x: parallax.x,
        y: parallax.y
      });
    });
  }
  function initProjects5() {
    const root = document.querySelector("[data-projects-5]");
    if (!root) return;
    initFilters(root);
    initPreview(root);
  }
  const HOLD_S$3 = 5.2;
  const FADE_S$2 = 0.55;
  const TEXT_S$2 = 0.4;
  function initProjectDetailsQuote() {
    const root = document.querySelector("[data-project-details-quote]");
    if (!root || root.dataset.projectDetailsQuoteReady) return;
    root.dataset.projectDetailsQuoteReady = "true";
    const photos = [...root.querySelectorAll(".project-details-quote__photo")];
    const quotes = [...root.querySelectorAll(".project-details-quote__quote")];
    const authors = [...root.querySelectorAll(".project-details-quote__author")];
    const currentEl = root.querySelector("[data-project-details-quote-current]");
    const totalEl = root.querySelector("[data-project-details-quote-total]");
    const nextBtn = root.querySelector("[data-project-details-quote-next]");
    const total = photos.length;
    if (total < 1) return;
    if (totalEl) {
      totalEl.textContent = String(total).padStart(2, "0");
    }
    let index = Math.max(0, photos.findIndex((photo) => photo.classList.contains("is-active")));
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let fade = null;
    let hold = null;
    let busy = false;
    let inView = false;
    let queued = null;
    const pad = (value) => String(value).padStart(2, "0");
    const applyCopy = (nextIndex, animate) => {
      const copyEls = [...quotes, ...authors];
      gsap.killTweensOf(copyEls);
      quotes.forEach((quote, i) => {
        quote.classList.toggle("is-active", i === nextIndex);
        quote.toggleAttribute("inert", i !== nextIndex);
      });
      authors.forEach((author, i) => {
        author.classList.toggle("is-active", i === nextIndex);
        author.toggleAttribute("inert", i !== nextIndex);
      });
      if (currentEl) currentEl.textContent = pad(nextIndex + 1);
      const outgoing = copyEls.filter((el) => !el.classList.contains("is-active"));
      const incoming = [quotes[nextIndex], authors[nextIndex]].filter(Boolean);
      gsap.set(outgoing, { autoAlpha: 0, y: 0, overwrite: true });
      if (!animate || prefersReducedMotion2) {
        gsap.set(incoming, { autoAlpha: 1, y: 0, overwrite: true });
        return;
      }
      gsap.fromTo(
        incoming,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: TEXT_S$2, ease: "power2.out", stagger: 0.05, overwrite: true }
      );
    };
    const stopHold = () => {
      hold == null ? void 0 : hold.kill();
      hold = null;
    };
    const startHold = () => {
      stopHold();
      if (prefersReducedMotion2 || total < 2 || !inView) return;
      hold = gsap.delayedCall(HOLD_S$3, () => goTo(index + 1));
    };
    const goTo = (rawIndex) => {
      if (total < 2) return;
      const nextIndex = (rawIndex % total + total) % total;
      if (nextIndex === index) {
        queued = null;
        return;
      }
      if (busy) {
        queued = nextIndex;
        return;
      }
      const outgoing = photos[index];
      const incoming = photos[nextIndex];
      const finish = () => {
        photos.forEach((photo, i) => {
          const active = i === nextIndex;
          photo.classList.toggle("is-active", active);
          gsap.killTweensOf(photo);
          gsap.set(photo, {
            opacity: active ? 1 : 0,
            zIndex: active ? 2 : 1,
            overwrite: true
          });
        });
        index = nextIndex;
        busy = false;
        const nextQueued = queued;
        queued = null;
        if (nextQueued != null && nextQueued !== index) {
          goTo(nextQueued);
          return;
        }
        startHold();
      };
      applyCopy(nextIndex, !prefersReducedMotion2);
      if (prefersReducedMotion2) {
        photos.forEach((photo, i) => {
          photo.classList.toggle("is-active", i === nextIndex);
          gsap.killTweensOf(photo);
          gsap.set(photo, { clearProps: "opacity,zIndex" });
        });
        index = nextIndex;
        busy = false;
        return;
      }
      busy = true;
      stopHold();
      fade == null ? void 0 : fade.kill();
      gsap.set(incoming, { opacity: 0, zIndex: 3 });
      gsap.set(outgoing, { zIndex: 2 });
      fade = gsap.timeline({ onComplete: finish });
      fade.to(incoming, { opacity: 1, duration: FADE_S$2, ease: "power2.out" }, 0);
      fade.to(outgoing, { opacity: 0, duration: FADE_S$2, ease: "power2.out" }, 0);
    };
    photos.forEach((photo, i) => {
      const active = i === index;
      photo.classList.toggle("is-active", active);
      if (prefersReducedMotion2) {
        gsap.set(photo, { clearProps: "opacity,zIndex" });
      } else {
        gsap.set(photo, { opacity: active ? 1 : 0, zIndex: active ? 2 : 1 });
      }
    });
    applyCopy(index, false);
    nextBtn == null ? void 0 : nextBtn.addEventListener("click", () => goTo(index + 1));
    const media = root.querySelector(".project-details-quote__media");
    const stage = root.querySelector(".project-details-quote__stage");
    let suppressClick = false;
    media == null ? void 0 : media.addEventListener("click", () => {
      if (suppressClick) return;
      goTo(index + 1);
    });
    if (stage && total > 1) {
      const THRESHOLD = 56;
      let originX = 0;
      let originY = 0;
      let lastX = 0;
      let lastY = 0;
      let dragging = false;
      let dragged = false;
      const onMove = (event) => {
        lastX = event.clientX;
        lastY = event.clientY;
        const dx = lastX - originX;
        const dy = lastY - originY;
        if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
          dragged = true;
          stage.classList.add("is-dragging");
          if (event.cancelable) event.preventDefault();
        }
      };
      const onUp = (event) => {
        if (!dragging) return;
        dragging = false;
        stage.classList.remove("is-dragging");
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        const endX = Number.isFinite(event.clientX) ? event.clientX : lastX;
        const endY = Number.isFinite(event.clientY) ? event.clientY : lastY;
        const dx = endX - originX;
        const dy = endY - originY;
        const isSwipe = dragged && Math.abs(dx) >= THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.15;
        if (isSwipe) {
          suppressClick = true;
          window.setTimeout(() => {
            suppressClick = false;
          }, 400);
          goTo(index + (dx < 0 ? 1 : -1));
        } else {
          startHold();
        }
      };
      stage.addEventListener(
        "click",
        (event) => {
          if (!suppressClick) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClick = false;
        },
        true
      );
      stage.addEventListener("pointerdown", (event) => {
        var _a;
        if (event.button != null && event.button !== 0) return;
        const from = event.target instanceof Element ? event.target : (_a = event.target) == null ? void 0 : _a.parentElement;
        if (from == null ? void 0 : from.closest("a, button")) return;
        dragging = true;
        dragged = false;
        suppressClick = false;
        originX = event.clientX;
        originY = event.clientY;
        lastX = originX;
        lastY = originY;
        stopHold();
        window.addEventListener("pointermove", onMove, { passive: false });
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);
      });
    }
    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
      }
    });
    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        inView = self.isActive;
        if (inView) startHold();
        else stopHold();
      }
    });
    root.addEventListener("mouseenter", stopHold);
    root.addEventListener("mouseleave", startHold);
    root.addEventListener("focusin", stopHold);
    root.addEventListener("focusout", (event) => {
      if (!root.contains(event.relatedTarget)) startHold();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopHold();
        fade == null ? void 0 : fade.pause();
        return;
      }
      fade == null ? void 0 : fade.resume();
      startHold();
    });
  }
  function initProject2() {
    const cards = gsap.utils.toArray(".project-card-2").filter(
      (card) => card instanceof Element && !card.closest("[hidden]")
    );
    if (!cards.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) {
      cards.forEach((card) => card.classList.add("is-armed", "is-in"));
      return;
    }
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => bindCards(cards, true));
    mm.add("(max-width: 1023px)", () => bindCards(cards, false));
  }
  function bindCards(cards, isDesktop) {
    const cleanups = cards.map((card) => setupCard(card, isDesktop));
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => {
      cleanups.forEach((fn) => fn());
    };
  }
  function setupCard(card, isDesktop) {
    const copy = card.querySelector(".project-card-2__copy");
    const index = card.querySelector(".project-card-2__index");
    const title = card.querySelector(".project-card-2__title");
    const text = card.querySelector(".project-card-2__text");
    const media = card.querySelector(".project-card-2__media");
    const imgs = gsap.utils.toArray((media == null ? void 0 : media.querySelectorAll("img")) ?? []);
    const tags = gsap.utils.toArray(card.querySelectorAll(".project-card-2__tag"));
    gsap.set([index, text].filter(Boolean), {
      y: isDesktop ? 28 : 18,
      opacity: 0
    });
    if (isDesktop && copy) {
      gsap.set(copy, { x: -40 });
    }
    if (tags.length) {
      gsap.set(tags, {
        x: isDesktop ? 32 : 0,
        y: isDesktop ? 8 : 14,
        opacity: 0
      });
    }
    const titleTween = title ? createTextBlurStaggerTween(title, {
      paused: true,
      x: isDesktop ? 22 : 12,
      blur: 10,
      duration: 0.9,
      stagger: { each: 0.028, from: "start" }
    }) : null;
    card.classList.add("is-armed");
    const entry = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: card,
        start: "top 82%",
        once: true
      },
      onComplete: () => {
        card.classList.add("is-in");
      }
    });
    if (isDesktop && copy) {
      entry.to(copy, { x: 0, duration: 1.1 }, 0.06);
    }
    if (index) {
      entry.to(index, { y: 0, opacity: 1, duration: 0.7 }, 0.1);
    }
    if (titleTween) {
      entry.add(() => {
        titleTween.play(0);
      }, 0.16);
    }
    if (text) {
      entry.to(text, { y: 0, opacity: 1, duration: 0.85 }, 0.28);
    }
    if (tags.length) {
      entry.to(
        tags,
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.07,
          ease: "power2.out"
        },
        0.38
      );
    }
    let kenBurns = null;
    if (imgs.length) {
      kenBurns = gsap.fromTo(
        imgs,
        {
          yPercent: 16,
          scale: 1.2,
          transformOrigin: "50% 58%",
          force3D: true
        },
        {
          yPercent: -10,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.35,
            invalidateOnRefresh: true
          }
        }
      );
      imgs.forEach((img) => {
        if (img instanceof HTMLImageElement && !img.complete) {
          img.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
        }
      });
    }
    return () => {
      var _a, _b;
      (_a = entry.scrollTrigger) == null ? void 0 : _a.kill();
      entry.kill();
      titleTween == null ? void 0 : titleTween.kill();
      (_b = kenBurns == null ? void 0 : kenBurns.scrollTrigger) == null ? void 0 : _b.kill();
      kenBurns == null ? void 0 : kenBurns.kill();
      card.classList.remove("is-armed", "is-in");
      gsap.set([card, copy, index, title, text, ...imgs, ...tags].filter(Boolean), {
        clearProps: "transform,opacity,filter"
      });
    };
  }
  function initProject3() {
    const section = document.querySelector("[data-project-3]");
    if (!section) return;
    const pinRoot = section.querySelector(".project-3__pin");
    const stage = section.querySelector(".project-3__stage");
    const indexEl = section.querySelector(".project-3__index");
    const images = section.querySelector(".project-3__images");
    const imageItems = gsap.utils.toArray(section.querySelectorAll(".project-3__image"));
    const namesBox = section.querySelector(".project-3__names");
    const names = gsap.utils.toArray(section.querySelectorAll(".project-3__entry"));
    const total = names.length;
    if (!pinRoot || !stage || !indexEl || !images || !namesBox || !total) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    section.classList.add("is-spotlight");
    const metrics = {
      index: 0,
      images: 0,
      mid: window.innerHeight / 2,
      /** @type {number[]} Peel distance per entry: rest → stacked park at stage top. */
      peel: []
    };
    const measure = () => {
      const pad = tokenNumber$4("--layout-project3-padding", 32);
      const host = pinRoot.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const indexRect = indexEl.getBoundingClientRect();
      const indexY = Number.parseFloat(gsap.getProperty(indexEl, "y")) || 0;
      const gap = tokenNumber$4("--layout-project3-names-gap", 20);
      metrics.index = Math.max(0, host.bottom - pad - (indexRect.bottom - indexY));
      metrics.images = window.innerHeight - images.offsetHeight;
      metrics.mid = window.innerHeight / 2;
      const parkStart = stageRect.top;
      metrics.peel = names.map((name, index) => {
        const y = Number.parseFloat(gsap.getProperty(name, "y")) || 0;
        const restTop = name.getBoundingClientRect().top - y;
        const parkTop = parkStart + index * (name.offsetHeight + gap);
        return Math.max(0, restTop - parkTop);
      });
    };
    measure();
    const padIndex = (value) => String(value).padStart(2, "0");
    const totalLabel = padIndex(total);
    const tensEl = indexEl.querySelector(".project-3__index-tens");
    const onesEl = indexEl.querySelector(".project-3__index-ones");
    const Odometer = window.Odometer;
    const duration = tokenNumber$4("--motion-duration-instant", 400);
    const wheels = { tens: null, ones: null };
    if (Odometer && tensEl && onesEl) {
      wheels.tens = new Odometer({
        el: tensEl,
        value: 0,
        format: "d",
        duration
      }) || tensEl.odometer;
      wheels.ones = new Odometer({
        el: onesEl,
        value: 1,
        format: "d",
        duration
      }) || onesEl.odometer;
    }
    let lastCurrent = 1;
    const setCurrent = (current) => {
      if (current === lastCurrent) return;
      lastCurrent = current;
      const padded = padIndex(current);
      indexEl.setAttribute("aria-label", `${padded}/${totalLabel}`);
      if (wheels.tens && wheels.ones) {
        wheels.tens.update(Number(padded[0]));
        wheels.ones.update(Number(padded[1]));
        return;
      }
      if (tensEl) tensEl.textContent = padded[0];
      if (onesEl) onesEl.textContent = padded[1];
    };
    const apply = (progress) => {
      const current = Math.min(Math.floor(progress * total) + 1, total);
      setCurrent(current);
      gsap.set(indexEl, { y: progress * metrics.index, force3D: true });
      gsap.set(images, { y: progress * metrics.images, force3D: true });
      const parallax = tokenNumber$4("--layout-project3-image-parallax", 18);
      const scale = tokenNumber$4("--layout-project3-image-scale", 1.15);
      const mid = window.innerHeight / 2;
      let activeIndex = 0;
      let closest = Infinity;
      imageItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const img = item.querySelector(".project-3__image-photo img");
        const span = window.innerHeight + rect.height;
        const passed = window.innerHeight - rect.top;
        const local = span > 0 ? Math.max(0, Math.min(1, passed / span)) : 0;
        const hitsMid = rect.top <= mid && rect.bottom >= mid;
        const dist = Math.abs((rect.top + rect.bottom) / 2 - mid);
        if (hitsMid || dist < closest) {
          activeIndex = index;
          closest = hitsMid ? -1 : dist;
        }
        if (img) {
          gsap.set(img, {
            yPercent: gsap.utils.interpolate(parallax, -parallax, local),
            scale,
            force3D: true
          });
        }
      });
      imageItems.forEach((item, index) => {
        item.classList.toggle("is-active", index === activeIndex);
      });
      names.forEach((name, index) => {
        const start = index / total;
        const end = (index + 1) / total;
        const local = Math.max(0, Math.min(1, (progress - start) / (end - start)));
        const travel = metrics.peel[index] || 0;
        gsap.set(name, { y: -local * travel, force3D: true });
        name.classList.toggle("is-active", current === index + 1);
      });
    };
    ScrollTrigger.create({
      trigger: pinRoot,
      start: "top top",
      end: () => `+=${window.innerHeight * tokenNumber$4("--layout-project3-scroll-screens", 5)}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: (self) => {
        measure();
        apply(self.progress);
      },
      onUpdate: (self) => {
        apply(self.progress);
      }
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function tokenNumber$4(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function initServices2() {
    const list = document.querySelector("[data-services-2-stack]");
    if (!list) return;
    const items = gsap.utils.toArray(list.querySelectorAll(".services-2__item"));
    const cards = items.map((item) => item.querySelector(".service-card-2")).filter(Boolean);
    if (cards.length < 2) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    gsap.matchMedia().add("(min-width: 1024px)", () => bindStack(list, items, cards));
  }
  function bindStack(list, items, cards) {
    var _a;
    const pinOffset = () => tokenNumber$3("--layout-services2-stack-pin-offset", 80);
    const perspective = () => tokenNumber$3("--layout-services2-stack-perspective", 1400);
    const scaleStep = () => tokenNumber$3("--layout-services2-stack-scale-step", 0.035);
    const rotateStep = () => tokenNumber$3("--layout-services2-stack-rotate-step", 8);
    const zStep = () => tokenNumber$3("--layout-services2-stack-z-step", -56);
    const yStep = () => tokenNumber$3("--layout-services2-stack-y-step", -14);
    gsap.set(list, {
      perspective: perspective(),
      perspectiveOrigin: "50% 0%"
    });
    cards.forEach((card, index) => {
      gsap.set(card, {
        transformPerspective: perspective(),
        transformOrigin: "50% 0%",
        force3D: true,
        zIndex: index + 1
      });
    });
    const runtime = [];
    const quote = (_a = list.closest(".services-2")) == null ? void 0 : _a.querySelector(".services-2__quote");
    const lastHeight = () => {
      var _a2;
      return ((_a2 = cards[cards.length - 1]) == null ? void 0 : _a2.offsetHeight) ?? 0;
    };
    const stackGap = () => tokenNumber$3("--layout-services2-stack-gap", 80);
    const pinEnd = () => pinOffset() + lastHeight() + stackGap();
    if (window.smoother) {
      list.classList.add("is-js-pin");
      items.forEach((item, index) => {
        const layer = index + 1;
        item.style.zIndex = String(layer);
        runtime.push(
          ScrollTrigger.create({
            trigger: item,
            start: () => `top top+=${pinOffset()}`,
            endTrigger: quote || list,
            end: () => quote ? `top top+=${pinEnd()}` : `bottom top+=${pinEnd()}`,
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh(self) {
              var _a2;
              const spacer = (_a2 = self.pin) == null ? void 0 : _a2.parentElement;
              if (spacer == null ? void 0 : spacer.classList.contains("pin-spacer")) {
                spacer.style.zIndex = String(layer);
              }
            }
          })
        );
      });
    } else {
      list.classList.add("is-css-sticky");
    }
    items.forEach((item, index) => {
      const next = items[index + 1];
      if (!next) return;
      const depth = items.length - 1 - index;
      runtime.push(
        gsap.fromTo(
          cards[index],
          {
            rotateX: 0,
            scale: 1,
            y: 0,
            z: 0
          },
          {
            rotateX: depth * rotateStep(),
            scale: 1 - depth * scaleStep(),
            y: depth * yStep(),
            z: depth * zStep(),
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top 88%",
              endTrigger: items[items.length - 1],
              end: () => `top top+=${pinOffset()}`,
              scrub: 0.45,
              invalidateOnRefresh: true
            }
          }
        )
      );
    });
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => {
      window.removeEventListener("load", onLoad);
      runtime.forEach((item) => item.kill());
      list.classList.remove("is-js-pin", "is-css-sticky");
      gsap.set(cards, { clearProps: "transform,transformPerspective,transformOrigin,zIndex" });
      gsap.set(list, { clearProps: "perspective,perspectiveOrigin" });
    };
  }
  function tokenNumber$3(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function initServices3() {
    const section = document.querySelector("[data-services-3]");
    if (!section) return;
    const titles = gsap.utils.toArray(section.querySelectorAll(".services-3__title"));
    const previews = gsap.utils.toArray(section.querySelectorAll(".services-3__preview"));
    if (!titles.length || !previews.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    bindTint(section);
    gsap.matchMedia().add("(min-width: 1024px)", () => {
      const cleanups = [bindHovers(section, titles, previews, prefersReducedMotion2)];
      const parallaxCleanup = bindCursorParallax(section);
      if (parallaxCleanup) {
        cleanups.push(parallaxCleanup);
      }
      return () => {
        cleanups.forEach((fn) => fn());
      };
    });
  }
  function bindHovers(section, titles, previews, prefersReducedMotion2) {
    var _a, _b;
    const duration = prefersReducedMotion2 ? 0 : 0.45;
    const restSlot = ((_a = titles[0]) == null ? void 0 : _a.getAttribute("data-service")) || "1";
    gsap.set(previews, {
      autoAlpha: 0,
      scale: 0.88,
      transformOrigin: "50% 50%",
      force3D: true
    });
    const show = (slot) => {
      if (!slot) return;
      setTint(section, slot);
      titles.forEach((title) => {
        title.classList.toggle("is-active", title.getAttribute("data-service") === slot);
      });
      previews.forEach((preview) => {
        const on = preview.getAttribute("data-service") === slot;
        gsap.to(preview, {
          autoAlpha: on ? 1 : 0,
          scale: on ? 1 : 0.88,
          duration,
          ease: "power2.out",
          overwrite: "auto"
        });
      });
    };
    show(restSlot);
    const onEnter = (event) => {
      const slot = event.currentTarget.getAttribute("data-service");
      show(slot);
    };
    const onLeaveList = () => {
      show(restSlot);
    };
    const list = (_b = titles[0]) == null ? void 0 : _b.closest(".services-3__list");
    titles.forEach((title) => {
      title.addEventListener("pointerenter", onEnter);
      title.addEventListener("focus", onEnter);
    });
    list == null ? void 0 : list.addEventListener("pointerleave", onLeaveList);
    return () => {
      titles.forEach((title) => {
        title.removeEventListener("pointerenter", onEnter);
        title.removeEventListener("focus", onEnter);
      });
      list == null ? void 0 : list.removeEventListener("pointerleave", onLeaveList);
      gsap.set(previews, { clearProps: "opacity,visibility,transform" });
      titles.forEach((title) => {
        title.classList.toggle("is-active", title.getAttribute("data-service") === restSlot);
      });
      setTint(section, restSlot);
    };
  }
  function bindTint(section) {
    var _a;
    const items = gsap.utils.toArray(section.querySelectorAll(".services-3__item"));
    const list = section.querySelector(".services-3__list");
    const restSlot = ((_a = items[0]) == null ? void 0 : _a.getAttribute("data-service")) || "1";
    setTint(section, restSlot);
    const onEnter = (event) => {
      setTint(section, event.currentTarget.getAttribute("data-service"));
    };
    items.forEach((item) => {
      item.addEventListener("pointerenter", onEnter);
      item.addEventListener("focusin", onEnter);
    });
    list == null ? void 0 : list.addEventListener("pointerleave", () => setTint(section, restSlot));
  }
  function setTint(section, slot) {
    if (!slot) return;
    section.dataset.tint = slot;
    section.querySelectorAll(".services-3__bg").forEach((bg) => {
      bg.classList.toggle("is-active", bg.getAttribute("data-service") === slot);
    });
  }
  function bindCursorParallax(section) {
    const photos = gsap.utils.toArray(section.querySelectorAll(".services-3__photo"));
    if (!photos.length) return;
    const cursorMax = tokenNumber$2("--layout-services3-parallax-cursor", 56);
    const depthA = tokenNumber$2("--layout-services3-parallax-depth-a", 0.85);
    const depthB = tokenNumber$2("--layout-services3-parallax-depth-b", 1.4);
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer) return;
    const items = photos.map((el) => {
      var _a;
      const side = (_a = [...el.classList].find((name) => /services-3__photo--\d+-[ab]/.test(name))) == null ? void 0 : _a.slice(-1);
      return {
        el,
        depth: side === "b" ? depthB : depthA,
        cursorX: 0,
        cursorY: 0,
        destX: 0,
        destY: 0
      };
    });
    const onMove = (event) => {
      const rect = section.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      items.forEach((item) => {
        item.destX = relX * cursorMax * item.depth * 2;
        item.destY = relY * cursorMax * item.depth * 2;
      });
    };
    const onLeave = () => {
      items.forEach((item) => {
        item.destX = 0;
        item.destY = 0;
      });
    };
    const onTick = () => {
      items.forEach((item) => {
        item.cursorX += (item.destX - item.cursorX) * 0.12;
        item.cursorY += (item.destY - item.cursorY) * 0.12;
        gsap.set(item.el, {
          x: item.cursorX,
          y: item.cursorY,
          force3D: true
        });
      });
    };
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    gsap.ticker.add(onTick);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      gsap.ticker.remove(onTick);
      gsap.set(photos, { clearProps: "transform" });
    };
  }
  function tokenNumber$2(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const HOLD_S$2 = 2.2;
  const CHAR_OUT = 0.32;
  const CHAR_IN = 0.48;
  const STAGGER = 0.03;
  function initFeatures1() {
    const section = document.querySelector("[data-features-1]");
    if (!section) return;
    initWordCycle(section);
    initBackgroundSwitch(section);
    initThumbReveal(section);
  }
  function initWordCycle(section) {
    const title = section.querySelector("[data-features-words]");
    const wordEl = title == null ? void 0 : title.querySelector(".features-1__word");
    if (!title || !wordEl) return;
    const words = getWords(section, wordEl);
    if (!words.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    title.setAttribute("aria-label", words.join(", "));
    if (prefersReducedMotion2 || words.length < 2) {
      wordEl.textContent = words[0];
      return;
    }
    let index = 0;
    let split = splitWord(wordEl);
    let cycle = null;
    let hold = null;
    let inView = false;
    let busy = false;
    const scheduleNext = () => {
      hold == null ? void 0 : hold.kill();
      hold = null;
      if (!inView || document.hidden) return;
      hold = gsap.delayedCall(HOLD_S$2, playNext);
    };
    const playNext = () => {
      if (!inView || document.hidden || !split || busy) return;
      const nextIndex = (index + 1) % words.length;
      const nextWord = words[nextIndex];
      const chars = split.chars;
      busy = true;
      cycle == null ? void 0 : cycle.kill();
      cycle = gsap.timeline({
        onComplete: () => {
          split == null ? void 0 : split.revert();
          wordEl.textContent = nextWord;
          split = splitWord(wordEl);
          index = nextIndex;
          const incoming = (split == null ? void 0 : split.chars) ?? [];
          gsap.fromTo(
            incoming,
            { yPercent: 55, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: CHAR_IN,
              stagger: STAGGER,
              ease: "power2.out",
              onComplete: () => {
                busy = false;
                scheduleNext();
              }
            }
          );
        }
      });
      cycle.to(chars, {
        yPercent: -55,
        opacity: 0,
        duration: CHAR_OUT,
        stagger: STAGGER,
        ease: "power2.in"
      });
    };
    ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        inView = true;
        scheduleNext();
      },
      onEnterBack: () => {
        inView = true;
        scheduleNext();
      },
      onLeave: () => {
        inView = false;
        hold == null ? void 0 : hold.kill();
        cycle == null ? void 0 : cycle.kill();
        busy = false;
      },
      onLeaveBack: () => {
        inView = false;
        hold == null ? void 0 : hold.kill();
        cycle == null ? void 0 : cycle.kill();
        busy = false;
      }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cycle == null ? void 0 : cycle.pause();
        return;
      }
      if (inView) cycle == null ? void 0 : cycle.resume();
    });
  }
  function splitWord(wordEl) {
    const split = new SplitText(wordEl, {
      type: "chars",
      charsClass: "features-1__char",
      tag: "span"
    });
    split.chars.forEach((char) => {
      var _a;
      if (!((_a = char.textContent) == null ? void 0 : _a.trim())) {
        char.classList.add("features-1__char--space");
      }
    });
    return split;
  }
  function getWords(section, wordEl) {
    var _a;
    const raw = section.getAttribute("data-words");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.map((word) => String(word).trim()).filter(Boolean);
        }
      } catch {
      }
    }
    const initial = (_a = wordEl.textContent) == null ? void 0 : _a.trim();
    return initial ? [initial] : [];
  }
  function initBackgroundSwitch(section) {
    const thumbsRoot = section.querySelector(".features-1__thumbs");
    const panes = [...section.querySelectorAll(".features-1__bg-pane")];
    const thumbs = [...section.querySelectorAll("[data-features-index]")];
    if (!thumbsRoot || !thumbs.length || !panes.length) return;
    let current = -1;
    panes.forEach((pane) => {
      pane.classList.remove("is-active");
      const photo = pane.querySelector("img");
      if (photo instanceof HTMLImageElement && photo.src) {
        const preload = new Image();
        preload.src = photo.src;
      }
    });
    const markThumbs = (activeIndex) => {
      thumbs.forEach((thumb, i) => {
        const on = i === activeIndex;
        thumb.classList.toggle("is-active", on);
        thumb.setAttribute("aria-pressed", String(on));
      });
    };
    const show = (nextIndex) => {
      if (nextIndex === current || !panes[nextIndex]) return;
      if (current >= 0) panes[current].classList.remove("is-active");
      panes[nextIndex].classList.add("is-active");
      current = nextIndex;
      markThumbs(nextIndex);
    };
    const hide = () => {
      if (current < 0) return;
      panes[current].classList.remove("is-active");
      current = -1;
      markThumbs(-1);
    };
    thumbs.forEach((thumb, index) => {
      thumb.addEventListener("pointerenter", () => show(index));
      thumb.addEventListener("mouseenter", () => show(index));
      thumb.addEventListener("focus", () => show(index));
    });
    thumbsRoot.addEventListener("pointerleave", hide);
    thumbsRoot.addEventListener("mouseleave", hide);
    thumbsRoot.addEventListener("focusout", (event) => {
      if (!thumbsRoot.contains(event.relatedTarget)) hide();
    });
  }
  function initThumbReveal(section) {
    const row = section.querySelector(".features-1__thumbs");
    const items = gsap.utils.toArray(section.querySelectorAll(".features-1__thumb-item"));
    if (!row || !items.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) {
      gsap.set(items, { opacity: 1, y: 0, scale: 1, clearProps: "transform" });
      items.forEach((item) => item.classList.add("is-in"));
      return;
    }
    gsap.set(items, { opacity: 0, y: 36, scale: 0.92, transformOrigin: "50% 100%" });
    ScrollTrigger.create({
      trigger: row,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.09,
          ease: "power3.out",
          overwrite: "auto",
          onComplete: () => {
            items.forEach((item) => item.classList.add("is-in"));
            gsap.set(items, { clearProps: "transform,opacity,transformOrigin" });
          }
        });
      }
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function initTextSlider1() {
    const rows = document.querySelectorAll("[data-text-marquee]");
    if (!rows.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rows.forEach((row) => {
      var _a;
      const track = row.querySelector("[data-text-marquee-track]") || row.querySelector(".text-slider-1__track");
      const group = row.querySelector("[data-text-marquee-group]") || row.querySelector(".text-slider-1__group");
      if (!track || !group) return;
      const direction = (row.getAttribute("data-direction") || "left").toLowerCase();
      const styles = getComputedStyle(row);
      const speed = Math.max(
        12,
        parseFloat(row.getAttribute("data-marquee-speed")) || parseFloat(styles.getPropertyValue("--text-marquee-speed")) || parseFloat(styles.getPropertyValue("--layout-textslider1-speed")) || 42
      );
      const dirSign = direction === "right" ? 1 : -1;
      const startX = row.hasAttribute("data-offset") ? parseFloat(styles.getPropertyValue("--layout-textslider1-row-offset")) || 0 : 0;
      let groupWidth = 0;
      let x = startX;
      let tickerFn = null;
      const wrapX = (value) => {
        if (!groupWidth) return value;
        return gsap.utils.wrap(-groupWidth, 0, value);
      };
      const render = () => {
        gsap.set(track, { x: wrapX(x) });
      };
      const fillTrack = () => {
        const source = group.cloneNode(true);
        track.replaceChildren(source);
        const unit = source.offsetWidth || source.getBoundingClientRect().width || 0;
        if (!unit) {
          track.replaceChildren(group);
          groupWidth = 0;
          return 0;
        }
        const minWidth = Math.max((row.offsetWidth || unit) * 2, unit * 2);
        let guard = 0;
        while (track.scrollWidth < minWidth && guard < 12) {
          track.appendChild(source.cloneNode(true));
          guard += 1;
        }
        groupWidth = unit;
        return unit;
      };
      const stopTicker = () => {
        if (tickerFn) {
          gsap.ticker.remove(tickerFn);
          tickerFn = null;
        }
      };
      const startTicker = () => {
        stopTicker();
        if (prefersReducedMotion2 || !groupWidth) return;
        tickerFn = (_time, delta) => {
          x += dirSign * speed * (delta / 1e3);
          render();
        };
        gsap.ticker.add(tickerFn);
      };
      const setup = () => {
        const unit = fillTrack();
        if (!unit) {
          gsap.set(track, { clearProps: "transform" });
          stopTicker();
          return;
        }
        x = wrapX(x);
        render();
        startTicker();
      };
      setup();
      window.setTimeout(setup, 100);
      window.setTimeout(setup, 400);
      if ((_a = document.fonts) == null ? void 0 : _a.ready) {
        document.fonts.ready.then(setup);
      }
      let resizeTimer = 0;
      window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(setup, 150);
      });
    });
  }
  const HOLD_S$1 = 5.2;
  const FADE_S$1 = 0.55;
  const TEXT_S$1 = 0.4;
  function initTestimonials2() {
    const root = document.querySelector("[data-testimonials-2]");
    if (!root || root.dataset.testimonials2Ready) return;
    root.dataset.testimonials2Ready = "true";
    const photos = [...root.querySelectorAll(".testimonials-2__photo")];
    const quotes = [...root.querySelectorAll(".testimonials-2__quote")];
    const authors = [...root.querySelectorAll(".testimonials-2__author")];
    const currentEl = root.querySelector("[data-testimonials-current]");
    const totalEl = root.querySelector("[data-testimonials-total]");
    const nextBtn = root.querySelector("[data-testimonials-next]");
    const total = photos.length;
    if (total < 1) return;
    if (totalEl) {
      totalEl.textContent = String(total).padStart(2, "0");
    }
    let index = Math.max(0, photos.findIndex((photo) => photo.classList.contains("is-active")));
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let fade = null;
    let hold = null;
    let busy = false;
    let inView = false;
    let queued = null;
    const pad = (value) => String(value).padStart(2, "0");
    const applyCopy = (nextIndex, animate) => {
      const copyEls = [...quotes, ...authors];
      gsap.killTweensOf(copyEls);
      quotes.forEach((quote, i) => {
        quote.classList.toggle("is-active", i === nextIndex);
        quote.toggleAttribute("inert", i !== nextIndex);
      });
      authors.forEach((author, i) => {
        author.classList.toggle("is-active", i === nextIndex);
        author.toggleAttribute("inert", i !== nextIndex);
      });
      if (currentEl) currentEl.textContent = pad(nextIndex + 1);
      const outgoing = copyEls.filter((el) => !el.classList.contains("is-active"));
      const incoming = [quotes[nextIndex], authors[nextIndex]].filter(Boolean);
      gsap.set(outgoing, { autoAlpha: 0, y: 0, overwrite: true });
      if (!animate || prefersReducedMotion2) {
        gsap.set(incoming, { autoAlpha: 1, y: 0, overwrite: true });
        return;
      }
      gsap.fromTo(
        incoming,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: TEXT_S$1, ease: "power2.out", stagger: 0.05, overwrite: true }
      );
    };
    const stopHold = () => {
      hold == null ? void 0 : hold.kill();
      hold = null;
    };
    const startHold = () => {
      stopHold();
      if (prefersReducedMotion2 || total < 2 || !inView) return;
      hold = gsap.delayedCall(HOLD_S$1, () => goTo(index + 1));
    };
    const goTo = (rawIndex) => {
      if (total < 2) return;
      const nextIndex = (rawIndex % total + total) % total;
      if (nextIndex === index) {
        queued = null;
        return;
      }
      if (busy) {
        queued = nextIndex;
        return;
      }
      const outgoing = photos[index];
      const incoming = photos[nextIndex];
      const finish = () => {
        photos.forEach((photo, i) => {
          const active = i === nextIndex;
          photo.classList.toggle("is-active", active);
          gsap.killTweensOf(photo);
          gsap.set(photo, {
            opacity: active ? 1 : 0,
            zIndex: active ? 2 : 1,
            overwrite: true
          });
        });
        index = nextIndex;
        busy = false;
        const nextQueued = queued;
        queued = null;
        if (nextQueued != null && nextQueued !== index) {
          goTo(nextQueued);
          return;
        }
        startHold();
      };
      applyCopy(nextIndex, !prefersReducedMotion2);
      if (prefersReducedMotion2) {
        photos.forEach((photo, i) => {
          photo.classList.toggle("is-active", i === nextIndex);
          gsap.killTweensOf(photo);
          gsap.set(photo, { clearProps: "opacity,zIndex" });
        });
        index = nextIndex;
        busy = false;
        return;
      }
      busy = true;
      stopHold();
      fade == null ? void 0 : fade.kill();
      gsap.set(incoming, { opacity: 0, zIndex: 3 });
      gsap.set(outgoing, { zIndex: 2 });
      fade = gsap.timeline({ onComplete: finish });
      fade.to(incoming, { opacity: 1, duration: FADE_S$1, ease: "power2.out" }, 0);
      fade.to(outgoing, { opacity: 0, duration: FADE_S$1, ease: "power2.out" }, 0);
    };
    photos.forEach((photo, i) => {
      const active = i === index;
      photo.classList.toggle("is-active", active);
      if (prefersReducedMotion2) {
        gsap.set(photo, { clearProps: "opacity,zIndex" });
      } else {
        gsap.set(photo, { opacity: active ? 1 : 0, zIndex: active ? 2 : 1 });
      }
    });
    applyCopy(index, false);
    nextBtn == null ? void 0 : nextBtn.addEventListener("click", () => goTo(index + 1));
    const media = root.querySelector(".testimonials-2__media");
    const stage = root.querySelector(".testimonials-2__stage");
    let suppressClick = false;
    media == null ? void 0 : media.addEventListener("click", () => {
      if (suppressClick) return;
      goTo(index + 1);
    });
    if (stage && total > 1) {
      const THRESHOLD = 56;
      let originX = 0;
      let originY = 0;
      let lastX = 0;
      let lastY = 0;
      let dragging = false;
      let dragged = false;
      const onMove = (event) => {
        lastX = event.clientX;
        lastY = event.clientY;
        const dx = lastX - originX;
        const dy = lastY - originY;
        if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
          dragged = true;
          stage.classList.add("is-dragging");
          if (event.cancelable) event.preventDefault();
        }
      };
      const onUp = (event) => {
        if (!dragging) return;
        dragging = false;
        stage.classList.remove("is-dragging");
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        const endX = Number.isFinite(event.clientX) ? event.clientX : lastX;
        const endY = Number.isFinite(event.clientY) ? event.clientY : lastY;
        const dx = endX - originX;
        const dy = endY - originY;
        const isSwipe = dragged && Math.abs(dx) >= THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.15;
        if (isSwipe) {
          suppressClick = true;
          window.setTimeout(() => {
            suppressClick = false;
          }, 400);
          goTo(index + (dx < 0 ? 1 : -1));
        } else {
          startHold();
        }
      };
      stage.addEventListener(
        "click",
        (event) => {
          if (!suppressClick) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClick = false;
        },
        true
      );
      stage.addEventListener("pointerdown", (event) => {
        var _a;
        if (event.button != null && event.button !== 0) return;
        const from = event.target instanceof Element ? event.target : (_a = event.target) == null ? void 0 : _a.parentElement;
        if (from == null ? void 0 : from.closest("a, button")) return;
        dragging = true;
        dragged = false;
        suppressClick = false;
        originX = event.clientX;
        originY = event.clientY;
        lastX = originX;
        lastY = originY;
        stopHold();
        window.addEventListener("pointermove", onMove, { passive: false });
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);
      });
    }
    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
      }
    });
    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        inView = self.isActive;
        if (inView) startHold();
        else stopHold();
      }
    });
    root.addEventListener("mouseenter", stopHold);
    root.addEventListener("mouseleave", startHold);
    root.addEventListener("focusin", stopHold);
    root.addEventListener("focusout", (event) => {
      if (!root.contains(event.relatedTarget)) startHold();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopHold();
        fade == null ? void 0 : fade.pause();
        return;
      }
      fade == null ? void 0 : fade.resume();
      startHold();
    });
  }
  const HOLD_S = 5.2;
  const FADE_S = 0.55;
  const TEXT_S = 0.4;
  function initTestimonials3() {
    const root = document.querySelector("[data-testimonials-3]");
    if (!root || root.dataset.testimonials3Ready) return;
    root.dataset.testimonials3Ready = "true";
    const photos = [...root.querySelectorAll(".testimonials-3__photo")];
    const quotes = [...root.querySelectorAll(".testimonials-3__quote")];
    const authors = [...root.querySelectorAll(".testimonials-3__author")];
    const currentEl = root.querySelector("[data-testimonials-current]");
    const totalEl = root.querySelector("[data-testimonials-total]");
    const nextBtn = root.querySelector("[data-testimonials-next]");
    const total = photos.length;
    if (total < 1) return;
    if (totalEl) {
      totalEl.textContent = String(total).padStart(2, "0");
    }
    let index = Math.max(0, photos.findIndex((photo) => photo.classList.contains("is-active")));
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let fade = null;
    let hold = null;
    let busy = false;
    let inView = false;
    let queued = null;
    const pad = (value) => String(value).padStart(2, "0");
    const applyCopy = (nextIndex, animate) => {
      const copyEls = [...quotes, ...authors];
      gsap.killTweensOf(copyEls);
      quotes.forEach((quote, i) => {
        quote.classList.toggle("is-active", i === nextIndex);
        quote.toggleAttribute("inert", i !== nextIndex);
      });
      authors.forEach((author, i) => {
        author.classList.toggle("is-active", i === nextIndex);
        author.toggleAttribute("inert", i !== nextIndex);
      });
      if (currentEl) currentEl.textContent = pad(nextIndex + 1);
      const outgoing = copyEls.filter((el) => !el.classList.contains("is-active"));
      const incoming = [quotes[nextIndex], authors[nextIndex]].filter(Boolean);
      gsap.set(outgoing, { autoAlpha: 0, y: 0, overwrite: true });
      if (!animate || prefersReducedMotion2) {
        gsap.set(incoming, { autoAlpha: 1, y: 0, overwrite: true });
        return;
      }
      gsap.fromTo(
        incoming,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: TEXT_S, ease: "power2.out", stagger: 0.05, overwrite: true }
      );
    };
    const stopHold = () => {
      hold == null ? void 0 : hold.kill();
      hold = null;
    };
    const startHold = () => {
      stopHold();
      if (prefersReducedMotion2 || total < 2 || !inView) return;
      hold = gsap.delayedCall(HOLD_S, () => goTo(index + 1));
    };
    const goTo = (rawIndex) => {
      if (total < 2) return;
      const nextIndex = (rawIndex % total + total) % total;
      if (nextIndex === index) {
        queued = null;
        return;
      }
      if (busy) {
        queued = nextIndex;
        return;
      }
      const outgoing = photos[index];
      const incoming = photos[nextIndex];
      const finish = () => {
        photos.forEach((photo, i) => {
          const active = i === nextIndex;
          photo.classList.toggle("is-active", active);
          gsap.killTweensOf(photo);
          gsap.set(photo, {
            opacity: active ? 1 : 0,
            zIndex: active ? 2 : 1,
            overwrite: true
          });
        });
        index = nextIndex;
        busy = false;
        const nextQueued = queued;
        queued = null;
        if (nextQueued != null && nextQueued !== index) {
          goTo(nextQueued);
          return;
        }
        startHold();
      };
      applyCopy(nextIndex, !prefersReducedMotion2);
      if (prefersReducedMotion2) {
        photos.forEach((photo, i) => {
          photo.classList.toggle("is-active", i === nextIndex);
          gsap.killTweensOf(photo);
          gsap.set(photo, { clearProps: "opacity,zIndex" });
        });
        index = nextIndex;
        busy = false;
        return;
      }
      busy = true;
      stopHold();
      fade == null ? void 0 : fade.kill();
      gsap.set(incoming, { opacity: 0, zIndex: 3 });
      gsap.set(outgoing, { zIndex: 2 });
      fade = gsap.timeline({ onComplete: finish });
      fade.to(incoming, { opacity: 1, duration: FADE_S, ease: "power2.out" }, 0);
      fade.to(outgoing, { opacity: 0, duration: FADE_S, ease: "power2.out" }, 0);
    };
    photos.forEach((photo, i) => {
      const active = i === index;
      photo.classList.toggle("is-active", active);
      if (prefersReducedMotion2) {
        gsap.set(photo, { clearProps: "opacity,zIndex" });
      } else {
        gsap.set(photo, { opacity: active ? 1 : 0, zIndex: active ? 2 : 1 });
      }
    });
    applyCopy(index, false);
    nextBtn == null ? void 0 : nextBtn.addEventListener("click", () => goTo(index + 1));
    const media = root.querySelector(".testimonials-3__media");
    const stage = root.querySelector(".testimonials-3__stage");
    let suppressClick = false;
    media == null ? void 0 : media.addEventListener("click", () => {
      if (suppressClick) return;
      goTo(index + 1);
    });
    if (stage && total > 1) {
      const THRESHOLD = 56;
      let originX = 0;
      let originY = 0;
      let lastX = 0;
      let lastY = 0;
      let dragging = false;
      let dragged = false;
      const onMove = (event) => {
        lastX = event.clientX;
        lastY = event.clientY;
        const dx = lastX - originX;
        const dy = lastY - originY;
        if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
          dragged = true;
          stage.classList.add("is-dragging");
          if (event.cancelable) event.preventDefault();
        }
      };
      const onUp = (event) => {
        if (!dragging) return;
        dragging = false;
        stage.classList.remove("is-dragging");
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        const endX = Number.isFinite(event.clientX) ? event.clientX : lastX;
        const endY = Number.isFinite(event.clientY) ? event.clientY : lastY;
        const dx = endX - originX;
        const dy = endY - originY;
        const isSwipe = dragged && Math.abs(dx) >= THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.15;
        if (isSwipe) {
          suppressClick = true;
          window.setTimeout(() => {
            suppressClick = false;
          }, 400);
          goTo(index + (dx < 0 ? 1 : -1));
        } else {
          startHold();
        }
      };
      stage.addEventListener(
        "click",
        (event) => {
          if (!suppressClick) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClick = false;
        },
        true
      );
      stage.addEventListener("pointerdown", (event) => {
        var _a;
        if (event.button != null && event.button !== 0) return;
        const from = event.target instanceof Element ? event.target : (_a = event.target) == null ? void 0 : _a.parentElement;
        if (from == null ? void 0 : from.closest("a, button")) return;
        dragging = true;
        dragged = false;
        suppressClick = false;
        originX = event.clientX;
        originY = event.clientY;
        lastX = originX;
        lastY = originY;
        stopHold();
        window.addEventListener("pointermove", onMove, { passive: false });
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);
      });
    }
    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
      }
    });
    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        inView = self.isActive;
        if (inView) startHold();
        else stopHold();
      }
    });
    root.addEventListener("mouseenter", stopHold);
    root.addEventListener("mouseleave", startHold);
    root.addEventListener("focusin", stopHold);
    root.addEventListener("focusout", (event) => {
      if (!root.contains(event.relatedTarget)) startHold();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopHold();
        fade == null ? void 0 : fade.pause();
        return;
      }
      fade == null ? void 0 : fade.resume();
      startHold();
    });
  }
  function initCta1() {
    const section = document.querySelector(".cta-1");
    const photos = section ? gsap.utils.toArray(section.querySelectorAll(".cta-1__photo")) : [];
    if (!section || !photos.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    gsap.matchMedia().add("(min-width: 1024px)", () => {
      const tweens = photos.map((el) => {
        var _a;
        const slot = (_a = [...el.classList].find((name) => name.startsWith("cta-1__photo--"))) == null ? void 0 : _a.replace("cta-1__photo--", "");
        const travel = tokenNumber$1(`--layout-cta1-parallax-${slot}`, 40);
        return gsap.fromTo(
          el,
          { y: travel },
          {
            y: -travel,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              end: "bottom 20%",
              scrub: 0.8
            }
          }
        );
      });
      return () => {
        tweens.forEach((tween) => {
          var _a;
          (_a = tween.scrollTrigger) == null ? void 0 : _a.kill();
          tween.kill();
        });
        gsap.set(photos, { clearProps: "transform" });
      };
    });
  }
  function tokenNumber$1(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function initCta2() {
    initCta2Slides();
    initCta2Titles();
  }
  function initCta2Slides() {
    const section = document.querySelector(".cta-2");
    const media = section == null ? void 0 : section.querySelector(".cta-2__media");
    const image = media == null ? void 0 : media.querySelector(".cta-2__image");
    if (!section || !media || !image) return;
    let slides = [];
    try {
      slides = JSON.parse(media.getAttribute("data-cta-slides") || "[]");
    } catch {
      slides = [];
    }
    slides = slides.map((item) => typeof item === "string" ? item : item == null ? void 0 : item.src).filter(Boolean);
    if (slides.length < 2) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    slides.forEach((src) => {
      const preload = new Image();
      preload.decoding = "async";
      preload.src = src;
    });
    const intervalMs = tokenDuration("--layout-cta2-slide-interval", 3e3);
    const fadeSec = tokenDuration("--layout-cta2-slide-fade", 800) / 1e3;
    let index = 0;
    let ticking = false;
    let hold = null;
    media.dataset.ctaSlide = "0";
    let st = null;
    const stop = () => {
      hold == null ? void 0 : hold.kill();
      hold = null;
    };
    const start = () => {
      if (hold || ticking) return;
      hold = gsap.delayedCall(intervalMs / 1e3, () => {
        hold = null;
        tick();
      });
    };
    const loadSlide = (src) => new Promise((resolve, reject) => {
      const probe = new Image();
      probe.decoding = "async";
      probe.onload = () => resolve(src);
      probe.onerror = reject;
      probe.src = src;
    });
    const tick = async () => {
      if (ticking || document.hidden || !(st == null ? void 0 : st.isActive)) return;
      ticking = true;
      const nextIndex = (index + 1) % slides.length;
      try {
        await loadSlide(slides[nextIndex]);
        await gsap.to(image, { opacity: 0, duration: fadeSec / 2, ease: "power1.inOut" });
        image.src = slides[nextIndex];
        await gsap.to(image, { opacity: 1, duration: fadeSec / 2, ease: "power1.inOut" });
        index = nextIndex;
        media.dataset.ctaSlide = String(index);
      } catch {
      } finally {
        ticking = false;
        if ((st == null ? void 0 : st.isActive) && !document.hidden) start();
      }
    };
    st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onEnter: start,
      onEnterBack: start,
      onLeave: stop,
      onLeaveBack: stop
    });
    if (st.isActive) start();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else if (st.isActive) start();
    });
  }
  function initCta2Titles() {
    const section = document.querySelector(".cta-2");
    const stage = section == null ? void 0 : section.querySelector(".cta-2__stage");
    const container = section == null ? void 0 : section.querySelector(":scope > .container");
    const headings = section ? gsap.utils.toArray(".cta-2__heading") : [];
    if (!section || !stage || !container || headings.length < 1) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    const startSize = () => tokenPx$9("--layout-cta2-title-start-size", 12);
    const startBottom = () => tokenPx$9("--layout-cta2-title-start-bottom", 20);
    const pinTop2 = () => tokenPx$9("--layout-cta2-title-pin-top", 250);
    const gap = () => tokenPx$9("--space-2", 16);
    const startHeight = () => tokenPx$9("--layout-cta2-height", 1e3);
    const endHeight = () => tokenPx$9("--layout-cta2-end-height", 500);
    const scrollPerLine = () => tokenLength$1("--layout-cta2-title-scroll", window.innerHeight);
    const shrinkScroll = () => {
      const drop = Math.max(0, startHeight() - endHeight());
      const fromToken = tokenLength$1("--layout-cta2-shrink-scroll", drop);
      return Math.max(drop, fromToken);
    };
    const titleSize = () => {
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;font-size:var(--layout-cta2-title-size)";
      document.body.appendChild(probe);
      const px = Number.parseFloat(getComputedStyle(probe).fontSize);
      probe.remove();
      return Number.isFinite(px) ? px : 72;
    };
    const pinTopForHeight = (height) => {
      const size = titleSize();
      const stack = size * headings.length + gap() * Math.max(0, headings.length - 1);
      const pad = tokenPx$9("--space-2", 16);
      const maxPin = height - stack - pad;
      return Math.min(pinTop2(), Math.max(pad, maxPin));
    };
    const headingBottom = (index, height, pin) => height - pin - titleSize() * (index + 1) - gap() * index;
    const frames = [stage, container];
    const collapse = () => Math.max(0, startHeight() - endHeight());
    gsap.set(section, { height: endHeight() });
    gsap.set(frames, { height: startHeight() });
    gsap.set(headings, {
      fontSize: startSize(),
      bottom: startBottom(),
      top: "auto"
    });
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${headings.length * scrollPerLine() + (collapse() > 0 ? shrinkScroll() : 0)}`,
        pin: section,
        pinSpacing: true,
        scrub: 0.15,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: () => {
          gsap.set(section, { height: endHeight() });
          gsap.set(frames, { height: startHeight() });
        }
      }
    });
    headings.forEach((heading, index) => {
      tl.fromTo(
        heading,
        {
          fontSize: () => `${startSize()}px`,
          bottom: () => `${startBottom()}px`
        },
        {
          fontSize: () => `${titleSize()}px`,
          bottom: () => `${headingBottom(index, startHeight(), pinTop2())}px`,
          duration: 1,
          immediateRender: false
        },
        index
      );
    });
    if (collapse() <= 0) return;
    const shrinkAt = headings.length;
    tl.fromTo(
      frames,
      { height: () => startHeight() },
      {
        height: () => endHeight(),
        duration: 1,
        immediateRender: false
      },
      shrinkAt
    );
    headings.forEach((heading, index) => {
      tl.to(
        heading,
        {
          bottom: () => `${headingBottom(index, endHeight(), pinTopForHeight(endHeight()))}px`,
          duration: 1,
          immediateRender: false
        },
        shrinkAt
      );
    });
  }
  function tokenDuration(name, fallbackMs) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (!raw) return fallbackMs;
    const value = Number.parseFloat(raw);
    if (!Number.isFinite(value)) return fallbackMs;
    if (raw.endsWith("s") && !raw.endsWith("ms")) return value * 1e3;
    return value;
  }
  function tokenPx$9(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function tokenLength$1(name, fallbackPx) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (!raw) return fallbackPx;
    const value = Number.parseFloat(raw);
    if (!Number.isFinite(value)) return fallbackPx;
    if (raw.endsWith("vh")) return value / 100 * window.innerHeight;
    if (raw.endsWith("vw")) return value / 100 * window.innerWidth;
    if (raw.endsWith("s") && !raw.endsWith("ms")) return value * 1e3;
    return value;
  }
  function initContact2() {
    const cards = gsap.utils.toArray(".contact-2__card");
    if (!cards.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cards.forEach((card) => {
      if (prefersReducedMotion2) {
        gsap.set(card, { scale: 1, rotateY: 0, clearProps: "transform,transformPerspective,transformOrigin" });
        return;
      }
      gsap.set(card, {
        transformPerspective: 1200,
        transformOrigin: "50% 50%",
        force3D: true
      });
      gsap.fromTo(
        card,
        {
          scale: 0.8,
          rotateY: 45
        },
        {
          scale: 1,
          rotateY: 0,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "top 45%",
            scrub: 0.4,
            invalidateOnRefresh: true
          }
        }
      );
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function initWhyUs2() {
    const section = document.querySelector(".why-us-2");
    const list = section == null ? void 0 : section.querySelector(".why-us-2__facts");
    if (!section || !list) return;
    const facts = gsap.utils.toArray(list.querySelectorAll(":scope > .why-us-2__fact"));
    if (facts.length < 2) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    gsap.matchMedia().add("(min-width: 1024px)", () => {
      list.classList.add("is-js-pin");
      const last = facts[facts.length - 1];
      const triggers = facts.map(
        (fact) => ScrollTrigger.create({
          trigger: fact,
          start: () => `top top+=${pinTop$5()}`,
          endTrigger: last,
          end: () => `top+=${pinHold$5()} top+=${pinTop$5()}`,
          pin: fact,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true
        })
      );
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return () => {
        triggers.forEach((st) => st.kill());
        list.classList.remove("is-js-pin");
      };
    });
  }
  function pinTop$5() {
    return tokenPx$8("--layout-whyus2-pin-top", 80);
  }
  function pinHold$5() {
    return tokenPx$8("--layout-whyus2-pin-hold", 80);
  }
  function tokenPx$8(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function initProcess2() {
    const section = document.querySelector(".process-2");
    const list = section == null ? void 0 : section.querySelector(".process-2__cards");
    if (!section || !list) return;
    const cards = gsap.utils.toArray(list.querySelectorAll(":scope > .process-2__card"));
    if (cards.length < 2) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    gsap.matchMedia().add("(min-width: 1024px)", () => {
      list.classList.add("is-js-pin");
      const last = cards[cards.length - 1];
      const triggers = cards.map(
        (card) => ScrollTrigger.create({
          trigger: card,
          start: () => `top top+=${pinTop$4()}`,
          endTrigger: last,
          end: () => `top+=${pinHold$4()} top+=${pinTop$4()}`,
          pin: card,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true
        })
      );
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return () => {
        triggers.forEach((st) => st.kill());
        list.classList.remove("is-js-pin");
      };
    });
  }
  function pinTop$4() {
    return tokenPx$7("--layout-process2-pin-top", 80);
  }
  function pinHold$4() {
    return tokenPx$7("--layout-process2-pin-hold", 80);
  }
  function tokenPx$7(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function initProcess3() {
    const section = document.querySelector(".process-3");
    const stage = section == null ? void 0 : section.querySelector(":scope > .container");
    const list = section == null ? void 0 : section.querySelector(".process-3__cards");
    if (!section || !stage || !list) return;
    const cards = gsap.utils.toArray(list.querySelectorAll(":scope > .process-3__card"));
    if (cards.length < 2) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    gsap.matchMedia().add("(min-width: 1024px)", () => {
      section.classList.add("is-js-fan");
      list.classList.add("is-js-fan");
      const fan = cards.map(() => ({ x: 0, y: 0, rotation: 0 }));
      const origin = "50% 80%";
      gsap.set(cards, { transformOrigin: origin, force3D: true });
      cards.forEach((card, index) => {
        gsap.set(card, { zIndex: index + 1 });
      });
      const measureFan = () => {
        const cache = cards.map((card) => ({
          x: gsap.getProperty(card, "x"),
          y: gsap.getProperty(card, "y"),
          rotation: gsap.getProperty(card, "rotation")
        }));
        gsap.set(cards, { x: 0, y: 0, rotation: 0 });
        const listBox = list.getBoundingClientRect();
        const centerX = listBox.left + listBox.width / 2;
        const mid = (cards.length - 1) / 2;
        const rotateStep = tokenPx$6("--layout-process3-fan-rotate", 12);
        const spread = tokenPx$6("--layout-process3-fan-spread", 120);
        const drop = tokenPx$6("--layout-process3-fan-drop", 16);
        cards.forEach((card, index) => {
          const box = card.getBoundingClientRect();
          const t = index - mid;
          fan[index] = {
            x: centerX - (box.left + box.width / 2) + t * spread,
            y: Math.abs(t) * drop,
            rotation: t * rotateStep
          };
        });
        cards.forEach((card, index) => {
          gsap.set(card, cache[index]);
        });
      };
      measureFan();
      cards.forEach((card, index) => {
        gsap.set(card, fan[index]);
      });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${pinScroll()}`,
          pin: section,
          pinSpacing: true,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: measureFan
        }
      });
      cards.forEach((card, index) => {
        tl.fromTo(
          card,
          {
            x: () => fan[index].x,
            y: () => fan[index].y,
            rotation: () => fan[index].rotation
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 1,
            immediateRender: false
          },
          0
        );
      });
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return () => {
        var _a;
        (_a = tl.scrollTrigger) == null ? void 0 : _a.kill();
        tl.kill();
        gsap.set(cards, { clearProps: "transform,zIndex,transformOrigin" });
        list.classList.remove("is-js-fan");
        section.classList.remove("is-js-fan");
      };
    });
  }
  function pinScroll() {
    return tokenLength("--layout-process3-pin-scroll", window.innerHeight * 0.9);
  }
  function tokenPx$6(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function tokenLength(name, fallbackPx) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (!raw) return fallbackPx;
    const value = Number.parseFloat(raw);
    if (!Number.isFinite(value)) return fallbackPx;
    if (raw.endsWith("vh")) return value / 100 * window.innerHeight;
    if (raw.endsWith("vw")) return value / 100 * window.innerWidth;
    return value;
  }
  function initProcess5() {
    const list = document.querySelector(".process-5__cards");
    if (!(list instanceof HTMLElement)) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    const shift = readShift();
    gsap.fromTo(
      list,
      { xPercent: shift },
      {
        xPercent: 0,
        ease: "none",
        immediateRender: true,
        scrollTrigger: {
          trigger: list,
          start: "top bottom",
          end: "top center",
          scrub: 1,
          invalidateOnRefresh: true
        }
      }
    );
  }
  function readShift() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--layout-process5-shift-x");
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) && value > 0 ? value : 50;
  }
  function initProcess6() {
    const section = document.querySelector(".process-6");
    const list = section == null ? void 0 : section.querySelector(".process-6__steps");
    if (!section || !list) return;
    const steps = gsap.utils.toArray(list.querySelectorAll(":scope > .process-6__step"));
    if (steps.length < 2) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    gsap.matchMedia().add("(min-width: 1024px)", () => {
      list.classList.add("is-js-pin");
      const last = steps[steps.length - 1];
      const triggers = steps.map(
        (step) => ScrollTrigger.create({
          trigger: step,
          start: () => `top top+=${pinTop$3()}`,
          endTrigger: last,
          end: () => `top+=${pinHold$3()} top+=${pinTop$3()}`,
          pin: step,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true
        })
      );
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return () => {
        triggers.forEach((st) => st.kill());
        list.classList.remove("is-js-pin");
      };
    });
  }
  function pinTop$3() {
    return tokenPx$5("--layout-process6-pin-top", 80);
  }
  function pinHold$3() {
    return tokenPx$5("--layout-process6-pin-hold", 80);
  }
  function tokenPx$5(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function initTeam2() {
    const section = document.querySelector(".team-2");
    const stack = section == null ? void 0 : section.querySelector(".team-2__stack");
    if (!section || !stack) return;
    const rows = gsap.utils.toArray(stack.querySelectorAll(":scope > .team-2__row"));
    if (rows.length < 2) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    gsap.matchMedia().add("(min-width: 1024px)", () => {
      stack.classList.add("is-js-pin");
      const last = rows[rows.length - 1];
      const fadeTo = tokenNumber("--layout-team2-card-fade", 0);
      const cards = rows.flatMap(
        (row) => gsap.utils.toArray(row.querySelectorAll(":scope > .team-2__member"))
      );
      const triggers = rows.map((row, index) => {
        const layer = index + 1;
        return ScrollTrigger.create({
          trigger: row,
          start: () => `top top+=${pinTop$2()}`,
          endTrigger: last,
          end: () => `top+=${pinHold$2()} top+=${pinTop$2()}`,
          pin: row,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh(self) {
            var _a;
            const spacer = (_a = self.pin) == null ? void 0 : _a.parentElement;
            if (spacer == null ? void 0 : spacer.classList.contains("pin-spacer")) {
              spacer.style.zIndex = String(layer);
            }
          }
        });
      });
      const fades = rows.slice(0, -1).map((row, index) => {
        const next = rows[index + 1];
        const members = gsap.utils.toArray(row.querySelectorAll(":scope > .team-2__member"));
        return gsap.fromTo(
          members,
          { filter: "opacity(1)" },
          {
            filter: `opacity(${fadeTo})`,
            ease: "none",
            stagger: { amount: 0.18 },
            immediateRender: false,
            scrollTrigger: {
              trigger: next,
              start: () => `top top+=${pinTop$2() + next.offsetHeight * 0.7}`,
              end: () => `top top+=${pinTop$2()}`,
              scrub: 0.45,
              invalidateOnRefresh: true
            }
          }
        );
      });
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return () => {
        fades.forEach((tween) => {
          var _a;
          (_a = tween.scrollTrigger) == null ? void 0 : _a.kill();
          tween.kill();
        });
        triggers.forEach((st) => st.kill());
        gsap.set(cards, { clearProps: "filter" });
        stack.classList.remove("is-js-pin");
      };
    });
  }
  function pinTop$2() {
    return tokenPx$4("--layout-team2-pin-top", 80);
  }
  function pinHold$2() {
    return tokenPx$4("--layout-team2-pin-hold", 80);
  }
  function tokenPx$4(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function tokenNumber(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function initTimeline1() {
    const section = document.querySelector(".timeline-1");
    const track = section == null ? void 0 : section.querySelector(".timeline-1__track");
    const progress = section == null ? void 0 : section.querySelector(".timeline-1__progress");
    if (!section || !track) return;
    const items = gsap.utils.toArray(track.querySelectorAll(".timeline-1__item"));
    const photo = section.querySelector(".timeline-1__photo");
    const photoTilt = section.querySelector(".timeline-1__photo-tilt");
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) {
      if (progress) gsap.set(progress, { scaleY: 1 });
      if (photo) gsap.set(photo, { y: 0, clearProps: "transform" });
      items.forEach((item) => {
        const milestone = item.querySelector(".timeline-1__milestone");
        const dot = item.querySelector(".timeline-1__dot");
        if (milestone) gsap.set(milestone, { autoAlpha: 1, x: 0, clearProps: "transform" });
        if (dot) gsap.set(dot, { scale: 1 });
      });
      return;
    }
    if (progress) {
      gsap.fromTo(
        progress,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          immediateRender: true,
          scrollTrigger: {
            trigger: track,
            start: "top 80%",
            end: "bottom 70%",
            scrub: 0.65,
            invalidateOnRefresh: true
          }
        }
      );
    }
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => setupItems(items, true));
    mm.add("(max-width: 1023px)", () => setupItems(items, false));
    if (photo) {
      gsap.fromTo(
        photo,
        { y: 0 },
        {
          y: () => Math.max(0, track.offsetHeight - photo.offsetHeight),
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: track,
            start: "top 75%",
            end: "bottom 65%",
            scrub: 0.85,
            invalidateOnRefresh: true
          }
        }
      );
    }
    if (photoTilt) {
      gsap.fromTo(
        photoTilt,
        { rotate: -18 },
        {
          rotate: 0,
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top 75%",
            end: "bottom 65%",
            scrub: 1,
            invalidateOnRefresh: true
          }
        }
      );
    }
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function setupItems(items, desktop) {
    const tweens = [];
    items.forEach((item) => {
      const milestone = item.querySelector(".timeline-1__milestone");
      const dot = item.querySelector(".timeline-1__dot");
      if (!milestone) return;
      const isLeft = desktop && item.classList.contains("timeline-1__item--left");
      const fromX = desktop ? isLeft ? -56 : 56 : 32;
      gsap.set(milestone, { autoAlpha: 0, x: fromX });
      if (dot) gsap.set(dot, { scale: 0, transformOrigin: "center center" });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 82%",
          once: true
        }
      });
      if (dot) {
        tl.to(
          dot,
          { scale: 1, duration: 0.45, ease: "back.out(2.2)" },
          0
        );
      }
      tl.to(
        milestone,
        { autoAlpha: 1, x: 0, duration: 0.95, ease: "power3.out" },
        0.06
      );
      tweens.push(tl);
    });
    return () => {
      tweens.forEach((tl) => tl.kill());
    };
  }
  function initProof1() {
    const section = document.querySelector(".proof-1");
    const metrics = section == null ? void 0 : section.querySelector(".proof-1__metrics");
    if (!section || !metrics) return;
    const cols = gsap.utils.toArray(metrics.querySelectorAll(":scope > .proof-1__col"));
    if (cols.length < 2) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    gsap.matchMedia().add("(min-width: 1024px)", () => {
      const travels = [
        tokenPx$3("--layout-proof1-parallax-a", 80),
        tokenPx$3("--layout-proof1-parallax-b", -120)
      ];
      const scrubs = [1.35, 0.7];
      const tweens = cols.map(
        (col, index) => gsap.fromTo(
          col,
          { y: 0 },
          {
            y: travels[index] ?? 0,
            ease: "none",
            force3D: true,
            immediateRender: false,
            scrollTrigger: {
              trigger: metrics,
              start: "top bottom",
              end: "bottom top",
              scrub: scrubs[index] ?? 1,
              invalidateOnRefresh: true
            }
          }
        )
      );
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return () => {
        tweens.forEach((tween) => {
          var _a;
          (_a = tween.scrollTrigger) == null ? void 0 : _a.kill();
          tween.kill();
        });
        gsap.set(cols, { clearProps: "transform" });
      };
    });
  }
  function tokenPx$3(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function initBlogCard2() {
    const cards = gsap.utils.toArray(".blog-card-2");
    if (!cards.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.matchMedia().add("(min-width: 1024px)", () => {
      cards.forEach((card) => {
        const mask = card.querySelector(".blog-card-2__mask");
        if (!mask) return;
        if (prefersReducedMotion2) {
          expandMask(mask);
          return;
        }
        const siblings = card.parentElement ? gsap.utils.toArray(card.parentElement.children) : [];
        const delay = Math.max(0, siblings.indexOf(card)) * 0.12;
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(mask, {
              width: tokenValue("--layout-blog-card2-mask-width", "280px"),
              height: tokenValue("--layout-blog-card2-mask-height", "347px"),
              duration: 0.8,
              delay,
              ease: "power3.out",
              overwrite: "auto"
            });
          }
        });
      });
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return () => {
        cards.forEach((card) => {
          const mask = card.querySelector(".blog-card-2__mask");
          if (!mask) return;
          gsap.killTweensOf(mask);
          gsap.set(mask, { clearProps: "width,height" });
        });
      };
    });
  }
  function expandMask(mask) {
    gsap.set(mask, {
      width: tokenValue("--layout-blog-card2-mask-width", "280px"),
      height: tokenValue("--layout-blog-card2-mask-height", "347px")
    });
  }
  function tokenValue(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return raw || fallback;
  }
  function initFeed2() {
    const section = document.querySelector(".feed-2");
    const grid = section == null ? void 0 : section.querySelector(".feed-2__grid");
    if (!section || !grid) return;
    const items = gsap.utils.toArray(grid.querySelectorAll(":scope > .feed-2__item"));
    if (items.length < 2) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    gsap.matchMedia().add("(min-width: 1024px)", () => {
      grid.classList.add("is-js-pin");
      const last = items[items.length - 1];
      const triggers = items.map((item, index) => {
        const layer = index + 1;
        return ScrollTrigger.create({
          trigger: item,
          start: () => `top top+=${pinTop$1()}`,
          endTrigger: last,
          end: () => `top+=${pinHold$1()} top+=${pinTop$1()}`,
          pin: item,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh(self) {
            var _a;
            const spacer = (_a = self.pin) == null ? void 0 : _a.parentElement;
            if (spacer == null ? void 0 : spacer.classList.contains("pin-spacer")) {
              spacer.style.zIndex = String(layer);
            }
          }
        });
      });
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return () => {
        triggers.forEach((st) => st.kill());
        grid.classList.remove("is-js-pin");
      };
    });
  }
  function pinTop$1() {
    return tokenPx$2("--layout-feed2-pin-top", 80);
  }
  function pinHold$1() {
    return tokenPx$2("--layout-feed2-pin-hold", 80);
  }
  function tokenPx$2(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function initPricing3() {
    document.querySelectorAll("[data-pricing-3], [data-pricing-4]").forEach((section) => {
      const tablist = section.querySelector('[role="tablist"]');
      if (!tablist) return;
      const tabs = [...tablist.querySelectorAll("[data-pricing-tab]")];
      const panels = [...section.querySelectorAll("[data-pricing-panel]")];
      if (tabs.length < 2 || !panels.length) return;
      const activate = (nextId, { focus = false } = {}) => {
        tabs.forEach((tab) => {
          const on = tab.getAttribute("data-pricing-tab") === nextId;
          tab.classList.toggle("is-active", on);
          tab.setAttribute("aria-selected", String(on));
          tab.tabIndex = on ? 0 : -1;
          if (on && focus) tab.focus();
        });
        panels.forEach((panel) => {
          const on = panel.getAttribute("data-pricing-panel") === nextId;
          panel.hidden = !on;
        });
      };
      tablist.addEventListener("click", (event) => {
        const tab = event.target.closest("[data-pricing-tab]");
        if (!tab || !tablist.contains(tab)) return;
        activate(tab.getAttribute("data-pricing-tab"));
      });
      tablist.addEventListener("keydown", (event) => {
        const current = tabs.indexOf(document.activeElement);
        if (current < 0) return;
        let next = current;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          next = (current + 1) % tabs.length;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          next = (current - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          next = 0;
        } else if (event.key === "End") {
          next = tabs.length - 1;
        } else {
          return;
        }
        event.preventDefault();
        activate(tabs[next].getAttribute("data-pricing-tab"), { focus: true });
      });
    });
  }
  function initFooterClock() {
    const el = document.querySelector("[data-footer-clock]");
    if (!el) return;
    const timeZone = el.getAttribute("data-footer-clock-tz") || "America/Toronto";
    const hoursEl = document.createElement("span");
    hoursEl.className = "footer-1__clock-hours";
    const sepEl = document.createElement("span");
    sepEl.className = "footer-1__clock-sep";
    sepEl.setAttribute("aria-hidden", "true");
    sepEl.textContent = ":";
    const minsEl = document.createElement("span");
    minsEl.className = "footer-1__clock-mins";
    const gap = document.createTextNode(" ");
    const periodEl = document.createElement("span");
    periodEl.className = "footer-1__clock-period";
    el.replaceChildren(hoursEl, sepEl, minsEl, gap, periodEl);
    el.setAttribute("aria-live", "off");
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    function tick() {
      try {
        const parts = formatter.formatToParts(/* @__PURE__ */ new Date());
        const get = (type) => {
          var _a;
          return ((_a = parts.find((part) => part.type === type)) == null ? void 0 : _a.value) ?? "";
        };
        hoursEl.textContent = get("hour");
        minsEl.textContent = get("minute");
        periodEl.textContent = get("dayPeriod");
      } catch {
      }
    }
    tick();
    const msToNextSecond = 1e3 - Date.now() % 1e3;
    window.setTimeout(() => {
      tick();
      window.setInterval(tick, 1e3);
    }, msToNextSecond);
  }
  function initFooterWordmarkCurtain() {
    const wordmarks = gsap.utils.toArray(".footer-1__wordmark");
    if (!wordmarks.length) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    wordmarks.forEach((wordmark) => {
      const curtain = wordmark.querySelector(".footer-1__wordmark-curtain");
      const lines = curtain ? gsap.utils.toArray(curtain.querySelectorAll(".footer-1__wordmark-curtain-line")) : [];
      if (!curtain || !lines.length) return;
      if (prefersReducedMotion2) {
        curtain.classList.add("is-open");
        return;
      }
      gsap.set(lines, { scaleY: 1, transformOrigin: "50% 50%" });
      gsap.to(lines, {
        scaleY: 0,
        duration: 0.85,
        ease: "power3.inOut",
        stagger: {
          amount: 0.4,
          from: "start"
        },
        overwrite: "auto",
        scrollTrigger: {
          trigger: wordmark,
          start: "top 90%",
          once: true
        },
        onComplete: () => {
          curtain.classList.add("is-open");
          gsap.set(lines, { clearProps: "transform" });
        }
      });
    });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
  function initJobOverviewStickyCopy() {
    const section = document.querySelector(".job-overview");
    const copy = section == null ? void 0 : section.querySelector(".job-overview__copy");
    if (!section || !copy) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    gsap.matchMedia().add("(min-width: 1024px)", () => {
      section.classList.add("is-js-pin");
      const pinTop2 = tokenPx$1("--layout-jobOverview-pin-top", 0);
      const pinHold2 = tokenPx$1("--layout-jobOverview-pin-hold", 80);
      const st = ScrollTrigger.create({
        trigger: section,
        start: () => `top top+=${pinTop2}`,
        end: () => `bottom bottom+=${pinHold2}`,
        pin: copy,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true
      });
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return () => {
        st.kill();
        section.classList.remove("is-js-pin");
      };
    });
  }
  function tokenPx$1(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function initBrief1JoinScroll() {
    var _a;
    const section = document.querySelector(".brief-1");
    const join = section == null ? void 0 : section.querySelector(".brief-1__join");
    const track = join == null ? void 0 : join.querySelector(".brief-1__join-track");
    if (!section || !join || !track) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    const travel = () => {
      const overflow = track.scrollWidth - join.clientWidth;
      return overflow > 0 ? -overflow : 0;
    };
    gsap.fromTo(
      track,
      { x: 0 },
      {
        x: travel,
        ease: "none",
        force3D: true,
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true
        }
      }
    );
    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    if ((_a = document.fonts) == null ? void 0 : _a.ready) {
      document.fonts.ready.then(refresh);
    }
  }
  function initBrief1FitPin() {
    const section = document.querySelector(".brief-1");
    const list = section == null ? void 0 : section.querySelector(".brief-1__fit-grid");
    if (!section || !list) return;
    const cards = gsap.utils.toArray(list.querySelectorAll(":scope > .brief-1__fit-card"));
    if (cards.length < 2) return;
    const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion2) return;
    gsap.matchMedia().add("(min-width: 1024px)", () => {
      list.classList.add("is-js-pin");
      const last = cards[cards.length - 1];
      const triggers = cards.map(
        (card) => ScrollTrigger.create({
          trigger: card,
          start: () => `top top+=${pinTop()}`,
          endTrigger: last,
          end: () => `top+=${pinHold()} top+=${pinTop()}`,
          pin: card,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true
        })
      );
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return () => {
        triggers.forEach((st) => st.kill());
        list.classList.remove("is-js-pin");
      };
    });
  }
  function pinTop() {
    return tokenPx("--layout-brief1-pin-top", 80);
  }
  function pinHold() {
    return tokenPx("--layout-brief1-pin-hold", 80);
  }
  function tokenPx(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
  function initGlightbox() {
    const GLightbox = window.GLightbox;
    if (typeof GLightbox !== "function") return;
    if (!document.querySelector(".glightbox")) return;
    GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
      openEffect: "fade",
      closeEffect: "fade"
    });
  }
  function initDemoForms() {
  const ENDPOINT = "https://formsubmit.co/ajax/vanshgrover4321@gmail.com";

  const forms = document.querySelectorAll(
    ".contact-1__card, .contact-2__card, .brief-2__form, .apply-1__form, .footer-3__news, [data-demo-form]"
  );

  forms.forEach((form) => {
    if (!(form instanceof HTMLFormElement) || form.dataset.formBound === "true") return;
    form.dataset.formBound = "true";

    const isNews = form.classList.contains("footer-3__news");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submit = form.querySelector('button[type="submit"]');
      const labelEl = submit ? submit.querySelector(".btn-1__label") : null;
      const oldText = labelEl ? labelEl.textContent : submit ? submit.textContent : "";

      if (submit) submit.disabled = true;
      if (labelEl) labelEl.textContent = "Sending...";
      else if (submit) submit.textContent = "Sending...";

      const data = new FormData(form);
      data.append("_subject", isNews ? "New newsletter signup - Orvix Media" : "New project brief - Orvix Media");
      data.append("_template", "table");
      data.append("_captcha", "false");
      data.append("_honey", "");

      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data
        });
        const json = await res.json().catch(() => ({}));

        if (!res.ok || String(json.success) !== "true") {
          throw new Error(json.message || "Submit failed");
        }

        form.reset();
        alert(
          isNews
            ? "You're subscribed! Thank you for joining the Orvix Media list."
            : "Thank you! Your brief has been submitted successfully. Team Orvix Media will review it and get back to you shortly."
        );
      } catch (error) {
        alert(
          "Oops! Something went wrong while submitting. Please email us at Info@theorvixmedia.com or call +91-9992363027."
        );
      } finally {
        if (submit) {
          submit.disabled = false;
          if (labelEl) labelEl.textContent = oldText;
          else submit.textContent = oldText;
        }
      }
    });
  });
}

  function initHelpSearch() {
    const form = document.querySelector(".help-hero-1__search");
    const input = document.querySelector("#help-search");
    if (!form || !input) return;
    const guideItems = Array.from(document.querySelectorAll(".guides-1 .accordion-1"));
    const topicCards = Array.from(document.querySelectorAll(".topics-1__card"));
    const topicArticles = [];
    const emptyId = "help-search-empty";
    let emptyEl = document.getElementById(emptyId);
    function ensureEmpty() {
      if (emptyEl) return emptyEl;
      const guides = document.querySelector(".guides-1__list");
      if (!guides) return null;
      emptyEl = document.createElement("p");
      emptyEl.id = emptyId;
      emptyEl.className = "help-search-empty";
      emptyEl.hidden = true;
      emptyEl.textContent = "No guides match that search.";
      guides.appendChild(emptyEl);
      return emptyEl;
    }
    function filter(query) {
      const q = query.trim().toLowerCase();
      let visibleGuides = 0;
      guideItems.forEach((item) => {
        var _a;
        const text = ((_a = item.textContent) == null ? void 0 : _a.toLowerCase()) || "";
        const match = !q || text.includes(q);
        item.hidden = !match;
        if (match) visibleGuides += 1;
      });
      const empty = ensureEmpty();
      if (empty) empty.hidden = !q || visibleGuides > 0;
      const cards = topicArticles.length ? topicArticles : topicCards;
      cards.forEach((card) => {
        var _a;
        const text = ((_a = card.textContent) == null ? void 0 : _a.toLowerCase()) || "";
        card.hidden = Boolean(q) && !text.includes(q);
      });
    }
    const params = new URLSearchParams(window.location.search);
    const initial = params.get(input.name || "q") || "";
    if (initial) {
      input.value = initial;
      filter(initial);
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      filter(input.value);
      const url = new URL(window.location.href);
      const q = input.value.trim();
      if (q) url.searchParams.set(input.name || "q", q);
      else url.searchParams.delete(input.name || "q");
      history.replaceState(null, "", url);
    });
    input.addEventListener("input", () => {
      filter(input.value);
    });
  }
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
  window.ScrollSmoother = ScrollSmoother;
  document.documentElement.classList.add("js");
  initPreLoader();
  initMagicCursor();
  initHeaderNavTextRoll();
  initHeader1Sub();
  let smoother = null;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coreCfg = typeof window.norioCore === "object" && window.norioCore ? window.norioCore : null;
  const smoothDisabledByCfg = !!(coreCfg && (coreCfg.reducedMotion || coreCfg.smoothScroll === false || coreCfg.smoothScroll === 0));
  const smoothWrapper = document.querySelector("#smooth-wrapper");
  const smoothContent = document.querySelector("#smooth-content");
  const useDesktopSmoothScroll = window.matchMedia("(min-width: 1025px) and (hover: hover) and (pointer: fine)").matches;
  if (!prefersReducedMotion && !smoothDisabledByCfg && useDesktopSmoothScroll && smoothWrapper && smoothContent) {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.35,
      effects: true,
      smoothTouch: 0.15,
      ignoreMobileResize: true
    });
    window.smoother = smoother;
    document.documentElement.classList.add("has-scroll-smoother");
    const refreshSmooth = () => {
      if (smoother) ScrollTrigger.refresh();
    };
    window.addEventListener("load", refreshSmooth, { once: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refreshSmooth).catch(() => {
      });
    }
  } else if (smoothWrapper && (prefersReducedMotion || smoothDisabledByCfg)) {
    smoothWrapper.style.overflow = "visible";
  }
  initMenuOverlay();
  initBottomNav();
  initFadeInUp();
  initFadeInDown();
  initFadeInLeft();
  initFadeInRight();
  initAnimZoomIn();
  initProjects2();
  initProjects3();
  initProjects4();
  initProjects5();
  initProjectDetailsQuote();
  initSplitWipe();
  initSplitWipe2();
  initGridWipe();
  initTextMark();
  initTextMarkTop();
  initHeroEmbedCycle();
  initHero2Slider();
  initShowcase1();
  initHeroFluid();
  initGlassTexture();
  initGridDeform();
  initHero3();
  initTextScramble();
  initOdometerCounter();
  initAboutThumbMarquee();
  initAbout2Mark();
  initAbout2Pin();
  initSectionTitleRule();
  initCursorParallax();
  initBox3D();
  initScrollParallax();
  initScrollMoveUp();
  initCoverReveal();
  initTextRoll();
  initTextMarkRoll();
  initTextBlurStagger();
  initTextScaleAnim();
  initTextScaleAnim2();
  initTestimonialsSticky();
  initProcessBarFill();
  initLazyVideo();
  initPricingLines();
  initAwardsSlider();
  initImageSlider2();
  initImageSlider3();
  initProject2();
  initProject3();
  initServices2();
  initServices3();
  initFeatures1();
  initTextSlider1();
  initTestimonials2();
  initTestimonials3();
  initCta1();
  initCta2();
  initContact2();
  initWhyUs2();
  initProcess2();
  initProcess3();
  initProcess5();
  initProcess6();
  initTeam2();
  initTimeline1();
  initProof1();
  initBlogCard2();
  initFeed2();
  initPricing3();
  initFooterClock();
  initFooterWordmarkCurtain();
  initJobOverviewStickyCopy();
  initBrief1JoinScroll();
  initBrief1FitPin();
  initGlightbox();
  initDemoForms();
  initHelpSearch();
  function scrollToTarget(target, smooth = true, position = "top top") {
    if (smoother) {
      if (typeof target === "number") {
        smoother.scrollTo(target, smooth);
      } else {
        smoother.scrollTo(target, smooth, position);
      }
      return;
    }
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: smooth ? "smooth" : "auto" });
      return;
    }
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (el) {
      el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    }
  }
  window.norioScrollTo = scrollToTarget;
  const headerToggle = document.querySelector(".header-1__toggle--float");
  const TOGGLE_SCROLL_SHOW_AT = 200;
  function getPageScrollY() {
    if (smoother) return smoother.scrollTop();
    return window.scrollY || document.documentElement.scrollTop || 0;
  }
  function syncHeaderToggle() {
    if (!headerToggle) return;
    const show = getPageScrollY() > TOGGLE_SCROLL_SHOW_AT;
    headerToggle.classList.toggle("is-visible", show);
    headerToggle.setAttribute("aria-hidden", String(!show));
    headerToggle.tabIndex = show ? 0 : -1;
  }
  syncHeaderToggle();
  window.addEventListener("resize", syncHeaderToggle);
  if (smoother) {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: syncHeaderToggle,
      onRefresh: syncHeaderToggle
    });
  } else {
    window.addEventListener("scroll", syncHeaderToggle, { passive: true });
  }
  document.querySelectorAll(".accordion-1").forEach((item) => {
    const trigger = item.querySelector(".accordion-1__trigger");
    if (!trigger) return;
    trigger.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");
      item.classList.toggle("is-open", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
    });
  });
  const footerBackTop = document.querySelectorAll(".footer-1__back-top, .footer-2__back-top, .footer-3__back-top, [data-back-to-top]");
  footerBackTop.forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      scrollToTarget(0);
    });
  });
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || href === "#" || href === "#0") return;
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    if (target.classList.contains("accordion-1")) {
      target.classList.add("is-open");
      const trigger = target.querySelector(".accordion-1__trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "true");
    }
    scrollToTarget(target);
    history.pushState(null, "", href);
  });
})(THREE);
