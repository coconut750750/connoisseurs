import { callApi } from './api';

export async function getSets() {
  return callApi('/game/sets');
}
