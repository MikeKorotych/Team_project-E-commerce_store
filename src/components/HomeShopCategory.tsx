import React from 'react';
import { Link } from 'react-router';

type Props = {
  supabaseUrl: string;
};

export const HomeShopCategory: React.FC<Props> = ({ supabaseUrl }) => {
  return (
    <div className="max-w-[1136px]">
      <h2 className="text-3xl font-bold mb-4 py-6">Shop by category</h2>
      <div className="flex gap-[10px] justify-between flex-col sm:flex-row items-center">
        <div>
          <Link to="/phones" className="overflow-hidden block">
            <img
              src={`${supabaseUrl}/storage/v1/object/public/product-images/img/cat-phones.png`}
              alt="phones-category"
              className="hover:scale-110 transition-all"
            />
          </Link>

          <div className="flex flex-col py-6">
            <span>Mobile phones</span>
            <span className="text-dark">{`${'length'} models`}</span>
          </div>
        </div>
        <div>
          <Link to="/tablets" className="overflow-hidden block">
            <img
              src={`${supabaseUrl}/storage/v1/object/public/product-images/img/cat-tablets.png`}
              alt="tablets-category"
              className="hover:scale-110 transition-all"
            />
          </Link>
          <div className="flex flex-col py-6">
            <span>Tablets</span>
            <span className="text-dark">{`${'length'} models`}</span>
          </div>
        </div>
        <div>
          <Link to="/accessories" className="overflow-hidden block">
            <img
              src={`${supabaseUrl}/storage/v1/object/public/product-images/img/cat-accessories.png`}
              alt="accessories-category"
              className="hover:scale-110 transition-all"
            />
          </Link>
          <div className="flex flex-col py-6">
            <span className="py-">Accessories</span>
            <span className="text-dark">{`${'length'} models`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
