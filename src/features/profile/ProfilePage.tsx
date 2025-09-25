import ProductPageNav from "@/components/ProductPageNav";
import { Button } from "@/components/ui/button";
import { Check, LogOut, SquarePen, X } from "lucide-react";
import { supabase } from "../../utils/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuthStore } from "../auth/sessionStore";
import { useEffect, useState } from "react";
import { OrderProducts } from "./order/OrderProducts";
import { AvatarsChanger } from "./avatars/AvatarsChanger";

export const ProfilePage = () => {
  const { session, profile, fetchProfile, orders, fetchOrders, updateProfile } =
    useAuthStore();

  const [selectedId, setSelectedId] = useState("");

  const [isOrderItemsOpen, setIsOrderItemsOpen] = useState(false);
  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = useState(false);

  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const [valueAddress, setValueAddress] = useState("");

  const [isNameEditing, setIsNameEditing] = useState(false);
  const [valueName, setValueName] = useState("");

  const navigate = useNavigate();

  const initChangeAddress = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await updateProfile({ default_shipping_address: valueAddress });
      toast.success("Address has been changed!");
    } catch {
      toast.error(`You can't do that...`);
    } finally {
      setValueAddress("");
      setIsAddressEditing(false);
    }
  };

  const initChangeName = async (event: React.FormEvent) => {
    event.preventDefault();

    if (valueName.length === 0) {
      toast.error(`You can't just leave it empty.`);
      setValueName("");
      setIsNameEditing(false);
      return;
    }

    try {
      await updateProfile({ first_name: valueName });
      toast.success("Name has been changed!");
    } catch {
      toast.error(`Something went wrong...`);
    } finally {
      setValueName("");
      setIsNameEditing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <div className="flex flex-row gap-2">
            {isNameEditing ? (
              <form onSubmit={initChangeName}>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="text-2xl"
                  value={valueName}
                  onChange={(e) => {
                    setValueName(e.target.value);
                  }}
                  onKeyUp={(e) => {
                    if (e.key === "Escape") {
                      setIsNameEditing(false);
                      setValueName("");
                    }
                  }}
                  placeholder="Write your name here"
                />
              </form>
            ) : (
              <>
                <span className="text-2xl">{`${profile?.first_name}`}</span>
                <button
                  className="mb-1"
                  onClick={() => {
                    setIsNameEditing(!isNameEditing);
                  }}
                >
                  <SquarePen className="w-4 h-4" />
                </button>
              </>
            )}
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

                <span className="text-[20px] font-semibold max-sm:text-sm">
                  {session?.user.email}
                </span>
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <span className="select-none">Shipping address:</span>

                <div className="flex flex-row gap-2">
                  {isAddressEditing ? (
                    <form onSubmit={initChangeAddress}>
                      <input
                        data-cy="TodoTitleField"
                        type="text"
                        value={valueAddress}
                        onChange={(e) => {
                          setValueAddress(e.target.value);
                        }}
                        onKeyUp={(e) => {
                          if (e.key === "Escape") {
                            setIsAddressEditing(false);
                            setValueAddress("");
                          }
                        }}
                        placeholder="Write address here."
                        className="w-[202px]"
                      />
                    </form>
                  ) : profile?.default_shipping_address.length === 0 ? (
                    <span className="text-7 font-semibold max-sm:text-sm">
                      Address not specified.
                    </span>
                  ) : (
                    <span className="text-7/7 font-semibold max-sm:text-sm">
                      {profile?.default_shipping_address}
                    </span>
                  )}
                  <button
                    className="mb-1"
                    onClick={() => {
                      setIsAddressEditing(!isAddressEditing);
                    }}
                  >
                    <SquarePen className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-5">
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
