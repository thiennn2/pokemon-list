import Image from "next/image";

interface IPokemonListProps {
  pokemonDetails: IPokemon[];
}

export default function PokemonList(props: IPokemonListProps) {
  const { pokemonDetails } = props;
  if (pokemonDetails.length) {
    return (
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
                  <div className="w-full h-full bg-gray-100 rounded flex justify-center items-center text-xs">
                    Not Found
                  </div>
                )}
              </div>
              <div className="text-center">{pokemon.name}</div>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div className="text-center text-3xl mx-auto my-24 font-bold">
      No results found.
    </div>
  );
}