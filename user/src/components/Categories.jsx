import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategorydata } from '../redux/slice/categorySlice'

const Categories = () => {
  const {categoryData,loading} = useSelector((state) => state.categories)
  const dispatch = useDispatch()
  useEffect(() => {
   dispatch(fetchCategorydata())
  }, [])
  // console.log(categoryData)
  

  return (
    <>
        <section className="py-20">
      <h2 className="text-4xl font-extrabold text-center mb-10">
        Shop By Categories
        <div className="w-36 h-0.5 bg-green-600 mx-auto mt-4 rounded"></div>
      </h2>
        
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 px-2">
        {categoryData.map((category, index) => (
          <NavLink to={'/collection/'+category.slug}>
          <div
            key={index}
            className="flex flex-col items-center justify-center text-center space-y-2"
          >
            <div className=" flex items-center justify-center p-3">
              <img src={category.categoryImage} alt={category.name} className="w-full h-full object-contain" />
            </div>
            <p className="text-md font-bold">{category.name}</p>
          </div>
          </NavLink>
        ))}
      </div>
        
        
    </section>
    </>
  )
}

export default Categories