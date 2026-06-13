import { Carrito, Preferencias } from '../config/schema.js';

export const obtenerCarrito = async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ cliente_uuid: req.usuario.cliente_id });
    res.json(carrito ?? { items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
};

export const actualizarCarrito = async (req, res) => {
  try {
    const carrito = await Carrito.findOneAndUpdate(
      { cliente_uuid: req.usuario.cliente_id },
      { items: req.body.items, actualizado_en: new Date() },
      { new: true, upsert: true }
    );
    res.json(carrito);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar carrito' });
  }
};

export const actualizarPreferencias = async (req, res) => {
  try {
    const prefs = await Preferencias.findOneAndUpdate(
      { cliente_uuid: req.usuario.cliente_id },
      { ...req.body, actualizado_en: new Date() },
      { new: true, upsert: true }
    );
    res.json(prefs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar preferencias' });
  }
};