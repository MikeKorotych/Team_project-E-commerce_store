import { Button } from "@/components/ui/button";

export const Navbar = () => (
  <div className="grid grid-cols-4 gap-4 p-4 border-b mb-4">
    <Button variant={"ghost"}>
      HOME
    </Button>
    <Button variant={"ghost"}>
      PHONES
    </Button>
    <Button variant={"ghost"}>
      TABLETS
    </Button>
    <Button variant={"ghost"}>
      ACCESSORIES
    </Button>
  </div>
);
