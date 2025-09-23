import ProductPageNav from "@/components/ProductPageNav";
import { Button } from "@/components/ui/button";
import { EyeClosed, LogOut, SquarePen } from "lucide-react";
import { supabase } from "../../utils/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export const ProfilePage = () => {
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
            <span className="text-2xl">Gigachad</span>
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
                  gigachad@gmail.com
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

            <Button variant={"outline"} className="font-bold">
              Change password
            </Button>
            <Button variant={"outline"} className="font-bold">
              History
            </Button>
            <Button variant={"destructive"} onClick={() => {
              handleSignOut();
              navigate('/');
            }}>
              Log out
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Credit cards */}
          <div className="flex bg-card p-4"></div>
        </div>
      </div>
    </>
  );
};
