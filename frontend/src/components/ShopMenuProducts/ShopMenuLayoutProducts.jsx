import { Link } from "react-router-dom";
import Styles from "../../Styles/Styles"
import { useEffect, useState } from "react";
import { GiCheckMark } from "react-icons/gi";
import { FaOpencart } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import "./ShopMenu.scss";
import QuickView from "../QuickView/QuickView";
import axios from "axios";
import { toast } from "react-toastify";
import { useAddItemToCartMutation, useFetchCartItemsQuery } from "../../Redux/CartSlice/cartApi";
import { getToken } from "../../Redux/UserAndAuthServices/LocalStorageService";
import label from "../../Assets/img/label.png"
import SingleProductPopUp from "../SingleProductPopUp/SingleProductPopUp";

const ShopMenuLayoutProducts = ({data,open,setOpen,singlePopup,setSinglePopUp,autoclose,deviceCookie}) => {
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
    const [count,setCount] = useState(1);
    const [selectedProduct,setSelectedProduct] = useState(null)
    const decrementQuantity = () =>{
        if(count>1){
            setCount(count-1);
        }
    }
    const incrementQuantity = () =>{
        setCount(count+1);
    }
    const d = encodeURIComponent(data?.name?.replace(/\//g, '~'));
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
    return(
      <div className="flex items-center gap-[30px] w-[98%] rounded-sm shadow-md shadow-[gray] relative">
      <div className="absolute top-[-14px] left-0 z-[1]">
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
         <div>
        
        <div className=" 1280px:h-[140px] 1280px:w-[140px] overflow-hidden bg-[#fff] relative group">
        <Link to={`/product/${d}`}>
          <img src={process.env.REACT_APP_IMG_URL + data.product_imgs[0].images} alt="" className='w-full h-full 1280px:p-[1px] object-cover 
          group-hover:scale-[1.1] transition-all duration-[0.8s] delay-0 ease-in'/>
          </Link>
          <span className='quickView5 absolute  hidden 
           1350px:group-hover:block'title='Quick View'
           onClick={()=>{handleQuickView(data.id)}}><IoIosSearch size={18}/></span>
            {open && selectedProduct ? (
                  <QuickView open={open} setOpen={setOpen} data={selectedProduct} autoclose={autoclose} deviceCookie={deviceCookie}/>
                ) : null}
        </div>
   
        </div>
        <div className="flex flex-col  gap-[10px]">
          <div className="pb-[5px] pl-2">
          <Link to={`/product/${d}`}>
          <h3 className='font-[400] text-[11px] text-[#242424]'>{data.name}</h3>
          </Link>
          </div>
           <div className="flex  pl-2 items-center gap-[60px]">
            <div className="flex items-center gap-[1px]">
                <span className="text-[8px]">(</span><GiCheckMark  className="text-[#077bc4] text-[8px]"/>
                <h6 className="font-[400] text-[8px] text-[#242424]">{data.stock}</h6><span className="text-[8px]">)</span>
            </div>
            <div className="flex  items-center">
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
                              <div className="flex items-center">
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
                <div className="flex items-center">
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
           <div className="flex items-center gap-[50px]">
           <div className={`${Styles.normal_flex} mt-3 pl-2 pr-3`}>
                  <button
                    className="py-[2px]
                             px-[10px] text-center text-white bg-[#009ccc] text-[13px]"
                    onClick={decrementQuantity}
                  >
                    -
                  </button>
                  <span className="py-1 px-5 text-center text-[13px] font-normal">{count}</span>
                  <button
                    className="py-[2px]
                             px-[10px] text-center text-white bg-[#009ccc] text-[13px]"
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>   

           <div className="pt-[10px]">
              <button className={`w-[150px] flex items-center justify-center rounded-sm cursor-pointer gap-[10px] 
              bg-[rgb(0,156,204)] text-white my-1 h-[40px] 1350px:w-[120px] 1350px:h-[32px]`} onClick={()=>{handleSinglePopup(data.id)}}>
                <span className="uppercase font-normal text-[13px]">add to cart</span> 
                {/* <FaOpencart 
                className="font-normal text-[13px]"/>  */}
                </button>
           </div>
           {
          singlePopup && selectedProduct ? (
            <SingleProductPopUp singlePopup={singlePopup} setSinglePopUp={setSinglePopUp} data={selectedProduct} autoclose={autoclose} deviceCookie={deviceCookie}/>
          ) : null
        }
           </div>
     
        </div>
      </div>
    )
  }
  export default ShopMenuLayoutProducts;

  