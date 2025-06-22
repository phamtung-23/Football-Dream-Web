import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@football.com' },
    update: {},
    create: {
      email: 'admin@football.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  console.log('👤 Created admin user:', admin.email);

  // Create sample teams
  const barcelona = await prisma.team.upsert({
    where: { name: 'FC Barcelona' },
    update: {},
    create: {
      name: 'FC Barcelona',
      shortName: 'BAR',
      city: 'Barcelona',
      country: 'Spain',
      stadium: 'Camp Nou',
      founded: 1899,
      description: 'More than a club',
      userId: admin.id,
    },
  });

  const realMadrid = await prisma.team.upsert({
    where: { name: 'Real Madrid CF' },
    update: {},
    create: {
      name: 'Real Madrid CF',
      shortName: 'RMA',
      city: 'Madrid',
      country: 'Spain',
      stadium: 'Santiago Bernabéu',
      founded: 1902,
      description: 'The Royal Club',
      userId: admin.id,
    },
  });

  console.log('⚽ Created teams:', barcelona.name, 'and', realMadrid.name);

  // Create sample players
  const messi = await prisma.player.create({
    data: {
      firstName: 'Lionel',
      lastName: 'Messi',
      position: 'FORWARD',
      jerseyNumber: 10,
      nationality: 'Argentina',
      birthDate: new Date('1987-06-24'),
      height: 170,
      weight: 72,
      teamId: barcelona.id,
      userId: admin.id,
    },
  });

  const benzema = await prisma.player.create({
    data: {
      firstName: 'Karim',
      lastName: 'Benzema',
      position: 'FORWARD',
      jerseyNumber: 9,
      nationality: 'France',
      birthDate: new Date('1987-12-19'),
      height: 185,
      weight: 81,
      teamId: realMadrid.id,
      userId: admin.id,
    },
  });

  console.log('👥 Created players:', messi.firstName, messi.lastName, 'and', benzema.firstName, benzema.lastName);

  // Create a sample league
  const laLiga = await prisma.league.create({
    data: {
      name: 'La Liga',
      shortName: 'LL',
      country: 'Spain',
      season: '2024-25',
      description: 'Spanish Primera División',
      teams: {
        connect: [{ id: barcelona.id }, { id: realMadrid.id }],
      },
    },
  });

  console.log('🏆 Created league:', laLiga.name);

  // Create a sample match
  const elClasico = await prisma.match.create({
    data: {
      matchDate: new Date('2025-01-15T20:00:00Z'),
      venue: 'Camp Nou',
      homeTeamId: barcelona.id,
      awayTeamId: realMadrid.id,
      leagueId: laLiga.id,
      userId: admin.id,
      status: 'SCHEDULED',
    },
  });

  console.log('🆚 Created match: El Clásico');

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
