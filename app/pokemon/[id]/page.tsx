interface PokemonDetail {
  name: string;
  id: number;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      ["official-artwork"]: {
        front_default: string;
      };
    };
  };
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
}

async function getPokemonDetails(id: string): Promise<PokemonDetail> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch Pokémon details");
  }
  return res.json();
}

export default async function PokemonDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const pokemon = await getPokemonDetails(params.id);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white shadow-xl rounded-lg p-8 border border-gray-200">
        <img
          src={
            pokemon.sprites.other["official-artwork"].front_default ||
            pokemon.sprites.front_default
          }
          alt={pokemon.name}
          className="w-64 h-64 mx-auto mb-6 transition-transform duration-300 ease-in-out hover:scale-110"
        />
        <h1 className="text-4xl font-bold text-center capitalize mb-6">
          {pokemon.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <p>
              <strong>ID:</strong> {pokemon.id}
            </p>
            <p>
              <strong>Height:</strong> {pokemon.height / 10} m
            </p>
            <p>
              <strong>Weight:</strong> {pokemon.weight / 10} kg
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Type(s)</h2>
            <ul className="list-disc list-inside">
              {pokemon.types.map((typeInfo) => (
                <li key={typeInfo.type.name} className="capitalize">
                  {typeInfo.type.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Abilities</h2>
          <ul className="list-disc list-inside">
            {pokemon.abilities.map((abilityInfo) => (
              <li key={abilityInfo.ability.name} className="capitalize">
                {abilityInfo.ability.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/pokemon"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors duration-300 ease-in-out"
          >
            Back to List
          </a>
        </div>
      </div>
    </div>
  );
}
