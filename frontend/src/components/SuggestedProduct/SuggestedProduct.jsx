import React, { useEffect, useState } from 'react'
import Styles from "../../Styles/Styles"
// import { productData } from '../../Static/Data';
import ShopProduct from "../../components/ShopProduct/ShopProduct"
import CatProdCard from '../CatSecProCard/CatProdCard'
import useFetch from '../../customHooks/useFetch';
// import axios from 'axios';
const SuggestedProduct = ({data,open,setOpen,singlePopup,setSinglePopUp,autoclose,deviceCookie}) => {
    const allprodctData = useFetch('api/products/')
    // console.log(allprodctData);
    // console.log(data);
  
      
      const [products, setProducts] = useState(null);
    
      
      useEffect(() => {
        if (allprodctData) {
          const filteredData = allprodctData?.filter((i) => i?.Category?.catname === data?.Category?.catname);
          setProducts(filteredData);
        }
      }, [allprodctData, data.Category]);
    
      // rest of the component
  
  return (
    <>
    {
        data ? (
            <div className={` p-1 1350px:py-[30px] 1350px:px-[58px] 1280px:px-[15px] 768px:w-[90%]  1024px:w-[98%]
            w-[94%] 1280px:w-[83%] 1350px:w-[81.5%] mx-auto bg-[rgb(234,234,234,0.3)] mb-[50px]`}>
                <h2 className={`text-[16px] font-[500] text-[orangered]
                   mt-[8px]`}>
                    Related Products
                </h2>
                <div className="w-[4%] h-[2px] bg-[rgb(7,123,196,0.6)] mb-[10px]"></div>
                <div className="productsPart grid grid-cols-2 gap-[6px]
        md:grid-cols-4 md:gap[10px] lg:grid-cols-5 xl:grid-cols-6 1280px:gap-[15px] 1350px:gap-[14px]
         300px:w-[98%] 768px:w-[100%]  1024px:w-[98%] w-[86%] 1280px:w-[95%] 1350px:w-[100%] mx-auto mb-[10px]">
           {products && products.map((i,index)=>(
              <ShopProduct data={i} key={index} open={open} setOpen={setOpen} singlePopup={singlePopup} 
              setSinglePopUp={setSinglePopUp} autoclose={autoclose} deviceCookie={deviceCookie}/>
           ))}
           
        </div>
          </div>
        ) : null
    }
    </>
  )
}

export default SuggestedProduct
