import "typeface-rubik";
import "@fontsource/ibm-plex-mono";

import {
  Authenticator,
  FirebaseCMSApp,
  buildCollection,
  buildProperty,
} from "@camberi/firecms";
import { User as FirebaseUser } from "firebase/auth";
import { useCallback } from "react";

const locales = {
  "en-US": "English (United States)",
  "es-ES": "Spanish (Spain)",
  "de-DE": "German",
};

interface Product {
  name: string;
  main_image: string;
  related_images: string[];
  categories: string[];
  description: string;
  price: number;
  published: boolean;
  promotion: number;
  new: boolean;
}

interface Product {
  name: string;
  main_image: string;
  related_images: string[];
  categories: string[];
  description: string;
  price: number;
  published: boolean;
  promotion: number;
  new: boolean;
}

const firebaseConfig = {
  apiKey: "AIzaSyAtKmUCXpRyshSsA4y-bro1BzqW-LLAm7M",
  authDomain: "shop-test-3e764.firebaseapp.com",
  databaseURL: "https://shop-test-3e764-default-rtdb.firebaseio.com",
  projectId: "shop-test-3e764",
  storageBucket: "shop-test-3e764.appspot.com",
  messagingSenderId: "787781144854",
  appId: "1:787781144854:web:eda630941ac1b20da74037",
  measurementId: "G-3K0XDT6TW3",
};

const productSchema = buildCollection({
  name: "Products",
  path: "products", // Firebase collection path
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    delete: true,
  }),
  properties: {
    price: {
      name: "Price",
      dataType: "number",
      validation: { required: true, min: 0 },
    },
    discount: {
      name: "Discount",
      dataType: "boolean",
    },
    brand: {
      name: "Brand",
      dataType: "string",
    },
    stock: {
      name: "Stock",
      dataType: "number",
      validation: { required: true, min: 0 },
    },
    size: buildProperty({
      name: "Size",
      dataType: "array",
      of: {
        dataType: "string",
      },
    }),
    description: {
      name: "Description",
      dataType: "string",
    },
    name: {
      name: "Name",
      dataType: "string",
      validation: { required: true },
    },
    category: {
      name: "Category",
      dataType: "string",
    },
    images: buildProperty({
      name: "Images",
      dataType: "array",
      of: {
        dataType: "map",
        properties: {
          id: buildProperty({
            name: "ID",
            dataType: "string",
            validation: { required: true },
            description: "Manually enter a unique ID for the image",
          }),
          url: buildProperty({
            name: "Image URL",
            dataType: "string",
            validation: { required: true, url: true },
            description: "Manually enter the image URL",
          }),
        },
      },
      description: "Manually enter image URLs and their corresponding IDs.",
    }),

    reviews: {
      name: "Reviews",
      dataType: "number",
    },
    stars: {
      name: "Stars",
      dataType: "number",
      validation: { min: 0, max: 5 },
    },
    featured: {
      name: "Featured",
      dataType: "boolean",
    },
  },
});

export default function NewApp() {
  const myAuthenticator: Authenticator<FirebaseUser> = useCallback(
    async ({ user, authController }) => {
      if (user?.email?.includes("flanders")) {
        throw Error("Stupid Flanders!");
      }

      console.log("Allowing access to", user?.email);
      // This is an example of retrieving async data related to the user
      // and storing it in the user extra field.
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
      collections={[productSchema]}
      firebaseConfig={firebaseConfig} // Make sure to define firebaseConfig
    />
  );
}
