const express = require('express');
const cors = require('cors');
const { controller } = require( './utils/controller');
const { createProduct, getAll, getById, removeProduct, updateProduct } = require( './products/product.controller.js');
const app = express();

app.use(express.json());
app.use(cors({origin: "*"}))


app.get("/api/items", controller(getAll))
app.get("/api/items/:id", controller(getById))
app.post("/api/items", controller(createProduct))
app.put("/api/items/:id", controller(updateProduct))
app.delete("/api/items/:id", controller(removeProduct))


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
