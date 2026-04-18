import type {
  ApiSuccessMessage,
  BillingActionInput,
  LateCharge,
} from "../types/api";

export const useBilling = () => {
  const api = useApiClient();

  return {
    listLateCharges: () => api.get<LateCharge[]>("/api/billing/late"),
    execute: (payload: BillingActionInput) =>
      api.post<ApiSuccessMessage>("/api/billing", payload),
  };
};
