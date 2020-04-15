import { callApi } from './api';

export async function createGame(options) {
  return callApi('/register/create', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });
}

export async function checkCode(gameCode) {
  return callApi(`/register/checkcode?gameCode=${gameCode}`);
}

export async function checkName(name, gameCode) {
  if (gameCode !== undefined) {
    return callApi(`/register/checkname?gameCode=${gameCode}&name=${name}`);
  } else {
    return callApi(`/register/checkname?name=${name}`);
  }
}
