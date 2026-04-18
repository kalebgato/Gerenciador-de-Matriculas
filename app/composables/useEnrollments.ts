import type {
  Enrollment,
  EnrollmentCreateInput,
  EnrollmentWithRelations,
  EnrollmentWithTeam,
  EntityId,
} from "../types/api";

export const useEnrollments = () => {
  const api = useApiClient();

  return {
    list: () => api.get<EnrollmentWithRelations[]>("/api/enrollments"),
    getById: (id: EntityId) => api.get<EnrollmentWithRelations>(`/api/enrollments/${id}`),
    listByStudent: (studentId: EntityId) =>
      api.get<EnrollmentWithTeam[]>(`/api/enrollments/student/${studentId}`),
    create: (payload: EnrollmentCreateInput) =>
      api.post<Enrollment>("/api/enrollments", payload),
  };
};
