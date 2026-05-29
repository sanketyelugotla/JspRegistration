import prisma from '../config/database.config';

export class LocationRepository {
    async getAllDistricts() {
        return prisma.district.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async getConstituenciesByDistrict(districtId: string) {
        return prisma.constituency.findMany({
            where: { districtId },
            orderBy: { name: 'asc' },
        });
    }

    async getMandalsByConstituency(constituencyId: string) {
        return prisma.mandal.findMany({
            where: { constituencyId },
            orderBy: { name: 'asc' },
        });
    }

    async getDistrictById(id: string) {
        return prisma.district.findUnique({ where: { id } });
    }

    async getConstituencyById(id: string) {
        return prisma.constituency.findUnique({
            where: { id },
            include: { district: true },
        });
    }

    async getMandalById(id: string) {
        return prisma.mandal.findUnique({
            where: { id },
            include: {
                constituency: {
                    include: { district: true },
                },
            },
        });
    }
}
