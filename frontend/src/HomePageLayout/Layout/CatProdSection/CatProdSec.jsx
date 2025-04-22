import React, { useEffect, useState } from 'react';
// import Styles from "../../../Styles/Styles.js";
// import { productData } from "../../../Static/Data.js";
import "./CartProdSec.scss";
// import HdProductCard from '../../../components/HomeDecProCard/HdProductCard.jsx';
import CatSecProdCard from "../../../components/CatSecProCard/CatProdCard.jsx"
import image from "../../../Assets/img/ProductNotFound/img4.jpg"
// import useFetch from '../../../customHooks/useFetch.js';
const CatProdSec = ({open,setOpen,singlePopup,setSinglePopUp, product_section_data, allProductData,autoclose,deviceCookie}) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState([]);
  // console.log(product_section_data)
  // Auto-select category or subcategory on component load
  useEffect(() => {
    if (allProductData?.length && product_section_data) {
      // Check for categories first
      if (product_section_data?.category?.length > 0 && product_section_data?.show_categorywise_product) {
        handleCategoryClick(product_section_data?.category[0]?.catname);
      } 
      // Fallback to subcategories if categories are not present or not shown
      else if (product_section_data?.sub_category?.length > 0 && product_section_data?.show_subcategorywise_product) {
        handleCategoryClick("All");
      }
    }
  }, [product_section_data, allProductData]);
  

  // Filter products based on clicked category or subcategory
  const handleCategoryClick = (name) => {
    setActiveCategory(name);
    let filtered;

    if (name === "All") {
      // Show all products if "All" is selected
      if (product_section_data?.category?.length > 0) {
        // Filter by the first category in product_section_data
        filtered = allProductData?.filter(
          (product) =>
            product?.Category?.catname === product_section_data.category[0].catname
        );
      }
    } else {
      filtered = allProductData?.filter(
        (product) =>
          product?.Category?.catname === name ||
          product?.Sub_category?.subcatname === name
      );
    }

    const limitedProducts = filtered?.slice(0, Number(product_section_data?.product_limitation) || filtered?.length);
    setFilteredProducts(limitedProducts || []);
  };
  return (
    <div className='1350px:w-[81.5%] 1350px:mx-auto 1024px:w-[98%] 1280px:w-[83%] 
    w-[100%]   mx-auto catProdSection'>
    <div
      className={`w-full h-full catProdContainer`}>
      <div className={` text-start flex 300px:flex-col 300px:gap-[5px] 768px:flex-row 768px:gap-[30px] 1024px:gap-[40px]
      1350px:gap-[60px] 768px:items-center`}>
        <h1 className='font-[500]'>{product_section_data?.title}</h1>
        <div className="catsubCategories 300px:overflow-x-scroll whitespace-nowrap scroll scroll-smooth 768px:overflow-x-hidden">
            {/* "All" option for  subcategories */}
            {product_section_data?.sub_category?.length > 0 && product_section_data?.show_subcategorywise_product ? (
              <span
              onClick={() => handleCategoryClick("All")}
              className={`cursor-pointer ${
                activeCategory === "All" ? "text-[#077bc4]" : "text-[#fff]"
              }`}
            >
              All
            </span>
            ) : ''}
            

            {product_section_data?.category?.length > 0 && product_section_data?.show_categorywise_product ? (
              product_section_data?.category.map((cat, index) => (
                <span
                  key={index}
                  onClick={() => handleCategoryClick(cat?.catname)}
                  className={`cursor-pointer ${
                    activeCategory === cat?.catname ? "text-[#077bc4]" : "text-[#fff]"
                  }`}
                >
                  {cat?.catname}
                </span>
              ))
            ) : (
              product_section_data?.sub_category.map((subcat, index) => (
                <span
                  key={index}
                  onClick={() => handleCategoryClick(subcat?.subcatname)}
                  className={`cursor-pointer ${
                    activeCategory === subcat?.subcatname ? "text-[#077bc4]" : "text-[#fff]"
                  }`}
                >
                  {subcat?.subcatname}
                </span>
              ))
            )}
      </div>
      </div>

      <div>
    
       <div >
       {filteredProducts && filteredProducts?.length===0?(
          <div
          className={` catSecProductCard`}
        >
          <img src={image} alt="" className='w-full 1024px:h-[500px] h-full 1024px:object-cover object-contain'/>
        </div>
       ):(
          <div
          className={`grid grid-cols-2 gap-[6px] md:grid-cols-4 md:gap-[11px] 
         lg:grid-cols-5 lg:gap-[10px] xl:grid-cols-6 xl:gap-[11px] 1350px:gap-[13px] catSecProductCard`}
        >
          {filteredProducts && filteredProducts?.map((i, index) => <CatSecProdCard data={i} key={index} open={open} setOpen={setOpen} singlePopup={singlePopup} setSinglePopUp={setSinglePopUp} autoclose={autoclose} deviceCookie={deviceCookie}/>)}
        </div>
       )}
     </div>

      </div>
    </div>
  </div>
  )
}

export default CatProdSec
