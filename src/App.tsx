import {
  Authenticator,
  FirebaseCMSApp,
  buildCollection,
  buildProperty,
} from "@camberi/firecms";
import { User as FirebaseUser } from "firebase/auth";
import { useCallback } from "react";

import { categories } from "./data/categories";
import { Order, Product } from "./types/types";

const firebaseConfig = {
  apiKey: "AIzaSyAexrhrIjr9t8_jxNz7nT3Ft9pmA2fg67s",
  authDomain: "meublesbymi.firebaseapp.com",
  projectId: "meublesbymi",
  storageBucket: "meublesbymi.appspot.com",
  messagingSenderId: "971133831930",
  appId: "1:971133831930:web:fd4c71b237e8d354be5743",
  measurementId: "G-ZXSJP8T8SH",
};

const locales = {
  "en-US": "English (United States)",
  "es-ES": "Spanish (Spain)",
  "de-DE": "German",
};

const productsCollection = buildCollection<Product>({
  name: "Products",
  path: "products",
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    delete: true,
  }),
  properties: {
    name: buildProperty({
      name: "Nom",
      dataType: "string",
      validation: { required: true },
    }),
    main_image: buildProperty({
      name: "Image Principale",
      dataType: "string",
      storage: {
        storagePath: "products",
        acceptedFiles: ["image/*"],
      },
    }),
    related_images: buildProperty({
      name: "Images associées",
      dataType: "array",
      of: {
        dataType: "string",
        storage: {
          storagePath: "products",
          acceptedFiles: ["image/*"],
        },
      },
    }),
    color_images: buildProperty({
      name: "Images par couleur",
      dataType: "array",
      of: {
        dataType: "map",
        properties: {
          color: buildProperty({
            name: "Couleur",
            dataType: "string",
            validation: { required: true },
            description:
              "Sélectionnez la couleur/option représentée par cette image",
          }),
          image: buildProperty({
            name: "Image",
            dataType: "string",
            storage: {
              storagePath: "product_colors",
              acceptedFiles: ["image/*"],
            },
            description:
              "Téléchargez l'image représentant le produit dans cette couleur/option spécifique",
          }),
          availableQuantity: buildProperty({
            name: "Quantité disponible",
            dataType: "number",
            validation: { required: true },
            description: "Quantité disponible pour cette couleur/option",
          }),
          price: buildProperty({
            name: "Prix",
            dataType: "number",
            validation: { required: false },
            description: "Prix du produit dans cette couleur/option",
          }),
        },
      },
      description:
        "Associez chaque couleur/option de produit à une image spécifique.",
    }),
    categories: buildProperty({
      name: "Catégories",
      dataType: "array",
      of: {
        dataType: "string",
        enumValues: categories,
      },
    }),
    description: buildProperty({
      name: "Description",
      dataType: "string",
    }),
    price: buildProperty({
      name: "Prix",
      dataType: "number",
      validation: { min: 0 },
    }),
    published: buildProperty({
      name: "Publié",
      dataType: "boolean",
    }),
    facebookProductUrl: buildProperty({
      name: "Lien Facebook",
      dataType: "string",
    }),
    shippingOptions: buildProperty({
      name: "Options de livraison",
      dataType: "map",
      properties: {
        Belgique: buildProperty({
          name: "Belgique",
          dataType: "number",
          validation: { required: false },
          description:
            "Frais de livraison pour la Belgique, laissez vide si non disponible",
        }),
        Luxembourg: buildProperty({
          name: "Luxembourg",
          dataType: "number",
          validation: { required: false },
          description:
            "Frais de livraison pour le Luxembourg, laissez vide si non disponible",
        }),
        France: buildProperty({
          name: "France",
          dataType: "number",
          validation: { required: false },
          description:
            "Frais de livraison pour la France, laissez vide si non disponible",
        }),
      },
    }),
    orderDate: buildProperty({
      dataType: "date",
      validation: { required: false },
    }),
  },
});

interface User {
  email: string;
  passwordHash: string;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const usersCollection = buildCollection<User>({
  name: "Users",
  path: "users",
  permissions: ({ authController, user }) => ({
    edit: true,
    create: true,
    delete: true,
  }),
  properties: {
    email: buildProperty({
      name: "Email",
      dataType: "string",
      validation: { required: true, email: true },
    }),
    passwordHash: buildProperty({
      name: "Mot de passe",
      dataType: "string",
      validation: { required: true },
      description: "Hash du mot de passe pour la sécurité de l'utilisateur",
    }),
    fullName: buildProperty({
      name: "Nom Complet",
      dataType: "string",
      validation: { required: true },
    }),
    address: buildProperty({
      name: "Adresse",
      dataType: "string",
      validation: { required: true },
    }),
    city: buildProperty({
      name: "Ville",
      dataType: "string",
      validation: { required: true },
    }),
    postalCode: buildProperty({
      name: "Code Postal",
      dataType: "string",
      validation: { required: true },
    }),
    country: buildProperty({
      name: "Pays",
      dataType: "string",
      validation: { required: true },
    }),
  },
});

const ordersCollection = buildCollection<Order>({
  name: "Orders",
  path: "orders",
  permissions: {
    create: true,
    edit: true,
    delete: true,
  },
  properties: {
    userId: buildProperty({
      name: "userId",
      dataType: "string",
    }),
    products: buildProperty({
      dataType: "array",
      of: {
        dataType: "map",
        properties: {
          productId: {
            dataType: "reference",
            path: "products",
          },
          quantity: {
            dataType: "number",
          },
          color: {
            dataType: "string",
          },
        },
      },
    }),
    orderDate: buildProperty({
      dataType: "date",
      validation: { required: true },
    }),
    shippingAddress: buildProperty({
      dataType: "map",
      properties: {
        fullName: {
          dataType: "string",
        },
        address: {
          dataType: "string",
        },
        city: {
          dataType: "string",
        },
        postalCode: {
          dataType: "string",
        },
        country: {
          dataType: "string",
        },
      },
    }),
    price: buildProperty({
      dataType: "number",
      validation: { required: true },
    }),
    status: buildProperty({
      dataType: "string",
      enumValues: {
        "en attente": "en attente",
        "en cours de livraison": "en cours de livraison",
        livré: "livré",
      },
    }),
  },
});

export default function Admin() {
  const myAuthenticator: Authenticator<FirebaseUser> = useCallback(
    async ({ user, authController }) => {
      if (user?.email?.includes("flanders")) {
        throw Error("Stupid Flanders!");
      }

      console.log("Allowing access to", user?.email);
      const sampleUserRoles = await Promise.resolve(["admin"]);
      authController.setExtra(sampleUserRoles);

      return true;
    },
    []
  );

  return (
    <FirebaseCMSApp
      name={"My Online Shop"}
      authentication={myAuthenticator}
      collections={[productsCollection, ordersCollection, usersCollection]}
      firebaseConfig={firebaseConfig} // Make sure to define firebaseConfig
    />
  );
}
