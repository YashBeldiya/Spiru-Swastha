import React, { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'SPIRULINA TABLETS',
    discount: '15% OFF',
    image: '/path-to-image1.png',
  },
  {
    id: 2,
    name: 'SPIRULINA TABLET',
    discount: '20% OFF',
    image: '/path-to-image2.png',
  },
  {
    id: 3,
    name: 'SPIRULINA CAPSULE',
    discount: '20% OFF',
    image: '/path-to-image3.png',
  },
];

const sortOptions = [
  'Featured',
  'Best selling',
  'Alphabetically, A-Z',
  'Alphabetically, Z-A',
  'Price, low to high',
  'Price, high to low',
  'Date, old to new',
];

const ImmunityPage = () => {
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Best selling');

  return (
    <div className="bg-white text-gray-800">
      {/* Banner */}
      <div className="bg-gray-100 py-10 px-6">
        <h1 className="text-4xl font-bold mb-2">Immunity</h1>
        <p className="text-sm text-gray-600">
          Home <span className="mx-1">{'>'}</span> Immunity
        </p>
      </div>

      {/* Filter & Sort */}
      <div className="flex justify-between items-center p-6">
        <button className="text-gray-600 text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 012 0v13a1 1 0 002 0V4a1 1 0 112 0v13a1 1 0 002 0V4a1 1 0 112 0v13a1 1 0 002 0V4a1 1 0 012 0v13a1 1 0 002 0V4a1 1 0 012 0v13a1 1 0 002 0V4a1 1 0 012 0" />
          </svg>
          Filter
        </button>

        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="border px-4 py-2 rounded-md text-sm"
          >
            {selectedSort}
          </button>
          {sortOpen && (
            <ul className="absolute right-0 mt-2 w-60 bg-white border rounded-md shadow z-50">
              {sortOptions.map((option) => (
                <li
                  key={option}
                  onClick={() => {
                    setSelectedSort(option);
                    setSortOpen(false);
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                    selectedSort === option ? 'text-green-600 font-semibold' : ''
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 pb-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-md p-4 relative hover:shadow-md transition"
          >
            <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
              {product.discount}
            </div>
            <img
              src={product.image}
              alt={product.name}
              className="mx-auto h-40 object-contain"
            />
            <h2 className="mt-4 text-center font-semibold">{product.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImmunityPage;
