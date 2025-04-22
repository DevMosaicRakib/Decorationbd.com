import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GiCheckMark } from "react-icons/gi";
import "./ProductCard.scss";
import { FaOpencart } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import QuickView from "../../components/QuickView/QuickView.jsx"
import { useAddItemToCartMutation, useFetchCartItemsQuery } from '../../Redux/CartSlice/cartApi.js';
import useFetch from '../../customHooks/useFetch.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../../Redux/UserAndAuthServices/LocalStorageService.js';
import label from "../../Assets/img/label.png"
import SingleProductPopUp from '../SingleProductPopUp/SingleProductPopUp.jsx';
// import { useDispatch } from 'react-redux';
// import { addToCart } from '../../Redux/CartSlice/CartSlice.js';


const ProductCard = ({data,open,setOpen,singlePopup,setSinglePopUp,count,decrementQuantity,incrementQuantity,autoclose,deviceCookie}) => {
  // console.log(data)
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
  const [addItemToCart] = useAddItemToCartMutation();
  // const [hoverCartIcon,setHoverCartIcon] = useState(false);
  // const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity,setQuantity] = useState(1);
  const decrementNumber = ()=>{
    if(quantity>1){setQuantity(quantity-1)}
  }
  const incrementNumber = ()=>{setQuantity(quantity+1)}
  const d = encodeURIComponent(data?.name?.replace(/\//g, '~'));
  // const d = data?.name
  // const product_name = d.replace(/\s+/g,"-");

  // const handleAddToCart = (data)=>{
  //   dispatch(addToCart(data))
  // }

  const {access_token} = getToken();



  
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
  return (
    <div className='w-full 300px:h-[320px] 768px:h-[320px] 1350px:h-[320px] 1280px:h-[320px]
     bg-black rounded-sm card-container
    shadow-sm  768px:p-1 1024px:p-[1px] 1280px:p-[2px]  p-[5px] relative cursor-pointer'>
      <div className="absolute top-[-11px] left-[4px] z-[1]">
        <div className="relative">
          <img src={label} className='w-[45px] h-[85px] z-[9]' />
            <span className='absolute top-[14px] left-[14px] text-center flex flex-col items-center justify-start 
            text-[#fff] font-[900] text-[10px]'><span>
            {Math.floor(
              ((priceRange.minPrice - priceRange.minDiscountPrice) / priceRange.minPrice) * 100
            )}
            %
          </span> <span>OFF</span>  </span>
        </div>
      </div>
      <div className="flex justify-end">
        </div>
        <div className='imgContainer'>
          <Link to={`/product/${d}`}>
            <img src={ process.env.REACT_APP_IMG_URL+data?.product_imgs[0]?.images} alt="" className='img  w-[160px] 
              h-[160px] 1024px:w-[170px] 1024px:h-[170px] 
              1280px:w-[160px] 1280px:h-[160px] 1024px:mt-[2px] 1280px:mt-[1px] 1350px:mt-[2px] 
              mx-auto object-cover'/>
          </Link>
            <span className='quickView'
            onClick={() => handleQuickView(data.id)}><IoIosSearch size={16} title='Quick View'
            /></span>
                {open && selectedProduct ? (
                  <QuickView open={open} setOpen={setOpen} data={selectedProduct} autoclose={autoclose} deviceCookie={deviceCookie}/>
                ) : null}
        </div> 
        <Link to={`/product/${d}`}>
          <h4 className='pb-[5px] font-[400] text-white 768px:pt-2 pt-[5px] 
          768px:ml-[2px] 1024px:ml-[7px] 1350px:ml-[5px] ml-[5px] text-[11px]'>
            {data?.name?.length>50 ? data?.name?.slice(0,50) + "..." : data?.name}
          </h4>
        </Link>
        <div className='flex items-center 768px:ml-[14px] 1024px:ml-[5px]  justify-center 
         flex-col 1350px:flex-col'>
        
          {/* <div className="">
            <span className=" ">{data?.variants[0]?.price}
            <strong className=''>৳</strong></span>
            <span className=''>{data?.variants[0]?.discount_price}<strong 
            className=' text-[13.6px] font-[600] font-Roboto'>৳</strong></span>
          </div> */}



          {data?.variants?.length > 1 ? (
                            <div className="price text-white  768px:mr-[12px] 1024px:mr-[5px] 1500px:mr-[12px] mr-[2px]">
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
                                  <p className={`mr-[10px] font-[500] text-[13px] line-through`}>
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
                              {/* <p className={`lineThroughPrice line-through font-[600]  
                                text-[13.6px] 768px:mr-[6px] mr-[3px] text-white`}>
                                {Math.floor(data?.variants[0]?.price)}
                                <strong className="text-[13.6px] font-[600] font-Roboto">৳</strong>
                              </p> */}
                              <p className={`lineThroughPrice line-through font-[600]  
                                text-[13.6px] 768px:mr-[6px] mr-[3px] text-white`}>
                              {`${Math.floor(Number(data?.variants[0]?.price))}৳`}
                            </p>

                            <p className={`text-[#007bc4] font-[600] 
                                                    text-[13.6px]`}>
                              {`${Math.floor(Number(data?.variants[0]?.discount_price))}৳`}
                            </p>

                            </div>
                            )}
              </div>
              ) : (
                <div className="flex items-center">
                  <p className={`lineThroughPrice line-through font-[600]  
            text-[13.6px] 768px:mr-[6px] mr-[3px] text-white`}>
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

        <div className="quantity mx-auto">
          <span className='minus ' onClick={decrementNumber}>-</span>
          <span className='text-[13px]'>{quantity}</span>
          <span className='plus' onClick={incrementNumber}>+</span>
        </div>
        <div className="btn ">
          <div className="add-to-cart" onClick={()=>{handleSinglePopup(data.id)}}>add to cart</div>
          {/* <div className="cart-icon"><FaOpencart/></div> */}
        </div>
        {
          singlePopup && selectedProduct ? (
            <SingleProductPopUp singlePopup={singlePopup} setSinglePopUp={setSinglePopUp} data={selectedProduct} autoclose={autoclose} deviceCookie={deviceCookie}/>
          ) : null
        }
    </div>
  )
}

export default ProductCard
