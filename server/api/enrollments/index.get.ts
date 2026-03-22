import { enrollmentService } from "#server/modules/enrollment/enrollment.service";

export default defineEventHandler(async (event) => {
        // Lista todas as matrículas (pode ser ajustado para limitar ou paginar)
        // Aqui usamos listByStudent se quiser filtrar depois
        return enrollmentService.listByStudent(""); // passando "" só como placeholder
});
