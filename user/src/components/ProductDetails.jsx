
// import React, { useEffect, useState } from 'react';
// import { FaStar, FaPlay } from 'react-icons/fa';
// import certification from '../assets/img/certification.png';
// import { paymentMethods } from '../const/Storage';
// import WhySpiruSwastha from './WhySpiruswastha';
// import CustomerReviews from './CustomerReview';
// import RelatedProduct from './RelatedProduct';
// import SubscribeEmail from './SubscribeEmail';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProductdata } from '../redux/slice/productSlice';
// import { fetchWishlist, toggleWishlistItem, clearError } from '../redux/slice/whishlistSlice';
// import { addToCart, fetchCart } from '../redux/slice/cartSlice';
// import { fetchContentByProductId, clearContentError } from '../redux/slice/contentSlice';
// import Content from './Content';

// const ProductDetails = () => {
//   const [quantity, setQuantity] = useState(1);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { product: slug } = useParams();
//   const { productData, loading: productLoading, isError: productError } = useSelector((state) => state.products);
//   const { content, loading: contentLoading, error: contentError } = useSelector((state) => state.content);
//   const { wishlist, loading: wishlistLoading, error: wishlistError } = useSelector((state) => state.wishlist);
//   const { user, isLoggedIn } = useSelector((state) => state.auth);
//   const { loading: cartLoading } = useSelector((state) => state.cart);

//   const newProductData = productData.find((product) => product.slug === slug);

//   const [mainImage, setMainImage] = useState('');
//   const [mainMediaType, setMainMediaType] = useState('image');
//   const allMedia = [
//     ...(newProductData?.variants?.flatMap((variant) =>
//       variant.productImage?.map((img) => ({ type: 'image', url: img, variantLabel: variant.label })) || []
//     ) || []),
//     ...(newProductData?.productVideo?.map((video) => ({ type: 'video', url: video, variantLabel: 'Video' })) || []),
//   ];

//   const weights = newProductData?.variants?.map((variant) => ({
//     label: variant.label,
//     price: variant.discountPrice,
//     oldPrice: variant.originalPrice,
//     discount: `${variant.discountPercent}%`,
//     variantId: variant._id,
//   })) || [{ label: '50ml', price: 225, oldPrice: 250, discount: '10%', variantId: '' }];

//   const [selectedWeight, setSelectedWeight] = useState(weights[0]);

//   useEffect(() => {
//     if (newProductData?.variants?.[0]?.productImage?.[0]) {
//       setMainImage(newProductData.variants[0].productImage[0]);
//       setMainMediaType('image');
//       setSelectedWeight({
//         label: newProductData.variants[0].label,
//         price: newProductData.variants[0].discountPrice,
//         oldPrice: newProductData.variants[0].originalPrice,
//         discount: `${newProductData.variants[0].discountPercent}%`,
//         variantId: newProductData.variants[0]._id,
//       });
//     }
//   }, [newProductData]);

//   // Fetch product data, wishlist, cart, and content
//   useEffect(() => {
//     dispatch(fetchProductdata());
//     if (isLoggedIn && user?._id) {
//       dispatch(fetchWishlist(user._id));
//       dispatch(fetchCart(user._id));
//     }
//     if (newProductData?._id) {
//       dispatch(fetchContentByProductId(newProductData._id));
//     }
//     return () => {
//       dispatch(clearError());
//       dispatch(clearContentError());
//     };
//   }, [dispatch, isLoggedIn, user?._id, newProductData?._id]); // Only depend on specific IDs

//   const handleToggleWishlist = (product) => {
//     if (!isLoggedIn || !user?._id) {
//       alert('Please log in to manage your wishlist.');
//       return;
//     }
//     if (!product?._id) return;
//     dispatch(toggleWishlistItem({ userId: user._id, productId: product._id }));
//   };

//   const handleWeightSelection = (weight) => {
//     setSelectedWeight(weight);
//     const selectedVariant = newProductData.variants.find((v) => v.label === weight.label);
//     if (selectedVariant?.productImage?.[0]) {
//       setMainImage(selectedVariant.productImage[0]);
//       setMainMediaType('image');
//     }
//   };

//   const handleMediaSelection = (media) => {
//     setMainImage(media.url);
//     setMainMediaType(media.type);
//   };

//   const handleAddToCart = async (e) => {
//     e.preventDefault();
//     if (!isLoggedIn || !user?._id) {
//       alert('Please log in to add items to your cart.');
//       return;
//     }
//     try {
//       await dispatch(
//         addToCart({
//           userId: user._id,
//           productId: newProductData._id,
//           variantId: selectedWeight.variantId,
//           quantity,
//         })
//       ).unwrap();
//       dispatch(fetchCart(user._id));
//     } catch (error) {
//       console.error('Add to cart error:', error);
//     }
//   };

//   const handleBuyNow = async (e) => {
//     e.preventDefault();
//     if (!isLoggedIn || !user?._id) {
//       alert('Please log in to proceed to checkout.');
//       return;
//     }
//     try {
//       await dispatch(
//         addToCart({
//           userId: user._id,
//           productId: newProductData._id,
//           variantId: selectedWeight.variantId,
//           quantity,
//         })
//       ).unwrap();
//       dispatch(fetchCart(user._id));
//       navigate('/checkout');
//     } catch (error) {
//       console.error('Add to cart error:', error);
//     }
//   };

//   const product = newProductData;
//   if (productError || !product) {
//     return (
//       <div className="text-center py-10">
//         <p className="text-red-500">{productError || 'Product not found!'}</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="p-6 lg:flex lg:items-start gap-10 bg-white">
//         <div className="flex w-full lg:w-1/2">
//           <div className="hidden lg:flex flex-col gap-3 mr-4 max-h-[400px] overflow-y-auto">
//             {allMedia.map((media, i) => (
//               <div key={i} className="relative">
//                 <img
//                   src={media.type === 'video' ? '/video-placeholder.jpg' : media.url}
//                   alt={`${media.variantLabel}-${i + 1}`}
//                   onClick={() => handleMediaSelection(media)}
//                   className={`w-20 h-20 object-cover rounded border cursor-pointer ${
//                     mainImage === media.url ? 'border-green-500' : 'border-gray-300'
//                   }`}
//                 />
//                 {media.type === 'video' && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
//                     <FaPlay className="text-white text-xl" />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-center items-center relative min-h-[400px] w-full">
//             {mainMediaType === 'image' ? (
//               <img
//                 src={mainImage || 'https://via.placeholder.com/400'}
//                 alt={product.productName || 'Spirulina Product'}
//                 className="w-full max-w-xl object-cover rounded"
//               />
//             ) : (
//               <video src={mainImage} controls className="w-full max-w-xl object-contain rounded">
//                 Your browser does not support the video tag.
//               </video>
//             )}
//             <div className="flex items-center gap-2 mb-2 absolute top-2 right-2">
//               <span className="bg-green-700 text-white text-sm px-3 py-1 rounded">
//                 {selectedWeight.discount} OFF
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="w-full lg:w-1/2">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.productName}</h1>

//             <div className="flex items-center gap-3 mb-1">
//               <span className="text-xl text-gray-400 line-through">₹{selectedWeight.oldPrice}.00</span>
//               <span className="text-2xl font-bold text-green-700/85">₹{selectedWeight.price}.00</span>
//               <span className="text-xs bg-green-700 text-white px-2 py-1 rounded font-semibold">
//                 SAVE {selectedWeight.discount}
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <div className="flex items-center text-yellow-500 mb-3 text-base">
//                 <FaStar className="text-yellow-500 mr-1" />
//                 <span className="text-gray-700">4.6 (5 reviews)</span>
//               </div>
//               <div className="flex items-center gap-4 mb-4">
//                 {product.certifications?.fssai && (
//                   <img src={certification} alt="FSSAI" className="h-13" />
//                 )}
//               </div>
//             </div>

//             <hr className="mb-3 h-1 bg-green-700 border-0" />

//             {/* {content?.benefits && content.benefits.length > 0 && (
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//                 {content.benefits.map((item, idx) => (
//                   <div
//                     key={idx}
//                     className="flex flex-col items-center text-center bg-green-50 p-3 rounded-lg border border-green-100 shadow-sm"
//                   >
//                     {item.icon && <img src={item.icon} alt={item.title} className="h-14 w-14 object-contain mb-2" />}
//                     <p className="text-sm text-green-800 font-medium">{item.title}</p>
//                   </div>
//                 ))}
//               </div>
//             )} */}

//             <div className="mb-4">
//               <h4 className="font-bold text-gray-900 text-sm mb-2">
//                 WEIGHT: <span className="text-green-600 ml-1">{selectedWeight.label.toUpperCase()}</span>
//               </h4>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                 {weights.map((item) => {
//                   const isSelected = selectedWeight.label === item.label;
//                   return (
//                     <button
//                       key={item.label}
//                       onClick={() => handleWeightSelection(item)}
//                       className={`w-full rounded-xl overflow-hidden hover:cursor-pointer border-1 ${
//                         isSelected ? 'border-green-700' : 'border-gray-200'
//                       }`}
//                     >
//                       <div
//                         className={`py-1 px-3 text-left text-lg ${
//                           isSelected ? 'bg-green-700 text-white' : 'bg-gray-100 text-green-700'
//                         }`}
//                       >
//                         {item.label}
//                       </div>
//                       <div className="bg-white px-3 py-2 text-left">
//                         <p className="text-green-700 text-md mb-1">₹{item.price}.00</p>
//                         <div className="flex items-center justify-between text-s">
//                           <span className="line-through text-gray-400">₹{item.oldPrice}</span>
//                           <span className="bg-green-700 text-white rounded px-2 py-0.5 text-xs">
//                             {item.discount} OFF
//                           </span>
//                         </div>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="flex items-center flex-wrap gap-3 mb-6">
//               <div className="flex items-center border border-black rounded-full overflow-hidden px-3 py-1">
//                 <button
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="text-xl font-semibold px-2"
//                 >
//                   −
//                 </button>
//                 <span className="mx-2 font-medium">{quantity}</span>
//                 <button
//                   onClick={() => setQuantity(quantity + 1)}
//                   className="text-xl font-semibold px-2"
//                 >
//                   +
//                 </button>
//               </div>
//               <button
//                 className="bg-green-700 hover:bg-green-800 transition-all text-white text-sm px-8 py-2 rounded-full font-semibold"
//                 onClick={handleAddToCart}
//                 disabled={cartLoading}
//               >
//                 ADD TO CART
//               </button>
//               <button
//                 className="border-2 border-green-600 rounded-full p-2 text-green-600 text-xs"
//                 type="button"
//                 onClick={() => handleToggleWishlist(product)}
//                 disabled={wishlistLoading}
//               >
//                 <i
//                   className={`fa-heart text-lg ${
//                     wishlist.some((item) => item._id === product._id)
//                       ? 'fas text-pink-700'
//                       : 'far text-green-600 group-hover/tooltip:opacity-100 opacity-40'
//                   }`}
//                 ></i>
//               </button>
//             </div>

//             <button
//               className="w-85 bg-gray-900 hover:bg-green-700 cursor-pointer transition-all text-white py-2 rounded-full font-bold text-md mb-4"
//               onClick={handleBuyNow}
//               disabled={cartLoading}
//             >
//               BUY IT NOW
//             </button>

//             <div className="flex gap-2 flex-wrap items-center relative">
//               {paymentMethods.map((method, i) => (
//                 <img key={i} src={method.img} alt={method.alt || `payment-${i}`} className="h-6" />
//               ))}
//             </div>

//             <div className="overflow-auto max-h-[300px]">
//               <Content content={content} loading={contentLoading} error={contentError} />
//             </div>
//           </div>
//         </div>
//       </div>
//       <WhySpiruSwastha />
//       <CustomerReviews />
//       <RelatedProduct />
//       <SubscribeEmail />
//     </>
//   );
// };

// export default ProductDetails;

import React, { useEffect, useState } from 'react';
import { FaStar, FaPlay } from 'react-icons/fa';
import certification from '../assets/img/certification.png';
import { paymentMethods } from '../const/Storage';
import WhySpiruSwastha from './WhySpiruswastha';
import CustomerReviews from './CustomerReview';
import RelatedProduct from './RelatedProduct';
import SubscribeEmail from './SubscribeEmail';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductdata } from '../redux/slice/productSlice';
import { fetchWishlist, toggleWishlistItem, clearError } from '../redux/slice/whishlistSlice';
import { addToCart, fetchCart } from '../redux/slice/cartSlice';
import { fetchContentByProductId, clearContentError } from '../redux/slice/contentSlice';
import Content from './Content';

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product: slug } = useParams();
  const { productData, loading: productLoading, isError: productError } = useSelector((state) => state.products);
  const { content, loading: contentLoading, error: contentError } = useSelector((state) => state.content);
  const { wishlist, loading: wishlistLoading, error: wishlistError } = useSelector((state) => state.wishlist);
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { loading: cartLoading } = useSelector((state) => state.cart);

  const newProductData = productData.find((product) => product.slug === slug);

  const [mainImage, setMainImage] = useState('');
  const [mainMediaType, setMainMediaType] = useState('image');
  const allMedia = [
    ...(newProductData?.variants?.flatMap((variant) =>
      variant.productImage?.map((img) => ({ type: 'image', url: img, variantLabel: variant.label })) || []
    ) || []),
    ...(newProductData?.productVideo?.map((video) => ({ type: 'video', url: video, variantLabel: 'Video' })) || []),
  ];

  const weights = newProductData?.variants?.map((variant) => ({
    label: variant.label,
    price: variant.discountPrice,
    oldPrice: variant.originalPrice,
    discount: `${variant.discountPercent}%`,
    variantId: variant._id,
  })) || [{ label: '50ml', price: 225, oldPrice: 250, discount: '10%', variantId: '' }];

  const [selectedWeight, setSelectedWeight] = useState(weights[0]);

  useEffect(() => {
    console.log('Product video URLs:', newProductData?.productVideo); // Debug log
    if (newProductData) {
      if (newProductData?.productVideo?.[0]) {
        setMainImage(newProductData.productVideo[0]);
        setMainMediaType('video');
      } else if (newProductData?.variants?.[0]?.productImage?.[0]) {
        setMainImage(newProductData.variants[0].productImage[0]);
        setMainMediaType('image');
      } else {
        setMainImage('https://via.placeholder.com/400');
        setMainMediaType('image');
      }
      if (newProductData?.variants?.[0]) {
        setSelectedWeight({
          label: newProductData.variants[0].label,
          price: newProductData.variants[0].discountPrice,
          oldPrice: newProductData.variants[0].originalPrice,
          discount: `${newProductData.variants[0].discountPercent}%`,
          variantId: newProductData.variants[0]._id,
        });
      }
    }
  }, [newProductData]);

  useEffect(() => {
    dispatch(fetchProductdata());
    if (isLoggedIn && user?._id) {
      dispatch(fetchWishlist(user._id));
      dispatch(fetchCart(user._id));
    }
    if (newProductData?._id) {
      dispatch(fetchContentByProductId(newProductData._id));
    }
    return () => {
      dispatch(clearError());
      dispatch(clearContentError());
    };
  }, [dispatch, isLoggedIn, user?._id, newProductData?._id]);

  const handleToggleWishlist = (product) => {
    if (!isLoggedIn || !user?._id) {
      alert('Please log in to manage your wishlist.');
      return;
    }
    if (!product?._id) return;
    dispatch(toggleWishlistItem({ userId: user._id, productId: product._id }));
  };

  const handleWeightSelection = (weight) => {
    setSelectedWeight(weight);
    if (mainMediaType === 'image') {
      const selectedVariant = newProductData.variants.find((v) => v.label === weight.label);
      if (selectedVariant?.productImage?.[0]) {
        setMainImage(selectedVariant.productImage[0]);
        setMainMediaType('image');
      }
    }
  };

  const handleMediaSelection = (media) => {
    console.log('Selected media:', media);
    setMainImage(media.url);
    setMainMediaType(media.type);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !user?._id) {
      alert('Please log in to add items to your cart.');
      return;
    }
    try {
      await dispatch(
        addToCart({
          userId: user._id,
          productId: newProductData._id,
          variantId: selectedWeight.variantId,
          quantity,
        })
      ).unwrap();
      dispatch(fetchCart(user._id));
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !user?._id) {
      alert('Please log in to proceed to checkout.');
      return;
    }
    try {
      await dispatch(
        addToCart({
          userId: user._id,
          productId: newProductData._id,
          variantId: selectedWeight.variantId,
          quantity,
        })
      ).unwrap();
      dispatch(fetchCart(user._id));
      navigate('/checkout');
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const product = newProductData;
  if (productError || !product) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{productError || 'Product not found!'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 lg:flex lg:items-start gap-10 bg-white">
        <div className="flex w-full lg:w-1/2">
          <div className="hidden lg:flex flex-col gap-3 mr-4 max-h-[400px] overflow-y-auto">
            {allMedia.map((media, i) => (
              <div key={i} className="relative">
                <img
                  src={media.type === 'video' ? '/video-placeholder.jpg' : media.url}
                  alt={`${media.variantLabel}-${i + 1}`}
                  onClick={() => handleMediaSelection(media)}
                  className={`w-20 h-20 object-cover rounded border cursor-pointer ${
                    mainImage === media.url ? 'border-green-500' : 'border-gray-300'
                  }`}
                />
                {media.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <FaPlay className="text-white text-xl" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center relative min-h-[400px] w-full">
            {mainMediaType === 'image' ? (
              <img
                src={mainImage || 'https://via.placeholder.com/400'}
                alt={product.productName || 'Spirulina Product'}
                className="w-full max-w-xl object-cover rounded"
              />
            ) : (
              <video
                key={mainImage}
                src={mainImage}
                controls
                className="w-full max-w-xl object-contain rounded"
                onError={(e) => {
                  console.error('Video error:', e);
                  setMainImage('https://via.placeholder.com/400');
                  setMainMediaType('image');
                }}
              >
                <source src={mainImage} type="video/mp4" />
                <source src={mainImage} type="video/webm" />
                Your browser does not support the video tag or the video could not be loaded.
              </video>
            )}
            <div className="flex items-center gap-2 mb-2 absolute top-2 right-2">
              <span className="bg-green-700 text-white text-sm px-3 py-1 rounded">
                {selectedWeight.discount} OFF
              </span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.productName}</h1>

            <div className="flex items-center gap-3 mb-1">
              <span className="text-xl text-gray-400 line-through">₹{selectedWeight.oldPrice}.00</span>
              <span className="text-2xl font-bold text-green-700/85">₹{selectedWeight.price}.00</span>
              <span className="text-xs bg-green-700 text-white px-2 py-1 rounded font-semibold">
                SAVE {selectedWeight.discount}
              </span>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center text-yellow-500 mb-3 text-base">
                <FaStar className="text-yellow-500 mr-1" />
                <span className="text-gray-700">4.6 (5 reviews)</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                {product.certifications?.fssai && (
                  <img src={certification} alt="FSSAI" className="h-13" />
                )}
              </div>
            </div>

            <hr className="mb-3 h-1 bg-green-700 border-0" />

            <div className="mb-4">
              <h4 className="font-bold text-gray-900 text-sm mb-2">
                WEIGHT: <span className="text-green-600 ml-1">{selectedWeight.label.toUpperCase()}</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weights.map((item) => {
                  const isSelected = selectedWeight.label === item.label;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleWeightSelection(item)}
                      className={`w-full rounded-xl overflow-hidden hover:cursor-pointer border-1 ${
                        isSelected ? 'border-green-700' : 'border-gray-200'
                      }`}
                    >
                      <div
                        className={`py-1 px-3 text-left text-lg ${
                          isSelected ? 'bg-green-700 text-white' : 'bg-gray-100 text-green-700'
                        }`}
                      >
                        {item.label}
                      </div>
                      <div className="bg-white px-3 py-2 text-left">
                        <p className="text-green-700 text-md mb-1">₹{item.price}.00</p>
                        <div className="flex items-center justify-between text-s">
                          <span className="line-through text-gray-400">₹{item.oldPrice}</span>
                          <span className="bg-green-700 text-white rounded px-2 py-0.5 text-xs">
                            {item.discount} OFF
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-3 mb-6">
              <div className="flex items-center border border-black rounded-full overflow-hidden px-3 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-xl font-semibold px-2"
                >
                  −
                </button>
                <span className="mx-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-xl font-semibold px-2"
                >
                  +
                </button>
              </div>
              <button
                className="bg-green-700 hover:bg-green-800 transition-all text-white text-sm px-8 py-2 rounded-full font-semibold"
                onClick={handleAddToCart}
                disabled={cartLoading}
              >
                ADD TO CART
              </button>
              <button
                className="border-2 border-green-600 rounded-full p-2 text-green-600 text-xs"
                type="button"
                onClick={() => handleToggleWishlist(product)}
                disabled={wishlistLoading}
              >
                <i
                  className={`fa-heart text-lg ${
                    wishlist.some((item) => item._id === product._id)
                      ? 'fas text-pink-700'
                      : 'far text-green-600 group-hover/tooltip:opacity-100 opacity-40'
                  }`}
                ></i>
              </button>
            </div>

            <button
              className="w-85 bg-gray-900 hover:bg-green-700 cursor-pointer transition-all text-white py-2 rounded-full font-bold text-md mb-4"
              onClick={handleBuyNow}
              disabled={cartLoading}
            >
              BUY IT NOW
            </button>

            <div className="flex gap-2 flex-wrap items-center relative">
              {paymentMethods.map((method, i) => (
                <img key={i} src={method.img} alt={method.alt || `payment-${i}`} className="h-6" />
              ))}
            </div>

            <div className="overflow-auto max-h-[300px]">
              <Content content={content} loading={contentLoading} error={contentError} />
            </div>
          </div>
        </div>
      </div>
      <WhySpiruSwastha />
      <CustomerReviews />
      <RelatedProduct />
      <SubscribeEmail />
    </>
  );
};

export default ProductDetails;