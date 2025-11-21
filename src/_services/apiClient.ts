import { setupAPIClient } from "./api";

let api = setupAPIClient();

export function getAPIClient(ctx?: any) {
  return setupAPIClient(ctx);
}

export function refreshAPIClient() {
  api = setupAPIClient(); // recria a instância com novo token
}