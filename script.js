// Usar la malla definida en index.html
const malla = window.malla;
  // Agrega más semestres y ramos según tu malla real...
};

// Cargar estados desde localStorage o inicializar vacíos
const aprobados = JSON.parse(localStorage.getItem('aprobados')) || [];

// Construye visualmente la malla
const contenedor = document.getElementById('malla');
const mensaje = document.getElementById('mensaje');

for (const [sem, ramos] of Object.entries(malla)) {
  const col = document.createElement('div');
  col.className = 'columna';
  col.innerHTML = `<div class="semestre">Semestre ${sem}</div>`;
  
  ramos.forEach(ramo => {
    const div = document.createElement('div');
    div.className = 'ramo';
    div.textContent = ramo.id;
    div.dataset.id = ramo.id;
    div.dataset.req = JSON.stringify(ramo.req);
    
    if (aprobados.includes(ramo.id)) div.classList.add('aprobado');
    else if (!ramo.req.every(r => aprobados.includes(r))) div.classList.add('bloqueado');
    
    div.addEventListener('click', () => manejarClick(div));
    col.appendChild(div);
  });
  
  contenedor.appendChild(col);
}

function manejarClick(div) {
  const ramo = div.dataset.id;
  const req = JSON.parse(div.dataset.req);
  
  if (div.classList.contains('bloqueado')) {
    const faltan = req.filter(r => !aprobados.includes(r));
    mensaje.textContent = `No puedes aprobar "${ramo}". Faltan: ${faltan.join(', ')}`;
    setTimeout(() => mensaje.textContent = '', 3000);
    return;
  }
  
  if (div.classList.contains('aprobado')) {
    // Desaprobar
    div.classList.remove('aprobado');
    const idx = aprobados.indexOf(ramo);
    if (idx > -1) aprobados.splice(idx, 1);
  } else {
    // Aprobar
    div.classList.add('aprobado');
    aprobados.push(ramo);
  }
  
  localStorage.setItem('aprobados', JSON.stringify(aprobados));
  actualizarBloqueos();
}

function actualizarBloqueos() {
  document.querySelectorAll('.ramo').forEach(div => {
    if (div.classList.contains('aprobado')) {
      div.classList.remove('bloqueado');
      return;
    }
    const req = JSON.parse(div.dataset.req);
    if (!req.every(r => aprobados.includes(r))) div.classList.add('bloqueado');
    else div.classList.remove('bloqueado');
  });
}

// Al cargar, actualizar bloqueos
actualizarBloqueos();
