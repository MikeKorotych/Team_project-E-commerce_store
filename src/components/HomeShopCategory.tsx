import React from "react";
import { Link } from "react-router";

export const HomeShopCategory = ({ supabaseUrl }: { supabaseUrl: string }) => {
  // const imgFromSupabase = `${supabaseUrl}/storage/v1/object/public/product-images/img/banner-phones.png`;
  return (
    <div className="max-w-[1136px]">
      <h2 className="text-3xl font-bold mb-4 py-6">Shop by category</h2>
      <div className="flex justify-between flex-col sm:flex-row">
        <div>
          <Link to="/phones">
            <img
              src={`${supabaseUrl}/storage/v1/object/public/product-images/img/cat-phones.png`}
              alt="phones-category"
            />
          </Link>

          <div className="flex flex-col py-6">
            <span>Mobile phones</span>
            <span className="text-dark">{`${"length"} models`}</span>
          </div>
        </div>
        <div>
          <Link to="/tables">
            <img
              src={`${supabaseUrl}/storage/v1/object/public/product-images/img/cat-tablets.png`}
              alt="tablets-category"
            />
          </Link>
          <div className="flex flex-col py-6">
            <span>Tablets</span>
            <span className="text-dark">{`${"length"} models`}</span>
          </div>
        </div>
        <div>
          <Link to="/accessories">
            <img
              src={`${supabaseUrl}/storage/v1/object/public/product-images/img/cat-accessories.png`}
              alt="accessories-category"
            />
          </Link>
          <div className="flex flex-col py-6">
            <span className="py-">Accessories</span>
            <span className="text-dark">{`${"length"} models`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// className="relative bg-[#6D6474] h-[288px] w-[288px] sm:h-[187px] sm:w-[187px] lg:h-[368px] lg:w-[368px] "
