import React from 'react'
import "./FeaturedProduct.scss";
import { Link } from 'react-router-dom';

const FeaturedProduct = ({data}) => {
  // console.log(data)
  const d = data?.name;
  // const product_name = d.replace(/\s+/g,"-");
  const product_name = encodeURIComponent(d?.replace(/\//g, '~'));
  const getPriceRange = (variants) => {
    const prices = variants.map((variant) => parseFloat(variant.price)); // Extract prices
    const discountPrices = variants.map((variant) => parseFloat(variant.discount_price)); // Extract discount prices
  
    const minPrice = Math.min(...prices); // Minimum price
    const minDiscountPrice = Math.min(...discountPrices); // Minimum discount price
  
    return { minPrice, minDiscountPrice };
  };
  return (
    <div className='productSection hover:shadow-2xl hover:shadow-black hover:rounded-sm'>
     <div className='prodContainer'>
     <Link to={`/product/${product_name}`}><img src={process.env.REACT_APP_IMG_URL+data?.product_imgs[0]?.images} alt="" /></Link>
       <div className="textAndPrice">
       <Link to={`/product/${product_name}`}>
       <h4>
      {data?.name?.length>40 ? data?.name?.slice(0,40) + "..." : data?.name}
      </h4>
       </Link>
      <div className="price text-[gray]  1500px:mr-[12px] mr-0">
            {/* <span className="lineThroughPrice line-through
            text-[13px] font-[400] mr-[6px]">{Number(data?.price).toFixed(2)}
            <strong className='text-[13px] font-[400] font-Roboto'>৳</strong></span>
            <span className='text-[#007bc4] font-[400] text-[13px]'>{Number(data?.discount_price).toFixed(2)}<strong 
            className='text-[13px] font-[400] font-Roboto'>৳</strong></span> */}

            {data?.variants?.length > 1 ? (
                            <div className="price text-[gray]  768px:mr-[12px] 1024px:mr-[5px] 1500px:mr-[12px] mr-[2px]">
                            {data.variants.some((variant) => variant.value !== "standard") ? (
                              (() => {
                                const { minPrice, minDiscountPrice } = getPriceRange(data.variants);
                                const currencySymbol = <strong className="text-[13.6px] font-[600] font-Roboto">৳</strong>;

                                return minPrice === minDiscountPrice 
                                  ? <p className={`text-[#007bc4] font-[600] 
                                     text-[13.6px]`}>
                                      {Number(minPrice)} {currencySymbol}
                                    </p>
                                  : <div className='flex items-center gap-[2px]'>
                                  <p className={`mr-[10px] font-[500] text-[13px] text-[gray] line-through`}>
                                    {minPrice}
                                    <strong className="text-[13px] font-Roboto">৳</strong>
                                  </p>
                                  <p className={`text-[13px] font-[500] text-[#077bc4]`}>
                                    {minDiscountPrice}
                                    <strong className="text-[13px] font-Roboto">৳</strong>
                                  </p>
                                </div>
                              })()
                            ) : (
                              <div className="flex pt-4 items-center">
                              <p className={`lineThroughPrice line-through font-[600]  
                        text-[13.6px] 768px:mr-[6px] mr-[3px] text-[gray]`}>
                                {Math.floor(Number(data?.variants[0]?.price))}
                                <strong className="text-[13.6px] font-[600] font-Roboto">৳</strong>
                              </p>
                              <p className={`text-[#007bc4] font-[600] 
                        text-[13.6px]`}>
                                {Math.floor(Number(data?.variants[0]?.discount_price))}
                                <strong className="text-[13.6px] font-[600] font-Roboto">৳</strong>
                              </p>
                            </div>
                            )}
              </div>
              ) : (
                <div className="flex pt-4 items-center">
                  <p className={`lineThroughPrice line-through font-[600]  
            text-[13.6px] 768px:mr-[6px] mr-[3px] text-[gray]`}>
                    {Math.floor(Number(data?.variants[0]?.price))}
                    <strong className="text-[13.6px] font-[600] font-Roboto">৳</strong>
                  </p>
                  <p className={`text-[#007bc4] font-[600] 
            text-[13.6px]`}>
                    {Math.floor(Number(data?.variants[0]?.discount_price))}
                    <strong className="text-[13.6px] font-[600] font-Roboto">৳</strong>
                  </p>
                </div>
              )} 
          </div>
       </div>
     </div>
    </div>
  )
}

export default FeaturedProduct
