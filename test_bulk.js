const vehiclesArray = [
  { marca: 'Kia', modelo: 'Sorento', ano: 2013, precio: 10300000, kilometraje: 93129, transmision: 'Manual', combustible: 'Diesel', color: 'Plomo', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true },
  { marca: 'Chery', modelo: 'Tiggo 2GLX', ano: 2021, precio: 6990000, kilometraje: 150000, transmision: 'Manual', combustible: 'Gasolina', color: 'Rojo', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true },
  { marca: 'Samsung', modelo: 'SM5', ano: 2011, precio: 5990000, kilometraje: 143000, transmision: 'Manual', combustible: 'Gasolina', color: 'Plomo', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true },
  { marca: 'Kia', modelo: 'Morning', ano: 2020, precio: 6990000, kilometraje: 120000, transmision: 'Manual', combustible: 'Gasolina', color: 'Blanco', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true },
  { marca: 'Changan', modelo: 'Alsvin', ano: 2022, precio: 6990000, kilometraje: 82000, transmision: 'Manual', combustible: 'Gasolina', color: 'Blanco', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true },
  { marca: 'Nissan', modelo: 'Navara NP30', ano: 2020, precio: 13990000, kilometraje: null, transmision: 'Manual', combustible: 'Diesel', color: 'Azul', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true },
  { marca: 'Jeep', modelo: 'Grand Chero', ano: 2014, precio: 14390000, kilometraje: 260000, transmision: 'Manual', combustible: 'Diesel', color: null, descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true },
  { marca: 'Renault', modelo: 'Clio HB Expre', ano: 2017, precio: 6500000, kilometraje: 81175, transmision: 'Manual', combustible: 'Gasolina', color: 'Rojo', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true },
  { marca: 'Ford', modelo: 'Ecosport', ano: 2017, precio: 6990000, kilometraje: null, transmision: 'Manual', combustible: 'Gasolina', color: 'Blanco', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true },
  { marca: 'Peugeot', modelo: '208', ano: 2024, precio: 12990000, kilometraje: 33000, transmision: 'Manual', combustible: null, color: 'Plomo', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true },
  { marca: 'Foton', modelo: 'TM5', ano: 2025, precio: 11990000, kilometraje: 190000, transmision: 'Manual', combustible: null, color: 'Blanco', descripcion: 'Excelente est', estado: 'DISPONIBLE', destacado: true },
];

async function run() {
  const res = await fetch('http://localhost:3000/api/vehicles/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehiclesArray)
  });
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Data:', data);
}

run();
