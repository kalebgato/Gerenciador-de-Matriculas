import type {
  ApiSuccessMessage,
  Course,
  CourseCreateInput,
  CourseUpdateInput,
  CourseWithTeams,
  EntityId,
} from "../types/api";

export const useCourses = () => {
  const api = useApiClient();

  return {
    list: () => api.get<CourseWithTeams[]>("/api/courses"),
    getById: (id: EntityId) => api.get<CourseWithTeams>(`/api/courses/${id}`),
    create: (payload: CourseCreateInput) => api.post<Course>("/api/courses", payload),
    update: (id: EntityId, payload: CourseUpdateInput) =>
      api.put<Course>(`/api/courses/${id}`, payload),
    remove: (id: EntityId) => api.delete<ApiSuccessMessage>(`/api/courses/${id}`),
  };
};
