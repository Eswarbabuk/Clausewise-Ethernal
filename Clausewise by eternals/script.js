// Tab switching
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// PDF Reader using pdf.js
async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(" ") + "\n";
  }
  return text;
}

// Mock Analyzer
function analyzeText(text) {
  const clauses = text.split(". ").map((c, i) => ({
    id: i + 1,
    original: c,
    simplified: "Simplified: " + c.toLowerCase()
  })).filter(c => c.original.trim());

  return {
    type: "Contract",
    summary: `Found ${clauses.length} clauses.`,
    risks: ["Confidentiality too broad", "Missing termination clause"],
    clauses,
    entities: {
      parties: ["Party A", "Party B"],
      dates: ["01-01-2025"],
      amounts: ["$5000"]
    }
  };
}

// Analyze Button
document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const file = document.getElementById("fileInput").files[0];
  if (!file) {
    alert("Please upload a PDF first.");
    return;
  }

  const spinner = document.getElementById("loadingSpinner");
  spinner.classList.remove("hidden");

  setTimeout(async () => {
    const text = await extractTextFromPDF(file);
    document.getElementById("previewBox").textContent = text;

    const result = analyzeText(text);

    // Overview
    document.getElementById("docType").textContent = result.type;
    document.getElementById("summary").textContent = result.summary;
    document.getElementById("risks").textContent = result.risks.join(", ");

    // Clauses
    const cbox = document.getElementById("clausesBox");
    cbox.innerHTML = "";
    result.clauses.forEach(c => {
      const div = document.createElement("div");
      div.className = "clause";
      div.innerHTML = `<strong>Original:</strong> ${c.original}<br><strong>Simplified:</strong> ${c.simplified}`;
      cbox.appendChild(div);
    });

    // Entities
    const ebox = document.getElementById("entitiesBox");
    ebox.innerHTML = "";
    for (let [k, v] of Object.entries(result.entities)) {
      const div = document.createElement("div");
      div.className = "entity";
      div.innerHTML = `<h4>${k}</h4><p>${v.join(", ")}</p>`;
      ebox.appendChild(div);
    }

    // Raw JSON
    document.getElementById("rawJson").textContent = JSON.stringify(result, null, 2);

    spinner.classList.add("hidden");
  }, 1200);
});

// ✅ Particle background (CDN + inline config)
particlesJS("particles-js", {
  particles: {
    number: { value: 90, density: { enable: true, value_area: 800 } },
    color: { value: "#6ea8fe" },
    shape: { type: "circle" },
    opacity: { value: 0.6 },
    size: { value: 3 },
    line_linked: { enable: true, distance: 150, color: "#6ea8fe", opacity: 0.4, width: 1 },
    move: { enable: true, speed: 2 }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" }
    },
    modes: {
      repulse: { distance: 100 },
      push: { particles_nb: 4 }
    }
  },
  retina_detect: true
});
