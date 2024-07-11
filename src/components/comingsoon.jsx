"use client";
import React from "react";
import { useState } from "react";

const comingsoon = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  return (
    <>
      <div className="fixed top-0 w-full z-30 clearNav md:bg-opacity-90 transition duration-300 ease-in-out">
        <div className="flex flex-col max-w-6xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
          <div className="flex flex-row items-center justify-between p-4">
            <a
              href="/"
              className="text-lg font-semibold rounded-lg tracking-widest focus:outline-none focus:shadow-outline"
            >
              <h1 className="text-4xl Avenir tracking-tighter text-gray-900 md:text-4x1 lg:text-3xl">
                <img className="h-12" src="/wootads.png" />
              </h1>
            </a>
            <button
              className="text-white cursor-pointer leading-none px-3 py-1 md:hidden outline-none focus:outline-none "
              type="button"
              aria-label="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#191919"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-menu"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <section className="text-gray-600 body-font">
        <div className="max-w-7xl mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 md:ml-24 pt-6 flex flex-col md:items-start md:text-left mb-40 items-center text-center">
            <h1 className="mb-5 sm:text-6xl text-5xl items-center Avenir xl:w-2/2 text-gray-900">
              Premier Solutions for SMEs in India and Beyond
            </h1>
            <p className="mb-4 xl:w-3/4 text-gray-600 text-lg">
              As a premier solutions provider, we cater to the needs of small
              and medium-sized enterprises across India and worldwide. Our
              cutting-edge services empower businesses to excel and grow in
              today's dynamic market environment. Stay tuned for our grand
              launch, where we will unveil innovative offerings designed to
              propel your business to new heights.
            </p>
            <div className="flex justify-center">
              <a
                className="inline-flex items-center px-5 py-3 mt-2 font-medium  transition duration-500 ease-in-out transform bg-transparent border rounded-lg bg-gray-900"
                href=""
              >
                <span className="justify-center">Find out more</span>
              </a>
            </div>
          </div>
          <div className="xl:mr-44 sm:mr-0 sm:mb-28 mb-0 lg:mb-0 mr-48 md:pl-10">
            <img
              className="w-80 md:ml-1 ml-24"
              alt="iPhone-12"
              src="/growth.png"
            ></img>
          </div>
        </div>
        <section className="mx-auto">
          <div className="container px-5 mx-auto lg:px-24 ">
            <div className="flex flex-col w-full mb-4 text-left lg:text-center">
              <h1 className="mb-8 text-4xl Avenir font-semibold text-black">
                We offer services in all the domains!
              </h1>
            </div>
            <div className=" gap-16 mb-16 text-center flex justify-center items-center">
              <div className="flex items-center justify-center">
                <img
                  src="/googlelogo.png"
                  alt="Google Logo"
                  className="block object-contain h-20 greyC"
                ></img>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/instagramlogo.png"
                  alt="Shopify Logo"
                  className="block object-contain h-20 greyC"
                ></img>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/fblogo.png"
                  alt="Cloudflare Logo"
                  className="block object-contain h-20 greyC"
                ></img>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/youtube_logo.png"
                  alt="Paypal Logo"
                  className="block object-contain h-20 greyC"
                ></img>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/twitterlogo.png"
                  alt="Paypal Logo"
                  className="block object-contain h-20 greyC"
                ></img>
              </div>
            </div>
          </div>
        </section>
        <div className="grr max-w-7xl pt-20 mx-auto text-center">
          <h1 className="mb-8 text-6xl Avenir font-semibold text-gray-900">
            Woot-Ads focused on building a media outreach
          </h1>
          <h1 className="mb-8 text-2xl Avenir font-semibold text-gray-600 text-center">
            Digital now reaches everyone
          </h1>
          <div className="container flex flex-col items-center justify-center mx-auto rounded-lg ">
            <img
              className="object-cover object-center w-3/4 mb-10 g327 border rounded-lg shadow-md"
              alt="Placeholder Image"
              src="/main.png"
            ></img>
          </div>
        </div>
        <section className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <div className="py-24 md:py-36">
              <h1 className="mb-5 text-6xl Avenir font-semibold text-gray-900">
                Subscribe to our newsletter
              </h1>
              <h1 className="mb-9 text-2xl font-semibold text-gray-600">
                Enter your email address and get our newsletters straight away.
              </h1>
              <input
                placeholder="jack@example.com"
                name="email"
                type="email"
                autoComplete="email"
                className="border border-gray-600 w-1/4 pr-2 pl-2 py-3 mt-2 rounded-md text-gray-800 font-semibold hover:border-gray-900"
              ></input>{" "}
              <a
                className="inline-flex items-center px-14 py-3 mt-2 ml-2 font-medium  transition duration-500 ease-in-out transform bg-transparent border rounded-lg bg-gray-900"
                href="/"
              >
                <span className="justify-center">Subscribe</span>
              </a>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default comingsoon;
