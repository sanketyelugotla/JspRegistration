import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createUserSchema } from '../validators/user.validator';
import { auditLog } from '../middlewares/audit.middleware';

const router = Router();
const userController = new UserController();

// All routes require authentication and admin/super_admin role
router.use(authenticate);
router.use(authorize(['SUPER_ADMIN', 'STATE_OFFICER']));

// Create officer users (Mandal, District, State)
router.post(
    '/',
    validate(createUserSchema),
    auditLog('CREATE_USER', 'User'),
    userController.createUser
);

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user
router.put(
    '/:id',
    auditLog('UPDATE_USER', 'User'),
    userController.updateUser
);

// Deactivate user
router.delete(
    '/:id',
    auditLog('DEACTIVATE_USER', 'User'),
    userController.deactivateUser
);

export default router;
