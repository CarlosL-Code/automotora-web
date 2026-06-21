import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const staffArray = await request.json();
    
    if (!Array.isArray(staffArray)) {
      return NextResponse.json({ error: 'Expected an array of staff members' }, { status: 400 });
    }

    const createdStaff = await prisma.staff.createMany({
      data: staffArray.map(staff => ({
        nombre: staff.nombre,
        cargo: staff.cargo,
        descripcion: staff.descripcion || '',
        imagenUrl: null, // Images loaded later
        telefono: staff.telefono || '',
        email: staff.email || '',
        esEjecutivo: staff.esEjecutivo === true,
        orden: staff.orden ? parseInt(staff.orden) : 0,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true, count: createdStaff.count }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to bulk create staff', details: error.message }, { status: 500 });
  }
}
