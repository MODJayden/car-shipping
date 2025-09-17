import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, Shield, Award, Clock, TrendingUp } from "lucide-react";

const HeroBanner = () => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white mb-8">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMzNzQiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48L2c+PC9zdmc+')] opacity-20"></div>

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Premium Cars at
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Auction Prices
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
                Discover exclusive vehicles from our global auctions. Luxury,
                performance, and rare finds at unbeatable prices.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-6 h-6 text-cyan-400" />
                  <span className="text-3xl font-bold">500+</span>
                </div>
                <p className="text-gray-400 mt-1">Premium Vehicles</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-6 h-6 text-cyan-400" />
                  <span className="text-3xl font-bold">100%</span>
                </div>
                <p className="text-gray-400 mt-1">Verified Quality</p>
              </div>
              {/* <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-6 h-6 text-cyan-400" />
                  <span className="text-3xl font-bold">24h</span>
                </div>
                <p className="text-gray-400 mt-1">Fast Delivery</p>
              </div> */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                  <span className="text-3xl font-bold">30%</span>
                </div>
                <p className="text-gray-400 mt-1">Average Savings</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 text-lg"
              >
                View Auctions
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={"bg-indigo-300"}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Image Content */}
          <div className="flex-1 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                alt="Luxury car from our auction"
                className="w-full h-auto object-cover"
              />
              {/* Floating badge */}
              <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
                LIVE AUCTION
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-500 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Wave divider at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-16"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-current text-white"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-current text-white"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-current text-white"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroBanner;
