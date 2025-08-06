import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransformationVideos } from '../redux/slice/transformationSlice';

// import { productsslider } from './Const';

const Transformation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const {transformationData} = useSelector((state) => state.transformations)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchTransformationVideos())
  }, [])
  // console.log(transformationData)

  const openModal = (index) => {
    setActiveIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // prevent background scroll
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    // Pause all modal videos when closing
    document.querySelectorAll('.swiper-slide-video').forEach((v) => v.pause());
  };

  return (
    <div className="w-full px-4 py-10 bg-white">
     <h2 className="text-4xl font-extrabold text-center mb-10">
     Why Choosе SpiruSwastha?
        <div className="w-36 h-0.5 bg-green-600 mx-auto mt-4 rounded"></div>
      </h2>

      <Swiper
        spaceBetween={16}
        slidesPerView={1.2}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1440: { slidesPerView: 5 },
        }}
        modules={[Navigation, Pagination]}
      >
        {transformationData.map((product, index) => (
          <SwiperSlide key={product.id}>
            <div
              className="relative rounded-xl border shadow hover:shadow-lg transition-all duration-300"
              onClick={() => openModal(index)}
            >
              <div className="relative w-full h-[580px] cursor-pointer rounded-t-xl overflow-hidden group">
                <video
                  src={product.url}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover pointer-events-none" // prevent interaction in preview
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <i className="fas fa-eye mr-1" />
                  {product.views}
                </div>
              </div>

              {/* Floating footer */}
              {/* <div className="absolute bottom-3 left-0 w-full px-2 z-10 pointer-events-none">
                <div className="bg-green-200 w-full rounded-xl p-[6px]">
                  <div className="bg-white w-full rounded-lg px-4 py-3 flex items-center gap-4 shadow-md">
                    <div className="w-16 h-16 bg-[#edf4ee] flex items-center justify-center overflow-hidden rounded">
                      <img src={product.productImage} alt={product.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="font-semibold text-sm text-black">{product.title}</p>
                      <div className="text-lg font-bold text-black">
                        ₹{product.price}
                        {product.originalPrice && (
                          <span className="text-gray-400 line-through font-medium ml-2 text-base">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modal Slider */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          {/* Close Button */}
          <div
            className="absolute top-5 right-5 z-50 text-white text-4xl cursor-pointer"
            onClick={closeModal}
          >
            &times;
          </div>

          {/* Centered Main Video with Side Peek using Swiper */}
          <Swiper
            initialSlide={activeIndex}
            centeredSlides={true}
            slidesPerView={3} // important!
            spaceBetween={10}
            loop={true}
            className="w-[70vw] px-4"
            onSlideChange={(swiper) => {
              document.querySelectorAll('.swiper-slide-video').forEach((v) => v.pause());
              const currentVideo = swiper.slides[swiper.activeIndex]?.querySelector('video');
              currentVideo?.play();
            }}
            onSwiper={(swiper) => {
              setTimeout(() => {
                const currentVideo = swiper.slides[swiper.activeIndex]?.querySelector('video');
                currentVideo?.play();
              }, 300);
            }}
          >
            {transformationData?.map((product) => (
              <SwiperSlide
                key={product.id}
                // style={{ width: '370px' }} // <- This makes center big and side small
                className="flex justify-center scale-100"
              >
                <div className="relative w-[320px] h-[640px] rounded-xl overflow-hidden shadow-lg bg-black">
                  <video
                    src={product.url}
                    controls
                    className="swiper-slide-video w-full h-full object-cover"
                  />

                  {/* View Count */}
                  <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center z-10">
                    <i className="fas fa-eye mr-1" />
                    {product.views}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute right-3 top-1/3 flex flex-col items-center gap-4 text-white text-xl z-10">
                    <button className="flex flex-col items-center">
                      <i className="fas fa-heart" />
                      <span className="text-sm">5</span>
                    </button>
                    <button>
                      <i className="fas fa-share" />
                    </button>
                  </div>

                  {/* Product Info at bottom */}
                  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[90%] z-10">
                    <div className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-md">
                      <img
                        src={product.productImage}
                        alt={product.title}
                        className="w-14 h-14 object-contain"
                      />
                      <div className="flex flex-col">
                        <p className="font-semibold text-sm text-black">{product.title}</p>
                        <div className="text-base font-bold text-black">
                          ₹{product.price}
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through text-sm ml-1">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="ml-auto bg-green-600 text-white px-4 py-2 text-sm rounded">
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      )}

    </div>
  );
};

export default Transformation;