'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    marca: '', modelo: '', ano: '', precio: '', kilometraje: '',
    transmision: 'Automática', combustible: 'Gasolina', estado: 'DISPONIBLE',
    descripcion: '', motor: '', color: ''
  });
  const [files, setFiles] = useState([]);

  const fetchVehicles = async () => {
    const res = await fetch('/api/vehicles');
    const data = await res.json();
    setVehicles(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Upload Images
    let imageUrls = [];
    if (files.length > 0) {
      const uploadData = new FormData();
      for (const file of files) {
        uploadData.append('file', file);
      }
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const uploadJson = await uploadRes.json();
      if (uploadJson.urls) {
        imageUrls = uploadJson.urls;
      }
    }

    // 2. Save Vehicle
    const vehicleData = {
      ...formData,
      imagenes: JSON.stringify(imageUrls)
    };

    const res = await fetch('/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleData)
    });

    if (res.ok) {
      setIsAdding(false);
      fetchVehicles();
      setFormData({
        marca: '', modelo: '', ano: '', precio: '', kilometraje: '',
        transmision: 'Automática', combustible: 'Gasolina', estado: 'DISPONIBLE',
        descripcion: '', motor: '', color: ''
      });
      setFiles([]);
    } else {
      alert('Error guardando el vehículo');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Seguro que deseas eliminar este vehículo?')) {
      await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      fetchVehicles();
    }
  };

  if (isAdding) {
    return (
      <div className="slide-up">
        <h2>Añadir Nuevo Vehículo</h2>
        <form onSubmit={handleSubmit} className="card glass" style={{ padding: '2rem', marginTop: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Marca</label>
              <input required type="text" name="marca" value={formData.marca} onChange={handleChange} className="input" />
            </div>
            <div className="form-group">
              <label className="form-label">Modelo</label>
              <input required type="text" name="modelo" value={formData.modelo} onChange={handleChange} className="input" />
            </div>
            <div className="form-group">
              <label className="form-label">Año</label>
              <input required type="number" name="ano" value={formData.ano} onChange={handleChange} className="input" />
            </div>
            <div className="form-group">
              <label className="form-label">Precio ($)</label>
              <input required type="number" name="precio" value={formData.precio} onChange={handleChange} className="input" />
            </div>
            <div className="form-group">
              <label className="form-label">Kilometraje</label>
              <input required type="number" name="kilometraje" value={formData.kilometraje} onChange={handleChange} className="input" />
            </div>
            <div className="form-group">
              <label className="form-label">Transmisión</label>
              <select name="transmision" value={formData.transmision} onChange={handleChange} className="input">
                <option>Automática</option>
                <option>Manual</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Combustible</label>
              <select name="combustible" value={formData.combustible} onChange={handleChange} className="input">
                <option>Gasolina</option>
                <option>Diésel</option>
                <option>Híbrido</option>
                <option>Eléctrico</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Color</label>
              <input type="text" name="color" value={formData.color} onChange={handleChange} className="input" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Descripción</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="input" rows="4"></textarea>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Imágenes (Selecciona múltiples)</label>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="input" style={{ padding: '0.5rem' }} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Guardar Vehículo</button>
            <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancelar</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Inventario de Vehículos</h2>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
          <Plus size={20} /> Añadir Vehículo
        </button>
      </div>

      <div className="card glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Marca y Modelo</th>
              <th>Año</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.id}>
                <td><strong>{v.marca}</strong> {v.modelo}</td>
                <td>{v.ano}</td>
                <td>${v.precio.toLocaleString('es-CL')}</td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.875rem',
                    backgroundColor: v.estado === 'DISPONIBLE' ? 'var(--color-accent-light)' : 'rgba(255,255,255,0.1)',
                    color: v.estado === 'DISPONIBLE' ? 'var(--color-accent)' : 'inherit'
                  }}>
                    {v.estado}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleDelete(v.id)} style={{ color: 'var(--color-danger)', cursor: 'pointer' }}>
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                  No hay vehículos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
