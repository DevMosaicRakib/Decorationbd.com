import React, { useEffect, useState } from 'react'
import Styles from "../../Styles/Styles"
import "./CartPage.scss";
import { LiaShippingFastSolid } from "react-icons/lia";
import { TiShoppingCart } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { MdLocalOffer } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { useFetchCartItemsQuery } from '../../Redux/CartSlice/cartApi';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { getToken } from '../../Redux/UserAndAuthServices/LocalStorageService';
import { toast } from 'react-toastify';
import { BsCartX } from 'react-icons/bs';


const CartPage = ({autoclose,shipping_charge,deviceCookie}) => {
  // console.log(shipping_charge)
  const { access_token } = getToken();
  const [quantities, setQuantities] = useState({});
  const [couponCode, setCouponCode] = useState('')
  const dispatch = useDispatch();
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
  console.log(cartItems);
  const totalCartItems = cartItems?.[0]?.total_cartitems;
  // const totalPrice = cartItems[0]?.total_price;

  const [checkedItems, setCheckedItems] = useState({});
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const initialCheckedState = {};
      const initialQuantities = {};
      cartItems.forEach(item => {
        initialCheckedState[item.id] = item.is_checked; 
        initialQuantities[item.id] = item.quantity; // Initialize quantities from backend
      });
      setCheckedItems(initialCheckedState);
      setQuantities(initialQuantities);

      const initialTotal = cartItems[0]?.total_price;
      setTotalSum(initialTotal);
      // console.log(totalSum)
    }
  }, [cartItems]);

  // const handleCheckboxChange = async (itemId, subTotal) => {
  //   const updatedCheckedItems = { ...checkedItems, [itemId]: !checkedItems[itemId] };
  //   setCheckedItems(updatedCheckedItems);
  
  //   try {
  //     if (access_token) {
  //       const response = await axios.patch(
  //         process.env.REACT_APP_API_URL + `api/cartitems/${itemId}/update_is_checked/`,
  //         { is_checked: updatedCheckedItems[itemId] },
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${access_token}` // Replace with your actual token if needed
  //           }
  //         }
  //       );
  //       const updatedCartItem = response.data.data;
  //     } else {
  //       const response = await axios.patch(
  //         process.env.REACT_APP_API_URL + `api/cartitems/${itemId}/update_is_checked/`,
  //         { is_checked: updatedCheckedItems[itemId] }
  //       );
  //       const updatedCartItem = response.data.data;
  //     }
      
  //     // console.log(updatedCartItem)
  //     refetch()
  //   } catch (error) {
  //     console.error('Error updating cart:', error);
  //   }
  
  //   const newTotalSum = Object.keys(updatedCheckedItems).reduce((sum, key) => {
  //     if (updatedCheckedItems[key]) {
  //       const item = cartItems.find(item => item.id === parseInt(key));
  //       return sum + item.sub_total;
  //     }
  //     return sum;
  //   }, 0);
  //   setTotalSum(newTotalSum);
  // };

  const handleCheckboxChange = async (itemId, subTotal) => {
    const updatedCheckedItems = { ...checkedItems, [itemId]: !checkedItems[itemId] };
    setCheckedItems(updatedCheckedItems);
  
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`, // Ensure access_token is correctly set
        'device': deviceCookie // Send deviceCookie in headers
      };
  
      // If access_token is not present, send the request without it
      if (!access_token) {
        delete headers['Authorization']; // Remove Authorization if not authenticated
      } else {
        delete headers['device']
      }
  
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}api/cartitems/${itemId}/update_is_checked/`,
        { is_checked: updatedCheckedItems[itemId] },
        { headers }
      );
  
      const updatedCartItem = response.data.data;
  
      refetch();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  
    // Recalculate the total sum based on checked items
    const newTotalSum = Object.keys(updatedCheckedItems).reduce((sum, key) => {
      if (updatedCheckedItems[key]) {
        const item = cartItems.find(item => item.id === parseInt(key));
        return sum + item.sub_total;
      }
      return sum;
    }, 0);
  
    setTotalSum(newTotalSum);
  };
  

  const allUnchecked = Object.keys(checkedItems).length === 0 || Object.values(checkedItems).every(checked => !checked);

  // const handleDeleteItem = async (itemId) => {
  //   try {
  //     if (access_token) {
  //       await axios.delete(
  //         process.env.REACT_APP_API_URL + `api/cartitems/${itemId}/cartitem_delete/`,
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${access_token}` // Ensure access_token is correctly set
  //           }
  //         }
  //       );
  //     } else {
  //       await axios.delete(
  //         process.env.REACT_APP_API_URL + `api/cartitems/${itemId}/cartitem_delete/`
  //       );
  //     }
  //     refetch();
  
  //     // Update the state to remove the deleted item
  //     // setCartItems((prevCartItems) => prevCartItems.filter(item => item.id !== itemId));
  
  //   } catch (error) {
  //     console.error('Error deleting cart item:', error);
  //   }
  // };

  const handleDeleteItem = async (itemId) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`, // Ensure access_token is correctly set
        'device': deviceCookie // Send deviceCookie in headers
      };
  
      // If access_token is not present, send the request without it
      if (!access_token) {
        delete headers['Authorization']; // Remove Authorization if not authenticated
      } else {
        delete headers['device']
      }

      await axios.delete(
        process.env.REACT_APP_API_URL + `api/cartitems/${itemId}/cartitem_delete/`,
        { headers }
      );
  
      refetch(); // Re-fetch the cart items after deletion
    
      // Update the state to remove the deleted item
      // setCartItems((prevCartItems) => prevCartItems.filter(item => item.id !== itemId));
    
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };
  

  const handleCouponInputChange = (e) => {
    setCouponCode(e.target.value);
  };

  // const handleApplyCoupon = async () => {
  //   try {
  //     if (access_token) {
  //       const response = await axios.post(
  //         `${process.env.REACT_APP_API_URL}api/cartitems/add_coupon/`,
  //         { coupon: couponCode },
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${access_token}`
  //           }
  //         }
  //       );
  //       setTotalSum(response.data.total_price)
  //     } else {
  //       const response = await axios.post(
  //         `${process.env.REACT_APP_API_URL}api/cartitems/add_coupon/`,
  //         { coupon: couponCode }
  //       );
  //       setTotalSum(response.data.total_price)
  //     }
      
  //     // Update the state with the new total price and cart items
  //     // const updatedCartItems = response.data.cart_items;
  //     // const updatedTotalPrice = response.data.total_price;
  //     // console.log(response.data)
      
  //     toast.success('Coupon code added successfully',{
  //       autoClose:autoclose
  //     })


  //   } catch (error) {
  //     console.error('Error applying coupon:', error);
  //     toast.error(error?.response?.data?.msg,{
  //       autoClose:autoclose
  //     })
  //   }
  // };

  // const updateQuantity = async (itemId, newQuantity) => {
  //   try {
  //     if (access_token) {
  //       const response = await axios.patch(
  //         `${process.env.REACT_APP_API_URL}api/cartitems/${itemId}/update_item/`,
  //         { quantity: newQuantity },
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${access_token}`
  //           }
  //         }
  //       );
  //       if (response.status === 200) {
  //         setQuantities(prevQuantities => ({
  //           ...prevQuantities,
  //           [itemId]: newQuantity
  //         }));
  //       }
  //     } else {
  //       const response = await axios.patch(
  //         `${process.env.REACT_APP_API_URL}api/cartitems/${itemId}/update_item/`,
  //         { quantity: newQuantity }
  //       );
  //       if (response.status === 200) {
  //         setQuantities(prevQuantities => ({
  //           ...prevQuantities,
  //           [itemId]: newQuantity
  //         }));
  //       }
  //     }
      
  //     refetch()
  //   } catch (error) {
  //     console.error('Error updating quantity:', error);
  //   }
  // };

  const handleApplyCoupon = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`, // Ensure access_token is correctly set
        'device': deviceCookie // Send deviceCookie in headers
      };
  
      // If access_token is not present, send the request without it
      if (!access_token) {
        delete headers['Authorization']; // Remove Authorization if not authenticated
      } else {
        delete headers['device']
      }
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/cartitems/add_coupon/`,
        { coupon: couponCode },
        { headers }
      );
  
      setTotalSum(response.data.total_price);
      toast.success('Coupon code added successfully', {
        autoClose: autoclose
      });
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error(error?.response?.data?.msg, {
        autoClose: autoclose
      });
    }
  };
  

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`, // Ensure access_token is correctly set
        'device': deviceCookie // Send deviceCookie in headers
      };
  
      // If access_token is not present, send the request without it
      if (!access_token) {
        delete headers['Authorization']; // Remove Authorization if not authenticated
      } else {
        delete headers['device']
      }
  
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}api/cartitems/${itemId}/update_item/`,
        { quantity: newQuantity },
        { headers }
      );
  
      if (response.status === 200) {
        setQuantities(prevQuantities => ({
          ...prevQuantities,
          [itemId]: newQuantity
        }));
      }
  
      refetch();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  

  const decrementQuantity = (itemId) => {
    const currentQuantity = quantities[itemId] || 1;
    if (currentQuantity > 1) {
      updateQuantity(itemId, currentQuantity - 1);
    }
  };

  const incrementQuantity = (itemId) => {
    const currentQuantity = quantities[itemId] || 1;
    updateQuantity(itemId, currentQuantity + 1);
  };

// Step 1: Iterate over cartItems


  // useEffect(() => {
  //   refetch(); // Trigger a refetch whenever the component mounts
  // });
  const navigate = useNavigate();
  const[ischecked,setIsChecked] = useState(true);
  return (
    <div className={` 1350px:w-[88%] 1280px:w-[95%] 1024px:w-[94%] w-[99%] mx-auto`}>
      <div className="flex items-center flex-col 1280px:flex-row 1280px:items-start w-full 1280px:mt-[50px] 1350px:mt-[30px] 1280px:justify-center
       mt-[100px] gap-[20px]">
      <div className={`${cartItems?.length ? "1280px:h-[calc(100vh-170px)] h-[300px]":"h-full"} 1500px:w-[56%] 1280px:w-[60%] 768px:w-[80%] w-[98%] overflow-y-scroll overflow-x-hidden
      scroll-smooth  no-scrollbar `}>

       
        <div className="mt-0">
          <h1 className='capitalize font-normal 768px:text-[20px] text-[16px] text-[#077bc4] mb-[30px] 768px:mb-[40px]'>
            <TiShoppingCart  className='inline  text-[30px]'/> shopping cart</h1>
              <div className='hidden 768px:block'>
              {!cartItems?.length ? (
              <div className="empty-cart ">
               <BsCartX/>
               <span>No Products in the cart.</span>
               <button className="return-cta" onClick={()=>navigate('/shop')}>return to shop</button>
              </div>
            ):(
              <table className='w-full mt-[20px] hidden 768px:block'>
              <thead className='w-full'>
                <tr className='w-full border-b border-[rgba(0,0,0,0.2)]'>
                  <th className='1500px:w-[50%] 1280px:w-[30%] 768px:w-[40%] w-[30%] 
                  text-center font-[400] text-[13px] 1500px:px-[150px] 1280px:px-[90px]
                  768px:px-[40px] px-[30px] pb-[10px]'>PRODUCT</th>
                  <th className='w-[10%] text-center font-[400] text-[13px] px-[20px] pb-[10px]'>SKU</th>
                  <th className='w-[10%] text-center font-[400] text-[13px] px-[20px] pb-[10px]'>PRICE</th>
                  <th className='w-[20%] 1350px:w-[4%] text-center font-[400] text-[13px] px-[20px] 1350px:px-[10px] pb-[10px]'>QUANTITY</th>
                  <th className='w-[10%] text-center font-[400] text-[13px] px-[10px] pb-[10px]'>SUBTOTAL</th>
                </tr>
              </thead>
              {/* {cartItems?.map(item => (
                <tbody key={item.id}>
                <tr className='w-full border-b border-[rgba(0,0,0,0.2)]'>
                  <td className='flex items-center 768px:py-3 py-1'>
                   <input type="checkbox" className='h-[12px] w-[12px] mr-[5px] cursor-pointer' checked={!!checkedItems[item.id]}  required
                   onChange={() => handleCheckboxChange(item.id, item.sub_total)}/>
                    <img src={process.env.REACT_APP_IMG_URL+item?.product?.product_imgs[0]?.images} alt="" className='w-[50px] h-[50px] object-cover'/>
                    <h4 className='font-normal text-[10px]
                     text-[#242424] 768px:px-[6px] px-[1px]'
                     >
                      {item?.product?.name.length>50?item?.product?.name.slice(0,50)+"...":item?.product?.name}
                      </h4>
                  </td>
                  <td className='text-center 1500px:px-[10px] 1280px:px-[5px] px-[5px] 
                  font-[400] text-[13px] text-[#242424] py-3'>{item.sku || 'N/A'}</td>
                  <td className='text-center mx-[15px] 
                  font-normal text-[13px] text-[#242424] py-3'>{Number(price).toFixed(2)} <strong className='text-[13px] font-Roboto'>৳ </strong></td>
                  <td className='text-center px-[45px] 1280px:px-[35px] 1500px:px-[45px] 1350px:px-[50px] 
                  font-normal text-[13px] text-[#242424] py-3'>
                   <div className='flex items-center 1280px:gap-[15px] gap-[10px]'>
                   <button className='h-[25px] w-[25px] 1350px:h-[22px] 1350px:w-[22px] 
                   bg-[#077bc4] text-white text-center border-none outline-none'
                   onClick={()=>{decrementQuantity(item.id)}}>-</button>
                    <span className='text-[13px] font-normal'>{quantities[item.id]}</span>
                    <button className='h-[25px] w-[25px] 1350px:h-[22px] 1350px:w-[22px]
                    bg-[#077bc4] text-white text-center border-none outline-none'
                    onClick={()=>{incrementQuantity(item.id)}}>+</button>
                   </div>
                  </td>
                  <td className=' text-center px-[10px] 1280px:px-[5px] 1500px:px-[10px] 
                  font-normal text-[13px] text-[#077bc4] py-3
                  '>{Number(item?.sub_total).toFixed(2)} <strong className='text-[13px] font-Roboto'>৳ </strong>
                 
                  </td>
                  <td className='text-center px-[20px]'><RxCross2  className='text-[red]  font-bold ml-[5px] 
                    text-[16px]  cursor-pointer' onClick={() => handleDeleteItem(item.id)} /></td>
                </tr>
              </tbody>
              ))} */}
              {cartItems?.map((item) => {
                // Calculate price based on the item's variant and its discount price
                const matchingVariant = item?.product?.variants?.find(
                  (variant) => variant?.value === item?.variant
                );
                const price = matchingVariant?.discount_price || matchingVariant?.price || 0;

                return (
                  <tbody key={item.id}>
                    <tr className="w-full border-b border-[rgba(0,0,0,0.2)]">
                      <td className="flex items-center 768px:py-3 py-1">
                        <input
                          type="checkbox"
                          className="h-[12px] w-[12px] mr-[5px] cursor-pointer"
                          checked={!!checkedItems[item.id]}
                          required
                          onChange={() => handleCheckboxChange(item.id, item.sub_total)}
                        />
                        <img
                          src={
                            process.env.REACT_APP_IMG_URL +
                            item?.product?.product_imgs[0]?.images
                          }
                          alt=""
                          className="w-[50px] h-[50px] object-cover"
                        />
                        <h4 className="font-normal text-[10px] text-[#242424] 768px:px-[6px] px-[1px]">
                          {item?.product?.name.length > 50
                            ? item?.product?.name.slice(0, 50) + "..."
                            : item?.product?.name}
                        </h4>
                      </td>
                      <td
                        className="text-center 1500px:px-[10px] 1280px:px-[5px] px-[5px]
                        font-[400] text-[13px] text-[#242424] py-3"
                      >
                        {item.sku || "N/A"}
                      </td>
                      <td
                        className="text-center mx-[15px]
                        font-normal text-[13px] text-[#242424] py-3"
                      >
                        {Number(price)}{" "}
                        <strong className="text-[13px] font-Roboto">৳</strong>
                      </td>
                      <td
                        className="text-center px-[45px] 1280px:px-[35px] 1500px:px-[45px] 1350px:px-[50px]
                        font-normal text-[13px] text-[#242424] py-3"
                      >
                        <div className="flex items-center 1280px:gap-[15px] gap-[10px]">
                          <button
                            className="h-[25px] w-[25px] 1350px:h-[22px] 1350px:w-[22px]
                            bg-[#077bc4] text-white text-center border-none outline-none"
                            onClick={() => {
                              decrementQuantity(item.id);
                            }}
                          >
                            -
                          </button>
                          <span className="text-[13px] font-normal">
                            {quantities[item.id]}
                          </span>
                          <button
                            className="h-[25px] w-[25px] 1350px:h-[22px] 1350px:w-[22px]
                            bg-[#077bc4] text-white text-center border-none outline-none"
                            onClick={() => {
                              incrementQuantity(item.id);
                            }}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td
                        className="text-center px-[10px] 1280px:px-[5px] 1500px:px-[10px]
                        font-normal text-[13px] text-[#077bc4] py-3"
                      >
                        {Number(item?.sub_total)}{" "}
                        <strong className="text-[13px] font-Roboto">৳</strong>
                      </td>
                      <td className="text-center px-[20px]">
                        <RxCross2
                          className="text-[red] font-bold ml-[5px]
                          text-[16px] cursor-pointer"
                          onClick={() => handleDeleteItem(item.id)}
                        />
                      </td>
                    </tr>
                  </tbody>
                );
              })}

            </table>
            )}
              </div>

            <div className='block 768px:hidden'>
            {!cartItems?.length ? (
              <div className="empty-cart">
              <BsCartX/>
              <span>No Products in the cart.</span>
              <button className="return-cta" onClick={()=>navigate('/shop')}>return to shop</button>
             </div>
            ):(
              <>
                {cartItems?.map(item => {
                  const matchingVariant = item?.product?.variants?.find(
                    (variant) => variant?.value === item?.variant
                  );
                  const price = matchingVariant?.discount_price || matchingVariant?.price || 0;
                  return(
                    <div className='flex items-center gap-[5px] 768px:hidden w-full relative
                shadow shadow-[rgb(128,128,128,0.6)] py-[2px] rounded-sm mb-[10px]' key={item.id}>
                  <div className='absolute top-1 left-1'>
                  <input type="checkbox" className='h-[14px] w-[14px]' checked={!!checkedItems[item.id]}  required
                   onChange={() => handleCheckboxChange(item.id, item.sub_total)}/>
                  </div>
                <div className="w-[30%] overflow-hidden">
                  <img src={process.env.REACT_APP_IMG_URL+item?.product?.product_imgs[0]?.images} alt="" className='h-[100px] w-[100px] object-cover'/> 
                </div>
                <div className="w-[68%]">
                  <div className="flex flex-col gap-[5px] justify-center pr-[3px]">
                    <div className="flex  justify-between border-b border-[rgba(0,0,0,0.2)] py-[2px]">
                      <h5 className='w-[90%] text-[13px] text-[#242424] font-[400] capitalize px-[2px]'>{item?.product?.name.length > 50
                            ? item?.product?.name.slice(0, 50) + "..."
                            : item?.product?.name}</h5>
                      <RxCross2 className='inline-block text-[16px] text-[orangered]'
                      onClick={() => handleDeleteItem(item.id)}/>
                    </div>
                    <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.2)] py-[2px]">
                      <h5 className='text-[13px] text-[#242424] uppercase font-[400]'>sku</h5>
                      <p className='uppercase font-[400] text-[13px] text-[#242424]'>n / a</p>
                    </div>
                    <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.2)] py-[2px]">
                      <h5 className='uppercase font-[400] text-[13px] text-[#242424] '>price</h5>
                      <p className='font-[400] text-[13px] text-[#242424] pr-[3px]'>{Number(price)} <strong className='text-[13px] font-Roboto'>৳</strong></p> 
                    </div>
                    <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.2)] py-[2px]">
                      <h5 className='font-[400] text-[13px] text-[#242424] uppercase'>quantity</h5>
                      <div className='flex items-center gap-[10px]'>
                    <button className='h-[25px] w-[25px] bg-[#077bc4] text-white text-center border-none outline-none'
                    onClick={()=>{decrementQuantity(item.id)}}>-</button>
                      <span className='text-[13px] font-normal'>{quantities[item.id]}</span>
                      <button className='h-[25px] w-[25px] bg-[#077bc4] text-white text-center border-none outline-none'
                      onClick={()=>{incrementQuantity(item.id)}}>+</button>
                    </div>
                    </div>
                    <div className="flex items-center justify-between ">
                      <h5 className='font-[400] text-[13px] text-[#242424] uppercase'>subtotal</h5>
                      <p className='text-[13px]  font-[400] pr-[3px] text-[#077bc4]'>
                      {Number(item?.sub_total)} <strong className='text-[13px] font-Roboto'>৳</strong></p>
                    </div>
                  </div>
                </div>
              </div>
                  )
                })}
              </>
            )}
            </div>


        </div>
      </div>


      <div className="1280px:w-[35%] 1350px:w-[28%] 768px:w-[80%] w-[98%] border-[2px] 
      mt-0 1280px:mt-11 shadow 
      768px:py-[10px] 1350px:py-[4px] py-[6px] shadow-[rgb(128,128,128,0.6)] relative
      border-[rgba(0,0,0,0.2)] outline-none 1280px:ml-[50px] mb-[50px] 768px:mb-0">
        <div className="w-full 768px:p-3 1350px:p-1 p-1 sticky top-0">
          <h1 className=' 1350px:text-[20px] text-[16px] text-[#077bc4] 
          font-[400] capitalize px-3 768px:py-3 py-2 768px:my-[8px] my-[5px]'>cart summary</h1>
         <div className="border-b border-[rgba(0,0,0,0.2)] my-[10px] py-[10px]">
         <div className="flex items-center justify-between 768px:px-3 px-1">
            <h5 className='capitalize text-[13px] font-[400] text-[#242424]'>subtotal :</h5>
           {checkedItems != null?(
             <span className='text-[13px] font-[400] text-[#077bc4]
             '>{Number(totalSum)}<strong className='text-[13px] font-Roboto'>৳</strong></span>
           ):(
            <span className='text-[13px] font-[400] text-[#077bc4]
            '>0<strong className='text-[13px] font-Roboto'>৳</strong></span>
           )}
          </div>
          <div className="flex items-center justify-between 768px:px-3 px-1 py-[4px]">
            <h5 className='capitalize text-[13px] font-[400] text-[#242424]'>delivery charges :</h5>
            {!allUnchecked ? (
              <>
              {shipping_charge?.length ? (
                <span className='text-[13px] font-normal text-[#077bc4]
                '>{shipping_charge?.[0]?.delivery_charge}<strong className='text-[13px] font-Roboto'>৳</strong></span>
              ):(
                <span className='text-[13px] font-normal text-[#077bc4]
              '>0<strong className='text-[13px] font-Roboto'>৳</strong></span>
              )}
              </>
            ):(
              <span className='text-[13px] font-normal text-[#077bc4]
              '>0<strong className='text-[13px] font-Roboto'>৳</strong></span>
            )}
          </div>
          <div className="flex items-center justify-between 768px:px-3 px-1 py-[4px]">
           <input type="text" placeholder='Enter coupon code' value={couponCode} onChange={handleCouponInputChange}
           className='text-[10px] py-1 1350px:py-[3px]
           px-[10px] w-[52%] outline-none border border-[rgba(0,0,0,0.2)]'/>
           <button className='text-[12px] 
           1350px:py-[3px] py-1 text-white uppercase w-[22%] 1350px:h-[24px] 300px:h-[30px] 
           text-center bg-[#25a5d8]' onClick={handleApplyCoupon}>Apply</button>
          </div>
          {/* <div className="flex items-center justify-between 768px:px-3 px-1 py-[2px]">
            <h5 className='capitalize 768px:text-[18px] text-[16px] 1350px:text-[13px] font-[500] text-[#242424]'>Estimated Delivery Date :</h5>
            <span className='768px:text-[18px] text-[16px] 1350px:text-[12px] font-[500] text-[orangered]
            '>December 21, 2023</span>
          </div> */}
         </div>
         <div className="flex items-center justify-between 768px:px-3 px-1">
            <h3 className='capitalize text-[13px] font-normal text-[#242424]'>Total :</h3>
              {
                !allUnchecked?(
                  <>
              {shipping_charge?.length ? (
                <span className='text-[13px] font-normal text-[#077bc4]
                '>{(Number(totalSum)+Number(shipping_charge?.[0]?.delivery_charge))}<strong className='text-[13px] font-Roboto'>৳</strong></span>
              ):(
                <span className='text-[13px] font-[400] text-[#077bc4]
                  '>{(Number(totalSum) + 0)}<strong className='text-[13px] font-Roboto'>৳</strong></span>
              )}
              </>
                ):(
                  <span className='text-[13px] font-[400] text-[#077bc4]
                  '>0<strong className='text-[13px] font-Roboto'>৳</strong></span>
                )
              }
          </div>
          <div className="w-full 768px:px-4 px-1 text-center mb-[10px] mt-[50px]">
            <Link to="/checkout">
              <button className='768px:w-[50%] 1280px:w-[65%] 1350px:w-[70%] w-[70%] px-[10px] py-[6px] text-[13px]
              uppercase outline-none border-none rounded-sm bg-[rgb(245,114,36,0.8)] text-white font-[400]'>
                procced to checkout ({checkedItems&&cartItems?.length?(totalCartItems):0})
              </button>
            </Link>
          </div>
        </div>
      </div>

      </div>
    </div>
  )
};


export default CartPage