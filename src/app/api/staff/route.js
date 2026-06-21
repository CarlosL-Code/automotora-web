import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { orden: 'asc' },
    });
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const staffMember = await prisma.staff.create({
      data: {
        nombre: data.nombre,
        cargo: data.cargo,
        descripcion: data.descripcion,
        imagenUrl: data.imagenUrl,
        telefono: data.telefono,
        email: data.email,
        esEjecutivo: data.esEjecutivo === true,
        orden: data.orden ? parseInt(data.orden) : 0,
      },
    });
    return NextResponse.json(staffMember, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create staff member', details: error.message }, { status: 500 });
  }
}
