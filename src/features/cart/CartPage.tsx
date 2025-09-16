import { CartItem } from "@/components/CartItem";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";

const data = [
  {
    id: "apple-iphone-11-128gb-black",
    name: "Apple iPhone 11 128GB Black",
    priceDiscount: 1050,
    capacity: "128GB",
    images: [
      "img/phones/apple-iphone-11/black/00.webp",
      "img/phones/apple-iphone-11/black/01.webp",
      "img/phones/apple-iphone-11/black/02.webp",
      "img/phones/apple-iphone-11/black/03.webp",
      "img/phones/apple-iphone-11/black/04.webp",
    ],
    // namespaceId: "apple-iphone-11",
    // capacityAvailable: ["64GB", "128GB", "256GB"],
    // priceRegular: 1100,
    // colorsAvailable: ["black", "green", "yellow", "white", "purple", "red"],
    // color: "black",
    // description: [
    //   {
    //     title: "And then there was Pro",
    //     text: [
    //       "A transformative triple-camera system that adds tons of capability without complexity.",
    //       "An unprecedented leap in battery life. And a mind-blowing chip that doubles down on machine learning and pushes the boundaries of what a smartphone can do. Welcome to the first iPhone powerful enough to be called Pro.",
    //     ],
    //   },
    //   {
    //     title: "Camera",
    //     text: [
    //       "Meet the first triple-camera system to combine cutting-edge technology with the legendary simplicity of iPhone. Capture up to four times more scene. Get beautiful images in drastically lower light. Shoot the highest-quality video in a smartphone — then edit with the same tools you love for photos. You’ve never shot with anything like it.",
    //     ],
    //   },
    //   {
    //     title:
    //       "Shoot it. Flip it. Zoom it. Crop it. Cut it. Light it. Tweak it. Love it.",
    //     text: [
    //       "iPhone 11 Pro lets you capture videos that are beautifully true to life, with greater detail and smoother motion. Epic processing power means it can shoot 4K video with extended dynamic range and cinematic video stabilization — all at 60 fps. You get more creative control, too, with four times more scene and powerful new editing tools to play with.",
    //     ],
    //   },
    // ],
    // screen: "6.1' IPS",
    // resolution: "1792x828",
    // processor: "Apple A13 Bionic",
    // ram: "4GB",
    // camera: "12 Mp + 12 Mp + 12MP",
    // zoom: "Digital, 5x",
    // cell: ["GPRS", "EDGE", "WCDMA", "UMTS", "HSPA", "LTE"],
  },

  {
    id: "apple-iphone-11-128gb-green",
    name: "Apple iPhone 11 128GB Green",
    priceDiscount: 1050,
    capacity: "128GB",
    images: [
      "img/phones/apple-iphone-11/green/00.webp",
      "img/phones/apple-iphone-11/green/01.webp",
      "img/phones/apple-iphone-11/green/02.webp",
      "img/phones/apple-iphone-11/green/03.webp",
      "img/phones/apple-iphone-11/green/04.webp",
    ],
  },

  {
    id: "apple-iphone-11-128gb-purple",
    name: "Apple iPhone 11 128GB Purple",
    priceDiscount: 1050,
    capacity: "128GB",
    images: [
      "img/phones/apple-iphone-11/purple/00.webp",
      "img/phones/apple-iphone-11/purple/01.webp",
      "img/phones/apple-iphone-11/purple/02.webp",
      "img/phones/apple-iphone-11/purple/03.webp",
      "img/phones/apple-iphone-11/purple/04.webp",
    ],
  },

  {
    id: "apple-iphone-11-128gb-red",
    name: "Apple iPhone 11 128GB Red",
    priceDiscount: 1050,
    capacity: "128GB",
    images: [
      "img/phones/apple-iphone-11/red/00.webp",
      "img/phones/apple-iphone-11/red/01.webp",
      "img/phones/apple-iphone-11/red/02.webp",
      "img/phones/apple-iphone-11/red/03.webp",
      "img/phones/apple-iphone-11/red/04.webp",
    ],
  },

  {
    id: "apple-iphone-11-128gb-white",
    name: "Apple iPhone 11 128GB White",
    priceDiscount: 1050,
    capacity: "128GB",
    images: [
      "img/phones/apple-iphone-11/white/00.webp",
      "img/phones/apple-iphone-11/white/01.webp",
      "img/phones/apple-iphone-11/white/02.webp",
      "img/phones/apple-iphone-11/white/03.webp",
      "img/phones/apple-iphone-11/white/04.webp",
    ],
  },
];

const total = data.reduce((sum, i) => (sum += i.priceDiscount), 0);

export const CartPage = () => {
  return (
    <>
      <div className="mb-10 max-sm:mb-6 flex flex-row gap-2">
        <ChevronLeft className="w-4 h-4" />
        <Link to="/" className="text-[#F1F2F9] text-xs mt-0.5">
          Back to shop
        </Link>
      </div>

      <h1 className="page-title">Cart</h1>
      <div className="flex flex-col xl:flex-row gap-8 lg:gap-4 mt-10 max-lg:items-center">
        {/* Item in Cart */}
        <div className="w-full flex flex-col gap-4 max-lg:items-center">
          {data.map((item) => (
            <CartItem
              key={item.id}
              item={{ ...item, image: item.images[0], quantity: 1 }}
            />
          ))}
        </div>

        {/* Total amount */}
        <div className="w-full max-w-[592px] xl:max-w-[368px] flex flex-col min-h-[190px] max-h-[206px] border shadow-sm justify-center items-center p-[24px]">
          <div className="flex flex-col items-center">
            <span className="font-bold text-[32px]/[41px]">${total}</span>
            <span className="text-dark text-sm/[21px]">Total for {data.length} items</span>
          </div>
          <div className="w-full max-w-[544px] border-t border-[#3B3E4A] my-4" />
          <Button className="w-full max-w-[544px] py-5">Checkout</Button>
        </div>
      </div>
    </>
  );
};
