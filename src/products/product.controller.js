// src/products/products.controller.js

const fs = require('fs');
const path = require('path');

// __dirname ya existe en CommonJS, no necesitás fileURLToPath
const DATA = path.join(__dirname, 'data.json');

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA, 'utf-8'));
  } catch {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA, JSON.stringify(data, null, 2));
}

function getAll(req, res) {
  res.json(readData());
}

function getById(req, res) {
  const items = readData();
  const id = parseInt(req.params.id, 10);
  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item no encontrado' });
  res.json(item);
}

function createProduct(req, res) {
  const { name, quantity } = req.body;
  if (!name || quantity < 0) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  const items = readData();
  const newId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const newItem = { id: newId, name, quantity };
  items.push(newItem);
  writeData(items);
  res.status(201).json(newItem);
}

function updateProduct(req, res) {
  const items = readData();
  const id = parseInt(req.params.id, 10);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Item no encontrado' });

  const { name, quantity } = req.body;
  if (!name || quantity < 0) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  items[idx] = { id, name, quantity };
  writeData(items);
  res.json(items[idx]);
}

function removeProduct(req, res) {
  const items = readData();
  const id = parseInt(req.params.id, 10);
  const updated = items.filter(i => i.id !== id);
  if (updated.length === items.length) {
    return res.status(404).json({ error: 'Item no encontrado' });
  }
  writeData(updated);
  res.status(204).end();
}

module.exports = {
  readData,
  writeData,
  getAll,
  getById,
  createProduct,
  updateProduct,
  removeProduct,
};
