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
      <style jsx>{`
        /* CRM Header & Filters */
        .crm-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .crm-header h2 { margin: 0; font-size: 2rem; }
        .subtitle { color: var(--color-text-secondary); margin-top: 0.2rem; }
        .crm-header-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        
        .crm-filters { display: flex; gap: 1.5rem; padding: 1.2rem 1.5rem; margin-bottom: 2rem; border-radius: 16px; }
        .filter-group { flex: 1; display: flex; align-items: center; gap: 0.8rem; background: var(--color-bg); padding: 0.8rem 1.2rem; border-radius: 12px; border: 1px solid var(--color-border); }
        .filter-icon { color: var(--color-text-secondary); }
        .filter-group input, .filter-group select { border: none; background: transparent; flex: 1; color: var(--color-text-primary); font-size: 0.95rem; outline: none; }

        /* CRM Form Layout */
        .crm-form-container { margin-top: 1rem; }
        .crm-form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .crm-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; }
        @media(max-width: 900px) { .crm-form-grid { grid-template-columns: 1fr; } }
        .crm-col { display: flex; flex-direction: column; gap: 2rem; }
        .crm-card { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 20px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.02); margin-bottom: 2rem; }
        .crm-card h3 { display: flex; align-items: center; gap: 0.5rem; margin-top: 0; margin-bottom: 1.5rem; font-size: 1.2rem; color: var(--color-accent); padding-bottom: 0.8rem; border-bottom: 1px solid var(--color-border); }
        
        /* Form Inputs */
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
        .form-group { margin-bottom: 1.5rem; }
        .form-row .form-group { margin-bottom: 0; }
        .form-group label { display: block; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-secondary); margin-bottom: 0.5rem; }
        .form-group input:not([type="checkbox"]), .form-group select, .form-group textarea { width: 100%; padding: 0.9rem 1.2rem; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 12px; color: var(--color-text-primary); font-family: inherit; font-size: 1rem; transition: all 0.3s; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 3px rgba(15, 113, 67, 0.1); }
        
        /* Toggle Switch */
        .checkbox-group { display: flex; flex-direction: column; justify-content: space-between; }
        .toggle-switch { position: relative; width: 60px; height: 32px; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-switch label { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--color-border); border-radius: 34px; transition: .4s; }
        .toggle-switch label:before { position: absolute; content: ""; height: 24px; width: 24px; left: 4px; bottom: 4px; background-color: white; border-radius: 50%; transition: .4s; }
        .toggle-switch input:checked + label { background-color: var(--color-accent); }
        .toggle-switch input:checked + label:before { transform: translateX(28px); }

        /* Upload Zone */
        .upload-dropzone { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2.5rem 1.5rem; background: rgba(15, 113, 67, 0.03); border: 2px dashed var(--color-accent); border-radius: 16px; cursor: pointer; transition: all 0.2s; text-align: center; }
        .upload-dropzone:hover { background: rgba(15, 113, 67, 0.08); }
        
        /* Profile Preview */
        .profile-preview-wrapper { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .profile-preview { width: 150px; height: 150px; border-radius: 50%; overflow: hidden; border: 4px solid var(--color-accent); box-shadow: 0 10px 30px rgba(15, 113, 67, 0.2); }
        .profile-preview img { width: 100%; height: 100%; object-fit: cover; }
        .btn-remove-photo { display: flex; align-items: center; gap: 0.5rem; background: rgba(239, 68, 68, 0.1); color: var(--color-danger); border: none; padding: 0.6rem 1rem; border-radius: 99px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-remove-photo:hover { background: rgba(239, 68, 68, 0.2); }

        .crm-form-actions { display: flex; justify-content: flex-end; margin-top: 1rem; }
        .crm-form-actions .btn { width: 100%; padding: 1.2rem; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }

        /* Dropdown */
        .dropdown-group { position: relative; display: inline-block; }
        .dropdown-menu { display: none; position: absolute; top: 100%; left: 0; background: var(--color-bg-card); min-width: 200px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border-radius: 12px; border: 1px solid var(--color-border); z-index: 10; overflow: hidden; margin-top: 0.5rem; }
        .dropdown-group:hover .dropdown-menu { display: block; }
        .dropdown-menu button, .dropdown-menu label { display: flex; align-items: center; gap: 0.5rem; width: 100%; padding: 1rem; border: none; background: transparent; color: var(--color-text-primary); text-align: left; cursor: pointer; font-size: 0.9rem; font-weight: 500; }
        .dropdown-menu button:hover, .dropdown-menu label:hover { background: var(--color-bg); color: var(--color-accent); }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* Staff Grid */
        .staff-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem; }
        .staff-card { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.2rem; transition: transform 0.2s, box-shadow 0.2s; }
        .staff-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .staff-card-header { display: flex; gap: 1rem; align-items: center; }
        .staff-avatar { width: 64px; height: 64px; border-radius: 50%; overflow: hidden; background: var(--color-bg); display: flex; align-items: center; justify-content: center; border: 2px solid var(--color-border); flex-shrink: 0; }
        .staff-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .staff-info h3 { margin: 0 0 0.2rem 0; font-size: 1.1rem; }
        .staff-info .puesto { color: var(--color-text-secondary); margin: 0 0 0.4rem 0; font-size: 0.9rem; }
        .badge-dep { background: rgba(15, 113, 67, 0.1); color: var(--color-accent); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        
        .staff-contact { background: var(--color-bg); padding: 1rem; border-radius: 12px; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem; color: var(--color-text-secondary); }
        .staff-contact div { display: flex; align-items: center; gap: 0.5rem; }
        
        .staff-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--color-border); }
        .badge-exec { display: flex; align-items: center; gap: 0.3rem; color: #10b981; font-size: 0.8rem; font-weight: 700; background: rgba(16, 185, 129, 0.1); padding: 0.3rem 0.6rem; border-radius: 99px; }
        .badge-internal { display: flex; align-items: center; gap: 0.3rem; color: var(--color-text-secondary); font-size: 0.8rem; font-weight: 700; background: var(--color-bg); padding: 0.3rem 0.6rem; border-radius: 99px; }
        
        .staff-actions { display: flex; gap: 0.5rem; }
        .btn-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid var(--color-border); background: transparent; cursor: pointer; transition: all 0.2s; }
        .btn-icon.edit { color: var(--color-primary); }
        .btn-icon.edit:hover { background: rgba(59, 130, 246, 0.05); border-color: var(--color-primary); }
        .btn-icon.delete { color: var(--color-danger); }
        .btn-icon.delete:hover { background: rgba(239, 68, 68, 0.05); border-color: var(--color-danger); }
      `}</style>
    </div>
  );
}
