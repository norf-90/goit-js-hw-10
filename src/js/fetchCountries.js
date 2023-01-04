function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(responce => {
    if (!responce.ok) {
      throw new Error(
        `Something goes wrong. Responce status: ${responce.status}!`
      );
    }
    return responce.json();
  });
}

export { fetchCountries };
