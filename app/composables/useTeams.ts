import type {
  ApiSuccessMessage,
  EntityId,
  Team,
  TeamCreateInput,
  TeamUpdateInput,
  TeamWithCourse,
} from "../types/api";

export const useTeams = () => {
  const api = useApiClient();

  return {
    list: (courseId?: EntityId) =>
      api.get<TeamWithCourse[]>("/api/teams", courseId ? { course_id: courseId } : undefined),
    getById: (id: EntityId) => api.get<TeamWithCourse>(`/api/teams/${id}`),
    create: (payload: TeamCreateInput) => api.post<Team>("/api/teams", payload),
    update: (id: EntityId, payload: TeamUpdateInput) =>
      api.put<Team>(`/api/teams/${id}`, payload),
    remove: (id: EntityId) => api.delete<ApiSuccessMessage>(`/api/teams/${id}`),
  };
};
