import Head from "next/head"
import React, { useState, useEffect, } from "react";

export default function HomePage() {
  
  return (
    <>
      <Head>
        <title>RRG Freight Services</title>
      </Head>


      <main className="">
<nav className="bg-transparent sticky">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 ">
    <a href="#" className="flex items-center">
    <img src="/assets/img/home/Logo3.png"  alt="..." className="image w-[60%]"></img>
    </a>

     
    <button data-collapse-toggle="navbar-dropdown" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-dropdown" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>

      
    <div className="hidden w-full md:block md:w-auto " id="navbar-dropdown">
      <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent">
        <li>
          <a href="#" className="bg-blue-700 rounded md:bg-transparent md:hover:text-blue-700" aria-current="page">Home</a>
        </li>
        <li>
          
            <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar" className="flex items-center justify-between w-full bg-blue-700 rounded md:bg-transparent md:hover:text-blue-700">About Us 
              <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
               <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
              </svg>
            </button>
            
            <div id="dropdownNavbar" className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-400" aria-labelledby="dropdownLargeButton">
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Mission & Vision</a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Meet the Team</a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Company Profile </a>
                  </li>
                </ul>
            </div>
        </li>
        
        <li>
          <a href="#" className="bg-blue-700 rounded md:bg-transparent md:hover:text-blue-700 grid-justify">Contact Us</a>
        </li>
        
        <li>
          <a href="#" className="bg-blue-700 rounded md:bg-transparent md:hover:text-blue-700">Track Package</a>
        </li>
        
        <li>
        <div className="flex items-center gap-6 font-medium bg-blue-700 rounded md:bg-transparent md:hover:text-blue-700 ">
              <button className=""><img src="/assets/img/home/login.png" className="image w-6 h-6 inline"></img>Log-in</button>
        </div>
        </li>
      </ul>
      
    </div>
  </div>
</nav>

    
<section>
<div className="imageWrapper">
          <img src="/assets/img/home/hp2.png" alt="Home Page"></img>
        </div>
        </section>
      
        <section>
        <div className="bg-white">
            <div className="text-center my-[150px]">
              <div className="font-size text-[70px] my-10">
              <p>Track now your package and</p>
              <p>ensure your cargo arrives safely</p>
              <p>and on schedule!</p>
              </div>
              <button className="bg-red-500 text-white px-6 py-3.5 rounded-full hover:bg-black hover:text-red-500 font-bold font-family my-10">Track Now</button>
            </div>
        </div>
        </section>

    
<section>
<div className="bg-[#acdee2] w-fullscreen h-[100vh]">
        <div id="controls-carousel" className="relative w-full" data-carousel="static">
    
    <div className="relative h-[100vh] overflow-hidden rounded-lg w-fullscreen">
         
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="/assets/img/home/cars1.png" className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."></img>
        </div>
        
        <div className="hidden duration-700 ease-in-out" data-carousel-item="active">
            <img src="/assets/img/home/cars2.png" className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."></img>
        </div>
        
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="/assets/img/home/cars1.png" className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."></img>
        </div>
        
        <div className=" duration-700 ease-in-out" data-carousel-item>
            <img src="/assets/img/home/cars2.png" className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."></img>
        </div>
        
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="/assets/img/home/cars1.png" className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."></img>
        </div>
    </div>
    
    <button type="button" className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg className="w-4 h-4 text-white dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
            <span className="sr-only">Previous</span>
        </span>
    </button>
    
    <button type="button" className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg className="w-4 h-4 text-white dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
            </svg>
            <span className="sr-only">Next</span>
        </span>
    </button>
        </div>
</div>
</section>
  
<section>
<div className="text-center my-[100px]">
    <div className="font-size text-[50px]">
      <p>RRG CLIENTS TESTIMONIALS</p>
             
     </div>
</div>
</section>


<section>

</section>




<footer className="bg-[#acdee2]">
    <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-10">
        <div className="md:flex md:justify-between">
          <div className="mb-5 md:mb-0">
              <a href="#" className="flex items-center">
                  <img src="/assets/img/home/logo3.png" className="image w-[45%] mx-20 my-5" alt="FlowBite Logo" /> 
                  
              </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-gray-900  dark:text-black">Useful Links</h2>
                  <ul className="text-gray-500 dark:text-gray-700 font-medium">
                      <li className="mb-4">
                          <a href="#" className="hover:underline">Login</a>
                      </li>
                      <li>
                          <a href="#" className="hover:underline">Tracking page</a>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-gray-900  dark:text-black">Company</h2>
                  <ul className="text-gray-500 dark:text-gray-700 font-medium">
                      <li className="mb-5">
                          <a href="#" className="hover:underline ">About Us</a>
                      </li>
                      <li className="mb-5">
                          <a href="#" className="hover:underline">Mission and Vision</a>
                      </li>
                      <li>
                          <a href="#" className="hover:underline">Contact Us</a>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-gray-900  dark:text-black">Legal</h2>
                  <ul className="text-gray-500 dark:text-gray-700 font-medium">
                      <li className="mb-4">
                          <a href="#" className="hover:underline">Privacy Policy</a>
                      </li>
                      <li>
                          <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center">© 2023 <a href="#" className="hover:underline">RRG FREIGHT SERVICES</a>
          </span>
          <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
            
              <a href="#" className="text-gray-700 hover:text-gray-900 dark:hover:text-white">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                        <path fill-rule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clip-rule="evenodd"/>
                    </svg>
                  <span className="sr-only">Facebook page</span>
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 dark:hover:text-white">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 16">
                        <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z"/>
                    </svg>
                  <span className="sr-only">Discord community</span>
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 dark:hover:text-white">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                    <path fill-rule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clip-rule="evenodd"/>
                </svg>
                  <span className="sr-only">Twitter page</span>
              </a>
              
          </div>
      </div>
    </div>
</footer>

      </main>
    </>
  );
}