import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../../server/.env' });

await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patitas_catalog');

const comidaSchema = new mongoose.Schema({ producto_id: String, nombre: String, categoria: String, precio: Number, marca: String, tipo_animal: [String], peso_kg: Number, sabores: [String], etiquetas: [String], industria: [String], stock: Number, activo: Boolean });
const ropaSchema = new mongoose.Schema({ producto_id: String, nombre: String, categoria: String, precio: Number, marca: String, tipo_animal: [String], tallas: [String], colores: [String], material: String, etiquetas: [String], industria: [String], stock: Number, activo: Boolean });
const juguetesSchema = new mongoose.Schema({ producto_id: String, nombre: String, categoria: String, precio: Number, marca: String, tipo_animal: [String], material: String, edad_minima_meses: Number, interactivo: Boolean, variantes: [String], etiquetas: [String], industria: [String], stock: Number, activo: Boolean });
const accesoriosSchema = new mongoose.Schema({ producto_id: String, nombre: String, categoria: String, precio: Number, marca: String, tipo_animal: [String], material: String, colores: [String], variantes: [String], etiquetas: [String], industria: [String], stock: Number, activo: Boolean });
const saludSchema = new mongoose.Schema({ producto_id: String, nombre: String, categoria: String, precio: Number, marca: String, tipo_animal: [String], tipo_producto: String, requiere_receta: Boolean, presentacion: [String], etiquetas: [String], industria: [String], stock: Number, activo: Boolean });

const Comida = mongoose.model('Comida', comidaSchema, 'productos_comida');
const Ropa = mongoose.model('Ropa', ropaSchema, 'productos_ropa');
const Juguetes = mongoose.model('Juguetes', juguetesSchema, 'productos_juguetes');
const Accesorios = mongoose.model('Accesorios', accesoriosSchema, 'productos_accesorios');
const Salud = mongoose.model('Salud', saludSchema, 'productos_salud');

const comida_precio_alto = await Comida.find({
  $and: [{ precio: { $gt: 100 } }, { stock: { $gt: 50 } }]
}).select('nombre precio stock marca');

const ropa_invierno_economica = await Ropa.find({
  $and: [{ etiquetas: { $in: ['invierno'] } }, { precio: { $lt: 250 } }]
}).select('nombre precio tallas colores');

const juguetes_interactivos_o_baratos = await Juguetes.find({
  $or: [{ interactivo: true }, { precio: { $lt: 100 } }]
}).select('nombre precio interactivo variantes');

const accesorios_seguridad_viaje = await Accesorios.find({
  etiquetas: { $in: ['seguridad', 'viaje', 'transporte'] }
}).select('nombre precio etiquetas');

const salud_sin_receta_economica = await Salud.find({
  $and: [{ requiere_receta: false }, { precio: { $gte: 80, $lte: 200 } }]
}).select('nombre precio tipo_producto presentacion');

const productos_por_industria = await Comida.find({
  industria: { $all: ['mascotas', 'nutricion'] }
}).select('nombre industria precio');

const todos_perros = await Promise.all([
  Comida.find({ tipo_animal: { $in: ['perro'] } }),
  Ropa.find({ tipo_animal: { $in: ['perro'] } }),
  Juguetes.find({ tipo_animal: { $in: ['perro'] } }),
  Accesorios.find({ tipo_animal: { $in: ['perro'] } }),
  Salud.find({ tipo_animal: { $in: ['perro'] } }),
]);

const productos_premium = await Promise.all([
  Comida.find({ etiquetas: { $in: ['premium'] } }),
  Ropa.find({ etiquetas: { $in: ['premium'] } }),
  Juguetes.find({ etiquetas: { $in: ['premium'] } }),
]);

console.log('=== Comida precio > 100 y stock > 50 ($and $gt) ===');
console.log(comida_precio_alto);

console.log('=== Ropa invierno precio < 250 ($and $in $lt) ===');
console.log(ropa_invierno_economica);

console.log('=== Juguetes interactivos O precio < 100 ($or) ===');
console.log(juguetes_interactivos_o_baratos);

console.log('=== Accesorios seguridad/viaje ($in arreglo) ===');
console.log(accesorios_seguridad_viaje);

console.log('=== Salud sin receta entre $80-$200 ($and $gte $lte) ===');
console.log(salud_sin_receta_economica);

console.log('=== Comida industria mascotas+nutricion ($all) ===');
console.log(productos_por_industria);

console.log('=== Todos los productos para perros ($in tipo_animal) ===');
console.log(todos_perros.flat().map(p => p.nombre));

console.log('=== Productos premium todas categorias ===');
console.log(productos_premium.flat().map(p => p.nombre));

await mongoose.disconnect();