import React from 'react';
import { Link } from 'react-router';
import { ChevronUp } from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const imgFromSupabase = `${supabaseUrl}/storage/v1/object/public/product-images/img/header/Nice-Gadgets-with-smile.png`;

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="font-sans bg-[#0f1121] text-white h-[257px] md:h-[96px] border-t w-full">
      <div className="container mx-auto h-full flex flex-col items-center justify-between space-y-8 md:flex-row md:space-y-0 md:justify-between md:items-center px-[32px]">
        {/* лого */}
        <Link to="/" className="py-4.5">
          <img
            className="w-22.5 h-7 inline object-contain"
            src={imgFromSupabase}
            alt="Nice Gadgets"
          />
        </Link>

        {/* лінки */}
        <nav className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 uppercase items-center">
          <a
            href="https://github.com/MikeKorotych/Team_project-E-commerce_store"
            className="font-extrabold text-[12px] leading-[11px] tracking-[0.04em] text-[#F1F2F9] hover:text-gray-400"
          >
            Github
          </a>
          <a
            href="#"
            className="font-extrabold text-[12px] leading-[11px] tracking-[0.04em] text-[#F1F2F9] hover:text-gray-400"
          >
            Contacts
          </a>
          <a
            href="#"
            className="font-extrabold text-[12px] leading-[11px] tracking-[0.04em] text-[#F1F2F9] hover:text-gray-400"
          >
            Rights
          </a>
        </nav>

        {/* кнопка топа */}
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <span className="font-extrabold text-[12px] leading-[11px] tracking-[0.04em] text-[#F1F2F9] hover:text-gray-400">
            Back to top
          </span>
          <button
            onClick={scrollToTop}
            className="bg-[#2a2a4a] p-2 rounded-md hover:bg-[#3a3a5a] focus:outline-none focus:ring-2 focus:ring-[#3a3a5a]"
          >
            <ChevronUp className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
