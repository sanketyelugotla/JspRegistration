import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { AuthRequest } from '../types/auth.types';

export class UserController {
    private userService = new UserService();

    createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { phone, password, role, assignedDistrictId, assignedConstituencyId, assignedMandalId } = req.body;

            const user = await this.userService.createUser({
                phone,
                password,
                role,
                assignedDistrictId,
                assignedConstituencyId,
                assignedMandalId
            });

            successResponse(res, user, 'User created successfully', 201);
        } catch (error) {
            next(error);
        }
    };

    getAllUsers = async (_req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const users = await this.userService.getAllUsers();
            successResponse(res, users, 'Users retrieved successfully');
        } catch (error) {
            next(error);
        }
    };

    getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);

            if (!user) {
                errorResponse(res, 'User not found', 404);
                return;
            }

            successResponse(res, user, 'User retrieved successfully');
        } catch (error) {
            next(error);
        }
    };

    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { password, assignedDistrictId, assignedConstituencyId, assignedMandalId } = req.body;

            const user = await this.userService.updateUser(id, {
                password,
                assignedDistrictId,
                assignedConstituencyId,
                assignedMandalId
            });

            successResponse(res, user, 'User updated successfully');
        } catch (error) {
            next(error);
        }
    };

    deactivateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await this.userService.deactivateUser(id);
            successResponse(res, null, 'User deactivated successfully');
        } catch (error) {
            next(error);
        }
    };
}
