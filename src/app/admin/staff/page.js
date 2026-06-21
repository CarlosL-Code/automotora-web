'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Download, Upload } from 'lucide-react';

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', cargo: '', descripcion: '', telefono: '', email: '', esEjecutivo: false, imagenUrl: ''
  });
  const [departamento, setDepartamento] = useState('Administración');
  const [puesto, setPuesto] = useState('');
  const [file, setFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const fetchStaff = async () => {
    const res = await fetch('/api/staff');
    const data = await res.json();
    setStaff(data);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Upload Image
    let imagenUrl = null;
    if (file) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const uploadJson = await uploadRes.json();
      if (uploadJson.urls && uploadJson.urls.length > 0) {
        imagenUrl = uploadJson.urls[0];
      }
    }

    // 2. Save Staff Member
    const staffData = {
      ...formData,
      cargo: `${puesto} | [${departamento}]`
    };
    
    // Si hay una nueva imagen subida, actualizamos la url
    if (imagenUrl) {
      staffData.imagenUrl = imagenUrl;
    } else if (existingImage) {
      // Si no subió una nueva pero tenía una antigua, la conservamos
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
      setIsAdding(false);
      setEditingId(null);
      fetchStaff();
      setFormData({ nombre: '', cargo: '', descripcion: '', telefono: '', email: '', esEjecutivo: false, imagenUrl: '' });
      setDepartamento('Administración');
      setPuesto('');
      setFile(null);
      setExistingImage(null);
    } else {
      alert('Error guardando personal');
    }
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
      nombre: s.nombre || '',
      cargo: s.cargo || '',
      descripcion: s.descripcion || '',
      telefono: s.telefono || '',
      email: s.email || '',
      esEjecutivo: s.esEjecutivo || false,
      imagenUrl: s.imagenUrl || '',
    });
    setExistingImage(s.imagenUrl || null);
    setEditingId(s.id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Seguro que deseas eliminar a este miembro del personal?')) {
      await fetch(`/api/staff/${id}`, { method: 'DELETE' });
      fetchStaff();
    }
  };

  const handleDownloadTemplate = async () => {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet([{
      Nombre: 'Juan Perez', Cargo: 'Vendedor', Descripcion: 'Experto en ventas', Telefono: '+56912345678', Email: 'juan@hmcmotor.cl', EsEjecutivo: 'SI', Orden: 1
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
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        const formattedData = json.map(row => ({
          nombre: row.Nombre,
          cargo: row.Cargo,
          descripcion: row.Descripcion || '',
          telefono: row.Telefono ? String(row.Telefono) : '',
          email: row.Email || '',
          esEjecutivo: String(row.EsEjecutivo).toUpperCase() === 'SI' || String(row.EsEjecutivo).toUpperCase() === 'SÍ',
          orden: row.Orden || 0
        })).filter(row => row.nombre && row.cargo); // Filter empty rows

        if (formattedData.length === 0) {
          alert('No se encontraron datos válidos en el archivo Excel.');
          return;
        }

        const res = await fetch('/api/staff/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedData)
        });
        
        if (res.ok) {
          alert(`${formattedData.length} miembros del personal importados exitosamente.`);
          fetchStaff();
        } else {
          alert('Error importando personal desde Excel.');
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
        <h2>{editingId ? 'Editar Personal' : 'Añadir Miembro del Personal'}</h2>
        <form onSubmit={handleSubmit} className="card glass" style={{ padding: '2rem', marginTop: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Nombre Completo</label>
              <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="input" />
            </div>
            <div className="form-group">
              <label className="form-label">Departamento / Área</label>
              <select value={departamento} onChange={(e) => setDepartamento(e.target.value)} className="input">
                <option value="Administración">Administración</option>
                <option value="Ventas">Ventas (Ejecutivos y Mecánicos)</option>
                <option value="TI">TI (Informática)</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Puesto (Ej. Jefe de Taller)</label>
              <input required type="text" value={puesto} onChange={(e) => setPuesto(e.target.value)} className="input" />
            </div>
            <div className="form-group">
              <label className="form-label">Teléfono (Opcional)</label>
              <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="input" />
            </div>
            <div className="form-group">
              <label className="form-label">Email (Opcional)</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" name="esEjecutivo" checked={formData.esEjecutivo} onChange={handleChange} id="esEjecutivoCheck" style={{ width: '20px', height: '20px' }} />
              <label htmlFor="esEjecutivoCheck" className="form-label" style={{ marginBottom: 0 }}>¿Es un Ejecutivo? (Aparecerá en la sección Ejecutivos)</label>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Descripción o Biografía breve</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="input" rows="3"></textarea>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Fotografía</label>
              
              {existingImage && !file && (
                <div style={{ marginBottom: '1rem', width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-accent)' }}>
                  <img src={existingImage} alt="Actual" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              
              <input type="file" accept="image/*" onChange={handleFileChange} className="input" style={{ padding: '0.5rem' }} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Guardar Personal</button>
            <button type="button" className="btn btn-outline" onClick={() => {
              setIsAdding(false);
              setEditingId(null);
              setFormData({ nombre: '', cargo: '', descripcion: '', telefono: '', email: '', esEjecutivo: false, imagenUrl: '' });
              setDepartamento('Administración');
              setPuesto('');
              setExistingImage(null);
              setFile(null);
            }}>Cancelar</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Personal</h2>
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
          setFormData({ nombre: '', cargo: '', descripcion: '', telefono: '', email: '', esEjecutivo: false, imagenUrl: '' });
          setDepartamento('Administración');
          setPuesto('');
          setExistingImage(null);
          setFile(null);
        }}>
          <Plus size={20} /> Añadir Manual
        </button>
        </div>
      </div>

      <div className="card glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Cargo</th>
              <th>Tipo</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s.id}>
                <td>
                  {s.imagenUrl ? (
                    <img src={s.imagenUrl} alt={s.nombre} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                  )}
                </td>
                <td><strong>{s.nombre}</strong></td>
                <td>{s.cargo && s.cargo.includes(' | [') ? s.cargo.split(' | [')[0] : s.cargo}</td>
                <td>{s.esEjecutivo ? <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>Ejecutivo</span> : 'Personal'}</td>
                <td>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {s.telefono && <div>{s.telefono}</div>}
                    {s.email && <div>{s.email}</div>}
                  </div>
                </td>
                <td>
                  <button onClick={() => handleEdit(s)} style={{ color: 'var(--color-primary)', cursor: 'pointer', marginRight: '1rem', background: 'none', border: 'none' }}>
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDelete(s.id)} style={{ color: 'var(--color-danger)', cursor: 'pointer', background: 'none', border: 'none' }}>
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                  No hay personal registrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
