import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!vehicle) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(vehicle);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const updateData = { ...data };
    if (updateData.ano) updateData.ano = parseInt(updateData.ano);
    if (updateData.precio) updateData.precio = parseFloat(updateData.precio);
    if (updateData.kilometraje) updateData.kilometraje = parseInt(updateData.kilometraje);

    const vehicle = await prisma.vehicle.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    return NextResponse.json(vehicle);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.vehicle.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
