'use client';
import { Icon } from '@iconify/react';

export default function DashboardClient({ stats, recentVehicles }) {
  const { totalVehicles, totalStaff, vehiclesByStatus, vehiclesByBrand } = stats;

  const maxBrandCount = Math.max(...vehiclesByBrand.map(b => b._count.id), 1);

  return (
    <div className="fade-in">
      <div className="crm-header" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h2>Panel de Control</h2>
          <p className="subtitle">Métricas en tiempo real del inventario y personal</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon blue"><Icon icon="solar:car-bold-duotone" width="32" /></div>
          <div className="kpi-data">
            <p>Total Vehículos</p>
            <h3>{totalVehicles}</h3>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon green"><Icon icon="solar:dollar-circle-bold-duotone" width="32" /></div>
          <div className="kpi-data">
            <p>Disponibles (Venta)</p>
            <h3>{vehiclesByStatus.find(s => s.estado === 'DISPONIBLE')?._count?.id || 0}</h3>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon orange"><Icon icon="solar:history-bold-duotone" width="32" /></div>
          <div className="kpi-data">
            <p>Reservados</p>
            <h3>{vehiclesByStatus.find(s => s.estado === 'RESERVADO')?._count?.id || 0}</h3>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon purple"><Icon icon="solar:users-group-two-rounded-bold-duotone" width="32" /></div>
          <div className="kpi-data">
            <p>Personal Registrado</p>
            <h3>{totalStaff}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Charts: Brands */}
        <div className="card glass dashboard-card">
          <h3 className="card-title"><Icon icon="solar:chart-square-bold-duotone" width="24" /> Top Marcas en Inventario</h3>
          <div className="bar-chart-container">
            {vehiclesByBrand.slice(0, 5).map(brand => (
              <div key={brand.marca} className="bar-row">
                <div className="bar-label">{brand.marca} ({brand._count.id})</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: \`\${(brand._count.id / maxBrandCount) * 100}%\` }}></div>
                </div>
              </div>
            ))}
            {vehiclesByBrand.length === 0 && <p style={{ color: 'var(--color-text-secondary)' }}>No hay datos suficientes.</p>}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="card glass dashboard-card">
          <h3 className="card-title"><Icon icon="solar:pie-chart-2-bold-duotone" width="24" /> Distribución por Estado</h3>
          <div className="status-grid">
            {vehiclesByStatus.map(status => (
              <div key={status.estado} className={\`status-box \${status.estado.toLowerCase()}\`}>
                <h4>{status._count.id}</h4>
                <p>{status.estado}</p>
              </div>
            ))}
            {vehiclesByStatus.length === 0 && <p style={{ color: 'var(--color-text-secondary)' }}>No hay vehículos.</p>}
          </div>
        </div>

        {/* Recent Vehicles */}
        <div className="card glass dashboard-card full-width">
          <h3 className="card-title"><Icon icon="solar:calendar-add-bold-duotone" width="24" /> Últimos Ingresos al Inventario</h3>
          <div className="recent-list">
            {recentVehicles.map(v => (
              <div key={v.id} className="recent-item">
                <div className="recent-icon"><Icon icon="solar:car-bold" width="20" /></div>
                <div className="recent-details">
                  <strong>{v.marca} {v.modelo}</strong>
                  <span>{new Date(v.createdAt).toLocaleDateString('es-CL')}</span>
                </div>
                <div className="recent-price">\${v.precio.toLocaleString('es-CL')}</div>
                <div className={\`recent-status \${v.estado.toLowerCase()}\`}>{v.estado}</div>
              </div>
            ))}
            {recentVehicles.length === 0 && <p style={{ color: 'var(--color-text-secondary)' }}>No hay vehículos recientes.</p>}
          </div>
        </div>
      </div>

      <style jsx>{\`
        .crm-header h2 { margin: 0; font-size: 2rem; }
        .subtitle { color: var(--color-text-secondary); margin-top: 0.2rem; }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .kpi-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          transition: transform 0.3s;
        }
        .kpi-card:hover { transform: translateY(-5px); }
        .kpi-icon {
          width: 60px; height: 60px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
        }
        .kpi-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .kpi-icon.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .kpi-icon.orange { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .kpi-icon.purple { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
        .kpi-data p { margin: 0; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-secondary); }
        .kpi-data h3 { margin: 0; font-size: 2rem; line-height: 1.1; color: var(--color-text-primary); }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .dashboard-card { padding: 2rem; border-radius: 20px; }
        .card-title {
          display: flex; align-items: center; gap: 0.6rem; margin-top: 0; margin-bottom: 2rem;
          font-size: 1.2rem; color: var(--color-text-primary);
        }
        .full-width { grid-column: 1 / -1; }

        /* Bar Chart */
        .bar-chart-container { display: flex; flex-direction: column; gap: 1rem; }
        .bar-row { display: flex; flex-direction: column; gap: 0.3rem; }
        .bar-label { font-size: 0.9rem; font-weight: 600; color: var(--color-text-secondary); }
        .bar-track { width: 100%; height: 12px; background: var(--color-border); border-radius: 6px; overflow: hidden; }
        .bar-fill { height: 100%; background: var(--color-accent); border-radius: 6px; transition: width 1s ease-out; }

        /* Status Grid */
        .status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .status-box { padding: 1.5rem; border-radius: 16px; text-align: center; border: 1px solid transparent; }
        .status-box h4 { margin: 0; font-size: 2.5rem; font-weight: 800; }
        .status-box p { margin: 0; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .status-box.disponible { background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-box.reservado { background: rgba(245, 158, 11, 0.05); border-color: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .status-box.vendido { background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.1); color: #ef4444; }

        /* Recent List */
        .recent-list { display: flex; flex-direction: column; gap: 1rem; }
        .recent-item {
          display: flex; align-items: center; gap: 1.5rem; padding: 1.2rem;
          background: var(--color-bg); border-radius: 12px; border: 1px solid var(--color-border);
        }
        .recent-icon {
          width: 40px; height: 40px; background: rgba(15, 113, 67, 0.1); color: var(--color-accent);
          border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .recent-details { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }
        .recent-details strong { font-size: 1rem; }
        .recent-details span { font-size: 0.8rem; color: var(--color-text-secondary); }
        .recent-price { font-weight: 800; font-size: 1.1rem; }
        .recent-status { padding: 0.3rem 0.8rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; }
        .recent-status.disponible { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .recent-status.reservado { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .recent-status.vendido { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        @media(max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          .recent-item { flex-direction: column; align-items: flex-start; gap: 0.8rem; }
        }
      \`}</style>
    </div>
  );
}
