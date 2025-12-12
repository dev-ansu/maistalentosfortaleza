import { getAPIClient } from "@/_services/apiClient";

export async function canAccess(ctx: any, required: string | string[]) {
  const api = getAPIClient(ctx);

  try {
    const resources = Array.isArray(required) ? required : [required];

    await api.get("/admin/check/permission", {
      params: { "resource[]": resources }
    });

    return true;

  } catch (err: any) {
    // Qualquer código diferente de 200 => não autorizado
    return false;
  }
}