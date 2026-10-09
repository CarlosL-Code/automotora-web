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

      
    </div>
  );
}
