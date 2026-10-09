'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Download, Upload, FileText, Search, Filter } from 'lucide-react';
import { Icon } from '@iconify/react';

export default function AdminVehiclesCRM() {
  const [vehicles, setVehicles] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // CRM Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');

  // Form State
  const [formData, setFormData] = useState({
    marca: '', modelo: '', ano: '', precio: '', kilometraje: '',
    transmision: 'Automática', combustible: 'Gasolina', estado: 'DISPONIBLE',
    descripcion: '', motor: '', color: '', destacado: false
  });
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVehicles = async () => {
    const res = await fetch('/api/vehicles');
    const data = await res.json();
    setVehicles(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Filtered Data
  const filteredVehicles = vehicles.filter(v => {
    const searchMatch = (v.marca + ' ' + v.modelo).toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus === 'TODOS' || v.estado === filterStatus;
    return searchMatch && statusMatch;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`/api/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: newStatus })
      });
      fetchVehicles();
    } catch (e) {
      console.error(e);
      alert('Error cambiando estado');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Seguro que deseas eliminar este vehículo del inventario?')) {
      await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      fetchVehicles();
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const setFileAsCover = (index) => {
    const newFiles = [...files];
    const [selectedFile] = newFiles.splice(index, 1);
    newFiles.unshift(selectedFile);
    setFiles(newFiles);

    const newUrls = [...previewUrls];
    const [selectedUrl] = newUrls.splice(index, 1);
    newUrls.unshift(selectedUrl);
    setPreviewUrls(newUrls);
  };

  const setExistingAsCover = (index) => {
    const newImages = [...existingImages];
    const [selectedImg] = newImages.splice(index, 1);
    newImages.unshift(selectedImg);
    setExistingImages(newImages);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    const newUrls = [...previewUrls];
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
  };

  const removeExisting = (index) => {
    const newImages = [...existingImages];
    newImages.splice(index, 1);
    setExistingImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let imageUrls = [];
    if (files.length > 0) {
      const uploadData = new FormData();
      for (const file of files) {
        uploadData.append('file', file);
      }
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
      const uploadJson = await uploadRes.json();
      if (uploadJson.urls) imageUrls = uploadJson.urls;
    }

    const vehicleData = { ...formData };
    const finalImages = [...existingImages, ...imageUrls];
    vehicleData.imagenes = JSON.stringify(finalImages);

    const url = editingId ? `/api/vehicles/${editingId}` : '/api/vehicles';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleData)
    });

    if (res.ok) {
      resetForm();
      fetchVehicles();
    } else {
      alert('Error guardando el vehículo');
    }
    setIsSubmitting(false);
  };

  const handleEdit = (v) => {
    setFormData({
      marca: v.marca || '', modelo: v.modelo || '', ano: v.ano || '', 
      precio: v.precio || '', kilometraje: v.kilometraje || '',
      transmision: v.transmision || 'Automática', combustible: v.combustible || 'Gasolina', 
      estado: v.estado || 'DISPONIBLE', descripcion: v.descripcion || '', 
      motor: v.motor || '', color: v.color || '', destacado: v.destacado || false
    });
    
    let imgs = [];
    if (v.imagenes) {
      try { imgs = JSON.parse(v.imagenes); } catch(e) { imgs = [v.imagenes]; }
    }
    setExistingImages(imgs);
    setFiles([]);
    setPreviewUrls([]);
    setEditingId(v.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      marca: '', modelo: '', ano: '', precio: '', kilometraje: '',
      transmision: 'Automática', combustible: 'Gasolina', estado: 'DISPONIBLE',
      descripcion: '', motor: '', color: '', destacado: false
    });
    setFiles([]);
    setPreviewUrls([]);
    setExistingImages([]);
  };

  const handleExportReport = async () => {
    const XLSX = await import('xlsx');
    const dataToExport = filteredVehicles.map(v => {
      const createdAtDate = new Date(v.createdAt);
      const diffDays = Math.ceil(Math.abs(new Date() - createdAtDate) / (1000 * 60 * 60 * 24));
      return {
        ID: v.id,
        Marca: v.marca,
        Modelo: v.modelo,
        Año: v.ano,
        Precio: v.precio,
        Kilometraje: v.kilometraje,
        Transmisión: v.transmision,
        Combustible: v.combustible,
        Estado: v.estado,
        "Fecha Ingreso": createdAtDate.toLocaleDateString('es-CL'),
        "Días en Inventario": diffDays,
        Destacado: v.destacado ? 'Sí' : 'No'
      };
    });
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventario_Automotora");
    XLSX.writeFile(wb, `Reporte_Inventario_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleDownloadTemplate = async () => {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet([{
      Marca: "Toyota", Modelo: "Yaris", Ano: 2022, Precio: 12500000, 
      Kilometraje: 35000, Transmision: "Manual", Combustible: "Gasolina",
      Motor: "1.5", Color: "Blanco", Estado: "DISPONIBLE", Destacado: "NO", Descripcion: ""
    }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vehiculos");
    XLSX.writeFile(wb, "Plantilla_Carga_Masiva.xlsx");
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
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet);

        const formattedData = json.map(row => ({
          marca: row.Marca, modelo: row.Modelo, ano: parseInt(row.Ano),
          precio: parseFloat(row.Precio), kilometraje: parseInt(row.Kilometraje),
          transmision: row.Transmision, combustible: row.Combustible,
          motor: row.Motor ? String(row.Motor) : null, color: row.Color || null,
          estado: row.Estado || 'DISPONIBLE', descripcion: row.Descripcion || '',
          destacado: String(row.Destacado).toUpperCase() === 'SI' || String(row.Destacado).toUpperCase() === 'SÍ'
        })).filter(row => row.marca && row.modelo);

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
  };

  if (isAdding) {
    return (
      <div className="crm-form-container fade-in">
        <div className="crm-form-header">
          <h2>{editingId ? 'Editar Vehículo' : 'Añadir Nuevo Vehículo'}</h2>
          <button type="button" className="btn btn-outline" onClick={resetForm}>Volver al Inventario</button>
        </div>

        <form onSubmit={handleSubmit} className="crm-form-grid">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="crm-form-col">
            <div className="crm-card">
              <h3><Icon icon="solar:info-circle-bold-duotone" width="20" /> Información Principal</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Marca</label>
                  <input required type="text" name="marca" value={formData.marca} onChange={handleChange} placeholder="Ej. Toyota" />
                </div>
                <div className="form-group">
                  <label>Modelo</label>
                  <input required type="text" name="modelo" value={formData.modelo} onChange={handleChange} placeholder="Ej. Corolla" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Año</label>
                  <input required type="number" name="ano" value={formData.ano} onChange={handleChange} placeholder="Ej. 2023" />
                </div>
                <div className="form-group">
                  <label>Precio ($)</label>
                  <input required type="number" name="precio" value={formData.precio} onChange={handleChange} placeholder="Ej. 15000000" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Estado</label>
                  <select name="estado" value={formData.estado} onChange={handleChange}>
                    <option value="DISPONIBLE">DISPONIBLE</option>
                    <option value="RESERVADO">RESERVADO</option>
                    <option value="VENDIDO">VENDIDO</option>
                  </select>
                </div>
                <div className="form-group checkbox-group">
                  <label>Destacar en Inicio</label>
                  <div className="toggle-switch">
                    <input type="checkbox" name="destacado" id="destacado" checked={formData.destacado} onChange={handleChange} />
                    <label htmlFor="destacado"></label>
                  </div>
                </div>
              </div>
            </div>

            <div className="crm-card">
              <h3><Icon icon="solar:settings-bold-duotone" width="20" /> Especificaciones Técnicas</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Kilometraje</label>
                  <input required type="number" name="kilometraje" value={formData.kilometraje} onChange={handleChange} placeholder="Ej. 25000" />
                </div>
                <div className="form-group">
                  <label>Transmisión</label>
                  <select name="transmision" value={formData.transmision} onChange={handleChange}>
                    <option value="Automática">Automática</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Combustible</label>
                  <select name="combustible" value={formData.combustible} onChange={handleChange}>
                    <option value="Gasolina">Gasolina</option>
                    <option value="Diésel">Diésel</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Eléctrico">Eléctrico</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Motor (Opcional)</label>
                  <input type="text" name="motor" value={formData.motor} onChange={handleChange} placeholder="Ej. 1.6 Turbo" />
                </div>
              </div>
              <div className="form-group">
                <label>Color (Opcional)</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="Ej. Blanco Perla" />
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="crm-form-col">
            <div className="crm-card">
              <h3><Icon icon="solar:gallery-bold-duotone" width="20" /> Imágenes y Multimedia</h3>
              <div className="form-group">
                <label className="upload-dropzone">
                  <Icon icon="solar:cloud-upload-bold-duotone" width="40" style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }} />
                  <span style={{ fontWeight: '600' }}>Haz clic para subir imágenes</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Formatos: JPG, PNG, WEBP</span>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
              </div>

              {(previewUrls.length > 0 || existingImages.length > 0) && (
                <div className="image-preview-grid">
                  {existingImages.map((url, i) => (
                    <div key={`ext-${i}`} className={`img-preview ${i === 0 ? 'cover' : ''}`}>
                      {i === 0 && <span className="cover-badge">PORTADA</span>}
                      <img src={url} alt="Preview" />
                      <div className="img-actions">
                        <button type="button" onClick={() => setExistingAsCover(i)} title="Hacer Portada"><Icon icon="solar:star-bold" /></button>
                        <button type="button" onClick={() => removeExisting(i)} title="Eliminar"><Icon icon="solar:trash-bin-trash-bold" /></button>
                      </div>
                    </div>
                  ))}
                  {previewUrls.map((url, i) => (
                    <div key={`new-${i}`} className={`img-preview ${i === 0 && existingImages.length === 0 ? 'cover' : ''}`}>
                      {i === 0 && existingImages.length === 0 && <span className="cover-badge">PORTADA</span>}
                      <img src={url} alt="New Preview" />
                      <div className="img-actions">
                        <button type="button" onClick={() => setFileAsCover(i)} title="Hacer Portada"><Icon icon="solar:star-bold" /></button>
                        <button type="button" onClick={() => removeFile(i)} title="Eliminar"><Icon icon="solar:trash-bin-trash-bold" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="crm-card">
              <h3><Icon icon="solar:document-text-bold-duotone" width="20" /> Detalles Adicionales</h3>
              <div className="form-group">
                <label>Descripción Pública</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="5" placeholder="Agrega notas o detalles atractivos del vehículo para el cliente..."></textarea>
              </div>
            </div>

            <div className="crm-form-actions">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? <Icon icon="solar:spinner-bold-duotone" className="spin" width="24" /> : <Icon icon="solar:diskette-bold-duotone" width="24" />}
                {isSubmitting ? 'Guardando...' : 'Guardar Vehículo'}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="crm-header">
        <div>
          <h2>Inventario CRM</h2>
          <p className="subtitle">Gestión centralizada de vehículos y reportes</p>
        </div>
        <div className="crm-header-actions">
          <div className="dropdown-group">
            <button className="btn btn-outline"><Icon icon="solar:import-bold-duotone" width="20" /> Carga Masiva (Excel)</button>
            <div className="dropdown-menu">
              <button onClick={handleDownloadTemplate}><Download size={16} /> Descargar Plantilla</button>
              <label>
                <Upload size={16} /> Subir Archivo Excel
                <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
          <button className="btn btn-outline" onClick={handleExportReport}>
            <FileText size={20} /> Exportar Reporte
          </button>
          <button className="btn btn-primary" onClick={() => { resetForm(); setIsAdding(true); }}>
            <Plus size={20} /> Añadir Vehículo
          </button>
        </div>
      </div>

      <div className="crm-filters card glass">
        <div className="filter-group">
          <Search size={20} className="filter-icon" />
          <input 
            type="text" 
            placeholder="Buscar por marca o modelo..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="filter-group">
          <Filter size={20} className="filter-icon" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="TODOS">Todos los Estados</option>
            <option value="DISPONIBLE">Solo Disponibles</option>
            <option value="RESERVADO">Solo Reservados</option>
            <option value="VENDIDO">Solo Vendidos</option>
          </select>
        </div>
      </div>

      <div className="vehicles-grid">
        {filteredVehicles.map(v => {
          const createdAtDate = new Date(v.createdAt);
          const now = new Date();
          const diffTime = Math.abs(now - createdAtDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          let imgs = [];
          if (v.imagenes) {
            try { imgs = JSON.parse(v.imagenes); } catch(e) { imgs = [v.imagenes]; }
          }
          const coverImg = imgs.length > 0 ? imgs[0] : null;

          return (
            <div key={v.id} className="admin-vehicle-card">
              <div className="card-img-container">
                {coverImg ? <img src={coverImg} alt={v.modelo} /> : <div className="no-img"><Icon icon="solar:camera-broken-bold-duotone" width="32" /></div>}
                <div className="card-badges">
                  {v.destacado && <span className="badge-star"><Icon icon="solar:star-bold" width="14" /> Destacado</span>}
                </div>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3><strong>{v.marca}</strong> {v.modelo}</h3>
                  <div className="card-price">${v.precio.toLocaleString('es-CL')}</div>
                </div>
                
                <div className="card-meta">
                  <span title="Fecha de carga"><Icon icon="solar:calendar-add-bold-duotone" width="16" /> {createdAtDate.toLocaleDateString('es-CL')}</span>
                  <span title="Tiempo publicado" style={{ color: diffDays > 60 ? 'var(--color-danger)' : diffDays > 30 ? '#f59e0b' : 'inherit' }}><Icon icon="solar:clock-circle-bold-duotone" width="16" /> {diffDays} días</span>
                </div>

                <div className="card-status-actions">
                  <select 
                    value={v.estado} 
                    onChange={(e) => handleStatusChange(v.id, e.target.value)}
                    className={`status-select ${v.estado.toLowerCase()}`}
                  >
                    <option value="DISPONIBLE">DISPONIBLE</option>
                    <option value="RESERVADO">RESERVADO</option>
                    <option value="VENDIDO">VENDIDO</option>
                  </select>
                </div>

                <div className="card-footer">
                  <button onClick={() => handleEdit(v)} className="btn-icon edit" title="Editar"><Icon icon="solar:pen-bold-duotone" width="20" /> Editar</button>
                  <button onClick={() => handleDelete(v.id)} className="btn-icon delete" title="Eliminar"><Icon icon="solar:trash-bin-trash-bold-duotone" width="20" /> Eliminar</button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredVehicles.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '3rem', width: '100%', gridColumn: '1 / -1' }}>
            <Icon icon="solar:box-bold-duotone" width="48" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No se encontraron vehículos que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        /* CRM Header & Filters */
        .crm-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .crm-header h2 { margin: 0; font-size: 2rem; }
        .subtitle { color: var(--color-text-secondary); margin-top: 0.2rem; }
        .crm-header-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        
        .crm-filters {
          display: flex;
          gap: 1.5rem;
          padding: 1.2rem 1.5rem;
          margin-bottom: 2rem;
          border-radius: 16px;
        }
        .filter-group {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: var(--color-bg);
          padding: 0.8rem 1.2rem;
          border-radius: 12px;
          border: 1px solid var(--color-border);
        }
        .filter-icon { color: var(--color-text-secondary); }
        .filter-group input, .filter-group select {
          border: none;
          background: transparent;
          flex: 1;
          color: var(--color-text-primary);
          font-size: 0.95rem;
          outline: none;
        }

        /* CRM Form Layout */
        .crm-form-container { margin-top: 1rem; }
        .crm-form-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
        }
        .crm-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
        }
        @media(max-width: 900px) {
          .crm-form-grid { grid-template-columns: 1fr; }
        }
        .crm-col { display: flex; flex-direction: column; gap: 2rem; }
        .crm-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          margin-bottom: 2rem;
        }
        .crm-card h3 {
          display: flex; align-items: center; gap: 0.5rem;
          margin-top: 0; margin-bottom: 1.5rem;
          font-size: 1.2rem; color: var(--color-accent);
          padding-bottom: 0.8rem; border-bottom: 1px solid var(--color-border);
        }
        
        /* Form Inputs */
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
        .form-group { margin-bottom: 1.5rem; }
        .form-row .form-group { margin-bottom: 0; }
        .form-group label {
          display: block; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.05em; color: var(--color-text-secondary); margin-bottom: 0.5rem;
        }
        .form-group input:not([type="checkbox"]), .form-group select, .form-group textarea {
          width: 100%; padding: 0.9rem 1.2rem;
          background: var(--color-bg); border: 1px solid var(--color-border);
          border-radius: 12px; color: var(--color-text-primary);
          font-family: inherit; font-size: 1rem; transition: all 0.3s;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none; border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(15, 113, 67, 0.1);
        }
        
        /* Toggle Switch */
        .checkbox-group { display: flex; flex-direction: column; justify-content: space-between; }
        .toggle-switch { position: relative; width: 60px; height: 32px; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-switch label {
          position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--color-border); border-radius: 34px; transition: .4s;
        }
        .toggle-switch label:before {
          position: absolute; content: ""; height: 24px; width: 24px;
          left: 4px; bottom: 4px; background-color: white; border-radius: 50%; transition: .4s;
        }
        .toggle-switch input:checked + label { background-color: var(--color-accent); }
        .toggle-switch input:checked + label:before { transform: translateX(28px); }

        /* Upload Zone */
        .upload-dropzone {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 2.5rem 1.5rem; background: rgba(15, 113, 67, 0.03);
          border: 2px dashed var(--color-accent); border-radius: 16px;
          cursor: pointer; transition: all 0.2s; text-align: center;
        }
        .upload-dropzone:hover { background: rgba(15, 113, 67, 0.08); }
        
        /* Image Previews */
        .image-preview-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem; margin-top: 1.5rem;
        }
        .img-preview {
          position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden;
          border: 2px solid var(--color-border);
        }
        .img-preview.cover { border-color: var(--color-accent); border-width: 3px; }
        .img-preview img { width: 100%; height: 100%; object-fit: cover; }
        .cover-badge {
          position: absolute; bottom: 0; left: 0; right: 0; background: var(--color-accent);
          color: white; font-size: 0.65rem; font-weight: 800; text-align: center; padding: 0.2rem;
        }
        .img-actions {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          opacity: 0; transition: opacity 0.2s;
        }
        .img-preview:hover .img-actions { opacity: 1; }
        .img-actions button {
          background: white; border: none; width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; cursor: pointer; color: #333;
        }
        .img-actions button:hover { transform: scale(1.1); }
        .img-actions button[title="Eliminar"] { color: var(--color-danger); }

        .crm-form-actions { display: flex; justify-content: flex-end; margin-top: 1rem; }
        .crm-form-actions .btn { width: 100%; padding: 1.2rem; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }

        /* Dropdown */
        .dropdown-group { position: relative; display: inline-block; }
        .dropdown-menu {
          display: none; position: absolute; top: 100%; left: 0; background: var(--color-bg-card);
          min-width: 200px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border-radius: 12px;
          border: 1px solid var(--color-border); z-index: 10; overflow: hidden; margin-top: 0.5rem;
        }
        .dropdown-group:hover .dropdown-menu { display: block; }
        .dropdown-menu button, .dropdown-menu label {
          display: flex; align-items: center; gap: 0.5rem; width: 100%; padding: 1rem;
          border: none; background: transparent; color: var(--color-text-primary);
          text-align: left; cursor: pointer; font-size: 0.9rem; font-weight: 500;
        }
        .dropdown-menu button:hover, .dropdown-menu label:hover { background: var(--color-bg); color: var(--color-accent); }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* Existing Grid styles included inline */
        .vehicles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        .admin-vehicle-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }
        .admin-vehicle-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }
        .card-img-container {
          height: 180px;
          position: relative;
          background: var(--color-border);
        }
        .card-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .no-img {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
        }
        .card-badges {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
        }
        .badge-star {
          background: #f59e0b;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
        }
        .card-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          flex: 1;
        }
        .card-header h3 {
          font-size: 1.1rem;
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }
        .card-price {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-accent);
        }
        .card-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          background: var(--color-bg);
          padding: 0.75rem;
          border-radius: 8px;
        }
        .card-meta span {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 600;
        }
        .status-select {
          width: 100%;
          padding: 0.6rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          border: 1px solid transparent;
          outline: none;
          appearance: none;
          text-align: center;
          transition: all 0.2s;
        }
        .status-select.disponible {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-color: rgba(16, 185, 129, 0.2);
        }
        .status-select.reservado {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border-color: rgba(245, 158, 11, 0.2);
        }
        .status-select.vendido {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.2);
        }
        .card-footer {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
          border-top: 1px solid var(--color-border);
          padding-top: 1.2rem;
        }
        .btn-icon {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.6rem;
          border-radius: 8px;
          border: 1px solid var(--color-border);
          background: transparent;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-icon.edit {
          color: var(--color-primary);
        }
        .btn-icon.edit:hover {
          background: rgba(59, 130, 246, 0.05);
          border-color: var(--color-primary);
        }
        .btn-icon.delete {
          color: var(--color-danger);
        }
        .btn-icon.delete:hover {
          background: rgba(239, 68, 68, 0.05);
          border-color: var(--color-danger);
        }
      `}</style>
    </div>
  );
}
