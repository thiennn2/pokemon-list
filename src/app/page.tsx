import { PAGE_SIZE } from "@/helper/constants";
import {
  getAllPokemonDetails,
  getPokemons,
  getPokemonTypes,
} from "@/helper/pokemon";
import Link from "next/link";
import PokemonTypes from "./components/PokemonTypes";
import PokemonList from "./components/PokemonList";

export default async function Home(props: PageProps) {
  const { searchParams } = props;
  const offset = searchParams.offset ?? "0";
  const selectedTypes: string[] = searchParams.types
    ? searchParams.types.split(",")
    : [];

  const pokemonTypes = await getPokemonTypes();

  // remove non-existen type
  const existedTypes = pokemonTypes.results.filter((i) =>
    selectedTypes.includes(i.name)
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

  const hidden = "hidden";
  return (
    <main>
      <div className="mx-auto max-w-screen-xl">
        <div className="flex items-center mx-4 my-4">
          <div className="mr-2 my-4 font-bold self-start">Types:</div>
          <div className="flex flex-wrap">
            <PokemonTypes types={pokemonTypes} selectedTypes={selectedTypes} />
          </div>
        </div>
        <div className={`my-12 mx-4 font-bold ${total > 0 ? "" : hidden}`}>
          {total} results found.
        </div>
      </div>
      <PokemonList pokemonDetails={pokemonDetails} />
      <div className="mt-8 flex justify-center">
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
