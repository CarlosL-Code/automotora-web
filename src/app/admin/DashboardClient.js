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
                  <div className="bar-fill" style={{ width: `${(brand._count.id / maxBrandCount) * 100}%` }}></div>
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
              <div key={status.estado} className={`status-box ${status.estado.toLowerCase()}`}>
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
                <div className="recent-price">${v.precio.toLocaleString('es-CL')}</div>
                <div className={`recent-status ${v.estado.toLowerCase()}`}>{v.estado}</div>
              </div>
            ))}
            {recentVehicles.length === 0 && <p style={{ color: 'var(--color-text-secondary)' }}>No hay vehículos recientes.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
