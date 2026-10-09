'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Download, Upload, FileText, Search } from 'lucide-react';
import { Icon } from '@iconify/react';

export default function AdminStaffCRM() {
  const [staff, setStaff] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // CRM Filters
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    nombre: '', cargo: '', descripcion: '', telefono: '', email: '', esEjecutivo: false, imagenUrl: ''
  });
  const [departamento, setDepartamento] = useState('Administración');
  const [puesto, setPuesto] = useState('');
  
  const [file, setFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStaff = async () => {
    const res = await fetch('/api/staff');
    const data = await res.json();
    setStaff(data);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(s => 
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.cargo && s.cargo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id) => {
    if (confirm('¿Seguro que deseas eliminar a este miembro del personal?')) {
      await fetch(`/api/staff/${id}`, { method: 'DELETE' });
      fetchStaff();
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setExistingImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let imagenUrl = null;
    if (file) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
      const uploadJson = await uploadRes.json();
      if (uploadJson.urls && uploadJson.urls.length > 0) {
        imagenUrl = uploadJson.urls[0];
      }
    }

    const staffData = {
      ...formData,
      cargo: `${puesto} | [${departamento}]`
    };
    
    if (imagenUrl) {
      staffData.imagenUrl = imagenUrl;
    } else if (existingImage) {
      staffData.imagenUrl = existingImage;
    }

    const url = editingId ? `/api/staff/${editingId}` : '/api/staff';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffData)
    });

    if (res.ok) {
      resetForm();
      fetchStaff();
    } else {
      alert('Error guardando personal');
    }
    setIsSubmitting(false);
  };

  const handleEdit = (s) => {
    let dep = 'Administración';
    let p = s.cargo || '';
    if (p.includes(' | [')) {
      const parts = p.split(' | [');
      p = parts[0];
      dep = parts[1].replace(']', '');
    }
    
    setDepartamento(dep);
    setPuesto(p);
    setFormData({
      nombre: s.nombre || '', descripcion: s.descripcion || '', 
      telefono: s.telefono || '', email: s.email || '', 
      esEjecutivo: s.esEjecutivo || false, imagenUrl: s.imagenUrl || ''
    });
    setExistingImage(s.imagenUrl || null);
    setFile(null);
    setPreviewUrl(null);
    setEditingId(s.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ nombre: '', cargo: '', descripcion: '', telefono: '', email: '', esEjecutivo: false, imagenUrl: '' });
    setDepartamento('Administración');
    setPuesto('');
    setFile(null);
    setExistingImage(null);
    setPreviewUrl(null);
  };

  const handleExportReport = async () => {
    const XLSX = await import('xlsx');
    const dataToExport = filteredStaff.map(s => {
      let dep = 'Administración';
      let p = s.cargo || '';
      if (p.includes(' | [')) {
        const parts = p.split(' | [');
        p = parts[0];
        dep = parts[1].replace(']', '');
      }
      return {
        ID: s.id,
        Nombre: s.nombre,
        Puesto: p,
        Departamento: dep,
        Teléfono: s.telefono,
        Email: s.email,
        "Aparece en Contacto": s.esEjecutivo ? 'Sí' : 'No',
        "Fecha de Registro": new Date(s.createdAt).toLocaleDateString('es-CL')
      };
    });
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Personal");
    XLSX.writeFile(wb, `Reporte_Personal_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleDownloadTemplate = async () => {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet([{
      Nombre: "Juan Pérez", Puesto: "Gerente de Ventas", Departamento: "Ventas",
      Telefono: "+56 9 12345678", Email: "juan@automotora.cl",
      EsEjecutivo: "SI", Descripcion: "Experto en vehículos premium."
    }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Personal");
    XLSX.writeFile(wb, "Plantilla_Personal.xlsx");
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
          nombre: row.Nombre,
          cargo: `${row.Puesto || 'Asesor'} | [${row.Departamento || 'Ventas'}]`,
          telefono: row.Telefono ? String(row.Telefono) : null,
          email: row.Email || null,
          descripcion: row.Descripcion || '',
          esEjecutivo: String(row.EsEjecutivo).toUpperCase() === 'SI' || String(row.EsEjecutivo).toUpperCase() === 'SÍ',
          imagenUrl: ''
        })).filter(row => row.nombre);

        if (formattedData.length === 0) {
          alert('No se encontraron datos válidos.');
          return;
        }

        const res = await fetch('/api/staff/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedData)
        });

        if (res.ok) {
          alert(`${formattedData.length} perfiles importados exitosamente.`);
          fetchStaff();
        } else {
          alert('Error importando personal.');
        }
      } catch (error) {
        alert('Error leyendo el archivo: ' + error.message);
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  if (isAdding) {
    return (
      <div className="crm-form-container fade-in">
        <div className="crm-form-header">
          <h2>{editingId ? 'Editar Perfil del Personal' : 'Añadir Nuevo Miembro'}</h2>
          <button type="button" className="btn btn-outline" onClick={resetForm}>Volver al Directorio</button>
        </div>

        <form onSubmit={handleSubmit} className="crm-form-grid">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="crm-form-col">
            <div className="crm-card">
              <h3><Icon icon="solar:user-id-bold-duotone" width="20" /> Información Principal</h3>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Carlos López" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Puesto</label>
                  <input required type="text" value={puesto} onChange={e => setPuesto(e.target.value)} placeholder="Ej. Asesor de Ventas" />
                </div>
                <div className="form-group">
                  <label>Departamento</label>
                  <select value={departamento} onChange={e => setDepartamento(e.target.value)}>
                    <option value="Administración">Administración</option>
                    <option value="Ventas">Ventas</option>
                    <option value="Taller">Taller</option>
                    <option value="Finanzas">Finanzas</option>
                  </select>
                </div>
              </div>
              <div className="form-group checkbox-group">
                <label>¿Es un ejecutivo de atención al cliente? (Aparecerá en los autos para cotizar y en página de Contacto)</label>
                <div className="toggle-switch">
                  <input type="checkbox" name="esEjecutivo" id="esEjecutivo" checked={formData.esEjecutivo} onChange={handleChange} />
                  <label htmlFor="esEjecutivo"></label>
                </div>
              </div>
            </div>

            <div className="crm-card">
              <h3><Icon icon="solar:letter-bold-duotone" width="20" /> Biografía y Notas</h3>
              <div className="form-group">
                <label>Sobre el perfil</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="4" placeholder="Breve descripción de su experiencia o función en la automotora..."></textarea>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="crm-form-col">
            <div className="crm-card">
              <h3><Icon icon="solar:phone-calling-bold-duotone" width="20" /> Datos de Contacto</h3>
              <div className="form-group">
                <label>Teléfono / WhatsApp</label>
                <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ej. +56 9 1234 5678" />
              </div>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Ej. asesor@automotora.cl" />
              </div>
            </div>

            <div className="crm-card">
              <h3><Icon icon="solar:camera-square-bold-duotone" width="20" /> Fotografía de Perfil</h3>
              
              {!previewUrl && !existingImage ? (
                <div className="form-group">
                  <label className="upload-dropzone">
                    <Icon icon="solar:user-circle-bold-duotone" width="40" style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }} />
                    <span style={{ fontWeight: '600' }}>Subir fotografía formal</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Formatos: JPG, PNG (1:1 Recomendado)</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                </div>
              ) : (
                <div className="profile-preview-wrapper">
                  <div className="profile-preview">
                    <img src={previewUrl || existingImage} alt="Preview" />
                  </div>
                  <button type="button" onClick={removeFile} className="btn-remove-photo">
                    <Icon icon="solar:trash-bin-trash-bold" width="16" /> Eliminar foto actual
                  </button>
                </div>
              )}
            </div>

            <div className="crm-form-actions">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? <Icon icon="solar:spinner-bold-duotone" className="spin" width="24" /> : <Icon icon="solar:diskette-bold-duotone" width="24" />}
                {isSubmitting ? 'Guardando...' : 'Guardar Perfil'}
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
          <h2>Directorio del Personal</h2>
          <p className="subtitle">Gestión de equipo, vendedores y ejecutivos</p>
        </div>
        <div className="crm-header-actions">
          <div className="dropdown-group">
            <button className="btn btn-outline"><Icon icon="solar:import-bold-duotone" width="20" /> Importar (Excel)</button>
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
            <Plus size={20} /> Añadir Miembro
          </button>
        </div>
      </div>

      <div className="crm-filters card glass">
        <div className="filter-group">
          <Search size={20} className="filter-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o puesto..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      <div className="staff-grid">
        {filteredStaff.map(s => {
          let dep = 'Administración';
          let p = s.cargo || '';
          if (p.includes(' | [')) {
            const parts = p.split(' | [');
            p = parts[0];
            dep = parts[1].replace(']', '');
          }

          return (
            <div key={s.id} className="staff-card">
              <div className="staff-card-header">
                <div className="staff-avatar">
                  {s.imagenUrl ? <img src={s.imagenUrl} alt={s.nombre} /> : <Icon icon="solar:user-bold-duotone" width="40" style={{ color: 'var(--color-text-secondary)', opacity: 0.5 }} />}
                </div>
                <div className="staff-info">
                  <h3>{s.nombre}</h3>
                  <p className="puesto">{p}</p>
                  <span className="badge-dep">{dep}</span>
                </div>
              </div>
              
              <div className="staff-contact">
                {s.telefono && <div><Icon icon="solar:phone-bold-duotone" width="16" /> {s.telefono}</div>}
                {s.email && <div><Icon icon="solar:letter-bold-duotone" width="16" /> {s.email}</div>}
              </div>

              <div className="staff-footer">
                {s.esEjecutivo ? 
                  <span className="badge-exec"><Icon icon="solar:check-circle-bold" width="14" /> Ejecutivo de Ventas</span> 
                  : 
                  <span className="badge-internal">Personal Interno</span>
                }
                <div className="staff-actions">
                  <button onClick={() => handleEdit(s)} className="btn-icon edit" title="Editar"><Icon icon="solar:pen-bold-duotone" width="20" /></button>
                  <button onClick={() => handleDelete(s.id)} className="btn-icon delete" title="Eliminar"><Icon icon="solar:trash-bin-trash-bold-duotone" width="20" /></button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredStaff.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '3rem', width: '100%', gridColumn: '1 / -1' }}>
            <Icon icon="solar:users-group-two-rounded-bold-duotone" width="48" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No se encontró personal que coincida con la búsqueda.</p>
          </div>
        )}
      </div>

      {/* REUSING THE EXACT SAME CRM CSS AS VEHICLES */}
      
    </div>
  );
}
