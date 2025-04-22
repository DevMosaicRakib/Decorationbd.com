import React, { useEffect, useRef, useState } from "react";
import Styles from "../../Styles/Styles";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { GiBuyCard } from "react-icons/gi";
import d1 from "../../Assets/img/DeliveryImg/delivery1.jpg";
import { useAddItemToCartMutation, useFetchCartItemsQuery } from "../../Redux/CartSlice/cartApi";
import { toast } from "react-toastify";
import { getToken } from "../../Redux/UserAndAuthServices/LocalStorageService";
import { useNavigate } from "react-router-dom";
// import d2 from "../../Assets/img/DeliveryImg/delivery2.jpeg";
import ReactImageMagnify from 'react-image-magnify';
import "./ProductDetails.scss";
const ProductDetails = ({
  data,
  count,
  decrementQuantity,
  incrementQuantity,
  autoclose,
  deviceCookie
}) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
        // Function to handle the wheel event
        const onWheel = (e) => {
            if (e.deltaY !== 0) {
                scrollContainer.scrollLeft += e.deltaY; // Scroll horizontally
                e.preventDefault(); // Prevent default vertical scroll
            }
        };

        // Attach the event listener
        scrollContainer.addEventListener('wheel', onWheel);

        // Cleanup the event listener on component unmount
        return () => scrollContainer.removeEventListener('wheel', onWheel);
    }
  }, [data]);
  // console.log(data)
  // console.log(data)

  const [selectedVariant, setSelectedVariant] = useState(null);
  console.log(data)
  useEffect(() => {
    if (data?.variants?.length) {
      data.variants.forEach((variant) => {
        if (variant.value === "standard") {
          setSelectedVariant(variant);
        }
      });
    }
  }, [data]);
  

  // const handleVariantClick = (variant) => {
  //   setSelectedVariant(variant);
  // };

  const getPriceRange = (variants) => {
    const prices = variants.map((variant) => parseFloat(variant.price)); // Extract prices
    const discountPrices = variants.map((variant) => parseFloat(variant.discount_price)); // Extract discount prices
  
    const minPrice = Math.min(...prices); // Minimum price
    const minDiscountPrice = Math.min(...discountPrices); // Minimum discount price
  
    return { minPrice, minDiscountPrice };
  };


  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
  const [addItemToCart] = useAddItemToCartMutation();
  const initialImage = data?.product_imgs?.[0]?.images ? process.env.REACT_APP_IMG_URL + data?.product_imgs?.[0]?.images : '';
  const [select, setSelect] = useState(initialImage);
  // useEffect(() => {
   
  //   if (data?.product_imgs?.[0]?.images) {
  //     setSelect(process.env.REACT_APP_IMG_URL + data.product_imgs[0].images);
  //   }
  // }, [data]);
  useEffect(() => {
    // Update the selected image when data is loaded or changes
    if (data?.product_imgs?.[0]?.images) {
      setSelect(process.env.REACT_APP_IMG_URL + data?.product_imgs[0]?.images);
    }
  }, [data]);
  
  // Function to handle variant selection
  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
    setSelect(process.env.REACT_APP_IMG_URL + variant?.images[0]?.images); // Set the first image of the selected variant
  };
  // console.log(selectedVariant);
  const {access_token} = getToken();

  const handleAddToCart = async () => {
    try {
      if (selectedVariant) {
        
        if (access_token) {
          const response = await addItemToCart({ products_id: data.id, variant_id:selectedVariant.id,quantity: count });
          // console.log(response)
          if (response.data) {
            const productName = response.data.product.name;
            console.log('Product name:', productName);
        
            if (productName) {
              toast.success(`${productName.length>15?productName.slice(0,15)+' ':productName} added to cart successfully`,{
                autoClose:autoclose
              });
            } else {
              console.error('Product name not found');
            }
            refetch()
            navigate('/cart')
          } else {
            console.error('Failed to add item to cart');
          }
        } else {
          const response = await addItemToCart({ products_id: data.id, variant_id:selectedVariant.id, quantity: count ,device:deviceCookie});
          // console.log(response)
          if (response.data) {
            const productName = response.data.product.name;
            console.log('Product name:', productName);
        
            if (productName) {
              toast.success(`${productName.length>15?productName.slice(0,15)+' ':productName} added to cart successfully`,{
                autoClose:autoclose
              });
            } else {
              console.error('Product name not found');
            }
            refetch()
            navigate('/cart')
          } else {
            console.error('Failed to add item to cart');
          }
        }

      } else {
        toast.error('Please Select an Variant !',{
          autoClose:autoclose
        })
      }




    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  const navigate = useNavigate();
  const handleBuyNow = async () =>{
    try {
      if (selectedVariant) {
        if (access_token) {
          const response = await addItemToCart({ products_id: data.id, variant_id:selectedVariant.id,quantity: count });
          if (response.data) {
            refetch();
            navigate('/checkout');
          } else {
            console.error('Failed to add item to cart');
          }
        } else {
          const response = await addItemToCart({ products_id: data.id, variant_id:selectedVariant.id, quantity: count ,device:deviceCookie});
          if (response.data) {
            refetch();
            navigate('/checkout');
          } else {
            console.error('Failed to add item to cart');
          }
    
        }
      } else {
        toast.error('Please Select an Variant !',{
          autoClose:autoclose
        })
      }



    } catch (error) {
      console.error('Error adding item to cart:', error);
    }

  };
  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(data?.description || "", 'text/html');
  const plainTextDescription = parsedHtml.body.textContent || "";
  const [showDescription,setShowDescription] = useState(false);

  // Image Zoom function 

  // const zoomRef = useRef(null);

  // const handleMouseOver = (event) => {
  //   const zoomImage = zoomRef.current;

  //   zoomImage.style.setProperty('--display', 'block');

  //   const pointer = {
  //     x: (event.nativeEvent.offsetX * 100) / zoomImage.offsetWidth,
  //     y: (event.nativeEvent.offsetY * 100) / zoomImage.offsetHeight,
  //   };

  //   zoomImage.style.setProperty('--zoom-x', `${pointer.x}%`);
  //   zoomImage.style.setProperty('--zoom-y', `${pointer.y}%`);
  // };

  // const handleMouseOut = () => {
  //   const zoomImage = zoomRef.current;
  //   zoomImage.style.setProperty('--display', 'none');
  // };

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
  
    document.getElementById("imageZoom").style.setProperty("--zoom-x", `${x}%`);
    document.getElementById("imageZoom").style.setProperty("--zoom-y", `${y}%`);
  };
  
  const handleMouseOver = () => {
    document.getElementById("imageZoom").style.setProperty("--display", "block");
  };
  
  const handleMouseOut = () => {
    document.getElementById("imageZoom").style.setProperty("--display", "none");
  };
  

  return (
    <div className="bg-white">
      {data ? (
        <div className={`w-[95%] 768px:w-[90%]  1024px:w-[98%] 1280px:w-[83%] 1350px:w-[81.5%] mx-auto
         mt-[60px] 768px:mt-[100px] lg:mt-[80px] xl:mt-0`}>
          <div className="w-full py-2 1350px:py-2">
            <div className="block w-full h-auto 1024px:flex justify-center
             shadow-sm shadow-[rgb(128,128,128,0.5)] gap-[50px] 300px:py-[20px] 1280px:py-[40px] 768px:p-[30px]">

            <div className="w-full 1024px:w-auto 1024px:mr-[30px]">
                {/* Main Product Image */}
                <div
                  id="imageZoom"
                  style={{
                    "--url": `url(${select})`,
                    "--zoom-x": "0%",
                    "--zoom-y": "0%",
                    "--display": "none",
                  }}
                  className="relative w-[300px] h-[300px] mx-auto md:mx-0 mb-[10px]"
                  onMouseMove={handleMouseMove}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  <img src={select} alt="Product Image" className="w-full h-full object-contain" />
                </div>

                {/* Scrollable Thumbnails for Product and Variant Images */}
                <div style={{ width: '300px', overflowX: 'scroll' }} ref={scrollRef} className="no-scrollbar 300px:mx-auto 768px:mx-0">
                  <div style={{ display: 'flex', gap: '5px', width: 'max-content' }}>
                    {/* Show Product Images */}
                    {data?.product_imgs?.map((image, i) => (
                      <img
                        key={i}
                        src={process.env.REACT_APP_IMG_URL + image.images}
                        alt=""
                        onClick={() => {setSelect(process.env.REACT_APP_IMG_URL + image.images);
                          setSelectedVariant(data?.variants[0]?.value === 'standard' ? data?.variants[0]?.value : null)
                        }}
                        style={{
                          width: '55px',
                          height: '55px',
                          cursor: 'pointer',
                          objectFit: 'cover',
                          border: '1px solid rgba(0,0,0,0.2)',
                        }}
                      />
                    ))}
                    
                    {/* Show Variant Images */}
                    {data?.variants?.map((variant) => (
                      <div key={variant.id} style={{ display: 'flex', gap: '5px' }}>
                        {variant?.images?.map((variantImage, index) => (
                          <img
                            key={variantImage.id}
                            src={process.env.REACT_APP_IMG_URL + variantImage.images}
                            alt={`variant-${variant.id}-${index}`}
                            onClick={() => {handleVariantClick(variant);
                              setSelect(process.env.REACT_APP_IMG_URL + variantImage.images)}
                            }
                            style={{
                              width: '55px',
                              height: '55px',
                              cursor: 'pointer',
                              objectFit: 'cover',
                              border: '1px solid rgba(0,0,0,0.2)',
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>


              <div className="w-[90%] mx-auto 768px:mx-0 768px:w-full 1024px:w-[600px] 768px:pt-0  pt-[20px]">
                <h1 className={`text-[16px] text-[#242424] font-[500]`}>{data?.name}</h1>
                <p className={`font-[400] text-[rgb(71,66,66)] pt-4 text-[12px]`}>
                {plainTextDescription?.length > 200 ? (
                          <>
                            {plainTextDescription?.slice(0, 200)}
                            {showDescription === true ? (plainTextDescription?.slice(200,-1)+".") : "...."}
                          </>
                        ) : (
                          plainTextDescription
                        )}{" "}
                  {plainTextDescription?.length >= 200 ? (
                    <>
                    <span className={`font-[500] 1350px:text-[12px] text-[#242424] cursor-pointer ${showDescription===true?"hidden":"inline"}`}
                  onClick={()=>setShowDescription(true)}>Read more...</span> 
                  
                  <span className={`font-[500] 1350px:text-[12px] text-[#242424] cursor-pointer ${showDescription===false?"hidden":"inline"}`}
                  onClick={()=>setShowDescription(false)}>hide description...</span>
                    </>
                  ) : null}      
                  
                </p>

            {/* Variant Section */}

               {Object.entries(
                data?.variants?.reduce((acc, variant) => {
                  if (variant.variant_type !== "Stand Mount System" || variant.value === "standard") return acc;

                  if (!acc[variant.variant_type]) {
                    acc[variant.variant_type] = [];
                  }
                  acc[variant.variant_type].push(variant);

                  return acc;
                }, {})
              ).map(([variantType, variants]) => (
                <div className="mt-4 flex items-center gap-[20px]" key={variantType}>
                  <p className="font-medium text-gray-700 text-[13px]">
                    Select Options: 
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantClick(variant)}
                        className={`py-1 px-3 border rounded-[16px] text-[12px] hover:bg-[#242424] hover:text-[#fff] ${
                          selectedVariant?.id === variant.id
                            ? "bg-[#242424] text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {variant.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))} 

            {/* Price Section */}

              {data?.variants?.length > 1 ? (
                            <div className="flex pt-4 items-center">
                            {data.variants.some((variant) => variant.value !== "standard" && selectedVariant === null) ? (
                              (() => {
                                const { minPrice, minDiscountPrice } = getPriceRange(data.variants);
                                const currencySymbol = <strong className="text-[13px] font-Roboto">৳</strong>;

                                return minPrice === minDiscountPrice 
                                  ? <p className={`text-[13px] font-[500] text-[#077bc4]`}>
                                      {Number(minPrice).toFixed(2)} {currencySymbol}
                                    </p>
                                  : <>
                                  <p className={`mr-[10px] font-[500] text-[13px] line-through`}>
                                    {minPrice}
                                    <strong className="text-[13px] font-Roboto">৳</strong>
                                  </p>
                                  <p className={`text-[13px] font-[500] text-[#077bc4]`}>
                                    {minDiscountPrice}
                                    <strong className="text-[13px] font-Roboto">৳</strong>
                                  </p>
                                </>
                              })()
                            ) : (
                              <>
                                <p className={`mr-[10px] font-[500] text-[13px] line-through`}>
                                  {Number(selectedVariant?.price)}
                                  <strong className="text-[13px] font-Roboto">৳</strong>
                                </p>
                                <p className={`text-[13px] font-[500] text-[#077bc4]`}>
                                  {Number(selectedVariant?.discount_price)}
                                  <strong className="text-[13px] font-Roboto">৳</strong>
                                </p>
                              </>
                            )}
              </div>
              ) : (
                <div className="flex pt-4 items-center">
                  <p className={`mr-[10px] font-[500] text-[13px] line-through`}>
                    {Math.floor(Number(data?.variants[0]?.price))}
                    <strong className="text-[13px] font-Roboto">৳</strong>
                  </p>
                  <p className={`text-[13px] font-[500] text-[#077bc4]`}>
                    {Math.floor(Number(data?.variants[0]?.discount_price))}
                    <strong className="text-[13px] font-Roboto">৳</strong>
                  </p>
                </div>
              )}       



                
                <div className={`${Styles.normal_flex} mt-4 1350px:mt-5 pr-3`}>
                  <button
                    className="py-[2px]
                             px-[10px] text-center text-white bg-[#077bc4] text-[13px] font-normal"
                    onClick={decrementQuantity}
                  >
                    -
                  </button>
                  <span className="py-1 px-5 text-center text-[13px]">{count}</span>
                  <button
                    className="py-[2px] 
                             px-2 text-center text-white bg-[#077bc4] text-[13px]"
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center mt-4 1350px:mt-5 gap-[30px]">
                  <div
                    className={`flex items-center justify-center
                      cursor-pointer bg-[#077bc4] w-[130px] h-[35px] 1350px:my-2 
                      addCart rounded-sm`}
                    onClick={handleAddToCart}>
                    <span className="text-white font-[400] flex items-center text-[13px]">
                      Add to cart <AiOutlineShoppingCart className="ml-2 text-[13px]" />
                    </span>
                  </div>
                  <div
                    className={`flex items-center justify-center
                      cursor-pointer bg-[rgb(255,69,0,0.8)] w-[130px] h-[35px] 
                      1350px:my-2 buy rounded-sm`}
                      onClick={handleBuyNow}
                  >
                    <span className="text-[#fff] font-[400] flex items-center text-[13px]">
                      Buy now <GiBuyCard className="ml-2 text-[13px]" />
                    </span>
                  </div>
                </div>
              </div>


            </div>
          </div>
          <ProductDetailsInfo data={data} plainTextDescription={plainTextDescription}/>
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};



// const ProductDetails = ({
//   data,
//   count,
//   decrementQuantity,
//   incrementQuantity,
//   autoclose,
//   deviceCookie
// }) => {
//   const [selectedVariant, setSelectedVariant] = useState(null);
  
//   useEffect(() => {
//     if (data?.variants?.length) {
//       setSelectedVariant(data.variants[0]); // Set the first variant as default
//     }
//   }, [data]);

//   const handleVariantClick = (variant) => {
//     setSelectedVariant(variant);
//   };

//   const getPriceRange = (variants) => {
//     const prices = variants.map((variant) => parseFloat(variant.discount_price));
//     const minPrice = Math.min(...prices);
//     const maxPrice = Math.max(...prices);
//     return minPrice === maxPrice ? `${minPrice}৳` : `${minPrice}৳ - ${maxPrice}৳`;
//   };

//   const plainTextDescription = new DOMParser()
//     .parseFromString(data?.description || "", 'text/html')
//     .body.textContent || "";

//   return (
//     <div className="bg-white">
//       {data ? (
//         <div className="container mx-auto mt-8">
//           <div className="flex flex-col lg:flex-row shadow p-6">
//             {/* Image Section */}
//             <div className="flex flex-col items-center">
//               <div className="w-[300px] h-[300px] overflow-hidden mb-4">
//                 <img
//                   src={selectedVariant?.images?.[0] || process.env.REACT_APP_IMG_URL + data.product_imgs?.[0]?.images}
//                   alt={data.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex gap-2 overflow-x-auto">
//                 {data?.product_imgs?.map((image, i) => (
//                   <img
//                     key={i}
//                     src={process.env.REACT_APP_IMG_URL + image.images}
//                     alt=""
//                     className="w-16 h-16 object-cover border"
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Details Section */}
//             <div className="ml-6 flex-1">
//               <h1 className="text-2xl font-semibold">{data.name}</h1>

//               {/* Variant Section */}
//               <div className="mt-4">
//                 <p className="font-medium text-gray-700">Variants:</p>
//                 <div className="flex gap-2 mt-2">
//                   {data.variants.map((variant) => (
//                     <button
//                       key={variant.id}
//                       onClick={() => handleVariantClick(variant)}
//                       className={`py-1 px-3 border rounded ${
//                         selectedVariant?.id === variant.id
//                           ? "bg-blue-500 text-white"
//                           : "bg-gray-200"
//                       }`}
//                     >
//                       {variant.value}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Price Section */}
//               <div className="mt-4">
//                 {data.variants.some((variant) => variant.value !== "Standard") ? (
//                   <p className="text-lg font-semibold text-blue-600">
//                     {getPriceRange(data.variants)}
//                   </p>
//                 ) : (
//                   <>
//                     <p className="text-lg font-semibold text-gray-500 line-through">
//                       {selectedVariant?.price || data.price}৳
//                     </p>
//                     <p className="text-xl font-bold text-blue-600">
//                       {selectedVariant?.discount_price || data.discount_price}৳
//                     </p>
//                   </>
//                 )}
//               </div>

//               {/* Description */}
//               <p className="mt-4 text-gray-700">{plainTextDescription}</p>

//               {/* Quantity Controls */}
//               <div className="flex items-center mt-4">
//                 <button
//                   className="px-3 py-1 bg-gray-300 rounded"
//                   onClick={decrementQuantity}
//                 >
//                   -
//                 </button>
//                 <span className="px-4">{count}</span>
//                 <button
//                   className="px-3 py-1 bg-blue-500 text-white rounded"
//                   onClick={incrementQuantity}
//                 >
//                   +
//                 </button>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-4 mt-6">
//                 <button className="px-6 py-2 bg-blue-600 text-white rounded">
//                   Add to Cart
//                 </button>
//                 <button className="px-6 py-2 bg-orange-500 text-white rounded">
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// };


const ProductDetailsInfo = ({ data,plainTextDescription }) => {
  const [active, setActive] = useState(1);
  return (
    <div className="bg-[rgb(245,246,251,0.7)] px-3 800px:px-10 py-2 1350px:px-[58px] 1350px:py-[30px] rounded  1350px:mt-[70px] 1350px:mb-[50px]">
      <div className="w-full flex justify-between border-b pt-5 pb-2">
        <div className="relative">
          <h5
            className="text-[#242424] px-1 leading-5 font-[500] 
                    cursor-pointer text-[13px]"
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${Styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative hidden 768px:inline">
          <h5
            className="text-[#242424] px-1 leading-5 font-[500] 
                    cursor-pointer text-[13px]"
            onClick={() => setActive(2)}
          >
            Additional Information
          </h5>
          {active === 2 ? (
            <div className={`${Styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className="text-[#242424] px-1 leading-5 font-[500] 
                    cursor-pointer text-[13px]"
            onClick={() => setActive(3)}
          >
            Shipping & Delivery
          </h5>
          {active === 3 ? (
            <div className={`${Styles.active_indicator}`} />
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p
            className="py-2 1280px:w-[40%] w-[98%]
                    text-[12px] leading-4 pb-5 whitespace-pre-line font-[400] text-[#242424]"
          >
            {plainTextDescription}
          </p>
         
        </>
      ) : null}
      {active === 2 ? (
        <div className="w-full min-h-[30vh] flex items-center justify-around">
          <h4 className="font-[400]  text-[#242424] text-[12px]">Weigth</h4>
          <p className="font-[400] text-[#077bc4] text-[12px]">2.5kg</p>
        </div>
      ) : null}
      {active === 3 ? (
        <div className="w-full flex flex-col 768px:flex-row items-center justify-around 768px:px-5 px-1">
          <div className="768px:w-[40%] w-[98%] overflow-hidden my-5 bg-[#f5f6fb]">
            <img src={d1} alt="" className="w-full object-contain" />
          </div>
          <div className="768px:w-[40%] w-[90%]">
            <h1
              className="font-[400]
                    text-[#242424] text-[16px] 768px:mt-[10px] mt-0 lg:mt-0"
            >
              Service Provider :
            </h1>
            <p className=" pt-1 font-[400] text-[12px] text-[#242424] capitalize">
              We usually use <span className="text-[#077bc4]">Pathao</span> ,{" "}
              <span>
                Red<span className="italic text-[red] text-[13px]">X</span>
              </span>{" "}
              or Steadfast{" "}
              <span className="text-[orangered]">Courier Service</span> Provider
              to shipping our products.
            </p>
            <h3 className="pt-3 text-[16px] capitalize font-[400] text-[#242424]">
              shipping time :
            </h3>
            <p className="capitalize font-[400] text-[12px]  pt-1">
              <span className=" text-[red]">7</span>{" "}
              <span className="text-[red]">days</span> minimum
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetails;
