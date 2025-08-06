
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { FaTruckFast } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import bgimg from "../assets/img/cart-bg.webp";
import RelatedProduct from "./RelatedProduct";
import {
  fetchCart,
  removeFromCart,
  updateCartQuantity,
} from "../redux/slice/cartSlice";
import {
  fetchWishlist,
  // addToWishlist,
  // removeFromWishlist,
} from "../redux/slice/whishlistSlice";
import debounce from "lodash/debounce";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart, loading: cartLoading, error: cartError } = useSelector(
    (state) => state.cart
  );
  const { wishlist, loading: wishlistLoading, error: wishlistError } = useSelector(
    (state) => state.wishlist
  );
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [optimisticQuantities, setOptimisticQuantities] = useState({});

  // Fetch cart and wishlist data on mount
  useEffect(() => {
    if (isLoggedIn && user?._id) {
      dispatch(fetchCart(user._id));
      dispatch(fetchWishlist(user._id));
    }
  }, [dispatch, isLoggedIn, user]);

  // Initialize optimistic quantities
  useEffect(() => {
    if (cart?.items) {
      const initialQuantities = {};
      cart.items.forEach((item) => {
        const key = `${item._id}-${item.variant?._id}`;
        initialQuantities[key] = item.quantity ?? 1;
      });
      setOptimisticQuantities(initialQuantities);
    } else {
      setOptimisticQuantities({});
    }
  }, [cart]);

  // Debounced quantity update handler
  const handleUpdateQuantity = useCallback(
    debounce(async (productId, variantId, newQuantity) => {
      if (newQuantity < 1) return;
      try {
        await dispatch(
          updateCartQuantity({
            userId: user?._id,
            productId,
            variantId,
            quantity: newQuantity,
          })
        ).unwrap();
        await dispatch(fetchCart(user._id)).unwrap();
      } catch (error) {
        console.error("Update quantity error:", error);
        setOptimisticQuantities((prev) => {
          const key = `${productId}-${variantId}`;
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });
      }
    }, 1000),
    [dispatch, user]
  );

  const updateQuantity = (productId, variantId, newQuantity) => {
    if (newQuantity < 1) return;
    const key = `${productId}-${variantId}`;
    setOptimisticQuantities((prev) => ({
      ...prev,
      [key]: newQuantity,
    }));
    handleUpdateQuantity(productId, variantId, newQuantity);
  };

  const handleRemoveFromCart = async (productId, variantId) => {
    try {
      await dispatch(
        removeFromCart({ userId: user._id, productId, variantId })
      ).unwrap();
      await dispatch(fetchCart(user._id));
    } catch (error) {
      console.error("Remove from cart error:", error);
    }
  };

  const handleToggleWishlist = async (productId, variantId) => {
    if (!isLoggedIn) {
      alert("Please log in to manage your wishlist.");
      return;
    }
    const isInWishlist = wishlist?.items?.some(
      (item) =>
        item._id === productId && item.variant?._id === variantId
    );
    try {
      if (isInWishlist) {
        await dispatch(
          removeFromWishlist({ userId: user._id, productId, variantId })
        ).unwrap();
      } else {
        await dispatch(
          addToWishlist({ userId: user._id, productId, variantId })
        ).unwrap();
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    }
  };

  const subtotal =
    cart?.items?.reduce((acc, item) => {
      const price = item.variant?.discountPrice || item.variant?.originalPrice || 0;
      const quantity =
        optimisticQuantities[`${item._id}-${item.variant?._id}`] ??
        item.quantity;
      return acc + price * quantity;
    }, 0) || 0;

  const progress = Math.min(100, (subtotal / 500) * 100);

  if (!cart?.items?.length) {
    return (
      <>
        <div
          className="relative py-25"
          style={{
            background: `url(${bgimg})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          <div className="absolute inset-0 bg-black/40 z-0"></div>
          <h2 className="relative z-1 text-start px-10 text-xl text-white font-semibold">
            SHOPPING CART
          </h2>
        </div>
        <div className="max-w-9xl mx-auto px-4 py-16 text-center bg-gray-100">
          <div className="bg-white border border-gray-300 rounded-lg py-52 px-4 shadow-sm">
            <div className="flex justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13m-13 0a1.5 1.5 0 103 0m10 0a1.5 1.5 0 103 0"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">YOUR CART IS EMPTY.</h2>
            <p className="text-gray-600 mb-1">
              Before proceed to checkout you must add some products to your
              shopping cart.
            </p>
            <p className="text-gray-600 mb-6">
              You will find a lot of interesting products on our{" "}
              <strong>"Shop"</strong> page.
            </p>
            <NavLink
              to="/"
              className="inline-block bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition"
            >
              RETURN TO SHOP
            </NavLink>
            <p className="text-sm mt-10 text-start text-gray-600">
              Free Shipping for all orders over{" "}
              <span className="text-red-600 font-semibold">₹500.00</span>
            </p>
          </div>
          <RelatedProduct />
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="relative py-25"
        style={{
          background: `url(${bgimg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <h2 className="relative z-1 text-start px-10 text-xl text-white font-semibold">
          SHOPPING CART
        </h2>
      </div>
      <div className="max-w-8xl mx-auto px-4 py-10 bg-gray-100">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items Table */}
          <div className="lg:col-span-2 bg-white p-10 rounded-b-xl">
            <h1 className="text-4xl font-medium mb-6">Shopping Cart</h1>
            {cartError && (
              <p className="text-red-500 text-sm mb-3">{cartError}</p>
            )}
            {/* {wishlistError && (
              <p className="text-red-500 text-sm mb-3">{wishlistError}</p>
            )} */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="grid grid-cols-6 gap-7 px-4 py-3 font-semibold text-lg">
                <div className="col-span-2">Product</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Total</div>
                <div>Action</div>
              </div>
              {cart.items.map((item) => {
                const variant = item.variant;
                const imageUrl =
                  variant?.productImage?.[0] ||
                  "https://via.placeholder.com/80?text=No+Image";
                const quantity =
                  optimisticQuantities[`${item._id}-${variant._id}`] ??
                  item.quantity;
                const isInWishlist = wishlist?.items?.some(
                  (w) => w._id === item._id && w.variant?._id === variant._id
                );
                return (
                  <div
                    key={`${item._id}-${variant._id}`}
                    className="grid grid-cols-6 items-center gap-7 px-4 py-4 border-t border-gray-300 text-sm bg-white"
                  >
                    {/* Product Info */}
                    <div className="col-span-2 flex gap-4 items-center">
                      <img
                        src={imageUrl}
                        alt={item.productName}
                        className="w-30 h-30 object-contain border border-gray-300"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80?text=Image+Not+Found";
                        }}
                      />
                      <div>
                        <p className="font-medium text-gray-500">
                          {item.productName}
                        </p>
                        {/* <p className="text-s text-gray-500 mt-1">
                          Quantity:{" "}
                          <span className="font-semibold text-green-600">
                            {item.stock || 90}
                          </span>
                        </p> */}
                      </div>
                    </div>
                    {/* Price */}
                    <div>
                      {variant?.originalPrice && (
                        <p className="line-through text-lg text-gray-400">
                          ₹{variant.originalPrice}
                        </p>
                      )}
                      <p className="text-green-700 text-lg mt-2">
                        ₹{variant?.discountPrice || variant?.originalPrice || "N/A"}
                      </p>
                    </div>
                    {/* Quantity */}
                    <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-fit text-base">
                      <button
                        className="text-gray-700 hover:text-black px-1"
                        onClick={() =>
                          updateQuantity(item._id, variant._id, quantity - 1)
                        }
                        disabled={quantity <= 1 || cartLoading}
                      >
                        -
                      </button>
                      <span className="px-3 font-medium">{quantity}</span>
                      <button
                        className="text-gray-700 hover:text-black px-1"
                        onClick={() =>
                          updateQuantity(item._id, variant._id, quantity + 1)
                        }
                        disabled={cartLoading}
                      >
                        +
                      </button>
                    </div>
                    {/* Total */}
                    <div>
                      <p className="text-green-700 text-lg">
                        ₹{(variant?.discountPrice * quantity).toFixed(2)}
                      </p>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRemoveFromCart(item._id, variant._id)}
                        disabled={cartLoading}
                      >
                        <FaRegTrashAlt className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          handleToggleWishlist(item._id, variant._id)
                        }
                        disabled={wishlistLoading}
                      >
                        {/* <CiHeart
                          className={`w-6 h-6 ${
                            isInWishlist ? "text-red-500" : "text-gray-500"
                          }`}
                        /> */}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Cart Totals */}
          <div className="p-10 bg-white rounded-lg">
            <h2 className="text-4xl font-medium mb-4">Cart Totals</h2>
            <div className="border rounded-lg p-6 shadow-sm h-fit">
              <div className="mb-3 text-sm">
                {subtotal < 500 ? (
                  <>
                    Almost there! Add{" "}
                    <span className="text-green-700 font-semibold">
                      ₹{(500 - subtotal).toFixed(2)}
                    </span>{" "}
                    more for <strong>free shipping</strong>.
                  </>
                ) : (
                  <p>
                    <span className="text-green-700 font-semibold">
                      Congratulations!
                    </span>{" "}
                    You've got free shipping!
                  </p>
                )}
              </div>
              {/* Progress Bar */}
              <div className="relative w-full bg-gray-200 h-2 rounded-full mb-4">
                <div
                  className="bg-green-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
                <div
                  className="absolute -top-4 text-xl transition-all duration-500"
                  style={{ left: `calc(${progress}% - 12px)` }}
                >
                  <FaTruckFast className="text-green-700" />
                </div>
              </div>
              {/* Subtotal */}
              <div className="flex justify-between text-2xl font-medium mb-5">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <NavLink to="/checkout">
                <button className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-blue-900/75 transition">
                  Check Out
                </button>
              </NavLink>
            </div>
          </div>
        </div>
        <RelatedProduct />
      </div>
    </>
  );
};

export default Cart;