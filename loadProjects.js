document.addEventListener("DOMContentLoaded", () => {
  // === ELEMENTS ===
  const projectContainer = document.getElementById("project-container");
  const tabs = {
    genai: document.getElementById("genai-tab"),
    ml: document.getElementById("ml-tab"),
    fundamentals: document.getElementById("fundamentals-tab"),
  };
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const themeToggle = document.getElementById("checkbox");
  const body = document.body;

  let allProjects = [];

  // === HAMBURGER MENU ===
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("nav-active");
      hamburger.classList.toggle("toggled");
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", !expanded);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("nav-active");
        hamburger.classList.remove("toggled");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // === DISPLAY PROJECTS ===
  function displayProjects(category) {
    const filtered = allProjects.filter((p) => p.category === category);
    projectContainer.style.opacity = "0";

    setTimeout(() => {
      projectContainer.innerHTML = "";

      if (filtered.length === 0) {
        projectContainer.innerHTML = `<p>No projects found in this category yet.</p>`;
      } else {
        filtered.forEach((project, index) => {
          const card = createProjectCard(project);
          card.style.animationDelay = `${index * 100}ms`;
          projectContainer.appendChild(card);
        });
      }

      projectContainer.style.opacity = "1";
    }, 400);
  }

  function createProjectCard(project) {
    const card = document.createElement("a");
    card.className = "card";
    card.href = project.repo;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.innerHTML = `
      <img src="${project.banner}" alt="${project.name} Banner" />
      <h3>${project.name}</h3>
      <p>${project.description}</p>
    `;
    return card;
  }

  function updateActiveTab(activeKey) {
    Object.keys(tabs).forEach((key) => {
      const tab = tabs[key];
      if (!tab) return;
      tab.classList.toggle("active", key === activeKey);
      tab.setAttribute("aria-selected", key === activeKey);
    });
  }

  // === LOAD PROJECTS FROM JSON ===
  async function loadProjects() {
    try {
      const res = await fetch("projects.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      allProjects = await res.json();

      updateActiveTab("genai");
      displayProjects("Generative AI");
    } catch (err) {
      console.error("Failed to load projects:", err);
      projectContainer.innerHTML = `<p class="error">Error loading projects. Try again later.</p>`;
    }
  }

  // === TAB EVENTS ===
  tabs.genai?.addEventListener("click", () => {
    updateActiveTab("genai");
    displayProjects("Generative AI");
  });

  tabs.ml?.addEventListener("click", () => {
    updateActiveTab("ml");
    displayProjects("Machine Learning");
  });

  tabs.fundamentals?.addEventListener("click", () => {
    updateActiveTab("fundamentals");
    displayProjects("Fundamentals");
  });

  // === SCROLL ANIMATION ===
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          scrollObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    scrollObserver.observe(el);
  });

  // === THEME SWITCHER ===
  function setTheme(mode) {
    body.className = mode;
    localStorage.setItem("theme", mode);
    themeToggle.checked = mode === "dark-mode";
  }

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(savedTheme || (prefersDark ? "dark-mode" : "light-mode"));

  themeToggle?.addEventListener("change", () => {
    setTheme(themeToggle.checked ? "dark-mode" : "light-mode");
  });

  // === INIT ===
  loadProjects();
});
