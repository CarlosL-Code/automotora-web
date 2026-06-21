const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.staff.deleteMany({}); // Clear existing

  const staffData = [
    // Ejecutivos
    { nombre: 'Mariana Garate', cargo: 'Ejecutivo de Ventas', telefono: '+56979505786', esEjecutivo: true, orden: 2 },
    { nombre: 'Gabriel Troncoso', cargo: 'Jefe de Ventas', telefono: '+56933978494', esEjecutivo: true, orden: 1 },
    { nombre: 'Bryan Garrido', cargo: 'Ejecutivo de Ventas', telefono: '+56932216461', esEjecutivo: true, orden: 3 },
    { nombre: 'Pablo San Martin', cargo: 'Ejecutivo de Ventas', telefono: '+56977133436', esEjecutivo: true, orden: 4 },
    { nombre: 'Nicolas Miranda', cargo: 'Ejecutivo de Ventas', telefono: '+56975276683', esEjecutivo: true, orden: 5 },
    { nombre: 'Pamela Soto', cargo: 'Ejecutivo de Ventas', telefono: '+56945410352', esEjecutivo: true, orden: 6 },
    { nombre: 'Ximena Clavel', cargo: 'Ejecutivo de Ventas', telefono: '+56964535829', esEjecutivo: true, orden: 7 },

    // Mecanico
    { nombre: 'Esteban Paine', cargo: 'Mecánico Oficial', telefono: '+56934636691', esEjecutivo: false, orden: 10 },

    // Administrativo
    { nombre: 'Sayen Huenulef', cargo: 'Jefe Administrativo', telefono: '+5693746202', esEjecutivo: false, orden: 8 },
    { nombre: 'Santiago Huenulef', cargo: 'Administrativo', telefono: '+56958251226', esEjecutivo: false, orden: 9 },
    { nombre: 'Mercedes Maturana', cargo: 'Administrativo', telefono: '+56976238160', esEjecutivo: false, orden: 11 },
  ];

  for (const person of staffData) {
    await prisma.staff.create({
      data: person
    });
  }

  console.log('Base de datos poblada con el personal exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
