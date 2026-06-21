import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const vehiclesArray = await request.json();
    
    if (!Array.isArray(vehiclesArray)) {
      return NextResponse.json({ error: 'Expected an array of vehicles' }, { status: 400 });
    }

    const createdVehicles = await prisma.vehicle.createMany({
      data: vehiclesArray.map(vehicle => ({
        marca: vehicle.marca,
        modelo: vehicle.modelo,
        ano: parseInt(vehicle.ano) || new Date().getFullYear(),
        precio: parseFloat(vehicle.precio) || 0,
        kilometraje: parseInt(vehicle.kilometraje) || 0,
        transmision: vehicle.transmision || 'Automática',
        combustible: vehicle.combustible || 'Gasolina',
        motor: vehicle.motor || '',
        color: vehicle.color || '',
        descripcion: vehicle.descripcion || '',
        estado: vehicle.estado || 'DISPONIBLE',
        imagenes: '[]', // Images loaded later
        destacado: vehicle.destacado === true || vehicle.destacado === 'true',
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true, count: createdVehicles.count }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to bulk create vehicles', details: error.message }, { status: 500 });
  }
}
