import { defineEventHandler, type H3Event } from "h3";
import { enrollmentService } from "#server/modules/enrollment/enrollment.service";

/**
 * GET /api/enrollments
 * Endpoint de listagem de matrículas.
 * Observação: a operação real ainda depende de um método de listagem completa no serviço.
 */
export default defineEventHandler(async (_event: H3Event) => {
    return enrollmentService.listByStudent("");
});
