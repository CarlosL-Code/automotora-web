import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';

// Ensure this route is dynamic so it fetches fresh data, or revalidates
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // 1. Fetch lightweight counts
  const totalVehicles = await prisma.vehicle.count();
  const totalStaff = await prisma.staff.count();

  // 2. Fetch aggregate data for charts
  const vehiclesByStatus = await prisma.vehicle.groupBy({
    by: ['estado'],
    _count: { id: true },
  });

  const vehiclesByBrand = await prisma.vehicle.groupBy({
    by: ['marca'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  // 3. Fetch top 5 recent vehicles for activity feed (only minimal fields)
  const recentVehicles = await prisma.vehicle.findMany({
    select: {
      id: true,
      marca: true,
      modelo: true,
      precio: true,
      estado: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const stats = {
    totalVehicles,
    totalStaff,
    vehiclesByStatus,
    vehiclesByBrand,
  };

  return <DashboardClient stats={stats} recentVehicles={recentVehicles} />;
}
