import { getAPIClient } from "@/_services/apiClient";
import { validateVagaId } from "@/_validations/vagas";


export async function publishVaga(id: string) {
  const data = validateVagaId.parse({ id });

  const response = await getAPIClient().patch(
    `/vagas/${data.id}/publish`
  );

  return response.data;
}
