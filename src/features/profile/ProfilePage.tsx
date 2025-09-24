import ProductPageNav from "@/components/ProductPageNav";
import { Button } from "@/components/ui/button";
import { Check, EyeClosed, LogOut, SquarePen, X } from "lucide-react";
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

      <div className="flex flex-row max-lg:flex-col mt-10 gap-3 justify-between">
        {/* Profile picture, name and buttons for change them */}
        <div className="flex flex-col justify-center items-center">
          <img
            src="https://placehold.co/400x400"
            alt=""
            className="rounded-full border-6"
          />
          <div className="flex flex-row">
            <span className="text-2xl">{`${profile?.first_name} ${profile?.last_name}`}</span>
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

            <div className="flex flex-row gap-10 justify-between max-sm:flex-col">
              {/* Email */}
              <div className="flex flex-col">
                <span className="select-none">Email:</span>

                <span className="text-xl font-semibold max-sm:text-sm">
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
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 mt-5">
              <Button variant={"outline"} className="flex-1 font-bold w-auto">
                Change password
              </Button>
              <Button variant={"outline"} className="flex-1 font-bold w-auto">
                Settings
              </Button>
              <Button
                variant={"destructive"}
                className="flex-1 font-bold w-auto"
                onClick={() => {
                  handleSignOut();
                  navigate("/");
                }}
              >
                Log out
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
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
                className="rounded-2xl"
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

        <div className="w-full flex flex-col gap-6 bg-card p-5 overflow-x-auto">
          {/* Order */}
          <table className="border shadow-sm text-center min-w-[800px]">
            <thead className="bg-secondary">
              <tr>
                <th className="px-7 py-2 border-l">ID</th>
                <th className="px-7 py-2 border-l">Created At</th>
                <th className="px-7 py-2 border-l">Shipping address</th>
                <th className="px-7 py-2 border-l">Total price</th>
                <th className="px-7 py-2 border-l">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-muted">
                <td className="px-7 py-2 border-l align-middle cursor-pointer" onClick={() => setIsModalOpen(true)}>{orders[0].id}</td>
                <td className="px-7 py-2 border-l align-middle">{orders[0].createdAt}</td>
                <td className="px-7 py-2 border-l align-middle">
                  {orders[0].shippingAddress}
                </td>
                <td className="px-7 py-2 border-l align-middle">{orders[0].totalPrice}</td>
                <td className="px-7 py-2 border-l align-middle">
                  {orders[0].status ? (
                    <Check className="text-green-600 mx-auto" />
                  ) : (
                    <X className="text-red-600 mx-auto" />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <OrderProducts open={isModalOpen} onOpenChange={setIsModalOpen} />
        </div>
      </div>
    </>
  );
};
