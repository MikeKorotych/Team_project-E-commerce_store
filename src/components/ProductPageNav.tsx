import { ChevronRight, House } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

type Props = {
  category: string;
};

const ProductPageNav: React.FC<Props> = ({ category }) => {
  return (
    <div className="mb-10 max-sm:mb-6 flex gap-2 items-center">
      <Link to="/">
        <House className="w-4 h-4" />
      </Link>
      <ChevronRight className="w-4 h-4" fill="#4A4D58" />
      <Link
        to={`/${category.toLowerCase()}`}
        className="text-dark text-xs mt-0.5"
      >
        {category}
      </Link>
    </div>
  );
};

export default ProductPageNav;
