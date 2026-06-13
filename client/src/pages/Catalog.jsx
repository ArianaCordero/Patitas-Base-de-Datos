import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catalogoService } from '../services/catalogo.js';
import ProductCard from '../components/ProductCard';
import { IconSearch } from '../components/Icons';

const CATEGORIAS = [
  { id: 'comida',     nombre: 'Comida' },
  { id: 'ropa',       nombre: 'Ropa' },
  { id: 'juguetes',   nombre: 'Juguetes' },
  { id: 'accesorios', nombre: 'Accesorios' },
  { id: 'salud',      nombre: 'Salud' },
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  const activeCategory = searchParams.get('categoria') || '';
  const activeEtiqueta = searchParams.get('etiqueta') || '';

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPrecioMin('');
    setPrecioMax('');
  };

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (activeCategory) params.categoria = activeCategory;
        if (activeEtiqueta) params.etiqueta = activeEtiqueta;
        if (precioMin) params.precio_min = precioMin;
        if (precioMax) params.precio_max = precioMax;

        const data = await catalogoService.listar(params);
        setProductos(data.productos ?? []);
        setTotal(data.total ?? (data.productos?.length ?? 0));
      } catch (err) {
        setError('Error al cargar productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [activeCategory, activeEtiqueta, precioMin, precioMax]);

  const hasAnyFilter = activeCategory || activeEtiqueta || precioMin || precioMax;

  const imagenesProducto = {
  'COM-001': 'https://ss345.liverpool.com.mx/xl/1056366039.jpg',
  'COM-002': 'https://cdn.eddress.co/market-products/merchants/7wg0D5ChQU-pXxzCDmVhkA/69a5fb126850433c84d3e88d--5vTg5doR3S2DpsB9SuQxQ-Ev8ikHshQ9mvlqNMZ7pE9g.png?v=1772485443439',
  'COM-003': 'https://patitasco.com/6588-large_default/milo-y-lola-snacks-dentales-para-perro.jpg',
  'COM-004': 'https://www.purina.com.bo/sites/default/files/styles/webp/public/2022-09/LONGEVIDAD%20ADULTOS%207%2B-dog-chow-frente.jpeg.webp?itok=GOjFfF68',
  'ROP-001': 'https://m.media-amazon.com/images/I/7176ZRdpSYL._AC_SX679_.jpg',
  'ROP-002': 'https://m.media-amazon.com/images/I/71q5QmqdYML._AC_SX679_.jpg',
  'ROP-003': 'https://acdn-us.mitiendanube.com/stores/575/267/products/chatgpt-image-23-may-2025-14_02_47-bfd0033504eeaded5617480201346783-1024-1024.webp',
  'ROP-004': 'https://m.media-amazon.com/images/I/81W7vxMC2iL.jpg',
  'JUG-001': 'https://de2kqc9pq55cj.cloudfront.net/fit-in/700x700/filters:fill(FFFFFF):quality(90):format(webp)/_img_productos/pelota-interactiva-loi-g-073-gris-16551-foto1.jpg',
  'JUG-002': 'https://m.media-amazon.com/images/I/81We9qHdqPL._AC_SX679_.jpg',
  'JUG-003': 'https://cdn0.expertoanimal.com/es/posts/5/5/2/como_funciona_el_kong_para_perros_20255_600.jpg',
  'JUG-004': 'https://www.tiendanimal.es/dw/image/v2/BDLQ_PRD/on/demandware.static/-/Sites-kiwoko-master-catalog/default/dwdba6169e/images/large/43e3e4f5d4de4811ba942634bbecde4f.jpg?sw=780&sh=780&sm=fit&q=85',
  'ACC-001': 'https://ae01.alicdn.com/kf/Sa919a941119b41fda1b6b9eb00c85d84H.jpg',
  'ACC-002': 'https://cdn.billowshop.com/0bd0313a-ccf0-5fc3/img/Producto/d7a86b57-46ca-ba90-d788-9980aef5e5f1/8445-2-66c71e3adc675-O.jpg',
  'ACC-003': 'https://petformed.com/es/wp-content/uploads/sites/7/2024/04/Legowisko-Petformed-Niebieskie-2.jpg',
  'ACC-004': 'https://pethome.cl/imagenes/productos/mochila-transporte-astronauta-color-rojo.webp',
  'SAL-001': 'https://postgradoveterinaria.com/wp-content/uploads/pipetas-para-perros.jpg',
  'SAL-002': 'https://www.tiendanimal.es/dw/image/v2/BDLQ_PRD/on/demandware.static/-/Sites-kiwoko-master-catalog/default/dwfc4bcb3c/images/large/0fe8bdfcac6e4ffb8b6810cfbf9da441.jpg?sw=780&sh=780&sm=fit&q=85',
  'SAL-003': 'https://m.media-amazon.com/images/I/81C89UmtLoL._AC_UF1000,1000_QL80_.jpg',
  'SAL-004': 'https://m.media-amazon.com/images/I/61iUWfX+HyL.jpg',
};

const productosNormalizados = productos.map(p => ({
  id: p.producto_id || p._id,
  producto_id: p.producto_id,
  name: p.nombre,
  price: p.precio,
  brand: p.marca,
  category: p.categoria,
  image: imagenesProducto[p.producto_id] || `https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop`,
  description: p.descripcion || p.nombre,
}));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-neon-purple brutal-border brutal-shadow-sm rounded-xl flex items-center justify-center animate-wiggle">
          <IconSearch className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-text" style={{ fontFamily: 'var(--font-family-display)' }}>Catalogo</h1>
          <p className="text-text-muted text-sm">Comida, Ropa, Juguetes, Accesorios y Salud para tu mascota</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <div className="bg-accent brutal-border brutal-shadow-lg rounded-2xl p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-text text-lg" style={{ fontFamily: 'var(--font-family-display)' }}>Filtros</h3>
              {hasAnyFilter && (
                <button onClick={clearFilters} className="sticker bg-neon-pink text-white cursor-pointer hover-lift transition-all">
                  Limpiar
                </button>
              )}
            </div>

            <h4 className="text-sm font-bold text-text mb-2 uppercase tracking-wider">Categoria</h4>
            <div className="space-y-1 mb-5">
              <button
                onClick={() => setFilter('categoria', '')}
                className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all brutal-border brutal-shadow-sm hover-lift cursor-pointer ${!activeCategory ? 'bg-primary text-white' : 'bg-white text-text-muted'}`}
              >
                Todas
              </button>
              {CATEGORIAS.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilter('categoria', cat.id)}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all brutal-border brutal-shadow-sm hover-lift cursor-pointer ${activeCategory === cat.id ? 'bg-primary text-white' : 'bg-white text-text-muted'}`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>

            <h4 className="text-sm font-bold text-text mb-2 uppercase tracking-wider">Precio</h4>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase">Minimo</label>
                <input type="number" value={precioMin} onChange={e => setPrecioMin(e.target.value)}
                  className="w-full brutal-border rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary bg-white" placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase">Maximo</label>
                <input type="number" value={precioMax} onChange={e => setPrecioMax(e.target.value)}
                  className="w-full brutal-border rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary bg-white" placeholder="Sin limite" />
              </div>
            </div>

            <h4 className="text-sm font-bold text-text mb-2 uppercase tracking-wider">Etiqueta</h4>
            <div className="space-y-1">
              {['premium', 'natural', 'invierno', 'interactivo', 'dental', 'seguridad', 'ortopedica', 'medicado'].map(tag => (
                <button key={tag} onClick={() => setFilter('etiqueta', activeEtiqueta === tag ? '' : tag)}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all brutal-border brutal-shadow-sm hover-lift cursor-pointer ${activeEtiqueta === tag ? 'bg-primary text-white' : 'bg-white text-text-muted'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <span className="sticker bg-primary text-white">{total} productos</span>
            {hasAnyFilter && (
              <button onClick={clearFilters} className="sticker bg-neon-pink text-white cursor-pointer hover-lift transition-all">
                Quitar filtros
              </button>
            )}
          </div>

          {loading && (
            <div className="text-center py-20">
              <p className="text-text font-black text-xl animate-pulse">Cargando productos...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          {!loading && !error && productosNormalizados.length === 0 && (
            <div className="text-center py-20 bg-white brutal-border brutal-shadow-lg rounded-2xl">
              <p className="text-text font-black text-xl mb-2">No se encontraron productos</p>
              <button onClick={clearFilters} className="bg-primary text-white font-bold px-6 py-3 rounded-xl brutal-border brutal-shadow-sm hover-lift transition-all cursor-pointer">
                Limpiar filtros
              </button>
            </div>
          )}

          {!loading && productosNormalizados.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {productosNormalizados.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}