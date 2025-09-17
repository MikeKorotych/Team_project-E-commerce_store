import React from "react";
import { Link } from "react-router";

type Props = {
  supabaseUrl: string;
};

export const HomeShopCategory: React.FC<Props> = ({ supabaseUrl }) => {
  return (
    <div className="max-w-[1136px]">
      <h2 className="text-3xl font-bold mb-4 py-6">Shop by category</h2>
      <div className="flex justify-between gap-[10px] flex-col sm:flex-row">
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
          <Link to="/tablets">
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
