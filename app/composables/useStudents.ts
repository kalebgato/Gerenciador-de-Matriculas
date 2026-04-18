import type {
  ApiSuccessMessage,
  EntityId,
  Student,
  StudentCreateInput,
  StudentUpdateInput,
} from "../types/api";

export const useStudents = () => {
  const api = useApiClient();

  return {
    list: () => api.get<Student[]>("/api/students"),
    getById: (id: EntityId) => api.get<Student>(`/api/students/${id}`),
    create: (payload: StudentCreateInput) => api.post<Student>("/api/students", payload),
    update: (id: EntityId, payload: StudentUpdateInput) =>
      api.put<Student>(`/api/students/${id}`, payload),
    remove: (id: EntityId) => api.delete<ApiSuccessMessage>(`/api/students/${id}`),
  };
};
