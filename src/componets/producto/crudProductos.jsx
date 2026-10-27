import { useState, useEffect } from "react";
import api from "../../services/api";
import "./crudProductos.css";

const CrudProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
  });

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put(`/productos/${form.id}`, form);
      } else {
        await api.post("/productos", form);
      }
      setForm({ id: null, nombre: "", descripcion: "", precio: "", stock: "" });
      obtenerProductos();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  };

  const handleEdit = (producto) => {
    setForm(producto);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setForm({ id: null, nombre: "", descripcion: "", precio: "", stock: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        await api.delete(`/productos/${id}`);
        obtenerProductos();
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  return (
    <div className="crud-container">
      <div className="container-fluid px-4 py-5">
        <div className="row gap-4">
          {/* Formulario */}
          <div className="col-lg-4">
            <div className="form-card">
              <div className="form-header">
                <h3 className="form-title">
                  {form.id ? "✏️ Actualizar Producto" : "➕ Nuevo Producto"}
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="form-content">
                <div className="form-group">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    className="form-input"
                    placeholder="Ej: Laptop Dell"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="descripcion" className="form-label">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    className="form-input form-textarea"
                    placeholder="Ej: Laptop de 15 pulgadas..."
                    rows="3"
                    value={form.descripcion}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="precio" className="form-label">Precio (S/)</label>
                    <input
                      id="precio"
                      type="number"
                      step="0.01"
                      name="precio"
                      className="form-input"
                      placeholder="0.00"
                      value={form.precio}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="stock" className="form-label">Stock</label>
                    <input
                      id="stock"
                      type="number"
                      name="stock"
                      className="form-input"
                      placeholder="0"
                      value={form.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {form.id ? "Actualizar Producto" : "Guardar Producto"}
                  </button>
                  {form.id && (
                    <button type="button" onClick={handleCancel} className="btn-secondary">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Tabla de Productos */}
          <div className="col-lg-8">
            <div className="table-card">
              <div className="table-header">
                <h3 className="table-title">📋 Inventario de Productos</h3>
                <span className="product-count">{productos.length} productos</span>
              </div>

              {loading ? (
                <div className="loading-state">
                  <p>Cargando productos...</p>
                </div>
              ) : productos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p className="empty-title">No hay productos registrados</p>
                  <p className="empty-text">Comienza agregando un nuevo producto en el formulario</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((prod) => (
                        <tr key={prod.id}>
                          <td className="cell-id">#{prod.id}</td>
                          <td className="cell-name">{prod.nombre}</td>
                          <td className="cell-price">S/ {parseFloat(prod.precio).toFixed(2)}</td>
                          <td className="cell-stock">
                            <span className={`stock-badge ${prod.stock > 10 ? 'high' : prod.stock > 0 ? 'medium' : 'low'}`}>
                              {prod.stock}
                            </span>
                          </td>
                          <td className="cell-actions">
                            <button
                              className="action-btn edit-btn"
                              onClick={() => handleEdit(prod)}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDelete(prod.id)}
                              title="Eliminar"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudProductos;