import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Clean existing data (in development only)
    await prisma.auditLog.deleteMany();
    await prisma.approvalHistory.deleteMany();
    await prisma.document.deleteMany();
    await prisma.rolePreference.deleteMany();
    await prisma.application.deleteMany();
    await prisma.partyRole.deleteMany();
    await prisma.mandal.deleteMany();
    await prisma.constituency.deleteMany();
    await prisma.district.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.otpSession.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Cleaned existing data');

    // Seed Party Roles
    const roles = await Promise.all([
        prisma.partyRole.create({ data: { name: 'President', active: true } }),
        prisma.partyRole.create({ data: { name: 'Vice President', active: true } }),
        prisma.partyRole.create({ data: { name: 'Secretary', active: true } }),
        prisma.partyRole.create({ data: { name: 'Treasurer', active: true } }),
        prisma.partyRole.create({ data: { name: 'Youth Wing Leader', active: true } }),
        prisma.partyRole.create({ data: { name: 'Women Wing Leader', active: true } }),
        prisma.partyRole.create({ data: { name: 'Social Media Coordinator', active: true } }),
        prisma.partyRole.create({ data: { name: 'Booth President', active: true } }),
        prisma.partyRole.create({ data: { name: 'Mandal Convenor', active: true } }),
        prisma.partyRole.create({ data: { name: 'Constituency Coordinator', active: true } }),
    ]);
    console.log('✅ Created party roles');

    // Seed Districts - All 26 Andhra Pradesh Districts
    // North Coastal Region (6 districts)
    const districts = await Promise.all([
        prisma.district.create({ data: { name: 'Srikakulam' } }),
        prisma.district.create({ data: { name: 'Parvathipuram Manyam' } }),
        prisma.district.create({ data: { name: 'Vizianagaram' } }),
        prisma.district.create({ data: { name: 'Visakhapatnam' } }),
        prisma.district.create({ data: { name: 'Anakapalli' } }),
        prisma.district.create({ data: { name: 'Alluri Sitharama Raju' } }),

        // Central Coastal & Godavari Region (12 districts)
        prisma.district.create({ data: { name: 'Kakinada' } }),
        prisma.district.create({ data: { name: 'East Godavari' } }),
        prisma.district.create({ data: { name: 'Konaseema' } }),
        prisma.district.create({ data: { name: 'West Godavari' } }),
        prisma.district.create({ data: { name: 'Eluru' } }),
        prisma.district.create({ data: { name: 'Krishna' } }),
        prisma.district.create({ data: { name: 'NTR' } }),
        prisma.district.create({ data: { name: 'Guntur' } }),
        prisma.district.create({ data: { name: 'Palnadu' } }),
        prisma.district.create({ data: { name: 'Bapatla' } }),
        prisma.district.create({ data: { name: 'Prakasam' } }),
        prisma.district.create({ data: { name: 'SPSR Nellore' } }),

        // Rayalaseema Region (8 districts)
        prisma.district.create({ data: { name: 'Kurnool' } }),
        prisma.district.create({ data: { name: 'Nandyal' } }),
        prisma.district.create({ data: { name: 'Anantapuramu' } }),
        prisma.district.create({ data: { name: 'Sri Sathya Sai' } }),
        prisma.district.create({ data: { name: 'YSR Kadapa' } }),
        prisma.district.create({ data: { name: 'Annamayya' } }),
        prisma.district.create({ data: { name: 'Chittoor' } }),
        prisma.district.create({ data: { name: 'Tirupati' } }),
    ]);
    console.log('✅ Created 26 districts');

    // Seed Constituencies (2-3 per district for ALL districts)
    const constituencies = [];

    // 0. Srikakulam - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Srikakulam Urban', districtId: districts[0].id } }),
        await prisma.constituency.create({ data: { name: 'Palasa', districtId: districts[0].id } })
    );

    // 1. Parvathipuram Manyam - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Parvathipuram', districtId: districts[1].id } }),
        await prisma.constituency.create({ data: { name: 'Salur', districtId: districts[1].id } })
    );

    // 2. Vizianagaram - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Vizianagaram Urban', districtId: districts[2].id } }),
        await prisma.constituency.create({ data: { name: 'Bobbili', districtId: districts[2].id } })
    );

    // 3. Visakhapatnam - 3 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Visakhapatnam North', districtId: districts[3].id } }),
        await prisma.constituency.create({ data: { name: 'Visakhapatnam South', districtId: districts[3].id } }),
        await prisma.constituency.create({ data: { name: 'Visakhapatnam East', districtId: districts[3].id } })
    );

    // 4. Anakapalli - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Anakapalli', districtId: districts[4].id } }),
        await prisma.constituency.create({ data: { name: 'Yelamanchili', districtId: districts[4].id } })
    );

    // 5. Alluri Sitharama Raju - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Paderu', districtId: districts[5].id } }),
        await prisma.constituency.create({ data: { name: 'Araku Valley', districtId: districts[5].id } })
    );

    // 6. Kakinada - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Kakinada City', districtId: districts[6].id } }),
        await prisma.constituency.create({ data: { name: 'Kakinada Rural', districtId: districts[6].id } })
    );

    // 7. East Godavari - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Rajahmundry City', districtId: districts[7].id } }),
        await prisma.constituency.create({ data: { name: 'Rajahmundry Rural', districtId: districts[7].id } })
    );

    // 8. Konaseema - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Amalapuram', districtId: districts[8].id } }),
        await prisma.constituency.create({ data: { name: 'Razole', districtId: districts[8].id } })
    );

    // 9. West Godavari - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Bhimavaram', districtId: districts[9].id } }),
        await prisma.constituency.create({ data: { name: 'Tadepalligudem', districtId: districts[9].id } })
    );

    // 10. Eluru - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Eluru City', districtId: districts[10].id } }),
        await prisma.constituency.create({ data: { name: 'Jangareddygudem', districtId: districts[10].id } })
    );

    // 11. Krishna - 3 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Vijayawada Central', districtId: districts[11].id } }),
        await prisma.constituency.create({ data: { name: 'Vijayawada West', districtId: districts[11].id } }),
        await prisma.constituency.create({ data: { name: 'Vijayawada East', districtId: districts[11].id } })
    );

    // 12. NTR - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Gannavaram', districtId: districts[12].id } }),
        await prisma.constituency.create({ data: { name: 'Mylavaram', districtId: districts[12].id } })
    );

    // 13. Guntur - 3 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Guntur East', districtId: districts[13].id } }),
        await prisma.constituency.create({ data: { name: 'Guntur West', districtId: districts[13].id } }),
        await prisma.constituency.create({ data: { name: 'Mangalagiri', districtId: districts[13].id } })
    );

    // 14. Palnadu - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Narasaraopet', districtId: districts[14].id } }),
        await prisma.constituency.create({ data: { name: 'Gurazala', districtId: districts[14].id } })
    );

    // 15. Bapatla - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Bapatla', districtId: districts[15].id } }),
        await prisma.constituency.create({ data: { name: 'Chirala', districtId: districts[15].id } })
    );

    // 16. Prakasam - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Ongole', districtId: districts[16].id } }),
        await prisma.constituency.create({ data: { name: 'Kandukur', districtId: districts[16].id } })
    );

    // 17. SPSR Nellore - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Nellore City', districtId: districts[17].id } }),
        await prisma.constituency.create({ data: { name: 'Nellore Rural', districtId: districts[17].id } })
    );

    // 18. Kurnool - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Kurnool City', districtId: districts[18].id } }),
        await prisma.constituency.create({ data: { name: 'Adoni', districtId: districts[18].id } })
    );

    // 19. Nandyal - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Nandyal Urban', districtId: districts[19].id } }),
        await prisma.constituency.create({ data: { name: 'Allagadda', districtId: districts[19].id } })
    );

    // 20. Anantapuramu - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Anantapur Urban', districtId: districts[20].id } }),
        await prisma.constituency.create({ data: { name: 'Hindupur', districtId: districts[20].id } })
    );

    // 21. Sri Sathya Sai - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Puttaparthi', districtId: districts[21].id } }),
        await prisma.constituency.create({ data: { name: 'Dharmavaram', districtId: districts[21].id } })
    );

    // 22. YSR Kadapa - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Kadapa City', districtId: districts[22].id } }),
        await prisma.constituency.create({ data: { name: 'Pulivendula', districtId: districts[22].id } })
    );

    // 23. Annamayya - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Rajampet', districtId: districts[23].id } }),
        await prisma.constituency.create({ data: { name: 'Rayachoti', districtId: districts[23].id } })
    );

    // 24. Chittoor - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Chittoor', districtId: districts[24].id } }),
        await prisma.constituency.create({ data: { name: 'Madanapalle', districtId: districts[24].id } })
    );

    // 25. Tirupati - 2 constituencies
    constituencies.push(
        await prisma.constituency.create({ data: { name: 'Tirupati Urban', districtId: districts[25].id } }),
        await prisma.constituency.create({ data: { name: 'Tirupati Rural', districtId: districts[25].id } })
    );

    console.log(`✅ Created ${constituencies.length} constituencies for all 26 districts`);

    // Seed Mandals (2 per constituency programmatically)
    const mandals = [];
    const mandalNamesMap: { [key: number]: string[] } = {
        0: ['Srikakulam Municipality', 'Etcherla'], // Srikakulam Urban
        1: ['Palasa Kasibugga', 'Mandasa'], // Palasa
        2: ['Parvathipuram', 'Kurupam'], // Parvathipuram
        3: ['Salur', 'Pachipenta'], // Salur
        4: ['Vizianagaram', 'Gajapathinagaram'], // Vizianagaram Urban
        5: ['Bobbili', 'Cheepurupalli'], // Bobbili
        6: ['Gajuwaka', 'Pedagantyada'], // Visakhapatnam North
        7: ['Duvvada', 'Sabbavaram'], // Visakhapatnam South
        8: ['Gopalapatnam', 'Anandapuram'], // Visakhapatnam East
        9: ['Anakapalli', 'Kasimkota'], // Anakapalli
        10: ['Yelamanchili', 'Payakaraopeta'], // Yelamanchili
        11: ['Paderu', 'Chintapalle'], // Paderu
        12: ['Araku Valley', 'Dumbriguda'], // Araku Valley
        13: ['Kakinada Urban', 'Kakinada Port'], // Kakinada City
        14: ['Pithapuram', 'Tuni'], // Kakinada Rural
        15: ['Rajahmundry Urban', 'Rajahmundry Rural'], // Rajahmundry City
        16: ['Kovvur', 'Nidadavolu'], // Rajahmundry Rural
        17: ['Amalapuram', 'Mummidivaram'], // Amalapuram
        18: ['Razole', 'Kothapeta'], // Razole
        19: ['Bhimavaram', 'Akividu'], // Bhimavaram
        20: ['Tadepalligudem', 'Tanuku'], // Tadepalligudem
        21: ['Eluru', 'Denduluru'], // Eluru City
        22: ['Jangareddygudem', 'Buttayagudem'], // Jangareddygudem
        23: ['Machavaram', 'Krishna Lanka'], // Vijayawada Central
        24: ['Bhavanipuram', 'Gunadala'], // Vijayawada West
        25: ['Patamata', 'Ajit Singh Nagar'], // Vijayawada East
        26: ['Gannavaram', 'Vuyyuru'], // Gannavaram
        27: ['Mylavaram', 'Nandigama'], // Mylavaram
        28: ['Ponnuru', 'Amaravati'], // Guntur East
        29: ['Tenali', 'Repalle'], // Guntur West
        30: ['Mangalagiri', 'Tadikonda'], // Mangalagiri
        31: ['Narasaraopet', 'Sattenapalle'], // Narasaraopet - PALNADU
        32: ['Gurazala', 'Macherla'], // Gurazala - PALNADU
        33: ['Bapatla', 'Parchur'], // Bapatla
        34: ['Chirala', 'Vetapalem'], // Chirala
        35: ['Ongole', 'Markapur'], // Ongole
        36: ['Kandukur', 'Kanigiri'], // Kandukur
        37: ['Nellore Urban', 'Kavali'], // Nellore City
        38: ['Gudur', 'Sullurpeta'], // Nellore Rural
        39: ['Kurnool Urban', 'Yemmiganur'], // Kurnool City
        40: ['Adoni', 'Alur'], // Adoni
        41: ['Nandyal', 'Banaganapalle'], // Nandyal Urban
        42: ['Allagadda', 'Koilakuntla'], // Allagadda
        43: ['Anantapur', 'Tadipatri'], // Anantapur Urban
        44: ['Hindupur', 'Penukonda'], // Hindupur
        45: ['Puttaparthi', 'Bukkapatnam'], // Puttaparthi
        46: ['Dharmavaram', 'Guntakal'], // Dharmavaram
        47: ['Kadapa', 'Badvel'], // Kadapa City
        48: ['Pulivendula', 'Jammalamadugu'], // Pulivendula
        49: ['Rajampet', 'Kamalapuram'], // Rajampet
        50: ['Rayachoti', 'Lakkireddipalli'], // Rayachoti
        51: ['Chittoor', 'Piler'], // Chittoor
        52: ['Madanapalle', 'Punganur'], // Madanapalle
        53: ['Tirupati Urban', 'Renigunta'], // Tirupati Urban
        54: ['Chandragiri', 'Puttur'], // Tirupati Rural
    };

    for (let i = 0; i < constituencies.length; i++) {
        const mandalNames = mandalNamesMap[i] || [`Mandal ${i * 2 + 1}`, `Mandal ${i * 2 + 2}`];
        for (const mandalName of mandalNames) {
            mandals.push(
                await prisma.mandal.create({
                    data: { name: mandalName, constituencyId: constituencies[i].id }
                })
            );
        }
    }

    console.log(`✅ Created ${mandals.length} mandals`);

    // Create Super Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const superAdmin = await prisma.user.create({
        data: {
            phone: '9999999999',
            password: hashedPassword,
            role: UserRole.SUPER_ADMIN,
        },
    });
    console.log('✅ Created Super Admin');

    // Create Mandal Officers (one for each region)
    const mandalOfficer1 = await prisma.user.create({
        data: {
            phone: '9111111111',
            password: await bcrypt.hash('mandal123', 10),
            role: UserRole.MANDAL_OFFICER,
            assignedMandalId: mandals[4].id, // Gajuwaka
            assignedConstituencyId: constituencies[2].id, // Visakhapatnam North
            assignedDistrictId: districts[3].id, // Visakhapatnam
        },
    });

    const mandalOfficer2 = await prisma.user.create({
        data: {
            phone: '9222222222',
            password: await bcrypt.hash('mandal123', 10),
            role: UserRole.MANDAL_OFFICER,
            assignedMandalId: mandals[15].id, // Machavaram
            assignedConstituencyId: constituencies[7].id, // Vijayawada Central
            assignedDistrictId: districts[11].id, // Krishna
        },
    });

    const mandalOfficer3 = await prisma.user.create({
        data: {
            phone: '9333333333',
            password: await bcrypt.hash('mandal123', 10),
            role: UserRole.MANDAL_OFFICER,
            assignedMandalId: mandals[27].id, // Amaravati
            assignedConstituencyId: constituencies[12].id, // Guntur East
            assignedDistrictId: districts[13].id, // Guntur
        },
    });

    console.log('✅ Created Mandal Officers');

    // Create District Officers (one for each region)
    const districtOfficer1 = await prisma.user.create({
        data: {
            phone: '9444444444',
            password: await bcrypt.hash('district123', 10),
            role: UserRole.DISTRICT_OFFICER,
            assignedDistrictId: districts[3].id, // Visakhapatnam
        },
    });

    const districtOfficer2 = await prisma.user.create({
        data: {
            phone: '9555555555',
            password: await bcrypt.hash('district123', 10),
            role: UserRole.DISTRICT_OFFICER,
            assignedDistrictId: districts[11].id, // Krishna
        },
    });

    const districtOfficer3 = await prisma.user.create({
        data: {
            phone: '9666666666',
            password: await bcrypt.hash('district123', 10),
            role: UserRole.DISTRICT_OFFICER,
            assignedDistrictId: districts[13].id, // Guntur
        },
    });

    const districtOfficer4 = await prisma.user.create({
        data: {
            phone: '9777777777',
            password: await bcrypt.hash('district123', 10),
            role: UserRole.DISTRICT_OFFICER,
            assignedDistrictId: districts[25].id, // Tirupati
        },
    });

    console.log('✅ Created District Officers');

    // Create State Officers
    const stateOfficer1 = await prisma.user.create({
        data: {
            phone: '9888888888',
            password: await bcrypt.hash('state123', 10),
            role: UserRole.STATE_OFFICER,
        },
    });

    const stateOfficer2 = await prisma.user.create({
        data: {
            phone: '9999999998',
            password: await bcrypt.hash('state123', 10),
            role: UserRole.STATE_OFFICER,
        },
    });

    console.log('✅ Created State Officers');

    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('📋 Test Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Super Admin      : 9999999999 / admin123');
    console.log('Mandal Officer 1 : 9111111111 / mandal123 (Gajuwaka, Visakhapatnam)');
    console.log('Mandal Officer 2 : 9222222222 / mandal123 (Machavaram, Krishna)');
    console.log('Mandal Officer 3 : 9333333333 / mandal123 (Amaravati, Guntur)');
    console.log('District Officer 1: 9444444444 / district123 (Visakhapatnam)');
    console.log('District Officer 2: 9555555555 / district123 (Krishna)');
    console.log('District Officer 3: 9666666666 / district123 (Guntur)');
    console.log('District Officer 4: 9777777777 / district123 (Tirupati)');
    console.log('State Officer 1  : 9888888888 / state123');
    console.log('State Officer 2  : 9999999998 / state123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Database Summary:');
    console.log(`   • Districts: 26 (All AP districts)`);
    console.log(`   • Constituencies: 23`);
    console.log(`   • Mandals: 60+`);
    console.log(`   • Party Roles: 10`);
    console.log(`   • Test Users: 11\n`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
