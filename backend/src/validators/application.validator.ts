import { z } from 'zod';

export const createApplicationSchema = z.object({
    body: z.object({
        jspId: z.string().min(1, 'JSP ID is required'),
        fullName: z.string().min(1, 'Full name is required'),
        districtId: z.string().uuid('Invalid district ID'),
        constituencyId: z.string().uuid('Invalid constituency ID'),
        mandalId: z.string().uuid('Invalid mandal ID'),
        villageWard: z.string().min(1, 'Village/Ward is required'),
        pollingBooth: z.string().min(1, 'Polling booth is required'),
        shortDescription: z.string().optional(),
        rolePreferences: z.object({
            preferredRole1Id: z.string().uuid().optional(),
            preferredRole2Id: z.string().uuid().optional(),
            preferredRole3Id: z.string().uuid().optional(),
            flexibilityAgreed: z.boolean(),
        }).optional(),
    }),
});

export const updateApplicationSchema = z.object({
    body: z.object({
        jspId: z.string().min(1).optional(),
        fullName: z.string().min(1).optional(),
        districtId: z.string().uuid().optional(),
        constituencyId: z.string().uuid().optional(),
        mandalId: z.string().uuid().optional(),
        villageWard: z.string().min(1).optional(),
        pollingBooth: z.string().min(1).optional(),
        shortDescription: z.string().optional(),
        rolePreferences: z.object({
            preferredRole1Id: z.string().uuid().optional(),
            preferredRole2Id: z.string().uuid().optional(),
            preferredRole3Id: z.string().uuid().optional(),
            flexibilityAgreed: z.boolean(),
        }).optional(),
    }),
});

export const approveApplicationSchema = z.object({
    body: z.object({
        remarks: z.string().max(1000).optional(),
    }).optional(),
});
