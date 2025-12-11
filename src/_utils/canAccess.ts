import { getAPIClient } from "@/_services/apiClient";

export async function canAccess(ctx: any, required: string | string[]) {
  const api = getAPIClient(ctx);

  try {
    await api.get("/admin/check/permission", {
      params: { resource: required }
    });

    return true;
    
  } catch {
    
    return false;
  
  }
}