// main.js
import { Item } from './products/item.js';

let items = [];
let editingItem = null;

const form = document.getElementById('item-form');
const nameInput = document.getElementById('item-name');
const qtyInput = document.getElementById('item-quantity');
const tableBody = document.querySelector('#item-table tbody');

// Carga inicial de datos
async function loadItems() {
  try {
    items = await Item.fetchAll();
    renderTable();
  } catch (err) {
    console.error('Error cargando items:', err);
    alert('No se pudieron cargar los datos');
  }
}

// Manejo de formulario (crear o actualizar)
form.addEventListener('submit', async e => {
  e.preventDefault(); // 🔒 evita recarga

  try {
    const item = editingItem || new Item();
    item.name = nameInput.value.trim();
    item.quantity = parseInt(qtyInput.value, 10);

    if (!item.isValid()) {
      alert('Datos inválidos');
      return;
    }

    console.log('Guardando item:', item);
    await item.save();
    resetForm();
    await loadItems();
  } catch (err) {
    console.error('Error al guardar el ítem:', err);
    alert('Ocurrió un error al guardar el ítem');
  }
});

// Renderiza tabla
function renderTable() {
  tableBody.innerHTML = '';
  items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>
        <button class="edit" data-id="${item.id}">Editar</button>
        <button class="delete" data-id="${item.id}">Eliminar</button>
      </td>`;
    tableBody.appendChild(row);
  });
}

// Delegación de eventos: editar / borrar
tableBody.addEventListener('click', async e => {
  const id = Number(e.target.dataset.id);
  if (e.target.classList.contains('edit')) {
    editingItem = items.find(i => i.id === id);
    if (!editingItem) return;
    nameInput.value = editingItem.name;
    qtyInput.value = editingItem.quantity;
    form.querySelector('button').textContent = 'Actualizar';
  }

  if (e.target.classList.contains('delete')) {
    try {
      const item = items.find(i => i.id === id);
      if (!item) return;
      await item.delete();
      await loadItems();
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('Ocurrió un error al eliminar el ítem');
    }
  }
});

// Resetea formulario a modo “Agregar”
function resetForm() {
  nameInput.value = '';
  qtyInput.value = '';
  editingItem = null;
  form.querySelector('button').textContent = 'Agregar';
}

// Primer render
loadItems();
