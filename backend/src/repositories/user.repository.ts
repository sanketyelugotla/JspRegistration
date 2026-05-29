import prisma from '../config/database.config';
import { UserRole } from '@prisma/client';

interface CreateUserData {
    phone: string;
    password: string;
    role: UserRole;
    assignedDistrictId?: string;
    assignedConstituencyId?: string;
    assignedMandalId?: string;
}

export class UserRepository {
    async create(data: CreateUserData) {
        return prisma.user.create({
            data: {
                phone: data.phone,
                password: data.password,
                role: data.role,
                assignedDistrictId: data.assignedDistrictId,
                assignedConstituencyId: data.assignedConstituencyId,
                assignedMandalId: data.assignedMandalId
            },
            include: {
                assignedDistrict: true,
                assignedConstituency: true,
                assignedMandal: true
            }
        });
    }

    async findAll() {
        return prisma.user.findMany({
            include: {
                assignedDistrict: true,
                assignedConstituency: true,
                assignedMandal: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            include: {
                assignedDistrict: true,
                assignedConstituency: true,
                assignedMandal: true
            }
        });
    }

    async findByPhone(phone: string) {
        return prisma.user.findUnique({
            where: { phone }
        });
    }

    async update(id: string, data: Partial<CreateUserData>) {
        return prisma.user.update({
            where: { id },
            data,
            include: {
                assignedDistrict: true,
                assignedConstituency: true,
                assignedMandal: true
            }
        });
    }

    async delete(id: string) {
        return prisma.user.delete({
            where: { id }
        });
    }
}
