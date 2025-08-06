

import React, { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

const Accordion = ({ content, loading, error }) => {
  const [openSections, setOpenSections] = useState({
    description: false,
    benefits: false,
    howtoUse: false,
    faqs: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) {
    return <div className="text-center py-4">Loading content...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500"></div>;
  }

  if (!content) {
    return <div className="text-center py-4">No content available.</div>;
  }

  return (
    <div className="space-y-2">
      {content.description && (
        <div className="rounded-md">
          <div
            onClick={() => toggleSection('description')}
            className="flex justify-between items-center bg-gray-100 px-4 py-1 cursor-pointer text-[15px]"
          >
            <h2 className="text-gray-400 text-lg font-semibold py-1">Description</h2>
            <span className="text-green-700">
              {openSections.description ? <FaMinus size={10} /> : <FaPlus size={10} />}
            </span>
          </div>
          {openSections.description && (
            <div className="p-2 space-y-1 text-gray-700 text-sm leading-relaxed">
              <p>{content.description}</p>
            </div>
          )}
        </div>
      )}

      {content.benefits && content.benefits.length > 0 && (
        <div className="rounded-md">
          <div
            onClick={() => toggleSection('benefits')}
            className="flex justify-between items-center bg-gray-100 px-4 py-1 cursor-pointer text-[15px]"
          >
            <h2 className="text-gray-400 text-lg font-semibold py-1">Benefits</h2>
            <span className="text-green-700">
              {openSections.benefits ? <FaMinus size={10} /> : <FaPlus size={10} />}
            </span>
          </div>
          {openSections.benefits && (
            <div className="p-2 space-y-2 text-gray-700 text-sm leading-relaxed">
              {content.benefits.map((benefit, idx) => (
                <div key={idx}>
                  <h3 className="text-green-700 font-bold text-md">{benefit.title}</h3>
                  <p>{benefit.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {content.howtoUse && content.howtoUse.length > 0 && (
        <div className="rounded-md">
          <div
            onClick={() => toggleSection('howtoUse')}
            className="flex justify-between items-center bg-gray-100 px-4 py-1 cursor-pointer text-[15px]"
          >
            <h2 className="text-gray-400 text-lg font-semibold py-1">How to Use</h2>
            <span className="text-green-700">
              {openSections.howtoUse ? <FaMinus size={10} /> : <FaPlus size={10} />}
            </span>
          </div>
          {openSections.howtoUse && (
            <div className="p-2 space-y-2 text-gray-700 text-sm leading-relaxed">
              {content.howtoUse.map((step, idx) => (
                <div key={idx}>
                  <h3 className="text-green-700 font-bold text-md">Step {idx + 1}: {step.step}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {content.faqs && content.faqs.length > 0 && (
        <div className="rounded-md">
          <div
            onClick={() => toggleSection('faqs')}
            className="flex justify-between items-center bg-gray-100 px-4 py-1 cursor-pointer text-[15px]"
          >
            <h2 className="text-gray-400 text-lg font-semibold py-1">FAQs</h2>
            <span className="text-green-700">
              {openSections.faqs ? <FaMinus size={10} /> : <FaPlus size={10} />}
            </span>
          </div>
          {openSections.faqs && (
            <div className="p-2 space-y-2 text-gray-700 text-sm leading-relaxed">
              {content.faqs.map((faq, idx) => (
                <div key={idx}>
                  <h3 className="text-green-700 font-bold text-md">Q: {faq.que}</h3>
                  <p>A: {faq.ans}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Accordion;