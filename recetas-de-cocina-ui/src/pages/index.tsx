import React, { Fragment } from "react";
import type { ReactElement } from "react";
import LandingLayout from "@/components/layout/landing/layout";
import PopularRecipes from "@/components/popularRecipes";
import { useSearchRecipeHook } from "@/hooks/recipe/use-search-recipe";

const HomeView = () => {
  const { data, isPending, isFetching, isError, error } = useSearchRecipeHook(
    {}
  );

  const recipes =
    data?.recipes.map((recipe) => ({
      id: Number(recipe.recetaid),
      nombre: recipe.nombre,
      categoria: recipe.categoria,
      votos: Number(recipe.votos),
    })) || [];

  return (
    <Fragment>
      <div className="px-16 py-16">
        <div className="col-lg-6 col-md-8 mx-auto">
          <h1 className="text-3xl font-mono font-semibold">
            Bienvenidos a nuestra aplicación de recetas de cocina
          </h1>
          <p className="text-lg font-mono py-4">
            Descubre nuevas recetas, comparte tus favoritas y vota por las
            mejores.
          </p>
        </div>
        <PopularRecipes popularRecipes={recipes} />
      </div>
    </Fragment>
  );
};

HomeView.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout showBreadcrumb={false}>{page}</LandingLayout>;
};

export default HomeView;
