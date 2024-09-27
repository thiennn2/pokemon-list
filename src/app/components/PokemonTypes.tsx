import Link from "next/link";

interface IPokemonTypesProps {
  types: IResponseType;
  selectedTypes: string[];
}

export default function PokemonTypes(props: IPokemonTypesProps) {
  const { types, selectedTypes } = props;
  const selectedClassName = "!text-white !bg-red-900";
  if (types && types.results?.length) {
    return types.results.map((i) => {
      const isSelected = selectedTypes.includes(i.name);
      const params = new URLSearchParams();
      const newTypes = isSelected
        ? selectedTypes.filter((name: string) => name !== i.name)
        : [...selectedTypes, i.name];
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
    });
  }
  return null;
}
