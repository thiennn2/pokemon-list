interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string };
}

interface PaginationParams {
  offset: string;
}

interface IPokemon {
  name: string;
  sprites: {
    other: {
      ["official-artwork"]: {
        front_default: string;
      };
    };
  };
}

interface IResponseType {
  count: number;
  results: { name: string; url: string }[];
}

interface IResponsePokemon {
  count: number;
  results: {
    name: string;
    url: string;
  }[];
}
