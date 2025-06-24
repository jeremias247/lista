// --- 1. Seleccionar elementos HTML ---
// Lo primero que hacemos en JavaScript es "encontrar" los elementos de nuestro HTML
// para poder interactuar con ellos. Usamos document.getElementById() para buscar por ID.
const inputNuevaTarea = document.getElementById('inputNuevaTarea'); // El campo donde el usuario escribe la tarea
const btnAgregarTarea = document.getElementById('btnAgregarTarea'); // El botón "Añadir"
const listaTareas = document.getElementById('listaTareas');         // La lista (<ul>) donde se mostrarán las tareas
const btnLimpiarCompletadas = document.getElementById('btnLimpiarCompletadas'); // El botón "Limpiar Completadas"

// --- 2. Funciones para Guardar y Cargar Tareas (¡La magia de LocalStorage!) ---

// Esta función se encarga de guardar la lista actual de tareas en el navegador del usuario.
// Así, las tareas no se pierden si cierran la página y la vuelven a abrir.
function guardarTareas() {
    // 1. Obtener todas las tareas que están visibles en la lista
    // Seleccionamos todos los <li> que tienen la clase 'item-tarea'.
    const elementosTarea = listaTareas.querySelectorAll('.item-tarea');
    const tareasParaGuardar = []; // Creamos un array vacío para guardar la información de cada tarea.

    // 2. Recorrer cada tarea y extraer su información
    elementosTarea.forEach(item => {
        // Obtenemos el texto de la tarea (lo que dice la etiqueta <label>).
        const descripcion = item.querySelector('.descripcion-tarea').textContent;
        // Verificamos si la tarea está marcada como completada (si tiene la clase 'completada').
        const completada = item.classList.contains('completada');
        // Agregamos un objeto al array con la descripción y el estado (true/false) de la tarea.
        tareasParaGuardar.push({ descripcion: descripcion, completada: completada });
    });

    // 3. Guardar el array de tareas en LocalStorage
    // LocalStorage solo puede guardar texto. Por eso, convertimos nuestro array de objetos
    // a una cadena de texto en formato JSON usando JSON.stringify().
    localStorage.setItem('misTareasWeb', JSON.stringify(tareasParaGuardar));
    console.log('Tareas guardadas en LocalStorage:', tareasParaGuardar); // Mensaje para verificar en la consola del navegador
}

// Esta función se ejecuta al inicio, para cargar las tareas que ya estaban guardadas.
function cargarTareas() {
    // 1. Intentar obtener las tareas guardadas de LocalStorage.
    const tareasGuardadas = localStorage.getItem('misTareasWeb');

    // 2. Si encontramos algo guardado...
    if (tareasGuardadas) {
        // Convertimos la cadena de texto JSON de nuevo a un array de objetos JavaScript.
        const tareas = JSON.parse(tareasGuardadas);
        // Para cada tarea en ese array, la creamos y la añadimos a la lista visual.
        tareas.forEach(tarea => {
            crearElementoTarea(tarea.descripcion, tarea.completada);
        });
        console.log('Tareas cargadas desde LocalStorage:', tareas); // Mensaje para verificar
    } else {
        console.log('No hay tareas guardadas en LocalStorage. ¡Lista vacía!');
    }
}

// --- 3. Función para Crear un Elemento de Tarea en el HTML ---

// Esta es una función muy importante. Se encarga de construir un <li> completo
// (con su checkbox, texto y botón de eliminar) y añadirlo a la lista.
function crearElementoTarea(descripcion, completada = false) {
    const li = document.createElement('li'); // Creamos un nuevo elemento <li> (un ítem de la lista)
    li.classList.add('item-tarea'); // Le añadimos la clase CSS 'item-tarea' para que tenga estilo.

    // Si la tarea viene marcada como 'completada' desde LocalStorage, le añadimos la clase CSS.
    if (completada) {
        li.classList.add('completada');
    }

    // Definimos el contenido HTML interno de este <li>.
    // Usamos `innerHTML` y las 'backticks' (``) para escribir HTML multilinea cómodamente.
    // Incluimos un checkbox, la descripción y un botón con el emoji de basura.
    li.innerHTML = `
        <input type="checkbox" class="checkbox-tarea" ${completada ? 'checked' : ''}>
        <label class="descripcion-tarea">${descripcion}</label>
        <button class="btn-eliminar-tarea" aria-label="Eliminar tarea">
            🗑️
        </button>
    `;

    // --- A. Evento para Marcar/Desmarcar Tarea (al hacer clic en checkbox o texto) ---
    // Seleccionamos el checkbox y la descripción dentro del NUEVO <li> que acabamos de crear.
    const checkbox = li.querySelector('.checkbox-tarea');
    const descripcionTarea = li.querySelector('.descripcion-tarea');

    // Escuchamos el evento 'change' en el checkbox (cuando se marca o desmarca).
    checkbox.addEventListener('change', () => {
        // Alternamos la clase 'completada' en el <li> principal.
        // Si la tiene, se la quita; si no la tiene, se la pone.
        li.classList.toggle('completada');
        guardarTareas(); // ¡Siempre guardar después de un cambio!
    });

    // También permitimos marcar/desmarcar haciendo clic en el texto de la tarea.
    descripcionTarea.addEventListener('click', () => {
        // Cambiamos el estado del checkbox internamente.
        checkbox.checked = !checkbox.checked;
        // Disparamos el evento 'change' del checkbox para que se actualice el estilo y se guarde.
        checkbox.dispatchEvent(new Event('change'));
    });

    // --- B. Evento para Eliminar Tarea ---
    // Seleccionamos el botón de eliminar dentro del nuevo <li>.
    const btnEliminar = li.querySelector('.btn-eliminar-tarea');
    btnEliminar.addEventListener('click', () => {
        // Removemos el <li> (la tarea completa) de la lista visual.
        listaTareas.removeChild(li);
        guardarTareas(); // ¡Siempre guardar después de un cambio!
    });

    // Finalmente, añadimos este nuevo <li> (con todos sus eventos configurados)
    // a la lista principal (<ul>) en nuestro HTML.
    listaTareas.appendChild(li);
}

// --- 4. Eventos Principales de la Aplicación ---

// Evento: Cuando el usuario hace clic en el botón "Añadir"
btnAgregarTarea.addEventListener('click', () => {
    // Obtenemos el texto del campo de entrada y usamos .trim() para quitar espacios al inicio/final.
    const nuevaDescripcion = inputNuevaTarea.value.trim();
    // Si hay texto (no está vacío)...
    if (nuevaDescripcion) {
        crearElementoTarea(nuevaDescripcion); // Creamos la nueva tarea en la interfaz.
        inputNuevaTarea.value = ''; // Limpiamos el campo de texto para una nueva tarea.
        guardarTareas(); // Guardamos la lista con la nueva tarea.
    } else {
        alert('Por favor, escribe una tarea.'); // Si el campo está vacío, mostramos un aviso.
    }
});

// Evento: Cuando el usuario presiona una tecla en el campo de texto de nueva tarea
inputNuevaTarea.addEventListener('keypress', (e) => {
    // Si la tecla presionada es 'Enter' (código para la tecla Enter)...
    if (e.key === 'Enter') {
        btnAgregarTarea.click(); // Simulamos un clic en el botón "Añadir" (reutilizamos su lógica).
    }
});

// Evento: Cuando el usuario hace clic en el botón "Limpiar Completadas"
btnLimpiarCompletadas.addEventListener('click', () => {
    // 1. Seleccionar todas las tareas que están marcadas como 'completada'.
    const tareasCompletadas = listaTareas.querySelectorAll('.item-tarea.completada');
    // 2. Recorrer cada tarea completada y eliminarla.
    tareasCompletadas.forEach(tarea => {
        listaTareas.removeChild(tarea);
    });
    guardarTareas(); // Guardamos la lista después de eliminar las tareas.
});

// --- 5. Lógica que se ejecuta al cargar la página ---

// Esto es crucial: cuando el navegador termina de cargar todo el HTML
// (evento 'DOMContentLoaded'), llamamos a la función 'cargarTareas()'.
// Así, cada vez que abrimos la página, vemos nuestras tareas guardadas.
document.addEventListener('DOMContentLoaded', cargarTareas);