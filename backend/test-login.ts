import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testUsers() {
    const officers = await prisma.user.findMany({
        where: {
            role: {
                in: ['MANDAL_OFFICER', 'DISTRICT_OFFICER', 'STATE_OFFICER']
            }
        },
        select: {
            phone: true,
            role: true,
            assignedDistrictId: true,
            assignedConstituencyId: true,
            assignedMandalId: true,
        }
    });

    console.log('\n📋 Officer Accounts:');
    console.log('='.repeat(80));
    officers.forEach(user => {
        console.log(`Phone: ${user.phone}`);
        console.log(`Role: ${user.role}`);
        console.log(`District: ${user.assignedDistrictId || 'None'}`);
        console.log(`Constituency: ${user.assignedConstituencyId || 'None'}`);
        console.log(`Mandal: ${user.assignedMandalId || 'None'}`);
        console.log('-'.repeat(80));
    });

    await prisma.$disconnect();
}

testUsers().catch(console.error);
