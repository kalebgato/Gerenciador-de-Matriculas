import { enrollmentService } from "#server/modules/enrollment/enrollment.service";

export default defineEventHandler(async (event) => {
        return enrollmentService.listAll();
});
