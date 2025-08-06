import React from "react";

import { superfoodData } from "../const/Storage";



const SuperFood = () => {
    return (
        <section className="py-20  bg-white w-[80%] mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
                {superfoodData.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center group transition-all duration-500 ease-in-out"
                    >
                        {/* Glow + Dance on Hover */}
                        <div className="h-28 w-28 rounded-full overflow-hidden flex items-center justify-center bg-white shadow transition-all duration-500 ease-in-out group-hover:shadow-[0_0_30px_rgba(255,255,255,0.8)]">
                            <img
                                src={item.img}
                                alt={item.label}
                                className="h-full w-full object-contain transition-transform duration-500 ease-in-out dance-on-hover"
                            />
                        </div>

                        {/* Label */}
                        <p className="text-lg md:text-lg  text-gray-800 mt-4">
                            {item.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SuperFood;