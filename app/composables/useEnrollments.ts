import type {
  Enrollment,
  EnrollmentCreateInput,
  EnrollmentUpdateInput,
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
    update: (id: EntityId, payload: EnrollmentUpdateInput) =>
      api.put<Enrollment>(`/api/enrollments/${id}`, payload),
    remove: (id: EntityId) => api.delete<{ message: string }>(`/api/enrollments/${id}`),
  };
};
