import React from "react";

export interface PopularRecipe {
  id: number;
  nombre: string;
  categoria: string;
  votos: number;
}

export interface PopularRecipesProps {
  popularRecipes: PopularRecipe[];
}

const PopularRecipes = ({ popularRecipes }: PopularRecipesProps) => {
  popularRecipes.sort((a, b) => b.votos - a.votos);
  const mostPopularRecipes = popularRecipes.slice(0, 3);

  return (
    <div className="py-8 px-2 mx-auto text-xl rounded-lg bg-gray-100">
      <h2 className="text-center text-2xl font-mono">Recetas más populares</h2>
      <div className="flex col-span-3 gap-10 mt-6 justify-center flex-wrap">
        {mostPopularRecipes.map((recipe) => (
          <div
            className="col-md-4 border border-gray-300 py-2 px-6 rounded-lg"
            key={recipe.id}
          >
            <div className="mb-4">
              <div className="">
                <h5 className="font-semibold font-mono">{recipe.nombre}</h5>
                <p className="">
                  <small className="font-mono">
                    Categoría: {recipe.categoria}
                  </small>
                </p>
                <p className="">
                  <small className="font-mono">Likes: {recipe.votos}</small>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularRecipes;
