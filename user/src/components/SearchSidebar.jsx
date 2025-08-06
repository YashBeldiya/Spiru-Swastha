import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { collection_array } from "../const/Storage";

const SearchSidebar = ({ isOpen, onClose }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const navigate = useNavigate();

  const allProducts = collection_array.flatMap((cat) =>
    cat.products.map((product) => ({ ...product, category: cat.slug }))
  );

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All Categories", ...new Set(collection_array.map((cat) => cat.slug))];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-full max-w-sm h-full bg-white z-50 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <h2 className="text-lg font-semibold">SEARCH OUR SITE</h2>
            <button onClick={onClose}>
              <IoClose className="text-2xl" />
            </button>
          </div>

          {/* Inputs */}
          <div className="p-4 space-y-4">
            <select
              className="w-full border px-3 py-2 rounded text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full border rounded px-3 py-2 pr-10 text-sm"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 px-4 overflow-y-auto">
            <h3 className="text-sm font-semibold mb-3">Need some inspiration?</h3>
            {filteredProducts.length > 0 ? (
              <div className="space-y-4 pb-4">
                {filteredProducts.slice(0, 5).map((item) => (
                    
                  <div key={item.id} className="flex items-center gap-4">
                    {/* {console.log(item)} */}
                    <img
                      src={item.proImage}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span className="text-sm font-medium line-clamp-2">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No products found.</p>
            )}
          </div>

          {/* View All Button */}
          <div className="px-4 py-4 border-t">
            <button
              onClick={() => {
                onClose();
                navigate("/collection/All");
              }}
              className="text-sm font-semibold text-black hover:text-green-700 flex items-center gap-1"
            >
              View All <span>→</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default SearchSidebar;
