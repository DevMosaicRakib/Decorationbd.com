import React, { useEffect, useState } from 'react'
import { FaOpencart } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom'
import { GiCheckMark } from "react-icons/gi";
import "./ShopProduct.scss"
import QuickView from '../QuickView/QuickView';
import { useAddItemToCartMutation, useFetchCartItemsQuery } from '../../Redux/CartSlice/cartApi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../../Redux/UserAndAuthServices/LocalStorageService';
import label from "../../Assets/img/label.png"
import SingleProductPopUp from '../SingleProductPopUp/SingleProductPopUp';
const ShopProduct = ({data,open,setOpen,singlePopup,setSinglePopUp,autoclose,deviceCookie}) => {
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
  const [addItemToCart] = useAddItemToCartMutation();
  const d = encodeURIComponent(data?.name?.replace(/\//g, '~'));
  // console.log(d)
  const [selectedProduct,setSelectedProduct] = useState(null);
  const handleQuickView = async (productId) => {
    if (!productId) {
        console.error("Product ID is undefined");
        return;
    }
    console.log(productId)
    try {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}api/QuickView/${productId}`);
        console.log(result);
        setSelectedProduct(result.data);
        setOpen(true);
    } catch (error) {
        console.error("Error fetching product data:", error);
    }
  };
  const handleSinglePopup = async (productId) => {
    if (!productId) {
        console.error("Product ID is undefined");
        return;
    }
    console.log(productId)
    try {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}api/QuickView/${productId}`);
        console.log(result);
        setSelectedProduct(result.data);
        setSinglePopUp(true)
    } catch (error) {
        console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    if (!open) {
        setSelectedProduct(null); // Reset selected product when modal is closed
    }
  }, [open]);

  useEffect(() => {
    if (!singlePopup) {
        setSelectedProduct(null); // Reset selected product when modal is closed
    }
  }, [singlePopup]);

  const getPriceRange = (variants) => {
    const prices = variants.map((variant) => parseFloat(variant.price)); // Extract prices
    const discountPrices = variants.map((variant) => parseFloat(variant.discount_price)); // Extract discount prices
  
    const minPrice = Math.min(...prices); // Minimum price
    const minDiscountPrice = Math.min(...discountPrices); // Minimum discount price
  
    return { minPrice, minDiscountPrice };
  };

  const priceRange = getPriceRange(data?.variants || []);
    // const product_name = d.replace(/\s+/g,"-");
  return (
    <div className='w-full 300px:h-[300px] 768px:h-[300px] 1280px:h-[284px] 1350px:h-[300px] bg-white rounded-sm card-container4
    shadow-xl 768px:p-3 1280px:p-[2px]  p-[2px] relative cursor-pointer'>
      <div className="absolute top-[-12px] left-[2px] z-[1]">
        <div className="relative">
          <img src={label} className='w-[45px] h-[85px] z-[9]' />
            <span className='absolute top-[14px] left-[14px] text-center flex flex-col items-center justify-start 
            text-[#fff] font-[900] text-[10px]'>
               <span>
            {Math.floor(
              ((priceRange.minPrice - priceRange.minDiscountPrice) / priceRange.minPrice) * 100
            )}
            %
          </span> <span>OFF</span>  </span>
        </div>
      </div>
      <div className="flex justify-end">
        </div>
       
            <div className='imgContainer4 bg-white overflow-hidden'>
            <Link to={`/product/${d}`}>
            <img src={process.env.REACT_APP_IMG_URL + data.product_imgs[0].images} alt="" className=' img
            mx-auto 768px:mt-0 1280px:mt-[2px]  mt-[2px] 768px:mb-0 1024px:mt-[5px] 1024px:mb-[5px]
            1280px:mb-[2px] 1350px:mt-0 1350px:mb-0  mb-[2px] w-[150px] h-[150px] 1280px:w-[142px] 1280px:h-[142px] 
            1350px:w-[150px] 1350px:h-[150px] object-cover'/>
             </Link>
             <span className='quickView4 hidden 1350px:block'><IoIosSearch size={16} title='Quick View'
            onClick={()=>{handleQuickView(data.id)}}/></span>
             {open && selectedProduct ? (
                  <QuickView open={open} setOpen={setOpen} data={selectedProduct} autoclose={autoclose} deviceCookie={deviceCookie}/>
                ) : null}
            </div>
       

        <Link to={`/product/${d}`}>
          <h4 className='pb-3 font-[400] text-[#242424] pt-2 768px:ml-[10px] 1280px:ml-[2px] 1300px:ml-[10px]
           ml-[5px] text-[11px]'>
            {data.name.length>45 ? data.name.slice(0,45) + "..." : data.name}
          </h4>
        </Link>
        <div className='flex flex-col  items-center 768px:ml-0 1280px:ml-0 
         ml-0 gap-1 stockAndPrice 
         overflow-hidden w-full'>
        <div className="stock4 flex items-center
         justify-between gap-[1px] mr-[10px] 768px:mr-0">
            <span className='text-[8px]'>(</span><GiCheckMark className='text-[#007bc4] text-[8px] '/>
            <span className='capitalize font-[400] text-[8px] '>{data.stock}</span>
            <span className='text-[8px]'>)</span>
          </div>
          <div className="price4 text-[gray]">
          {data?.variants?.length > 1 ? (
                            <div className="price text-[#242424]  768px:mr-[12px] 1024px:mr-[5px] 1500px:mr-[12px] mr-[2px]">
                            {data.variants.some((variant) => variant.value !== "standard") ? (
                              (() => {
                                const { minPrice, minDiscountPrice } = getPriceRange(data.variants);
                                const currencySymbol = <strong className="text-[13.6px] font-[600] font-Roboto">৳</strong>;

                                return minPrice === minDiscountPrice 
                                  ? <p className={`text-[#007bc4] font-[600] 
                                     text-[13.6px]`}>
                                      {Number(minPrice)} {currencySymbol}
                                    </p>
                                  : <div className='flex items-center gap-[2px] pt-3'>
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
                              <div className="flex pt-3 items-center">
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
                <div className="flex pt-3 items-center">
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

        <div className="btn4">
          <div className="add-to-cart4 font-[400]" onClick={()=>{handleSinglePopup(data.id)}}>add to cart</div>
          {/* <div className="cart-icon4"><FaOpencart/></div> */}
        </div>
        {
          singlePopup && selectedProduct ? (
            <SingleProductPopUp singlePopup={singlePopup} setSinglePopUp={setSinglePopUp} data={selectedProduct} autoclose={autoclose} deviceCookie={deviceCookie}/>
          ) : null
        }
    </div>
  )
}

export default ShopProduct
