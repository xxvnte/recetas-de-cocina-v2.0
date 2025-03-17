import React, { Fragment, ReactElement, useState, useEffect } from "react";
import LandingLayout from "@/components/layout/landing/layout";
import Recipes from "@/components/recipes";
import { useSearchRecipeHook } from "@/hooks/recipe/use-retrieve-recipe";
import { useAddFavoriteRecipeHook } from "@/hooks/recipe/use-addFavorite-recipe";
import { useRemoveFavoriteRecipeHook } from "@/hooks/recipe/use-removeFavorite-recipe";
import { useRetrieveProfileUserHook } from "@/hooks/user/use-retrieve-profile-user";
import { useSession } from "next-auth/react";

const RecipesView = () => {
  const { data, isPending, isFetching, isError, error } = useSearchRecipeHook(
    {}
  );

  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const {
    data: userData,
    isPending: userIsPending,
    isFetching: userIsFetching,
    isError: userIsError,
    error: userError,
  } = useRetrieveProfileUserHook({ id: userId });

  const [favorites, setFavorites] = useState<number[]>([]);
  const { mutate: addFavoriteRecipe } = useAddFavoriteRecipeHook();
  const { mutate: removeFavoriteRecipe } = useRemoveFavoriteRecipeHook();

  useEffect(() => {
    if (userData?.favorites) {
      setFavorites(
        Array.isArray(userData.favorites)
          ? userData.favorites.map((fav) => Number(fav.id))
          : []
      );
    }
  }, [data]);

  const handleFavorite = (recipeId: number) => {
    if (favorites.includes(recipeId)) {
      removeFavoriteRecipe(
        { recetaid: recipeId.toString() },
        {
          onSuccess: () => {
            setFavorites(favorites.filter((id) => id !== recipeId));
          },
          onError: (error) => {
            console.error("Error al quitar de favoritos:", error);
          },
        }
      );
    } else {
      addFavoriteRecipe(
        { recetaid: recipeId.toString() },
        {
          onSuccess: () => {
            setFavorites([...favorites, recipeId]);
          },
          onError: (error) => {
            console.error("Error al agregar a favoritos:", error);
          },
        }
      );
    }
  };

  if (isPending || isFetching) {
    return <div className="font-mono py-4">Cargando recetas...</div>;
  }

  if (isError) {
    return <div className="font-mono py-4">Error: {error?.message}</div>;
  }

  const recipes = Array.isArray(data?.recipes)
    ? data.recipes.map((recipe) => ({
        id: Number(recipe.recetaid),
        usuario: recipe.usuario_id,
        nombre: recipe.nombre,
        ingredientes: recipe.ingredientes,
        categoria: recipe.categoria,
        preparacion: recipe.pasos,
        tiempo: recipe.tiempo,
        votos: Number(recipe.votos),
      }))
    : [];

  return (
    <Fragment>
      <div className="py-8 mx-40 text-xl rounded-lg bg-gray-100">
        <Recipes
          recipes={recipes}
          favorites={favorites}
          handleFavorite={handleFavorite}
        />
      </div>
    </Fragment>
  );
};

RecipesView.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout showBreadcrumb={false}>{page}</LandingLayout>;
};

export default RecipesView;
