import React, {useState, useEffect} from 'react'
import BannerSlider from "../HomePageLayout/Slider/BannerSlider.jsx";
import EndLine from '../HomePageLayout/Layout/BannerEndLine/EndLine.jsx';
import MonitorArm from '../HomePageLayout/Layout/MonitorArmCategory/MonitorArm.jsx';
import BannerArea from "../HomePageLayout/Layout/BannerArea/BannerAre.jsx"
import HomeDecor from "../HomePageLayout/Layout/Home&Decor/HomeDecor.jsx";
import Banner2 from "../HomePageLayout/Layout/Banner2/Banner2.jsx";
import CategoryProductSection from "../HomePageLayout/Layout/CatProdSection/CatProdSec.jsx";
import ServiceBanner from "../HomePageLayout/Layout/ServiceBanner/ServiceBanner.jsx";
import useFetch from '../customHooks/useFetch.js';
import Preloader from '../components/Preloader/Preloader'
import NewsPopup from '../components/SiteNewsPopup/NewsPopup.jsx';

// const HomePage = ({open,setOpen,count,decrementQuantity,incrementQuantity,categories,autoclose}) => {
//   const homeData = useFetch('api/home/');
//   const allProductData = useFetch('api/products/');
//   const [isLoading, setIsLoading] = useState(true);
//   // console.log(homeData)
//   // Show a loading state until the data is available
//   useEffect(() => {
//     if (homeData) {
//       setIsLoading(false);
//     }
//   }, [homeData]);
  
//   if (isLoading) {
//     return (
//       <Preloader/>
//     );
//   }

//   // Check if `homeData` has the required properties
//   const { product_section: productSections = [], banner_section: bannerSections = [] } = homeData[0] || {};

//   // Merge product and banner sections sequentially
//   const mergeSections = (productSections, bannerSections) => {
//     let mergedArray = [];
//     let maxLength = Math.max(productSections.length, bannerSections.length);

//     for (let i = 0; i < maxLength; i++) {
//       if (productSections[i]) {
//         mergedArray.push({ type: 'product', data: productSections[i] });
//       }
//       if (bannerSections[i]) {
//         mergedArray.push({ type: 'banner', data: bannerSections[i] });
//       }
//     }

//     return mergedArray;
//   };

//   const mergedSections = mergeSections(productSections, bannerSections);
//   // console.log(mergedSections)
//   return (
//     <div>
//       <BannerSlider categories={categories}/>
//       <EndLine/>
//       {mergedSections.map((section, index) => {
//         if (section.type === 'product') {
//           switch (section.data.product_section_type) {
//             case 'normal':
//               return (
//                 <div className={``}>
//                 <MonitorArm
//                   key={index}
//                   open={open}
//                   setOpen={setOpen}
//                   count={count}
//                   incrementQuantity={incrementQuantity}
//                   decrementQuantity={decrementQuantity}
//                   product_section_data = {section.data}
//                   allProductData = {allProductData}
//                   autoclose={autoclose}
//                 /></div>
//               );
//             case 'multiple':
//               return <HomeDecor 
//               key={index} 
//               open={open} 
//               setOpen={setOpen}
//               product_section_data = {section.data}
//               allProductData = {allProductData}
//               autoclose={autoclose}
//                />;
//             case 'other':
//               return <CategoryProductSection 
//               key={index} 
//               open={open} 
//               setOpen={setOpen} 
//               product_section_data = {section.data}
//               allProductData = {allProductData}
//               autoclose={autoclose}
//               />;
//             default:
//               return null; // You can handle other product sections here if necessary
//           }
//         } else if (section.type === 'banner') {
//           switch (section.data.banner_type) {
//             case 'normal':
//               return <BannerArea key={index} bannerData={section.data}/>;
//             case 'logo':
//               return <Banner2 key={index} bannerData={section.data}/>;
//             case 'service':
//               return <ServiceBanner key={index} bannerData={section.data}/>;
//             default:
//               return null; // You can handle other banner sections here if necessary
//           }
//         }
//         return null;
//       })}        
//     </div>
//   )
// }

// export default HomePage

const HomePage = ({ open, setOpen,singlePopup,setSinglePopUp, count, decrementQuantity, incrementQuantity, categories, autoclose,deviceCookie }) => {
  const homeData = useFetch('api/home/');
  const newspopupData = useFetch('api/newspopup/');
  // console.log(newspopupData)
  const allProductData = useFetch('api/products/');
  // console.log(allProductData)
  const [isLoading, setIsLoading] = useState(true);
  // const [news,setNews] = useState(false)
  const [activeNews, setActiveNews] = useState([]);

  useEffect(() => {
    if (homeData) {
      setIsLoading(false);
    }
  }, [homeData]);
  
  useEffect(() => {
    if (!isLoading && newspopupData) {
      // Filter the active news popups
      const activePopups = newspopupData.filter(popup => popup.active);
      setActiveNews(activePopups);
  
      // If active popups exist, show them one at a time
      if (activePopups.length > 0) {
        const timer = setTimeout(() => {
          setActiveNews([]);
        }, 5000 * activePopups.length); // Adjust timeout for multiple popups
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, newspopupData]);
  
  if (isLoading) {
    return <Preloader />;
  }
  
  if (activeNews.length > 0) {
    // Show the first active popup
    return (
      <NewsPopup
        news={activeNews[0]}
        setActiveNews={setActiveNews}
      />
    );
  }

  const { product_section: productSections = [], banner_section: bannerSections = [] } = homeData[0] || {};

  const mergeSections = (productSections, bannerSections) => {
    let mergedArray = [];
    let maxLength = Math.max(productSections.length, bannerSections.length);

    for (let i = 0; i < maxLength; i++) {
      if (productSections[i]) {
        mergedArray.push({ type: 'product', data: productSections[i] });
      }
      if (bannerSections[i]) {
        mergedArray.push({ type: 'banner', data: bannerSections[i] });
      }
    }

    return mergedArray;
  };

  const mergedSections = mergeSections(productSections, bannerSections);

  return (
    <div>
      <BannerSlider categories={categories} />
      <EndLine />
      {mergedSections.map((section, index) => {
        const isLastSection = index === mergedSections.length - 1;

        // Apply a bottom margin only if it's not the last section
        const sectionMarginClass = !isLastSection ? '768px:mb-[50px]' : '';

        if (section.type === 'product') {
          switch (section.data.product_section_type) {
            case 'normal':
              return (
                <div className={`${sectionMarginClass}`} key={index}>
                  <MonitorArm
                    open={open}
                    setOpen={setOpen}
                    singlePopup={singlePopup} 
                    setSinglePopUp={setSinglePopUp}
                    count={count}
                    incrementQuantity={incrementQuantity}
                    decrementQuantity={decrementQuantity}
                    product_section_data={section.data}
                    allProductData={allProductData}
                    autoclose={autoclose}
                    deviceCookie={deviceCookie}
                  />
                </div>
              );
            case 'multiple':
              return (
                <div className={`${sectionMarginClass}`} key={index}>
                  <HomeDecor 
                    open={open} 
                    setOpen={setOpen} 
                    singlePopup={singlePopup} 
                    setSinglePopUp={setSinglePopUp}
                    product_section_data={section.data} 
                    allProductData={allProductData} 
                    autoclose={autoclose}
                    deviceCookie={deviceCookie} 
                  />
                </div>
              );
            case 'other':
              return (
                <div className={`${sectionMarginClass}`} key={index}>
                  <CategoryProductSection 
                    open={open} 
                    setOpen={setOpen} 
                    singlePopup={singlePopup} 
                    setSinglePopUp={setSinglePopUp}
                    product_section_data={section.data} 
                    allProductData={allProductData} 
                    autoclose={autoclose} 
                    deviceCookie={deviceCookie}
                  />
                </div>
              );
            default:
              return null;
          }
        } else if (section.type === 'banner') {
          switch (section.data.banner_type) {
            case 'normal':
              return <div className={`${sectionMarginClass}`} key={index}><BannerArea bannerData={section.data} /></div>;
            case 'logo':
              return <div className={`${sectionMarginClass}`} key={index}><Banner2 bannerData={section.data} /></div>;
            case 'service':
              return <div className={`${sectionMarginClass}`} key={index}><ServiceBanner bannerData={section.data} /></div>;
            default:
              return null;
          }
        }
        return null;
      })}
    </div>
  );
};

export default HomePage;