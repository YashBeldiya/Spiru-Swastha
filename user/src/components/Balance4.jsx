import React from 'react'
import { balanceData } from '../const/Storage'

const Balance4 = () => {
  return (
    <>
    <section className="py-16 text-center bg-white">
      <h2 className="text-4xl font-bold mb-2">4 Balance</h2>
      <div className="w-30 h-0.5 bg-green-600 mx-auto mb-10"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {balanceData.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center text-center px-4">
            <img src={item.icon} alt={item.title} className="w-20 h-20 mb-4" />
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-500 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
    </>
  )
}

export default Balance4