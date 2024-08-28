import { createContext } from "react";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export const KrjContext = createContext();

export default function App() {
  // const [keranjang, setKeranjang] = useState(0); //angka
  const [keranjang, setKeranjang] = useState([]);
  return (
    <KrjContext.Provider value={{ keranjang, setKeranjang }}>
      <Header />
      <Outlet />
    </KrjContext.Provider>
  );
}
