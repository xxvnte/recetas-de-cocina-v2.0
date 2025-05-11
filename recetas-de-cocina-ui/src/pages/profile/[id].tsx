import React, { Fragment, ReactElement, useState, useEffect } from "react";
import LandingLayout from "@/components/layout/landing/layout";
import Profile from "@/components/profile";
import { useRetrieveProfileUserHook } from "@/hooks/user/use-retrieve-profile-user";
import { useRemoveFavoriteRecipeHook } from "@/hooks/recipe/use-removeFavorite-recipe";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface User {
  name: string;
  phone: string;
  email: string;
}

interface UserRecipes {
  id: number;
  nombre: string;
  ingredientes: string;
  categoria: string;
  preparacion: string;
  tiempo: string;
  votos: number;
}

interface FavoritesRecipes {
  id: number;
  recipe_id: number;
  nombre: string;
  ingredientes: string;
  preparacion: string;
}

const ProfileView = () => {
  const router = useRouter();

  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const { data, isPending, isFetching, isError, error } =
    useRetrieveProfileUserHook({ id: userId });

  const { mutate: removeFavoriteRecipe } = useRemoveFavoriteRecipeHook();

  const [user, setUser] = useState<User>({
    name: "",
    phone: "",
    email: "",
  });
  const [userRecipes, setUserRecipes] = useState<UserRecipes[]>([]);
  const [favoritesRecipes, setFavoritesRecipes] = useState<FavoritesRecipes[]>(
    []
  );

  useEffect(() => {
    if (data?.user) {
      setUser({
        name: data.user.nombre,
        phone: data.user.telefono,
        email: data.user.email,
      });
    }
  }, [data]);

  useEffect(() => {
    if (Array.isArray(data?.recipes)) {
      setUserRecipes(
        data.recipes.map((recipe) => ({
          id: Number(recipe.id),
          nombre: recipe.nombre,
          ingredientes: recipe.ingredientes,
          categoria: recipe.categoria,
          preparacion: recipe.pasos,
          tiempo: recipe.tiempo,
          votos: Number(recipe.votos),
        }))
      );
    }
  }, [data]);

  useEffect(() => {
    if (Array.isArray(data?.favorites)) {
      setFavoritesRecipes(
        data.favorites.map((favorite) => ({
          id: Number(favorite.id),
          recipe_id: Number(favorite.recetaid),
          nombre: favorite.nombre,
          ingredientes: favorite.ingredientes,
          preparacion: favorite.pasos,
        }))
      );
    }
  }, [data]);

  const handleRemoveFavorite = (recipeId: number) => {
    removeFavoriteRecipe(
      { recetaid: recipeId.toString(), usuarioid: userId },
      {
        onSuccess: () => {
          router.reload();
        },
        onError: (error) => {
          console.error("Error al eliminar receta de favoritos:", error);
        },
      }
    );
  };

  if (isPending || isFetching) {
    return <div className="font-mono py-4">Cargando perfil...</div>;
  }

  if (isError) {
    return <div className="font-mono py-4">Error: {error?.message}</div>;
  }

  return (
    <Fragment>
      <Profile
        user={user}
        userRecipes={userRecipes}
        favoritesRecipes={favoritesRecipes}
        handleRemoveFavorite={handleRemoveFavorite}
      />
    </Fragment>
  );
};

ProfileView.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout showBreadcrumb={false}>{page}</LandingLayout>;
};

export default ProfileView;
