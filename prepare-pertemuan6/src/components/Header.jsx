import { Home, Info, Contact, LogIn } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { KrjContext } from "../App";
export default function Header() {
  const { keranjang } = useContext(KrjContext);

  return (
    <header className=" w-full flex items-center justify-between bg-slate-100 shadow-lg px-4 py-4">
      <div className="flex w-1/2 items-center gap-4 ">
        <img src="vite.svg" alt="" />
        <h1 className="">Nebula store</h1>
      </div>
      <nav className="flex w-1/2">
        <ul className="w-full flex justify-evenly gap-2">
          <li className="flex items-center gap-2 cursor-pointer">
            <Home />
            <Link to="/">Home</Link>
          </li>
          <li className="flex items-center gap-2 cursor-pointer">
            <Info />
            <Link to="/about">About</Link>
          </li>
          <li className="flex items-center gap-2 cursor-pointer">
            <Contact />
            <Link to="/contact">Contact</Link>
          </li>
          <li className="flex items-center gap-2 cursor-pointer">
            <LogIn />
            <Link to="/login">Login</Link>
          </li>
          <li className="flex items-center gap-2 cursor-pointer">
            <LogIn />
            <Link to="/register">Regis</Link>
          </li>
          {/*    const { keranjang } = useContext(KrjContext);
 import usecontext dan krj context dari app*/}
          <li>
            <h1
              onClick={() =>
                alert(
                  "Munculuin popup keranjang " +
                    (keranjang[0]?.name ??
                      "isi popup nya tidak ada gays, kasihan delo cuman bisa chekout doang beli doanggggg ")
                )
              }
            >
              Keranjang {keranjang.length}
            </h1>
          </li>
        </ul>
      </nav>
    </header>
  );
}
