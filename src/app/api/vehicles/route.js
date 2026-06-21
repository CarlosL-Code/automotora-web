import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const vehicle = await prisma.vehicle.create({
      data: {
        marca: data.marca,
        modelo: data.modelo,
        ano: parseInt(data.ano),
        precio: parseFloat(data.precio),
        kilometraje: parseInt(data.kilometraje),
        transmision: data.transmision,
        combustible: data.combustible,
        motor: data.motor,
        color: data.color,
        descripcion: data.descripcion,
        estado: data.estado || 'DISPONIBLE',
        imagenes: data.imagenes || '[]', // Should be JSON stringified array
        destacado: data.destacado || false,
      },
    });
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create vehicle', details: error.message }, { status: 500 });
  }
}
