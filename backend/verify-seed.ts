import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifySeedData() {
    console.log('🔍 Verifying seed data...\n');

    const districts = await prisma.district.findMany({
        include: {
            constituencies: {
                include: {
                    mandals: true
                }
            }
        },
        orderBy: { name: 'asc' }
    });

    console.log('📊 District Coverage:\n');
    let totalConstituencies = 0;
    let totalMandals = 0;
    let districtsWithoutData = [];

    districts.forEach(district => {
        const constituencyCount = district.constituencies.length;
        const mandalCount = district.constituencies.reduce((sum, c) => sum + c.mandals.length, 0);

        totalConstituencies += constituencyCount;
        totalMandals += mandalCount;

        const status = constituencyCount > 0 ? '✅' : '❌';
        console.log(`${status} ${district.name.padEnd(25)} ${constituencyCount} constituencies, ${mandalCount} mandals`);

        if (constituencyCount === 0) {
            districtsWithoutData.push(district.name);
        }
    });

    console.log('\n📈 Summary:');
    console.log(`   Total Districts: ${districts.length}`);
    console.log(`   Total Constituencies: ${totalConstituencies}`);
    console.log(`   Total Mandals: ${totalMandals}`);

    if (districtsWithoutData.length > 0) {
        console.log(`\n⚠️  Districts without constituencies: ${districtsWithoutData.join(', ')}`);
    } else {
        console.log('\n✅ All districts have constituencies!');
    }

    await prisma.$disconnect();
}

verifySeedData().catch(console.error);
