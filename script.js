/*
  Srikar Santosh — The Digital Lab
  Static, framework-free interaction layer.
  Before publishing, add real contact links to PROFILE below.
*/

const PROFILE = {
  email: "srikarsantoshmummina@gmail.com",
  github: "https://github.com/srikarsantosh2007",
  linkedin: "https://www.linkedin.com/in/srikarsantosh"
};

(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  // Current year in the footer.
  const year = $("#currentYear");
  if (year) year.textContent = new Date().getFullYear();

  // Navigation: mobile menu, header state, and active section.
  const header = $(".site-header");
  const menuToggle = $("#menuToggle");
  const mobileNav = $("#mobileNav");

  const closeMenu = () => {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    mobileNav.hidden = true;
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(willOpen));
      menuToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
      mobileNav.hidden = !willOpen;
      document.body.classList.toggle("menu-open", willOpen);
    });
    $$('a[href^="#"]', mobileNav).forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (!mobileNav.hidden && !mobileNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }

  const sectionLinks = $$('.desktop-nav a[href^="#"]');
  const activeSections = ["about", "projects", "toolkit", "journey", "contact"]
    .map((id) => document.getElementById(id)).filter(Boolean);
  if ("IntersectionObserver" in window && sectionLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-current", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    activeSections.forEach((section) => navObserver.observe(section));
  }

  // Scroll reveal. Content remains visible if IntersectionObserver is unavailable.
  const revealItems = $$(".reveal");
  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.13, rootMargin: "0px 0px -6% 0px" });
    revealItems.forEach((item, index) => {
      item.style.setProperty("--delay", `${Math.min(index % 4, 3) * 65}ms`);
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const timeline = $("#timeline");
  if (timeline && "IntersectionObserver" in window && !reduceMotion.matches) {
    const timelineObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        timeline.classList.add("is-active");
        timelineObserver.disconnect();
      }
    }, { threshold: 0.15 });
    timelineObserver.observe(timeline);
  } else if (timeline) timeline.classList.add("is-active");

  // Reading progress and header styling, updated at most once per animation frame.
  const progressBar = $("#scrollProgress");
  let scrollFrame = 0;
  const updatePageProgress = () => {
    scrollFrame = 0;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    if (progressBar) progressBar.style.width = `${ratio * 100}%`;
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 20);
    updateProjectRail();
  };
  const onScroll = () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updatePageProgress);
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // Cursor aura. Native pointer stays visible for usability and text selection.
  const cursorAura = $(".cursor-aura");
  const cursorDot = $(".cursor-dot");
  if (!coarsePointer && !reduceMotion.matches && cursorAura && cursorDot) {
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let auraX = pointerX;
    let auraY = pointerY;
    let cursorFrame = 0;
    const moveCursor = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursorDot.style.left = `${pointerX}px`;
      cursorDot.style.top = `${pointerY}px`;
      document.body.classList.add("cursor-ready");
      if (!cursorFrame) cursorFrame = requestAnimationFrame(animateAura);
    };
    const animateAura = () => {
      auraX += (pointerX - auraX) * 0.18;
      auraY += (pointerY - auraY) * 0.18;
      cursorAura.style.left = `${auraX}px`;
      cursorAura.style.top = `${auraY}px`;
      if (Math.abs(pointerX - auraX) + Math.abs(pointerY - auraY) > 0.4) {
        cursorFrame = requestAnimationFrame(animateAura);
      } else cursorFrame = 0;
    };
    window.addEventListener("pointermove", moveCursor, { passive: true });
    document.addEventListener("pointerleave", () => document.body.classList.remove("cursor-ready"));
    document.addEventListener("pointerenter", () => document.body.classList.add("cursor-ready"));
  }

  // Magnetic buttons, limited to a few pixels for restraint.
  if (!coarsePointer && !reduceMotion.matches) {
    $$(".magnetic").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.transform = `translate3d(${x * 5}px, ${y * 4}px, 0)`;
      });
      element.addEventListener("pointerleave", () => { element.style.transform = ""; });
    });
  }

  // Card spotlight and subtle 3D tilt, only for precise pointer devices.
  if (!coarsePointer && !reduceMotion.matches) {
    $$(".glass-panel, .focus-item, .toolkit-card, .lab-card, .project-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        card.style.setProperty("--spot-x", `${px * 100}%`);
        card.style.setProperty("--spot-y", `${py * 100}%`);
        if (card.matches(".focus-item, .toolkit-card, .lab-card")) {
          const rx = (0.5 - py) * 3.5;
          const ry = (px - 0.5) * 4.5;
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
        }
      });
      card.addEventListener("pointerleave", () => {
        if (card.matches(".focus-item, .toolkit-card, .lab-card")) card.style.transform = "";
      });
    });
  }

  // Desktop scroll-driven horizontal project gallery. On mobile the cards become a normal stack.
  const projectsSection = $("#projects");
  const projectsPin = $(".projects-pin");
  const projectsViewport = $("#projectsViewport");
  const projectsTrack = $("#projectsTrack");
  const allProjectCards = $$(".project-card", projectsTrack || document);
  const projectCounter = $("#projectCounter");
  const projectProgressFill = $("#projectProgressFill");
  const mobileBreakpoint = window.matchMedia("(max-width: 780px)");
  let railShift = 0;
  let railProgress = 0;
  let visibleCards = [...allProjectCards];
  let railMeasureFrame = 0;

  const recalculateRail = () => {
    railMeasureFrame = 0;
    if (!projectsSection || !projectsPin || !projectsViewport || !projectsTrack) return;
    visibleCards = allProjectCards.filter((card) => !card.hidden);
    if (mobileBreakpoint.matches || reduceMotion.matches) {
      projectsSection.style.height = "auto";
      projectsTrack.style.transform = "none";
      projectsPin.style.position = "relative";
      projectsPin.style.top = "auto";
      railShift = 0;
      railProgress = 0;
      updateProjectCounter(0);
      return;
    }
    projectsPin.style.position = "sticky";
    projectsPin.style.top = "0px";
    const trackWidth = projectsTrack.scrollWidth;
    railShift = Math.max(0, trackWidth - window.innerWidth);
    projectsSection.style.height = `${window.innerHeight + railShift}px`;
    updateProjectRail();
  };

  const scheduleRailMeasure = () => {
    if (!railMeasureFrame) railMeasureFrame = requestAnimationFrame(recalculateRail);
  };

  const updateProjectCounter = (index) => {
    const count = Math.max(visibleCards.length, 1);
    const safeIndex = Math.min(Math.max(index, 0), count - 1);
    if (projectCounter) projectCounter.textContent = `${String(safeIndex + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
    if (projectProgressFill) projectProgressFill.style.width = `${((safeIndex + 1) / count) * 100}%`;
  };

  const updateProjectRail = () => {
    if (!projectsSection || !projectsTrack || !projectsViewport) return;
    visibleCards = allProjectCards.filter((card) => !card.hidden);
    if (mobileBreakpoint.matches || reduceMotion.matches || railShift <= 0) {
      if (mobileBreakpoint.matches || reduceMotion.matches) projectsTrack.style.transform = "none";
      // On mobile, highlight the card nearest the central viewing line.
      if (mobileBreakpoint.matches && visibleCards.length) {
        const mid = window.innerHeight * 0.54;
        let nearest = 0;
        let best = Infinity;
        visibleCards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const distance = Math.abs((rect.top + rect.bottom) / 2 - mid);
          if (distance < best) { best = distance; nearest = index; }
        });
        updateProjectCounter(nearest);
      }
      return;
    }
    const sectionTop = projectsSection.getBoundingClientRect().top + window.scrollY;
    const scrollDistance = Math.max(1, projectsSection.offsetHeight - window.innerHeight);
    railProgress = Math.min(1, Math.max(0, (window.scrollY - sectionTop) / scrollDistance));
    projectsTrack.style.transform = `translate3d(${-railShift * railProgress}px, 0, 0)`;
    if (visibleCards.length) {
      const center = window.innerWidth / 2;
      let nearest = 0;
      let best = Infinity;
      visibleCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs((rect.left + rect.right) / 2 - center);
        if (distance < best) { best = distance; nearest = index; }
      });
      updateProjectCounter(nearest);
    }
  };

  // Category filters also recalculate the scroll length so no hidden-card gap remains.
  const filterButtons = $$(".filter-button");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter || "all";
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      allProjectCards.forEach((card) => {
        card.hidden = category !== "all" && card.dataset.category !== category;
      });
      // Let the browser apply display changes before measuring the new rail width.
      requestAnimationFrame(() => {
        recalculateRail();
        updateProjectRail();
      });
    });
  });

  window.addEventListener("resize", scheduleRailMeasure, { passive: true });
  window.addEventListener("load", scheduleRailMeasure, { once: true });
  if ("ResizeObserver" in window && projectsTrack) {
    const trackObserver = new ResizeObserver(scheduleRailMeasure);
    trackObserver.observe(projectsTrack);
  }
  if (projectsSection) scheduleRailMeasure();

  // Portfolio particle field: lightweight canvas, pointer-reactive on desktop and calm on mobile.
  const canvas = $("#particleCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d", { alpha: true });
    if (ctx) {
      let width = 0;
      let height = 0;
      let dpr = 1;
      let particles = [];
      let animationFrame = 0;
      let heroVisible = true;
      let pointer = { x: -1000, y: -1000 };
      const maxParticles = () => window.innerWidth < 650 ? 34 : window.innerWidth < 1050 ? 52 : 74;
      const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        dpr = Math.min(window.devicePixelRatio || 1, 1.6);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const amount = maxParticles();
        particles = Array.from({ length: amount }, (_, index) => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (reduceMotion.matches ? 0 : 0.22),
          vy: (Math.random() - 0.5) * (reduceMotion.matches ? 0 : 0.22),
          r: index % 9 === 0 ? 1.5 : 0.7 + Math.random() * 0.65,
          alpha: 0.18 + Math.random() * 0.45,
        }));
        drawParticles();
      };
      const drawParticles = () => {
        ctx.clearRect(0, 0, width, height);
        const connectionDistance = width < 650 ? 95 : 130;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (!reduceMotion.matches && heroVisible && document.visibilityState === "visible") {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.y < -10) p.y = height + 10;
            if (p.y > height + 10) p.y = -10;
          }
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const distance = Math.hypot(dx, dy);
          if (!coarsePointer && distance < 150 && !reduceMotion.matches) {
            p.x -= dx * 0.00025;
            p.y -= dy * 0.00025;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(127, 190, 255, ${p.alpha})`;
          ctx.fill();
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const lx = p.x - q.x;
            const ly = p.y - q.y;
            const d = Math.sqrt(lx * lx + ly * ly);
            if (d < connectionDistance) {
              const alpha = (1 - d / connectionDistance) * 0.13;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(86, 156, 232, ${alpha})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
        if (!reduceMotion.matches && heroVisible && document.visibilityState === "visible") {
          animationFrame = requestAnimationFrame(drawParticles);
        } else animationFrame = 0;
      };
      const restartParticles = () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        drawParticles();
      };
      canvas.addEventListener("pointermove", (event) => {
        const rect = canvas.getBoundingClientRect();
        pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      }, { passive: true });
      canvas.addEventListener("pointerleave", () => { pointer = { x: -1000, y: -1000 }; });
      window.addEventListener("resize", resizeCanvas, { passive: true });
      document.addEventListener("visibilitychange", restartParticles);
      if ("IntersectionObserver" in window) {
        const heroObserver = new IntersectionObserver((entries) => {
          heroVisible = entries.some((entry) => entry.isIntersecting);
          restartParticles();
        }, { threshold: 0.02 });
        heroObserver.observe(canvas.closest(".hero"));
      }
      resizeCanvas();
      if (!reduceMotion.matches) restartParticles();
    }
  }

  // Contact links are intentionally not fabricated. Add real details to PROFILE above.
  const contactNote = $("#contactConfigNote");
  let configuredCount = 0;
  $$('[data-contact]').forEach((link) => {
    const key = link.dataset.contact;
    const value = PROFILE[key];
    if (typeof value === "string" && value.trim()) {
      if (key === "email") link.href = `mailto:${value.trim()}`;
      else {
        try {
          const url = new URL(value.trim());
          if (url.protocol === "https:" || url.protocol === "http:") link.href = url.href;
          else throw new Error("Unsupported URL protocol");
        } catch {
          link.removeAttribute("href");
          link.classList.add("is-unconfigured");
          link.setAttribute("aria-disabled", "true");
          return;
        }
      }
      link.classList.remove("is-unconfigured");
      link.removeAttribute("aria-disabled");
      configuredCount++;
    } else {
      link.removeAttribute("href");
      link.classList.add("is-unconfigured");
      link.setAttribute("aria-disabled", "true");
      link.removeAttribute("target");
    }
  });
  if (contactNote && configuredCount === 3) contactNote.classList.add("is-hidden");

  // Initial position: prevents a flash of an incorrect progress bar after reload in-page.
  updatePageProgress();
})();
