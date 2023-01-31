import Head from "next/head";
import { Inter } from "@next/font/google";
import CssBaseline from "@mui/material/CssBaseline";

import Nav from "./nav";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Sales Crud</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline />

      <Nav />
    </>
  );
}
