export async function callApi(path, data) {
  const response = await fetch(path, data);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
};
