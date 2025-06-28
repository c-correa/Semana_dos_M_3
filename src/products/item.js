// item.js
export class Item {
  constructor(id = null, name = '', quantity = 0) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
  }

  // Trae todos los ítems del servidor y los convierte en instancias de Item
  static async fetchAll() {
    const res = await fetch('http://localhost:3000/api/items');
    const data = await res.json();
    return data.map(i => new Item(i.id, i.name, i.quantity));
  }

  // Obtener un ítem por ID
  static async fetchGetById(e, id) {

    const res = await fetch(`http://localhost:3000/api/items/${id}`);
    return res.json();
  }

  // Crea o actualiza este ítem
  async save(e) {

    const method = this.id ? 'PUT' : 'POST';
    const url = this.id ? `http://localhost:3000/api/items/${this.id}` : 'http://localhost:3000/api/items';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: this.name, quantity: this.quantity })
    });

    const json = await res.json();
    Object.assign(this, json); // actualiza con datos del servidor
  }

  // Elimina este ítem
  async delete() {
    if (!this.id) return;
    await fetch(`http://localhost:3000/api/items/${this.id}`, { method: 'DELETE' });
  }

  // Validación simple
  isValid() {
    return !!this.name && this.quantity >= 0;
  }
}
