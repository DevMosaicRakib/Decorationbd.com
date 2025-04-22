import React, { useEffect, useState } from 'react'
import "./BannerArea.scss"
// import useFetch from "../../../customHooks/useFetch"
const BannerAre = ({bannerData}) => {
  console.log(bannerData)
  return (
    <div className={`1350px:w-[81.5%] 1024px:w-[98%] 1280px:w-[83%] mx-auto w-[98%] `}>
      <div className="imageContainer grid grid-cols-1 md:grid-cols-3">
        <div className="firstImg">
           <img src={process.env.REACT_APP_IMG_URL+bannerData?.banner_images[0]?.images} alt="" />
        </div>
        <div className="midTwoimg grid grid-cols-1 grid-rows-2">
            <div className="midImg1"><img src={process.env.REACT_APP_IMG_URL+bannerData?.banner_images[1]?.images} alt="" /></div>
            <div className="midImg2"><img src={process.env.REACT_APP_IMG_URL+bannerData?.banner_images[2]?.images} alt="" /></div>
        </div>
        <div className="lastImg">
            <img src={process.env.REACT_APP_IMG_URL+bannerData?.banner_images[3]?.images} alt="" />
        </div>
      </div>
    </div>
  )
}

export default BannerAre
