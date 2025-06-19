document.addEventListener("DOMContentLoaded", () => {
  // --- GLOBAL VARIABLES ---
  let allProjects = [];
  const projectContainer = document.getElementById("project-container");

  const tabs = {
    genai: document.getElementById("genai-tab"),
    ml: document.getElementById("ml-tab"),
    fundamentals: document.getElementById("fundamentals-tab"),
  };

  // --- DISPLAY LOGIC ---

  /**
   * Displays projects of a specific category with a staggered animation.
   * @param {string} category - The category to display.
   */
  function displayProjects(category) {
    const filteredProjects = allProjects.filter((p) => p.category === category);

    // 1. Fade out the container
    projectContainer.style.opacity = "0";

    setTimeout(() => {
      // 2. Clear container and repopulate after fade-out
      projectContainer.innerHTML = "";

      if (filteredProjects.length === 0) {
        projectContainer.innerHTML =
          "<p>No projects found in this category yet.</p>";
      } else {
        filteredProjects.forEach((project, index) => {
          const card = createProjectCard(project);
          // Set staggered animation delay for the cascading effect
          card.style.animationDelay = `${index * 100}ms`;
          projectContainer.appendChild(card);
        });
      }

      // 3. Fade the container back in
      projectContainer.style.opacity = "1";
    }, 400); // This delay should match the transition time in CSS
  }

  /**
   * Creates and returns a project card element.
   * @param {object} project - The project data.
   * @returns {HTMLElement} The project card anchor element.
   */
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

  /**
   * Updates the active state of the tab buttons.
   * @param {string} activeTabKey - The key of the active tab (e.g., 'genai').
   */
  function updateActiveTab(activeTabKey) {
    for (const key in tabs) {
      if (tabs[key]) {
        tabs[key].classList.remove("active");
        tabs[key].setAttribute("aria-selected", "false");
      }
    }
    if (tabs[activeTabKey]) {
      tabs[activeTabKey].classList.add("active");
      tabs[activeTabKey].setAttribute("aria-selected", "true");
    }
  }

  // --- DATA FETCHING ---

  async function loadProjects() {
    try {
      const res = await fetch("projects.json");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      allProjects = await res.json();

      // Initial display (defaults to Generative AI)
      updateActiveTab("genai");
      displayProjects("Generative AI");
    } catch (error) {
      console.error("Could not load projects:", error);
      projectContainer.innerHTML = "<p>Error: Could not load project data.</p>";
    }
  }

  // --- EVENT LISTENERS ---

  // Tab click events
  if (tabs.genai)
    tabs.genai.addEventListener("click", () => {
      updateActiveTab("genai");
      displayProjects("Generative AI");
    });
  if (tabs.ml)
    tabs.ml.addEventListener("click", () => {
      updateActiveTab("ml");
      displayProjects("Machine Learning");
    });
  if (tabs.fundamentals)
    tabs.fundamentals.addEventListener("click", () => {
      updateActiveTab("fundamentals");
      displayProjects("Fundamentals");
    });

  // --- SCROLL ANIMATION ---
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          scrollObserver.unobserve(entry.target); // Optional: stop observing once visible
        }
      });
    },
    {
      threshold: 0.1, // Trigger when 10% of the element is visible
    }
  );

  // Observe all elements with the 'animate-on-scroll' class
  document.querySelectorAll(".animate-on-scroll").forEach((element) => {
    scrollObserver.observe(element);
  });

  // --- THEME SWITCHER LOGIC (Unchanged) ---
  const themeToggle = document.getElementById("checkbox");
  const body = document.body;

  function setTheme(theme) {
    body.className = theme;
    localStorage.setItem("theme", theme);
    if (themeToggle) themeToggle.checked = theme === "dark-mode";
  }

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  setTheme(savedTheme || (prefersDark ? "dark-mode" : "light-mode"));

  if (themeToggle) {
    themeToggle.addEventListener("change", () => {
      setTheme(themeToggle.checked ? "dark-mode" : "light-mode");
    });
  }

  // --- INITIALIZATION ---
  loadProjects();
});
