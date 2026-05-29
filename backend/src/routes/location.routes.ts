import { Router } from 'express';
import { LocationRepository } from '../repositories/location.repository';
import { successResponse, errorResponse } from '../utils/response.util';
import { Request, Response } from 'express';

const router = Router();
const locationRepository = new LocationRepository();

router.get('/districts', async (req: Request, res: Response) => {
    try {
        const districts = await locationRepository.getAllDistricts();
        return successResponse(res, districts, 'Districts fetched successfully');
    } catch (error: any) {
        return errorResponse(res, error.message || 'Failed to fetch districts', 500);
    }
});

router.get('/constituencies', async (req: Request, res: Response) => {
    try {
        const { districtId } = req.query;

        if (!districtId || typeof districtId !== 'string') {
            return errorResponse(res, 'District ID is required', 400);
        }

        const constituencies = await locationRepository.getConstituenciesByDistrict(districtId);
        return successResponse(res, constituencies, 'Constituencies fetched successfully');
    } catch (error: any) {
        return errorResponse(res, error.message || 'Failed to fetch constituencies', 500);
    }
});

router.get('/mandals', async (req: Request, res: Response) => {
    try {
        const { constituencyId } = req.query;

        if (!constituencyId || typeof constituencyId !== 'string') {
            return errorResponse(res, 'Constituency ID is required', 400);
        }

        const mandals = await locationRepository.getMandalsByConstituency(constituencyId);
        return successResponse(res, mandals, 'Mandals fetched successfully');
    } catch (error: any) {
        return errorResponse(res, error.message || 'Failed to fetch mandals', 500);
    }
});

export default router;
