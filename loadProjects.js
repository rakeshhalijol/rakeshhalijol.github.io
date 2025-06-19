async function loadProjects() {
  const res = await fetch("projects.json");
  const projects = await res.json();

  const categories = {
    Fundamentals: document.getElementById("fundamentals-projects"),
    "Machine Learning": document.getElementById("ml-projects"),
    "Generative AI": document.getElementById("genai-projects"),
  };

  projects.forEach((project) => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = project.repo;
    card.target = "_blank";
    card.innerHTML = `
      <img src="${project.banner}" alt="${project.name} Banner" />
      <h3>${project.name}</h3>
      <p>${project.description}</p>
    `;

    const section = categories[project.category];
    if (section) section.appendChild(card);
  });
}

loadProjects();
