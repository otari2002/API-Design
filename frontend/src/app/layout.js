import { Inter } from "next/font/google";
import 'react-complex-tree/lib/style-modern.css';
import "./globals.css";
import { ChakraProvider, Box } from "@chakra-ui/react";
import ThemeProvider from "./context/ThemeContext";
import UserProvider from "./context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ThemeProvider>
      <UserProvider>
      <body className={inter.className}>
        <ChakraProvider>
          <Box>{children}</Box>
        </ChakraProvider>
      </body>
      </UserProvider>
      </ThemeProvider>
    </html>
  );
}
