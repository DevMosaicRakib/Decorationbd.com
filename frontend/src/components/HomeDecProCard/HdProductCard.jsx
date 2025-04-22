import React, { useEffect, useState } from 'react'
import { FaOpencart } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom'
import { GiCheckMark } from "react-icons/gi";
import "./HdProCard.scss";
import QuickView from '../QuickView/QuickView';
import { useAddItemToCartMutation, useFetchCartItemsQuery } from '../../Redux/CartSlice/cartApi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../../Redux/UserAndAuthServices/LocalStorageService';
import label from "../../Assets/img/label.png"
import SingleProductPopUp from '../SingleProductPopUp/SingleProductPopUp';
const HdProductCard = ({data,open,setOpen,singlePopup,setSinglePopUp,autoclose,deviceCookie}) => {
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
  const [selectedProduct,setSelectedProduct] = useState(null)
  const [addItemToCart] = useAddItemToCartMutation();
  const d = encodeURIComponent(data?.name?.replace(/\//g, '~'));
  const {access_token} = getToken()


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
    <div className='w-full 768px:h-[260px] 1280px:h-[260px] h-[420px]
    300px:h-[300px] bg-white rounded-sm card-container2
    shadow-sm  768px:p-[2px] 1024px:p-2 1280px:p-[2px]  p-[5px] relative cursor-pointer'>
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
        
            <div className='imgContainer2 bg-white overflow-hidden '>
            <Link to={`/product/${d}`}>
            <img src={process.env.REACT_APP_IMG_URL+data.product_imgs[0].images} alt="" className='img w-[130px] h-[130px] 
            300px:w-[155px] 300px:h-[155px] 768px:w-[130px] 768px:h-[130px]
            mx-auto  object-cover'/>
            </Link>
            <span className='quickView2'><IoIosSearch size={16} title='Quick View'
            onClick={()=>{handleQuickView(data.id)}}/></span>
             {open && selectedProduct ? (
                  <QuickView open={open} setOpen={setOpen} data={selectedProduct} autoclose={autoclose} deviceCookie={deviceCookie}/>
                ) : null}
            </div>
      
    
        <Link to={`/product/${d}`}>
          <h4 className='pb-2 font-[400] text-[#242424] pt-1 768px:ml-[5px] ml-[2px] text-[11px]'>
            {data.name.length>40 ? data.name.slice(0,40) + "..." : data.name}
          </h4>
        </Link>
        <div className='flex flex-col items-center ml-[2px] gap-1 mr-1 justify-between overflow-hidden w-full'>
        <div className="stock2 text-[gray] flex items-center
         justify-between gap-[1px] 768px:mr-[15px] 300px:mr-0 mr-[10px]">
            <span className='text-[8px]'>(</span><GiCheckMark className='text-[rgb(0,123,196)] text-[8px]'/>
            <span className='capitalize font-[400] text-[8px]'>{data.stock}</span><span className='text-[8px]'>)</span>
          </div>
          <div className="price2  mr-[2px]">
          {/* <span className="lineThroughPrice line-through text-[13.6px] font-[600] mr-[3px]">{data.price}
            <strong className='
             text-[13.6px] font-[600] font-Roboto'>৳</strong></span>

            <span className='text-[#007bc4] font-[600] 
              text-[13.6px]'>{data.discount_price}<strong 
            className=' text-[13.6px] font-[600] font-Roboto'>৳</strong></span> */}
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
                                  : <div className='flex items-center gap-[2px] pt-2'>
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

        <div className="btn2 ">
          <div className="add-to-cart2 " onClick={()=>{handleSinglePopup(data.id)}}>add to cart</div>
          {/* <div className="cart-icon2"><FaOpencart/></div> */}
        </div>
        {
          singlePopup && selectedProduct ? (
            <SingleProductPopUp singlePopup={singlePopup} setSinglePopUp={setSinglePopUp} data={selectedProduct} autoclose={autoclose} deviceCookie={deviceCookie}/>
          ) : null
        }
    </div>
  )
}

export default HdProductCard
