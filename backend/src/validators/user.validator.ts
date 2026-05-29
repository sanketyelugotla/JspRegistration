import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        role: z.enum(['MANDAL_OFFICER', 'DISTRICT_OFFICER', 'STATE_OFFICER']),
        assignedDistrictId: z.string().uuid().optional(),
        assignedConstituencyId: z.string().uuid().optional(),
        assignedMandalId: z.string().uuid().optional(),
    }).refine((data) => {
        // Mandal officer must have assignedMandalId
        if (data.role === 'MANDAL_OFFICER' && !data.assignedMandalId) {
            return false;
        }
        // District officer must have assignedDistrictId
        if (data.role === 'DISTRICT_OFFICER' && !data.assignedDistrictId) {
            return false;
        }
        return true;
    }, {
        message: 'Officer must be assigned to appropriate location'
    })
});

export const updateUserSchema = z.object({
    body: z.object({
        password: z.string().min(6).optional(),
        assignedDistrictId: z.string().uuid().optional(),
        assignedConstituencyId: z.string().uuid().optional(),
        assignedMandalId: z.string().uuid().optional(),
    })
});
