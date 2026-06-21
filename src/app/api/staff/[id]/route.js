import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const staffMember = await prisma.staff.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!staffMember) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(staffMember);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const updateData = { ...data };
    if (updateData.orden !== undefined) updateData.orden = parseInt(updateData.orden);

    const staffMember = await prisma.staff.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    return NextResponse.json(staffMember);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.staff.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
