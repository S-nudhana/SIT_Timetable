import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import { RouterProvider } from "react-router-dom";
import { router } from "./router/index";

export default function App() {
  return (
    <ChakraProvider value={defaultSystem}>
        <RouterProvider router={router} />
    </ChakraProvider>
  );
}