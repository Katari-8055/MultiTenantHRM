import { asyncHandler } from "../utils/AsyncHandler.js";
import prisma from "../utils/client.js";

//-----------------------------------------------------get Leave Requeste-----------------------------------------------------//

export const getHRLeaves = asyncHandler(async (req, res) => {
    const { tenentId } = req;

    const leave = await prisma.leave.findMany({
        where: {
            tenentId: tenentId
        },
        include: {
            employee: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true
                }
            }
        }
    });

    res.status(200).json({
        success: true,
        leave
    });
});
