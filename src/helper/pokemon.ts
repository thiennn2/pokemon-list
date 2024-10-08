import { BASE_URL, PAGE_SIZE } from "./constants";

export async function getPokemons(
  params?: PaginationParams & { typeUrls?: string[] }
) {
  const { offset = 0, typeUrls = [] } = params ?? {};
  if (typeUrls.length) {
    const data = await Promise.all(
      typeUrls.map((url) =>
        fetch(url)
          .then((i) => i.json())
          .then((p) => p.pokemon)
          .catch((e) => console.log('[Error] fetch type: ', url, e))
      )
    );
    if (!data) return {
      success: false,
      count: 0,
      results: [],
    }
    const isOnlyOneFilter = 1 === typeUrls.length;

    const counter: { [key: string]: number } = {};
    const filteredData = [];
    for (let i = 0; i < data.length; i += 1) {
      const pokemons = data[i];
      for (let j = 0; j < pokemons.length; j += 1) {
        const pokemon = pokemons[j].pokemon;
        if (isOnlyOneFilter) {
          filteredData.push(pokemon);
          continue;
        }
        if (counter[pokemon.name]) {
          counter[pokemon.name] += 1;
        } else {
          counter[pokemon.name] = 1;
        }
        const isOverGap = counter[pokemon.name] === typeUrls.length;
        if (isOverGap) {
          filteredData.push(pokemon);
        }
      }
    }

    const limit = PAGE_SIZE + +offset;
    return {
      success: true,
      count: filteredData.length,
      results: filteredData.slice(+offset, limit),
    };
  }
  const searchParams = new URLSearchParams({
    offset: offset.toString(),
    limit: `${PAGE_SIZE}`,
  });
  const url = `${BASE_URL}/pokemon?${searchParams}`;
  try {
    const data = await fetch(url);
    const pokemons: IResponsePokemon = await data.json();
    return {
      success: true,
      ...pokemons
    };
  } catch (error) {
    console.log('Error: ', error);
    return {
      success: false,
      count: 0,
      results: [],
    }
  }
}

export async function getPokemonTypes() {
  const url = `${BASE_URL}/type?offset=0&limit=${PAGE_SIZE}`;
  try {
    const data = await fetch(url);
    const types: IResponseType = await data.json();
    return {
      success: true,
      ...types,
    };
  } catch (error) {
    console.log('[Error] ', url, error)
    return {
      success: false, 
      count: 0,
      results: [],
    }
  }
}

export function getAllPokemonDetails(pokemons: IResponsePokemon) {
  return Promise.all(
    pokemons.results.map((i) => fetch(i.url).then((i) => i.json()))
  );
}
