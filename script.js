/* =========================================================
   Malla Curricular Interactiva — Terapia Ocupacional U. Mayor
   - Marca ramos aprobados con click (tachado y color)
   - Respeta prerrequisitos (bloquea si faltan)
   - Persiste en localStorage
   - Compatible con index.html + estilos.css anteriores
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // 1) Contenedores de la página
  const container = document.getElementById("malla");
  const messageEl = document.getElementById("mensaje");

  if (!container) {
    console.error('No se encontró el contenedor con id="malla".');
    return;
  }

  // 2) Clave de almacenamiento
  const STORAGE_KEY = "malla_TO_umayor_aprobados";

  // 3) Cargar progreso previo
  const aprobados = new Set(
    (() => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch {
        return [];
      }
    })()
  );

  // 4) Malla: usar la de index.html si existe; si no, usar la malla por defecto
  const malla =
    (window.malla && typeof window.malla === "object" && Object.keys(window.malla).length)
      ? window.malla
      : {
          1: [
            { id: "Desarrollo personal y autoconocimiento", req: [] },
            { id: "Fundamentos de Terapia Ocupacional", req: [] },
            { id: "Estudios en ocupación y Terapia Ocupacional", req: [] },
            { id: "Anatomía humana", req: [] },
            { id: "Psicología general", req: [] },
            { id: "Biología y microbiología", req: [] }
          ],
          2: [
            { id: "Participación ocupacional I", req: ["Fundamentos de Terapia Ocupacional"] },
            { id: "Desarrollo de la creatividad", req: [] },
            { id: "Filosofía de la ocupación", req: [] },
            { id: "Ciencias sociales y ocupación", req: ["Psicología general"] },
            { id: "Fisiología general", req: ["Biología y microbiología"] }
          ],
          3: [
            { id: "Participación ocupacional II", req: ["Participación ocupacional I"] },
            { id: "Razonamiento estratégico terapéutico", req: ["Fundamentos de Terapia Ocupacional"] },
            { id: "Salud basada en evidencia", req: [] },
            { id: "Anatomía funcional y biomecánica I", req: ["Anatomía humana"] },
            { id: "Gerontología ocupacional", req: ["Psicología general"] },
            { id: "Fisiopatología", req: ["Fisiología general"] }
          ],
          4: [
            { id: "Práctica integrada inicial", req: ["Participación ocupacional II"] },
            { id: "Enfoques y modelos de práctica", req: ["Filosofía de la ocupación"] },
            { id: "Desarrollo de la persona del terapeuta", req: [] },
            { id: "Anatomía funcional y biomecánica II", req: ["Anatomía funcional y biomecánica I"] },
            { id: "Psicomotricidad y curso de vida", req: ["Gerontología ocupacional"] },
            { id: "Neurociencias", req: ["Fisiopatología"] }
          ],
          5: [
            { id: "Participación ocupacional III", req: ["Práctica integrada inicial"] },
            { id: "Razonamiento estratégico terapéutico II", req: ["Razonamiento estratégico terapéutico"] },
            { id: "Diseños de investigación cuantitativa", req: ["Salud basada en evidencia"] },
            { id: "Procesos de salud y enfermedad infantil", req: ["Neurociencias"] },
            { id: "Procesos de salud y enfermedad en jóvenes y adultos", req: ["Neurociencias"] }
          ],
          6: [
            { id: "Práctica integrada intermedia I", req: ["Participación ocupacional III"] },
            { id: "Diseños de investigación cualitativa", req: ["Diseños de investigación cuantitativa"] },
            { id: "Desafíos ocupacionales en adultos y personas mayores", req: ["Procesos de salud y enfermedad en jóvenes y adultos"] },
            { id: "Procesos de salud ocupacional en adultos y personas mayores", req: ["Procesos de salud y enfermedad en jóvenes y adultos"] },
            { id: "Salud pública", req: [] },
            { id: "Bioética", req: [] }
          ],
          7: [
            { id: "Proceso de Terapia Ocupacional inicial I", req: ["Práctica integrada intermedia I"] },
            { id: "Ortótica y tecnología aplicada I", req: [] },
            { id: "Procesos de salud ocupacional en niños y jóvenes", req: ["Procesos de salud y enfermedad infantil"] },
            { id: "Procesos de salud ocupacional en adultos y personas mayores II", req: ["Procesos de salud ocupacional en adultos y personas mayores"] }
          ],
          8: [
            { id: "Práctica integrada intermedia II", req: ["Proceso de Terapia Ocupacional inicial I"] },
            { id: "Ortótica y tecnología aplicada II", req: ["Ortótica y tecnología aplicada I"] },
            { id: "Proyecto de investigación", req: ["Diseños de investigación cualitativa"] },
            { id: "Innovación y emprendimiento", req: [] },
            { id: "Electivo 1", req: [] },
            { id: "Electivo 2", req: [] },
            { id: "Electivo 3", req: [] },
            { id: "Electivo 4", req: [] }
          ],
          9: [
            { id: "Práctica profesional I", req: ["Práctica integrada intermedia II"] },
            { id: "Práctica profesional II", req: ["Práctica profesional I"] },
            { id: "Desarrollo profesional I", req: [] },
            { id: "Proyecto de título I", req: ["Proyecto de investigación"] }
          ],
          10: [
            { id: "Práctica profesional III", req: ["Práctica profesional II"] },
            { id: "Práctica profesional IV", req: ["Práctica profesional III"] },
            { id: "Desarrollo profesional II", req: ["Desarrollo profesional I"] },
            { id: "Proyecto de título II", req: ["Proyecto de título I"] },
            { id: "Electivo 5", req: [] }
          ]
        };

  // Orden de semestres (1..10)
  const semestresOrdenados = Object.keys(malla)
    .map((n) => parseInt(n, 10))
    .sort((a, b) => a - b);

  // 5) Render de toda la malla
  function render() {
    container.innerHTML = "";

    semestresOrdenados.forEach((sem) => {
      // columna por semestre (usa clase .columna para calzar con estilos.css)
      const col = document.createElement("div");
      col.className = "columna";
      col.innerHTML = `<div class="semestre">Semestre ${sem}</div>`;

      malla[sem].forEach((ramo) => {
        const card = document.createElement("div");
        card.className = "ramo";
        card.textContent = ramo.id;

        // Guardar data para validación rápida
        card.dataset.id = ramo.id;
        card.dataset.req = JSON.stringify(ramo.req || []);

        // Marcar estado inicial
        if (aprobados.has(ramo.id)) {
          card.classList.add("aprobado");
        }

        card.addEventListener("click", () => onClickRamo(card));
        col.appendChild(card);
      });

      container.appendChild(col);
    });

    actualizarBloqueos();
  }

  // 6) Click en ramo: aprobar / desaprobar con verificación de requisitos
  function onClickRamo(card) {
    const id = card.dataset.id;
    const req = JSON.parse(card.dataset.req || "[]");

    // Si intenta aprobar un ramo bloqueado, avisar
    if (!card.classList.contains("aprobado") && !cumpleReq(req)) {
      const faltan = req.filter((r) => !aprobados.has(r));
      mostrarMensaje(
        `No puedes aprobar "${id}". Faltan por aprobar: ${faltan.join(", ")}`
      );
      return;
    }

    // Toggle estado
    if (card.classList.contains("aprobado")) {
      card.classList.remove("aprobado");
      aprobados.delete(id);
    } else {
      card.classList.add("aprobado");
      aprobados.add(id);
    }

    guardar();
    actualizarBloqueos();
  }

  // 7) Actualizar bloqueo visual según requisitos
  function actualizarBloqueos() {
    const cards = container.querySelectorAll(".ramo");
    cards.forEach((card) => {
      const id = card.dataset.id;
      const req = JSON.parse(card.dataset.req || "[]");

      if (aprobados.has(id)) {
        // Si ya está aprobado, no se bloquea
        card.classList.remove("bloqueado");
        return;
      }

      const ok = cumpleReq(req);
      card.classList.toggle("bloqueado", !ok);
    });
  }

  function cumpleReq(reqs) {
    return (reqs || []).every((r) => aprobados.has(r));
  }

  function guardar() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...aprobados]));
    } catch (e) {
      console.warn("No se pudo guardar en localStorage:", e);
    }
  }

  function mostrarMensaje(texto) {
    if (messageEl) {
      messageEl.textContent = texto;
      // Quitar mensaje anterior a los 3s
      clearTimeout(mostrarMensaje._t);
      mostrarMensaje._t = setTimeout(() => {
        messageEl.textContent = "";
      }, 3000);
    } else {
      alert(texto);
    }
  }

  // 8) ¡Listo!
  render();
});
