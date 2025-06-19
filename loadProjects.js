fetch("./projects.json")
  .then((response) => response.json())
  .then((data) => {
    const container = document.querySelector(".projects");
    container.innerHTML = ""; // Clear existing content

    data.forEach((project) => {
      const card = document.createElement("a");
      card.className = "card";
      card.href = project.repo;
      card.target = "_blank";
      card.setAttribute("data-aos", "flip-left");

      card.innerHTML = `
        <img src="${project.banner}" alt="${project.name} banner" />
        <h3>${project.name}</h3>
        <p>${project.description}</p>
      `;

      container.appendChild(card);
    });
  })
  .catch((error) => console.error("Error loading project data:", error));
