// script.js
// ======================================
// Generador de la malla curricular interactiva
// ======================================

// Usamos la malla que viene definida en index.html
const malla = window.malla;

// Contenedor donde va la malla
const container = document.getElementById("malla");

// Cargar progreso desde localStorage
let aprobados = JSON.parse(localStorage.getItem("aprobados")) || [];

// Función para renderizar la malla completa
function renderMalla() {
  container.innerHTML = "";

  Object.keys(malla).forEach((semestre) => {
    const col = document.createElement("div");
    col.classList.add("semestre");

    const title = document.createElement("h3");
    title.textContent = `Semestre ${semestre}`;
    col.appendChild(title);

    malla[semestre].forEach((ramo) => {
      const btn = document.createElement("button");
      btn.textContent = ramo.id;
      btn.classList.add("ramo");

      // Marcar si ya está aprobado
      if (aprobados.includes(ramo.id)) {
        btn.classList.add("aprobado");
      }

      // Evento de click
      btn.addEventListener("click", () => toggleRamo(ramo, btn));

      col.appendChild(btn);
    });

    container.appendChild(col);
  });
}

// Función para marcar o desmarcar un ramo
function toggleRamo(ramo, btn) {
  // Si ya estaba aprobado → desmarcar
  if (aprobados.includes(ramo.id)) {
    aprobados = aprobados.filter((r) => r !== ramo.id);
    btn.classList.remove("aprobado");
  } else {
    // Verificar requisitos
    const faltantes = ramo.req.filter((r) => !aprobados.includes(r));
    if (faltantes.length > 0) {
      alert(
        `No puedes aprobar "${ramo.id}" aún. Te faltan: ${faltantes.join(", ")}`
      );
      return;
    }

    // Marcar como aprobado
    aprobados.push(ramo.id);
    btn.classList.add("aprobado");
  }

  // Guardar en localStorage
  localStorage.setItem("aprobados", JSON.stringify(aprobados));
}

// Renderizar la malla al cargar la página
renderMalla();
