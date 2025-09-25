import ProductPageNav from "@/components/ProductPageNav";
import { Button } from "@/components/ui/button";
import { Check, LogOut, SquarePen, X } from "lucide-react";
import { supabase } from "../../utils/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuthStore } from "../auth/sessionStore";
import { useState } from "react";
import { OrderProducts } from "./order/OrderProducts";
import { AvatarsChanger } from "./avatars/AvatarsChanger";
// import { useUserStore } from "../user/userStore";

export const ProfilePage = () => {
  const { session, profile, orders } = useAuthStore();

  const [selectedId, setSelectedId] = useState("");

  const [isOrderItemsOpen, setIsOrderItemsOpen] = useState(false);
  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = useState(false);

  // const [isAdressEditing, setIsAdressEditing] = useState(false);
  // const [isNameEditing, setIsNameEditing] = useState(false);

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
          <div className="max-w-[428px] max-h-[428px]">
            <img
              src={profile?.user_ava}
              alt="Profile Avatar"
              className="rounded-full border-6 object-contain"
            />
          </div>
          <div className="flex flex-row">
            <span className="text-2xl">{`${profile?.first_name} ${profile?.last_name}`}</span>
            <Button variant={"ghost"}>
              <SquarePen className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant={"ghost"}
            className="text-1xl"
            onClick={() => {
              setIsChangeAvatarOpen(true);
            }}
          >
            Change avatar
          </Button>
          <AvatarsChanger
            open={isChangeAvatarOpen}
            onOpenChange={setIsChangeAvatarOpen}
          />
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
                <span className="select-none">Shipping address:</span>

                <div className="flex flex-row gap-2 items-center">
                  <span>
                    {profile?.shipping_address === undefined
                      ? "Address not specified."
                      : profile?.shipping_address}
                  </span>
                  <Button variant={"ghost"}>
                    <SquarePen className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 mt-5">
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
          {/* <div className="flex flex-col gap-4 bg-card p-4">
            <Button asChild variant={"outline"} className="max-w-[150px]">
              <Link to="/credit_cards">Choose card</Link>
            </Button>

            Visible choosed Credit Card
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
          </div> */}
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
              {orders?.length === 0 ? (
                <div className="flex justify-center p-5">
                  <h2>No orders made yet</h2>
                </div>
              ) : (
                orders?.map((order) => {
                  return (
                    <tr key={order.id}>
                      <td
                        className="px-7 py-2 border-l align-middle cursor-pointer hover:bg-muted"
                        onClick={() => {
                          setIsOrderItemsOpen(true);
                          setSelectedId(order.id);
                        }}
                      >
                        {order.id}
                      </td>
                      <td className="px-7 py-2 border-l align-middle">
                        {order.created_at.split("T")[0]}
                      </td>
                      <td className="px-7 py-2 border-l align-middle">
                        {order.shipping_address}
                      </td>
                      <td className="px-7 py-2 border-l align-middle">
                        {`$${order.total_price}`}
                      </td>
                      <td className="px-7 py-2 border-l align-middle">
                        {order.status ? (
                          <Check className="text-green-600 mx-auto" />
                        ) : (
                          <X className="text-red-600 mx-auto" />
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <OrderProducts
            orderId={selectedId}
            open={isOrderItemsOpen}
            onOpenChange={setIsOrderItemsOpen}
          />
        </div>
      </div>
    </>
  );
};
