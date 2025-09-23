import ProductPageNav from "@/components/ProductPageNav";
import { Button } from "@/components/ui/button";
import { EyeClosed, LogOut, SquarePen } from "lucide-react";
import { supabase } from "../../utils/supabase";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../auth/sessionStore";
import { useState } from "react";
import { OrderProducts } from "./OrderProducts";
// Temprorary
const orders = [
  {
    id: "1234567",
    createdAt: "23.09.2025",
    status: true,
    totalPrice: "$1234",
    shippingAddress: "3 Sadova Street, Kyiv, Kyiv Region",
  },
];

// ----------
export const ProfilePage = () => {
  const { session, profile } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast("You have been signed out");
  };

  return (
    <>
      <ProductPageNav category="Profile" />

      <h1 className="page-title">Profile page</h1>

      <div className="flex flex-row mt-10 gap-3 justify-between">
        {/* Profile picture, name and buttons for change them */}
        <div className="flex flex-col justify-center items-center">
          <img
            src="https://placehold.co/400x400"
            alt=""
            className="rounded-full border-6"
          />
          <div className="">
            <span className="text-2xl">{profile?.first_name}</span>
            <Button variant={"ghost"}>
              <SquarePen className="w-4 h-4" />
            </Button>
          </div>
          <Button variant={"ghost"} className="text-1xl">
            Change avatar
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          {/* My profile */}
          <div className="flex flex-col bg-card p-4 gap-3">
            <h2 className="text-2xl font-bold">My profile</h2>

            <div className="flex flex-row gap-10 justify-between">
              {/* Email */}
              <div className="flex flex-col">
                <span className="select-none">Email:</span>

                <span className="text-xl font-semibold">
                  {session?.user.email}
                </span>
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <span className="select-none">Password:</span>

                <div className="flex flex-row gap-2 items-center">
                  <span>*********</span>

                  <Button variant={"ghost"} size={"sm"}>
                    <EyeClosed />
                  </Button>
                </div>
              </div>
            </div>

            <Button variant={"outline"} className="font-bold max-w-2xs">
              Change password
            </Button>
            <Button variant={"outline"} className="font-bold max-w-2xs">
              Settings
            </Button>
            <Button
              variant={"destructive"}
              className="font-bold max-w-2xs"
              onClick={() => {
                handleSignOut();
                navigate("/");
              }}
            >
              Log out
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Credit cards */}
          <div className="flex flex-col gap-4 bg-card p-4">
            <Button asChild variant={"outline"} className="max-w-[150px]">
              <Link to="/credit_cards">Choose card</Link>
            </Button>

            {/* Visible choosed Credit Card */}
            <div className="flex bg-secondary justify-center gap-5 p-6">
              <img
                src="https://placehold.co/300x200"
                alt="Choosed Credit Card"
              />
            </div>
            <span className="self-center">
              You haven't created or choosed your credit card
            </span>
          </div>
        </div>
      </div>
      {/* Purchase history */}
      <div className="flex flex-col mt-10">
        <h1 className="text-[22px]/[32px] font-bold mb-2 self-center">
          Purchase history
        </h1>

        <div className="flex flex-col gap-6 bg-card p-5">
          {/* Order */}
          <div className="w-full bg-secondary flex flex-row justify-center gap-6 border shadow-sm p-4">
            <span
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer"
            >
              {orders[0].id}
            </span>
            <span>{orders[0].createdAt}</span>
            <span>{orders[0].shippingAddress}</span>
            <span>{orders[0].totalPrice}</span>
            <span>{orders[0].status}</span>
            <OrderProducts open={isModalOpen} onOpenChange={setIsModalOpen} />
          </div>

          <div className="w-full bg-secondary flex flex-row justify-center gap-6 border shadow-sm p-4">
            <span
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer"
            >
              {orders[0].id}
            </span>
            <span>{orders[0].createdAt}</span>
            <span>{orders[0].shippingAddress}</span>
            <span>{orders[0].totalPrice}</span>
            <span>{orders[0].status}</span>
            <OrderProducts open={isModalOpen} onOpenChange={setIsModalOpen} />
          </div>
        </div>
      </div>
    </>
  );
};
