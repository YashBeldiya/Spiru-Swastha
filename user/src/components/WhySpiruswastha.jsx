import React from "react";
import { FaHeartbeat } from "react-icons/fa";
import { GiHerbsBundle } from "react-icons/gi";
import { MdSupportAgent } from "react-icons/md";
import { GiPlantRoots } from "react-icons/gi";
import { features } from "../const/Storage";

const WhySpiruSwastha = () => {
  

  return (
    <div className="text-center py-12 px-4 bg-white">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Why SpiruSwastha?
      </h2>
      <div className="w-32 h-1 bg-green-600 mx-auto mb-10 rounded-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-green-800/5 rounded-lg p-6 flex flex-col items-center shadow-sm hover:shadow-md transition"
          >
            <img src={feature.icon} alt="" className=""/>
            <h4 className="text-2xl font-semibold text-gray-900 mt-2 mb-1">
              {feature.title}
            </h4>
            <p className="text-lg text-gray-600 text-center">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhySpiruSwastha;
