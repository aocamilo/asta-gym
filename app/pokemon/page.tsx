import Image from "next/image";
import { Metadata } from "next";

interface PokemonListItem {
  name: string;
  url: string;
}

async function getPokemons(): Promise<PokemonListItem[]> {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  return data.results;
}

export const metadata: Metadata = {
  title: "Pokemon Page",
};

export default async function PokemonPage() {
  const pokemons = await getPokemons();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Choose your Pokémon!
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {pokemons.map((pokemon: PokemonListItem, index: number) => {
          const pokemonId =
            pokemon.url.split("/")[pokemon.url.split("/").length - 2];
          return (
            <div
              key={index}
              className="bg-white shadow-xl rounded-lg p-5 border border-gray-200 hover:shadow-2xl transition-shadow duration-300 ease-in-out"
            >
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`}
                alt={pokemon.name}
                width={128}
                height={128}
                className="mx-auto mb-4 transition-transform duration-300 ease-in-out hover:scale-110"
              />
              <h2 className="text-xl font-semibold text-center capitalize mb-3">
                {pokemon.name}
              </h2>
              <a
                href={`/pokemon/${pokemonId}`}
                className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center transition-colors duration-300 ease-in-out"
              >
                View Details
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
