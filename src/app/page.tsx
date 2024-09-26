import { PAGE_SIZE } from "@/helper/constants";
import {
  getAllPokemonDetails,
  getPokemons,
  getPokemonTypes,
} from "@/helper/pokemon";
import Image from "next/image";
import Link from "next/link";

export default async function Home(props: PageProps) {
  const { searchParams } = props;
  const offset = searchParams.offset ?? "0";
  const types: string[] = searchParams.types
    ? searchParams.types.split(",")
    : [];

  const pokemonTypes = await getPokemonTypes();

  // remove non-existen type
  const existedTypes = pokemonTypes.results.filter((i) =>
    types.includes(i.name)
  );
  const typeUrls = existedTypes.map((i) => i.url); // get url only

  const pokemons = await getPokemons({
    offset,
    typeUrls,
  });
  const pokemonDetails: IPokemon[] = await getAllPokemonDetails(pokemons);

  const total = pokemons?.count ?? 0;

  // calculate pagination
  const prevPageOffset = +offset - PAGE_SIZE;
  const nextPageOffset = Math.min(+offset + PAGE_SIZE, total);

  const hasNext = nextPageOffset < total;
  const hasPrev = prevPageOffset >= 0;

  const disabledLinkClassName =
    "opacity-40 cursor-not-allowed pointer-events-none";
  const prevClassName = !hasPrev ? disabledLinkClassName : "";
  const nextClassName = !hasNext ? disabledLinkClassName : "";

  const typesName = existedTypes.map((i) => i.name).join(",");
  const nextLink = typesName
    ? `?types=${typesName}&offset=${nextPageOffset}`
    : `?offset=${nextPageOffset}`;
  const prevLink = typesName
    ? `?types=${typesName}&offset=${prevPageOffset}`
    : `?offset=${prevPageOffset}`;

  const selectedClassName = "!text-white !bg-red-900";
  const hidden = "hidden";
  return (
    <main>
      <div className="mx-auto max-w-screen-xl">
        <div className="flex items-center mx-4 my-4">
          <div className="mr-2 my-4 font-bold self-start">Types:</div>
          <div className="flex flex-wrap">
            {pokemonTypes && pokemonTypes.results
              ? pokemonTypes.results.map((i) => {
                  const isSelected = types.includes(i.name);
                  const params = new URLSearchParams();
                  const newTypes = isSelected
                    ? types.filter((name: string) => name !== i.name)
                    : [...types, i.name];
                  if (newTypes.length) {
                    params.set("types", newTypes.join(","));
                  } else {
                    params.delete("types");
                  }
                  return (
                    <Link
                      href={`/?${params}`}
                      key={i.name}
                      className={`px-2 py-2 mx-2 my-2 border-red-900 border-2 rounded-md font-bold text-red-900 ${
                        isSelected ? selectedClassName : ""
                      }`}
                    >
                      {i.name}
                    </Link>
                  );
                })
              : null}
          </div>
        </div>
        <div className={`my-12 mx-4 font-bold ${total > 0 ? "" : hidden}`}>
          {total} results found.
        </div>
      </div>
      {pokemonDetails.length ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {pokemonDetails.map((pokemon) => {
            const src = pokemon.sprites.other["official-artwork"].front_default;
            return (
              <div key={pokemon.name}>
                <div className="h-24 w-24 mx-auto">
                  {src ? (
                    <Image
                      src={src}
                      alt={pokemon.name}
                      title={pokemon.name}
                      width="100"
                      height="100"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded flex justify-center items-center text-xs">Not Found</div>
                  )}
                </div>
                <div className="text-center">{pokemon.name}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-3xl mx-auto my-24 font-bold">
          No results found.
        </div>
      )}
      <div className="mt-8 flex justify-center">
        {/* <Link
          href="/"
          className="p-2 bg-red-900 rounded-md text-white mr-4"
        >
          First
        </Link> */}
        <Link
          href={prevLink}
          className={`p-2 bg-red-900 rounded-md text-white mr-4 ${prevClassName}`}
        >
          Prev
        </Link>
        <Link
          href={nextLink}
          className={`p-2 bg-red-900 rounded-md text-white mr-4 ${nextClassName}`}
        >
          Next
        </Link>
      </div>
    </main>
  );
}
