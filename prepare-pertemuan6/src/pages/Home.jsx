import { useState, useEffect, useContext } from "react";
import { Trash, SquarePen, PlusCircle, Search } from "lucide-react";
import { KrjContext } from "../App";
import Cookies from 'js-cookie'; 

export default function Home() {
  const { keranjang, setKeranjang } = useContext(KrjContext);
  const [producttts, setproducttts] = useState([]);
  const [updateproducttt, setUpdateproducttt] = useState(null);
  const [newproducttt, setNewproducttt] = useState(null);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

    // Ambil token dari cookies
    const token = Cookies.get('token');

    console.log(token)
  
    useEffect(() => {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
        headers: { "Authorization": `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Gagal mengambil data produk, status: " + response.status);
          }
          return response.json();
        })
        .then((products) => setproducttts(products))
        .catch((error) => {
          console.error("Error fetching products:", error.message);
          alert("Terjadi masalah saat mengambil data produk. Silakan coba lagi.");
        });
    }, [token]);
  

    function handleDelete(product) {
      if (confirm("Apakah anda yakin akan menghapus produk ini?")) {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${product.id}`, {
          method: "DELETE",
          headers:{
            "Authorization": `Bearer ${token}`,
          }
        })
          .then((response) => response.text())
          .then((message) => {
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
              headers: { "Authorization": `Bearer ${token}` },
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Gagal mengambil data produk, status: " + response.status);
                }
                return response.json();
              })
              .then((products) => setproducttts(products))
              .catch((error) => {
                console.error("Error fetching products:", error.message);
                alert("Terjadi masalah saat mengambil data produk. Silakan coba lagi.");
              });
            alert(message);
          });
      }
    }
  
    function saveUpdate() {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${updateproducttt.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updateproducttt),
      })
        .then((response) => response.json())
        .then((message) => {
          setproducttts((prevProducttts) =>
            prevProducttts.map((p) =>
              p.id === updateproducttt.id ? updateproducttt : p
            )
          );
          // alert(message);
        });
      setUpdateproducttt(null);
    }
  

    function handleAddNewproducttt() {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newproducttt),
      })
        .then((response) => response.json())
        .then(() => {
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`)
            .then((response) => response.json())
            .then((products) => setproducttts(products));
        });
      setNewproducttt(null);
    }
  
  const filterData = producttts
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortBy] < b[sortBy] ? -1 : 1;
      } else {
        return a[sortBy] > b[sortBy] ? -1 : 1;
      }
    })
    .filter((item) => {
      // Pastikan item.name tidak null atau undefined sebelum menggunakan toLowerCase()
      return (
        item?.name && item?.name.toLowerCase().includes(search.toLowerCase())
      );
    });
  return (
    <div>
      <div className="flex items-center mt-1 w-full p-3 gap-2">
        <button
          onClick={() => setNewproducttt({ name: "", price: "", imageurl: "" })}
          className="flex w-1/5 justify-center gap-2 p-4"
        >
          <PlusCircle /> Add
        </button>
        <div className="flex items-center gap-1 w-1/5">
          <Search />
          <input
            type="text"
            className="bg-gray-100 w-full p-4 gap-2 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <label className="flex w-1/5 gap-2">
          <h1>urutkan</h1>
          <select
            className="rounded-lg border-2 border-solid border-gray-200 h-9 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="id">Normal</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </label>
        <label className="flex items-center gap-1  w-1/5">
          <h1>Urutkan</h1>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="h-9 p-2 text-sm rounded-lg outline-blue-400 border-2 border-solid border-gray-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex justify-center items-center gap-3">
          {filterData.map((producttt) => (
            <div
              key={producttt.id}
              className="flex flex-col gap-1 bg-slate-50 w-60 justify-center items-center"
            >
              <img
                src={producttt.imageurl}
                alt={producttt.name}
                className="w-full h-40 object-cover"
              />
              <div>
                <p>{producttt.name}</p>
                <p>{producttt.price}</p>
              </div>
              <div>
                <button onClick={() => setKeranjang([...keranjang, producttt])}>
                  Checkout
                </button>
                <button onClick={() => handleDelete(producttt)}>
                  <Trash />
                </button>
                <button
                  onClick={() => {
                    setUpdateproducttt(producttt);
                    console.log(producttt);
                  }}
                >
                  <SquarePen />
                </button>
              </div>
            </div>
          ))}
        </div>

        {updateproducttt && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-1/3 shadow-lg relative">
              <button
                onClick={() => setUpdateproducttt(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
                Edit Product
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveUpdate();
                }}
              >
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={updateproducttt.name}
                    onChange={(e) =>
                      setUpdateproducttt({
                        ...updateproducttt,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="price"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={updateproducttt.price}
                    onChange={(e) =>
                      setUpdateproducttt({
                        ...updateproducttt,
                        price: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product price"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="imageurl"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="imageurl"
                    value={updateproducttt.imageurl}
                    onChange={(e) =>
                      setUpdateproducttt({
                        ...updateproducttt,
                        imageurl: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter image URL"
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setUpdateproducttt(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {newproducttt && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-1/3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddNewproducttt();
                }}
              >
                <label className="block mb-2">Name producttt</label>
                <input
                  type="text"
                  id="newName"
                  value={newproducttt.name || ""}
                  onChange={(e) =>
                    setNewproducttt({ ...newproducttt, name: e.target.value })
                  }
                  className="border border-gray-300 p-2 mb-4 w-full"
                />
                <label>Price</label>
                <input
                  type="number"
                  id="newPrice"
                  value={newproducttt.price}
                  onChange={(e) =>
                    setNewproducttt({
                      ...newproducttt,
                      price: parseInt(e.target.value),
                    })
                  }
                  className="border border-gray-300 p-2 mb-4 w-full"
                />
                <label>imageurl URL</label>
                <input
                  type="text"
                  id="newimageurl"
                  value={newproducttt.imageurl}
                  onChange={(e) =>
                    setNewproducttt({
                      ...newproducttt,
                      imageurl: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 mb-4 w-full"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 mr-2 rounded hover:bg-blue-600"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setNewproducttt(null)}
                  className="bg-blue-500 text-white px-4 py-2 mr-2 rounded hover:bg-blue-600"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
