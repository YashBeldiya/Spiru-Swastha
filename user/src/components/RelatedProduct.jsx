import React from 'react'
import { SwiperSlide } from 'swiper/react'
import { relatedProducts } from '../const/Storage'
import { useWishlist } from './WhishlistContext';
import { useCart } from './CartContext';

const RelatedProduct = () => {
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
  
    const handleCartClick = (product) => {
      addToCart(product);
      openCart(); // trigger cart sidebar opening
    };
  
    const toggleWishlist = (product) => {
      if (wishlist.find((item) => item.id === product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    };
  return (
    <div className='py-20'>
        <div>
            <h1 className='text-4xl font-bold text-center'>You may also like</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">

        {relatedProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="bg-white shadow-md rounded-md overflow-hidden relative group hover:shadow-lg transition flex flex-col h-full">

                {/* Image Section */}
                <div className="w-full aspect-[4/4] relative overflow-hidden group">
                  {product.discount && (
                    <span className="absolute top-2 left-2 bg-green-700 text-white text-xs px-2 py-1 rounded z-30 shadow-md">
                      {product.discount}
                    </span>
                  )}


                  {/* ❤️ Wishlist Icon with Tooltip */}
                  <div className="absolute top-2 right-2 z-40 group/tooltip">
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      className="transition-colors duration-300 drop-shadow"
                    >
                      <i
                        className={`fa-heart text-lg ${wishlist.some((item) => item.id === product.id)
                          ? 'fas text-pink-700'
                          : 'far text-green-600 group-hover/tooltip:opacity-100 opacity-40'
                          }`}
                      ></i>
                    </button>

                    {/* Tooltip */}
                    <div className="absolute top-0 right-8 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                      {wishlist.some((item) => item.id === product.id)
                        ? 'Remove from Wishlist'
                        : 'Add to Wishlist'}
                    </div>
                  </div>



                  {/* First Image */}
                  <img
                    src={product.proImage}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10"
                  />

                  {/* Hover Image */}
                  <img
                    src={product.hoverImage || product.image}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-in-out z-20"
                  />
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-between flex-1">
                  <div className='p-4'>
                    <h3 className="text-md font-bold mb-2">{product.title}</h3>
                    <div className="">
                      {product.oldPrice && (
                        <span className="line-through text-gray-400 mr-2">
                          ₹{product.oldPrice}.00
                        </span>
                      )}
                      <span className="text-green-600 font-semibold">
                        {typeof product.newPrice === 'number'
                          ? `₹${product.newPrice}.00`
                          : product.newPrice}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => addToCart(product)}
                      className="w-1/2 bg-gray-900 hover:bg-black text-white text-lg py-2 transition"
                    >
                      <i className="fas fa-shopping-cart"></i>
                    </button>
                    <button className="w-1/2 bg-green-700 hover:bg-green-800 text-white text-lg py-2">
                      BUY NOW
                    </button>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </div>
    </div>
  )
}

export default RelatedProduct