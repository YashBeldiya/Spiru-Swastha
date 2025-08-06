import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { spiruTabsData } from "../const/Storage";

const SpiruSwasthaTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-16 px-4 md:px-8 lg:px-10 bg-gray-50">
     <h2 className="text-4xl font-extrabold text-center mb-10">
     Why Choosе SpiruSwastha?
        <div className="w-36 h-0.5 bg-green-700 mx-auto mt-4 rounded"></div>
      </h2>

      {/* Desktop View */}
      <div className="hidden lg:flex flex-row gap-8 items-start">
        {/* Tab list */}
        <div className="w-1/3 space-y-4">
          {spiruTabsData.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-full text-left font-semibold transition-all duration-300 group ${
                activeTab === index
                  ? "bg-green-700 text-white"
                  : "border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white"
              }`}
            >
              {tab.label}
              <FaArrowRight
                className={`ml-2 transition-transform duration-300 group-hover:translate-x-1 ${
                  activeTab === index ? "text-white" : "text-green-700 group-hover:text-white"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Image */}
        <div className="w-1/2">
          <img
            src={spiruTabsData[activeTab].image}
            alt={spiruTabsData[activeTab].label}
            className="rounded-xl w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="w-1/3 text-gray-700 text-sm md:text-base space-y-4">
          {spiruTabsData[activeTab].content}
        </div>
      </div>

      {/* Tablet View (768px–1023px) */}
      <div className="hidden md:flex lg:hidden gap-8 flex-row">
        {/* Left: Tab List */}
        <div className="w-1/3 space-y-4">
          {spiruTabsData.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-full text-left font-semibold transition-all duration-300 group ${
                activeTab === index
                  ? "bg-green-600 text-white"
                  : "border-2 border-green-600 text-green-600 hover:bg-green-100 hover:text-green-700"
              }`}
            >
              {tab.label}
              <FaArrowRight
                className={`ml-2 transition-transform duration-300 group-hover:translate-x-1 ${
                  activeTab === index ? "text-white" : "text-green-600 group-hover:text-green-700"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Right: Image + Content */}
        <div className="w-2/3 flex flex-col gap-6">
          <img
            src={spiruTabsData[activeTab].image}
            alt={spiruTabsData[activeTab].label}
            className="rounded-xl w-full object-cover"
          />
          <div className="text-gray-700 text-sm md:text-base space-y-4">
            {spiruTabsData[activeTab].content}
          </div>
        </div>
      </div>

      {/* Mobile View (<768px) */}
      <div className="md:hidden flex flex-col gap-6">
        {spiruTabsData.map((tab, index) => (
          <div key={index} className="border border-green-600 rounded-lg">
            <button
              onClick={() => setActiveTab(activeTab === index ? -1 : index)}
              className={`w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-green-700 ${
                activeTab === index ? "bg-green-100" : "bg-white"
              }`}
            >
              {tab.label}
              <FaArrowRight
                className={`transition-transform duration-300 ${
                  activeTab === index ? "rotate-90 text-green-700" : "text-green-600"
                }`}
              />
            </button>

            {activeTab === index && (
              <div className="px-4 py-3 text-sm text-gray-700">
                {/* No image on mobile */}
                {tab.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpiruSwasthaTabs;