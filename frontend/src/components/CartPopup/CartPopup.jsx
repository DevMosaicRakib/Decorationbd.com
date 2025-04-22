import React, { useEffect, useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

import "./CartPopup.scss";
import { useDispatch, useSelector } from "react-redux";
import { resetCart } from "../../Redux/CartSlice/cartSlice";
import { useDeleteAllCartItemsMutation, useFetchCartItemsQuery } from "../../Redux/CartSlice/cartApi";
import { getToken } from "../../Redux/UserAndAuthServices/LocalStorageService";
import axios from "axios";
import {BsCartX}from "react-icons/bs"

const CartPopup = ({ setOpencart, openCart,deviceCookie }) => {
  const { access_token } = getToken();
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
  console.log(cartItems)
  const totalCartItems = cartItems?.[0]?.total_cartitems;
  const totalPrice = cartItems?.[0]?.total_price;
  const [deleteAllCartItems, { isError, isSuccess }] = useDeleteAllCartItemsMutation();
  const navigate = useNavigate()
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
  //         },
  //         {
  //           device:deviceCookie
  //         }
  //       );
  //     } else {
  //       await axios.delete(
  //         process.env.REACT_APP_API_URL + `api/cartitems/${itemId}/cartitem_delete/`,
  //         {
  //           device:deviceCookie
  //         }
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
  
  const handleClearCart = async () => {
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
        process.env.REACT_APP_API_URL + 'api/cartitems/allcart_delete/',
        { headers }
      );
  
      refetch(); // Re-fetch the cart items after clearing the cart
    
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // You can handle the error here, such as showing an error message to the user
    }
  };
  


  // const handleClearCart = async () => {
  //   try {
  //     await deleteAllCartItems();
  //     refetch()
  //     // You can add additional logic here if needed, like updating the UI or showing a success message
  //   } catch (error) {
  //     console.error('Failed to clear cart:', error);
  //     // You can handle the error here, such as showing an error message to the user
  //   }
  // };

  useEffect(()=>{
    refetch();
  },[cartItems])
  // const cItems = useSelector((state)=>state.cart)
  // console.log(cItems)
  // const dispatch = useDispatch();
  // const handleResetCart = ()=>{
  //     dispatch(resetCart())
  // }

  // if (openCart===true) {
  //      var cartOuttSideHandler = (e)=>{
  //         if (!cartRef.current.contains(e.target) && e.target !== cartButton) {
  //             setOpencart(false)
  //         }
  //      }
  // }

  // useEffect(()=>{
  //   document.addEventListener('click',cartOuttSideHandler);
  //   return ()=>{
  //     document.removeEventListener('click', cartOuttSideHandler);
  //   }
  // })
  return (
    <>
      <div>
        <div className="flex w-full justify-end pt-5 pr-5">
          <RxCross1
            className="cursor-pointer 1024px:text-[22px] 1350px:text-[18px] text-[20px] text-[#242424]"
            onClick={() => setOpencart(false)}
          />
        </div>
        {/* items length */}
        <div className="768px:p-4 1024px:p-[2px] 1280px:p-2  p-[5px] flex items-center justify-between">
          <div className="flex ">
            <IoBagHandleOutline size={20} className="text-[#242424]" />
            <h5 className="pl-2 text-[13px] font-[400] text-[#242424] pt-[2px]">
              {!cartItems?.length ? 0 : totalCartItems} items
            </h5>
          </div>
          <div className="flex items-center gap-[5px] text-[#f51919] pr-[5px] cursor-pointer" onClick={handleClearCart}>
            <MdDelete size={15} />
            <p className="capitalize font-[400] text-[13px]">Reset cart</p>
          </div>
        </div>
        {/* cart single items */}
        <br />
        <div className="w-full border-t 300px:h-[500px] 768px:h-[750px] 1024px:h-[1000px]
        1280px:h-[600px] 1350px:h-[400px] overflow-y-scroll scroll-smooth no-scrollbar">
          {cartItems &&
            cartItems.map((i, index) => <CartSingle key={index} data={i} 
            handleDeleteItem={handleDeleteItem}/>)}

          {!cartItems?.length && 
          <div className="empty-cart">
                <BsCartX/>
                <span className="text-[12px] font-[400]">No Products in the cart.</span>
                <button className="return-cta rounded-sm" onClick={()=>{navigate('/shop');setOpencart(false);}}>return to shop</button>
            </div>}  
        </div>
      </div>
      <div>
        {/* View Cart button */}
        <div className="px-5 mb-[10px] 1350px:mb-[5px]">
          <Link to="/cart" onClick={() => setOpencart(false)}>
            <div
              className={`h-[45px] 1350px:h-[40px]
            w-full flex items-center justify-center bg-[#31bd03] rounded-sm`}
            >
              <h1
                className="text-[#fff]
                text-[13px]  font-[400]"
              >
                View Cart
              </h1>
            </div>
          </Link>
        </div>
        {/* checkout button */}
        <div className="px-5 mb-3 1350px:mb-[8px]">
          <Link to="/checkout" onClick={() => setOpencart(false)}>
            <div
              className={`h-[45px] 1350px:h-[40px]
            w-full flex items-center justify-center bg-[#f57224] rounded-sm`}
            >
              <h1
                className="text-[#fff]
                text-[13px] font-[400]"
              >
                Checkout Now (Tk. {cartItems?.length ? Number(totalPrice) : '0'}{" "}
                <strong className="text-[13px] font-[400] font-Roboto">৳</strong>)
              </h1>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

const CartSingle = ({ data,handleDeleteItem}) => {
  return (
    <div className="border-b 1024px:p-1 1280px:p-3 1350px:p-[5px] 768px:p-2 p-[5px]">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
        <img
          src={process.env.REACT_APP_IMG_URL+data?.product?.product_imgs[0]?.images}
          alt=""
          className="768px:w-[80px] 768px:h-[80px] 1280px:w-[50px] 1280px:h-[50px] w-[60px] h-[60px] ml-2"
        />
        <div className="768px:pl-[8px] pl-[5px]">
          <h1 className="text-[#242424] text-[10px] font-[400] ">
          {data?.product?.name.length>100?data?.product?.name.slice(0,100)+"...":data?.product?.name}
          </h1>

          <h4
            className="font-normal text-[13px] 
                    pt-[2px] text-[#077bc4]"
          >
            Tk. {Number(data.sub_total)}{" "}
            <strong className="text-[13px] font-Roboto">৳</strong>
          </h4>
        </div>
        </div>
        <RxCross1 className="cursor-pointer text-[orangered] text-[16px]" onClick={() => handleDeleteItem(data.id)}/>
      </div>
    </div>
  );
};

export default CartPopup;
