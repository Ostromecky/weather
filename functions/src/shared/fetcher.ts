//TODO - refactor to composable function

export const fetcher = async <T>(url: string): Promise<T> => {
  return await fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  });
}
