import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcryptjs';

interface CreateUserData {
    phone: string;
    password: string;
    role: 'MANDAL_OFFICER' | 'DISTRICT_OFFICER' | 'STATE_OFFICER';
    assignedDistrictId?: string;
    assignedConstituencyId?: string;
    assignedMandalId?: string;
}

interface UpdateUserData {
    password?: string;
    assignedDistrictId?: string;
    assignedConstituencyId?: string;
    assignedMandalId?: string;
}

export class UserService {
    private userRepository = new UserRepository();

    async createUser(data: CreateUserData) {
        // Check if user already exists
        const existingUser = await this.userRepository.findByPhone(data.phone);
        if (existingUser) {
            throw new Error('User with this phone number already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create user
        const user = await this.userRepository.create({
            phone: data.phone,
            password: hashedPassword,
            role: data.role,
            assignedDistrictId: data.assignedDistrictId,
            assignedConstituencyId: data.assignedConstituencyId,
            assignedMandalId: data.assignedMandalId
        });

        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll();
        return users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }

    async getUserById(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) return null;

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async updateUser(id: string, data: UpdateUserData) {
        const updateData: any = {
            assignedDistrictId: data.assignedDistrictId,
            assignedConstituencyId: data.assignedConstituencyId,
            assignedMandalId: data.assignedMandalId
        };

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        const user = await this.userRepository.update(id, updateData);
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async deactivateUser(id: string) {
        // For now, we'll just delete. Later can implement soft delete
        await this.userRepository.delete(id);
    }
}
