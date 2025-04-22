import React, { useEffect, useRef, useState } from 'react'
import { useAddItemToCartMutation, useFetchCartItemsQuery } from '../../Redux/CartSlice/cartApi';
import { getToken } from '../../Redux/UserAndAuthServices/LocalStorageService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RxCross1 } from 'react-icons/rx';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { GiBuyCard } from 'react-icons/gi';
import "./singlePopup.scss"
import ReactImageMagnify from 'react-image-magnify';

const SingleProductPopUp = ({data,singlePopup,setSinglePopUp,autoclose,deviceCookie}) => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const SingleProductPopUpRef = useRef(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedImg,setSelectedImg] = useState(process.env.REACT_APP_IMG_URL + (data?.product_imgs?.[0]?.images || ''));
  
    useEffect(() => {
      if (data?.variants?.length) {
        data.variants.forEach((variant) => {
          if (variant.value === "standard") {
            setSelectedVariant(variant);
          }
        });
      }
    }, [data]);
  
    useEffect(() => {
      // Update the selected image when data is loaded or changes
      if (data?.product_imgs?.[0]?.images) {
        setSelectedImg(process.env.REACT_APP_IMG_URL + data.product_imgs[0].images);
      }
    }, [data]);
    
    // Function to handle variant selection
    const handleVariantClick = (variant) => {
      setSelectedVariant(variant);
      setSelectedImg(process.env.REACT_APP_IMG_URL + variant.images[0].images); // Set the first image of the selected variant
    };
  
    const getPriceRange = (variants) => {
      const prices = variants.map((variant) => parseFloat(variant.price)); // Extract prices
      const discountPrices = variants.map((variant) => parseFloat(variant.discount_price)); // Extract discount prices
    
      const minPrice = Math.min(...prices); // Minimum price
      const minDiscountPrice = Math.min(...discountPrices); // Minimum discount price
    
      return { minPrice, minDiscountPrice };
    };
    useEffect(() => {
      // Function to close the shopSideBar if clicked outside
      const handleClickOutside = (event) => {
        if (SingleProductPopUpRef.current && !SingleProductPopUpRef.current.contains(event.target)) {
            setSinglePopUp(false);
        }
      };
  
      // Add event listener to detect clicks outside
      document.addEventListener("mousedown", handleClickOutside);
  
      // Cleanup event listener on component unmount
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [SingleProductPopUpRef, setSinglePopUp]);

    useEffect(() => {
      const scrollContainer = scrollRef.current;

      // Custom scroll handler for horizontal scrolling
      const onWheel = (e) => {
          if (e.deltaY !== 0) {
              scrollContainer.scrollLeft += e.deltaY; // Adjust for horizontal scrolling
              e.preventDefault(); // Prevent default vertical scroll
          }
      };

      // Attach the event listener
      scrollContainer.addEventListener('wheel', onWheel);

      // Cleanup the event listener on component unmount
      return () => scrollContainer.removeEventListener('wheel', onWheel);
    }, []);
    const {access_token} = getToken();
    
    const [count, setCount] = useState(1);

    const decrementQuantity = () => {
      if (count > 1) {
        setCount(count - 1);
      }
    };
    const incrementQuantity = () => {
      setCount(count + 1);
    };
    const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
    const [addItemToCart] = useAddItemToCartMutation();

    if (!singlePopup) return null;

    
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

    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(data?.description || "", 'text/html');
    const plainTextDescription = parsedHtml.body.textContent || "";


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
    <div className='bg-[#fff]'>
      {data?(
        <div className="fixed w-full h-screen top-0 left-0 
        bg-[#0000008f] z-50 flex items-center
        justify-center">
            <div ref={SingleProductPopUpRef} className="relative w-[90%] 768px:w-[70%] 
            h-[90vh] overflow-y-scroll no-scrollbar 768px:h-[75vh] 
            bg-white rounded-md shadow-md p-4">
                <RxCross1 size={20} className="absolute right-3 top-3 z-50" 
                onClick={()=>setSinglePopUp(false)}/>

                <div className=" w-full 1024px:flex justify-center items-center mt-[30px]">
                     
                      <div className='w-full 1024px:w-[50%]'>
                           
                            <div
                                id="imageZoom"
                                style={{
                                  "--url": `url(${selectedImg})`,
                                  "--zoom-x": "0%",
                                  "--zoom-y": "0%",
                                  "--display": "none",
                                }}
                                className="w-full 768px:w-[70%] mx-auto 1024px:mx-0 1024px:w-[295px] 1024px:h-[295px] mb-2  relative"
                                onMouseMove={handleMouseMove}
                                onMouseOver={handleMouseOver}
                                onMouseOut={handleMouseOut}
                              >
                                <img src={selectedImg} alt="Product Image" className="w-full h-full object-contain" />
                              </div>
                           
                            
                            

                            {/* Scrollable Thumbnails for Product and Variant Images */}
                            <div style={{ width: '300px', overflowX: 'scroll' }} ref={scrollRef} className="no-scrollbar ml-0 768px:ml-[80px] 1024px:ml-0">
                              <div style={{ display: 'flex', gap: '5px', width: 'max-content' }}>
                                {/* Show Product Images */}
                                {data?.product_imgs?.map((image, i) => (
                                  <img
                                    key={i}
                                    src={process.env.REACT_APP_IMG_URL + image.images}
                                    alt=""
                                    onClick={() => {setSelectedImg(process.env.REACT_APP_IMG_URL + image.images);
                                      setSelectedVariant(data.variants[0].value === 'standard' ? data.variants[0].value : null)
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
                                          setSelectedImg(process.env.REACT_APP_IMG_URL + variantImage.images)}
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




                    <div className='w-full 768px:w-[75%] mx-auto 1024px:mx-0 1024px:w-[42%]  pl-[5px] pr-[5px] mt-[10px] 768px:mt-[20px] 1024px:mt-0'>
                        <h2 className={`text-[#242424] capitalize mb-2 text-[16px] font-[500]`}>{data?.name}</h2>
                        <p className='font-[400] text-[gray] mt-[5px] text-[12px]'>{plainTextDescription?.length>100 ? plainTextDescription?.slice(0,100) + "..." : plainTextDescription}</p>
                        <div className='pt-3 mb-2'>

                            {/* Variant Section */}

                            {Object.entries(
                                data.variants.reduce((acc, variant) => {
                                if (variant.variant_type !== "Stand Mount System" || variant.value === "standard") return acc;

                                if (!acc[variant.variant_type]) {
                                    acc[variant.variant_type] = [];
                                }
                                acc[variant.variant_type].push(variant);

                                return acc;
                                }, {})
                            ).map(([variantType, variants]) => (
                                <div className="mt-0 768px:mt-4 flex flex-col items-start 768px:flex-row 768px:items-center gap-[4px]" key={variantType}>
                                <p className="font-medium text-gray-700 text-[13px]">
                                    Select Options: {/* Display the type */}
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
                                                    {Number(minPrice)} {currencySymbol}
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
                            {/* Price section end */}
                        </div>
                        <div className="flex items-center pt-0 768px:pt-4">
                            <button className='py-[2px]
                             px-2 text-center text-white bg-[#077bc4] text-[13px]'
                             onClick={decrementQuantity}>-</button>
                            <span className='py-1 px-5 text-center font-normal text-[13px]'>{count}</span>
                            <button className='py-[2px]
                             px-2 text-center text-white bg-[#077bc4] text-[13px]'
                             onClick={incrementQuantity}>+</button>
                        </div>
                        <div className="flex items-center mt-1 768px:mt-4 gap-[30px]">
                           <div className={`h-[35px] w-[100px] my-1 flex justify-center 
                           items-center bg-[#5098f7] addCartp rounded-sm cursor-pointer`}
                           onClick={handleAddToCart}>
                            <span className='text-white font-[400] flex items-center justify-center text-[13px]'>
                                Continue </span>
                           </div>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
      ):null}
    </div>
  )
}

export default SingleProductPopUp