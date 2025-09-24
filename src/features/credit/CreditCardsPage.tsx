import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { CreditInfo } from "./CreditInfo";
import { Button } from "@/components/ui/button";

export const CreditCardsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mb-10 max-sm:mb-6 flex flex-row gap-2">
        <ChevronLeft className="w-4 h-4" />
        <Link to="/profile" className="text-[#F1F2F9] text-xs mt-0.5">
          Back to profile
        </Link>
      </div>

      <h1 className="page-title">Credit Cards</h1>

      <Button variant={"outline"} className="mt-5">Add card</Button>

      {/* Credit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-card gap-5 mt-10 p-5">
        <div>
          <div className="flex flex-col bg-secondary items-center justify-center gap-5 p-6">
            <img
              src="https://placehold.co/300x200"
              alt="Choosed Credit Card"
              className="cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
            <span>My card</span>
          </div>
        </div>

        <div>
          <div className="flex flex-col bg-secondary items-center justify-center gap-5 p-6">
            <img
              src="https://placehold.co/300x200"
              alt="Choosed Credit Card"
              className="cursor-pointer"
            />
            <span>My Second Card</span>
          </div>
        </div>

        <div>
          <div className="flex flex-col bg-secondary items-center justify-center gap-5 p-6">
            <img
              src="https://placehold.co/300x200"
              alt="Choosed Credit Card"
              className="cursor-pointer"
            />
            <span>My Third Card</span>
          </div>
        </div>
        <CreditInfo open={isModalOpen} onOpenChange={setIsModalOpen} />
        
      </div>

    </>
  );
};
