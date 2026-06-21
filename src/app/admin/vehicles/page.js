'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Download, Upload } from 'lucide-react';

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
    };
    // Only update imagenes if new files were uploaded
    if (imageUrls.length > 0) {
      vehicleData.imagenes = JSON.stringify(imageUrls);
    }

    const url = editingId ? `/api/vehicles/${editingId}` : '/api/vehicles';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleData)
    });

    if (res.ok) {
      setIsAdding(false);
      setEditingId(null);
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

  const handleEdit = (v) => {
    setFormData({
      marca: v.marca || '',
      modelo: v.modelo || '',
      ano: v.ano || '',
      precio: v.precio || '',
      kilometraje: v.kilometraje || '',
      transmision: v.transmision || 'Automática',
      combustible: v.combustible || 'Gasolina',
      estado: v.estado || 'DISPONIBLE',
      descripcion: v.descripcion || '',
      motor: v.motor || '',
      color: v.color || '',
    });
    setEditingId(v.id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Seguro que deseas eliminar este vehículo?')) {
      await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      fetchVehicles();
    }
  };

  const handleDownloadTemplate = async () => {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet([{
      Marca: 'Toyota', Modelo: 'Yaris', Ano: 2020, Precio: 8500000, Kilometraje: 45000, 
      Transmision: 'Manual', Combustible: 'Gasolina', Color: 'Blanco', Descripcion: 'Excelente estado', 
      Estado: 'DISPONIBLE', Destacado: 'NO'
    }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vehiculos");
    XLSX.writeFile(wb, "Plantilla_Vehiculos.xlsx");
  };

  const handleExcelUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const XLSX = await import('xlsx');
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        const formattedData = json.map(row => ({
          marca: row.Marca,
          modelo: row.Modelo,
          ano: row.Ano || row.Año,
          precio: row.Precio,
          kilometraje: row.Kilometraje,
          transmision: row.Transmision,
          combustible: row.Combustible,
          color: row.Color || '',
          descripcion: row.Descripcion || '',
          estado: row.Estado || 'DISPONIBLE',
          destacado: String(row.Destacado).toUpperCase() === 'SI' || String(row.Destacado).toUpperCase() === 'SÍ'
        })).filter(row => row.marca && row.modelo); // Filter empty rows

        if (formattedData.length === 0) {
          alert('No se encontraron datos válidos en el archivo Excel.');
          return;
        }

        const res = await fetch('/api/vehicles/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedData)
        });
        
        if (res.ok) {
          alert(`${formattedData.length} vehículos importados exitosamente.`);
          fetchVehicles();
        } else {
          alert('Error importando vehículos desde Excel.');
        }
      } catch (error) {
        alert('Error leyendo el archivo Excel: ' + error.message);
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
    e.target.value = ''; // Reset input
  };

  if (isAdding) {
    return (
      <div className="slide-up">
        <h2>{editingId ? 'Editar Vehículo' : 'Añadir Nuevo Vehículo'}</h2>
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
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select name="estado" value={formData.estado} onChange={handleChange} className="input">
                <option value="DISPONIBLE">DISPONIBLE</option>
                <option value="VENDIDO">VENDIDO</option>
              </select>
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
            <button type="button" className="btn btn-outline" onClick={() => {
              setIsAdding(false);
              setEditingId(null);
              setFormData({
                marca: '', modelo: '', ano: '', precio: '', kilometraje: '',
                transmision: 'Automática', combustible: 'Gasolina', estado: 'DISPONIBLE',
                descripcion: '', motor: '', color: ''
              });
            }}>Cancelar</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Inventario de Vehículos</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" onClick={handleDownloadTemplate}>
            <Download size={20} /> Plantilla Excel
          </button>
          <label className="btn btn-outline" style={{ cursor: 'pointer', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={20} /> Subir Excel
            <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} style={{ display: 'none' }} />
          </label>
          <button className="btn btn-primary" onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({
              marca: '', modelo: '', ano: '', precio: '', kilometraje: '',
              transmision: 'Automática', combustible: 'Gasolina', estado: 'DISPONIBLE',
              descripcion: '', motor: '', color: ''
            });
          }}>
            <Plus size={20} /> Añadir Manual
          </button>
        </div>
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
                  <button onClick={() => handleEdit(v)} style={{ color: 'var(--color-primary)', cursor: 'pointer', marginRight: '1rem', background: 'none', border: 'none' }}>
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDelete(v.id)} style={{ color: 'var(--color-danger)', cursor: 'pointer', background: 'none', border: 'none' }}>
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
