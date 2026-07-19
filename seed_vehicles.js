const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const vehiclesArray = [
  { marca: 'Kia', modelo: 'Sorento', ano: 2013, precio: 10300000, kilometraje: 93129, transmision: 'Manual', combustible: 'Diesel', color: 'Plomo', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true, imagenes: '[]' },
  { marca: 'Chery', modelo: 'Tiggo 2GLX', ano: 2021, precio: 6990000, kilometraje: 150000, transmision: 'Manual', combustible: 'Gasolina', color: 'Rojo', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true, imagenes: '[]' },
  { marca: 'Samsung', modelo: 'SM5', ano: 2011, precio: 5990000, kilometraje: 143000, transmision: 'Manual', combustible: 'Gasolina', color: 'Plomo', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true, imagenes: '[]' },
  { marca: 'Kia', modelo: 'Morning', ano: 2020, precio: 6990000, kilometraje: 120000, transmision: 'Manual', combustible: 'Gasolina', color: 'Blanco', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true, imagenes: '[]' },
  { marca: 'Changan', modelo: 'Alsvin', ano: 2022, precio: 6990000, kilometraje: 82000, transmision: 'Manual', combustible: 'Gasolina', color: 'Blanco', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true, imagenes: '[]' },
  { marca: 'Nissan', modelo: 'Navara NP30', ano: 2020, precio: 13990000, kilometraje: 100000, transmision: 'Manual', combustible: 'Diesel', color: 'Azul', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true, imagenes: '[]' },
  { marca: 'Jeep', modelo: 'Grand Chero', ano: 2014, precio: 14390000, kilometraje: 260000, transmision: 'Manual', combustible: 'Diesel', color: 'Negro', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true, imagenes: '[]' },
  { marca: 'Renault', modelo: 'Clio HB Expre', ano: 2017, precio: 6500000, kilometraje: 81175, transmision: 'Manual', combustible: 'Gasolina', color: 'Rojo', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true, imagenes: '[]' },
  { marca: 'Ford', modelo: 'Ecosport', ano: 2017, precio: 6990000, kilometraje: 100000, transmision: 'Manual', combustible: 'Gasolina', color: 'Blanco', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true, imagenes: '[]' },
  { marca: 'Peugeot', modelo: '208', ano: 2024, precio: 12990000, kilometraje: 33000, transmision: 'Manual', combustible: 'Gasolina', color: 'Plomo', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true, imagenes: '[]' },
  { marca: 'Foton', modelo: 'TM5', ano: 2025, precio: 11990000, kilometraje: 190000, transmision: 'Manual', combustible: 'Gasolina', color: 'Blanco', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true, imagenes: '[]' },
];

async function main() {
  await prisma.vehicle.deleteMany();
  for (const v of vehiclesArray) {
    await prisma.vehicle.create({ data: v });
  }
  console.log('Vehiculos insertados!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
