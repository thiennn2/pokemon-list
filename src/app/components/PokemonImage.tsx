"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface IPropsPokemonImage {
  name: string;
  url: string;
}

export default function PokemonImage(props: IPropsPokemonImage) {
  const [loading, setLoading] = useState(false);
  const { url, name } = props;
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (url) {
      setLoading(true);
      fetch(url)
        .then((res) => res.json())
        .then((pokemon) => {
          const imgUrl =
            pokemon.sprites.other["official-artwork"].front_default;
          setSrc(imgUrl);
        })
        .catch((error) => {
          console.error("[Error] PokemonImage: ", name, url, error);
        })
        .finally(() => {
          setTimeout(() => setLoading(false), 300);
        });
    }
  }, [url]);

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        title={name}
        width="100"
        height="100"
        loading="lazy"
      />
    );
  }
  return (
    <div className="w-full h-full bg-gray-100 rounded flex justify-center items-center text-xs">
      {loading ? '...loading' : 'Not Found'}
    </div>
  );
}
