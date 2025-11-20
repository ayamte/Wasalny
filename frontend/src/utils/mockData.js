// Mock data pour les pages d'administration

export const mockClients = [
  {
    id: '1',
    firstName: 'Ahmed',
    lastName: 'Alami',
    email: 'ahmed.alami@email.com',
    phone: '+212 6 12 34 56 78',
    username: 'ahmed_alami',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    firstName: 'Fatima',
    lastName: 'Bennani',
    email: 'fatima.bennani@email.com',
    phone: '+212 6 23 45 67 89',
    username: 'fatima_bennani',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '3',
    firstName: 'Youssef',
    lastName: 'Idrissi',
    email: 'youssef.idrissi@email.com',
    phone: '+212 6 34 56 78 90',
    username: 'youssef_idrissi',
    createdAt: new Date('2024-03-05'),
  },
]

export const mockDrivers = [
  {
    id: '1',
    firstName: 'Mohammed',
    lastName: 'Tazi',
    email: 'mohammed.tazi@wasalny.com',
    phone: '+212 6 45 67 89 01',
    licenseNumber: 'DL-12345',
    username: 'mohammed_tazi',
    createdAt: new Date('2023-06-01'),
  },
  {
    id: '2',
    firstName: 'Rachid',
    lastName: 'Chakir',
    email: 'rachid.chakir@wasalny.com',
    phone: '+212 6 56 78 90 12',
    licenseNumber: 'DL-23456',
    username: 'rachid_chakir',
    createdAt: new Date('2023-07-15'),
  },
  {
    id: '3',
    firstName: 'Karim',
    lastName: 'Fassi',
    email: 'karim.fassi@wasalny.com',
    phone: '+212 6 67 89 01 23',
    licenseNumber: 'DL-34567',
    username: 'karim_fassi',
    createdAt: new Date('2023-08-20'),
  },
]

export const mockBuses = [
  {
    id: '1',
    registrationNumber: 'A-12345-RB',
    model: 'Mercedes Citaro',
    capacity: 50,
    driverId: '1',
    createdAt: new Date('2023-01-10'),
  },
  {
    id: '2',
    registrationNumber: 'A-23456-RB',
    model: 'Volvo 7900',
    capacity: 45,
    driverId: '2',
    createdAt: new Date('2023-02-15'),
  },
  {
    id: '3',
    registrationNumber: 'A-34567-RB',
    model: 'Scania Citywide',
    capacity: 55,
    createdAt: new Date('2023-03-20'),
  },
]
