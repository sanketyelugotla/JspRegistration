import prisma from '../config/database.config';

export class PartyRoleRepository {
    async getAllActiveRoles() {
        return prisma.partyRole.findMany({
            where: { active: true },
            orderBy: { name: 'asc' },
        });
    }

    async getAllRoles() {
        return prisma.partyRole.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async getRoleById(id: string) {
        return prisma.partyRole.findUnique({ where: { id } });
    }

    async createRole(name: string) {
        return prisma.partyRole.create({
            data: { name, active: true },
        });
    }

    async updateRole(id: string, name: string, active: boolean) {
        return prisma.partyRole.update({
            where: { id },
            data: { name, active },
        });
    }

    async deleteRole(id: string) {
        return prisma.partyRole.delete({ where: { id } });
    }
}
