import React, { Fragment } from "react";
import type { ReactElement } from "react";
import LandingLayout from "@/components/layout/landing/layout";
import Profile from "@/components/profile";

const ProfileView = () => {
  const user = {
    name: "John Doe",
    phone: "123456789",
    email: "john@gmail.com",
  };

  const [userRecipes, setUserRecipes] = React.useState([
    {
      id: 1,
      nombre: "Tortilla de patatas",
      categoria: "Española",
      ingredientes: "patatas, huevos, cebolla",
      preparacion:
        "Freir las patatas y la cebolla, batir los huevos y mezclarlo todo",
      tiempo: "30 minutos",
      votos: 100,
    },
  ]);

  const [favoritesRecipes, setFavoritesRecipes] = React.useState([
    {
        id: 2,
        nombre: "Paella",
        categoria: "Española",
        ingredientes: "arroz, pollo, conejo, verduras",
        preparacion: "Freir la carne y las verduras, añadir el arroz y el caldo",
        tiempo: "45 minutos",
        votos: 90,
      },
    {
      id: 3,
      nombre: "Ceviche",
      categoria: "Peruana",
      ingredientes: "pescado, limón, cebolla, ají",
      preparacion:
        "Cocinar el pescado con el limón, añadir la cebolla y el ají",
      tiempo: "20 minutos",
      votos: 80,
    },
  ]);

  return (
    <Fragment>
      <div className="py-8 mx-40 text-xl rounded-lg bg-gray-100">
        <Profile
          user={user}
          userRecipes={userRecipes}
          favoritesRecipes={favoritesRecipes}
        />
      </div>
    </Fragment>
  );
};

ProfileView.getLayout = function getLayout(page: ReactElement) {
  return <LandingLayout showBreadcrumb={false}>{page}</LandingLayout>;
};

export default ProfileView;
