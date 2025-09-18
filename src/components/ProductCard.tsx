import type { Product } from '@/types/Product';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, Heart, ShoppingBasket } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import { useTransition, useContext, useRef } from 'react';
import { Spinner } from './ui/shadcn-io/spinner';
import { useFavoritesStore } from '@/features/favourites/favoritesStore';
import { toast } from 'sonner';
import { Link } from 'react-router';
import { AnimationContext } from '../context/AnimationContext';
import { CardContainer, CardItem } from './ui/shadcn-io/3d-card';

// import QuantityController from './QuantityController';

type Props = {
  product: Product;
};

export const ProductCard: React.FC<Props> = ({ product }) => {
  const [isCartPending, startCartTransition] = useTransition();
  const [isFavoritePending, startFavoriteTransition] = useTransition();

  const { addToCart, items } = useCartStore();
  const { toggleFavorites, favorites } = useFavoritesStore();

  const cartIconRef = useContext(AnimationContext)?.cartIconRef;
  const productImageRef = useRef<HTMLImageElement>(null);

  const currentItem = items.find((item) => item.product.id === product.id);
  const isFavorite = favorites.some((item) => item.id === product.id);

  const handleAddToCart = (product: Product) => {
    if (!productImageRef.current || !cartIconRef?.current) {
      // Fallback for no animation
      startCartTransition(async () => {
        await addToCart(product);
        toast.success('Item added to cart');
      });
      return;
    }

    const productImageRect = productImageRef.current.getBoundingClientRect();
    const cartIconRect = cartIconRef.current.getBoundingClientRect();

    const flyingImage = document.createElement('img');
    flyingImage.src = productImageRef.current.src;
    flyingImage.style.position = 'fixed';
    flyingImage.style.left = `${productImageRect.left}px`;
    flyingImage.style.top = `${productImageRect.top}px`;
    flyingImage.style.width = `${productImageRect.width}px`;
    flyingImage.style.height = `${productImageRect.height}px`;
    flyingImage.style.objectFit = 'contain';
    flyingImage.style.zIndex = '1000';
    flyingImage.style.borderRadius = '0.5rem';
    // Use transform for smoother animation
    flyingImage.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
    flyingImage.style.transform = 'translate(0, 0) scale(1)';
    flyingImage.style.opacity = '1';

    document.body.appendChild(flyingImage);

    // Calculate the translation and scale
    const deltaX =
      cartIconRect.left -
      productImageRect.left +
      (cartIconRect.width - productImageRect.width) / 2;
    const deltaY =
      cartIconRect.top -
      productImageRect.top +
      (cartIconRect.height - productImageRect.height) / 2;

    // Trigger the animation
    requestAnimationFrame(() => {
      flyingImage.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0)`;
      flyingImage.style.opacity = '0.5';
    });

    // Add to cart and remove the element after animation
    startCartTransition(async () => {
      await addToCart(product);
      toast.success('Item added to cart');
      setTimeout(() => {
        if (document.body.contains(flyingImage)) {
          document.body.removeChild(flyingImage);
        }
      }, 1000); // Match transition duration
    });
  };

  const handleToggleFavorites = (product: Product) => {
    startFavoriteTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await toggleFavorites(product);
      if (isFavorite) {
        toast.error('Item removed from favorites');
      } else {
        toast.success('Item added to favorites');
      }
    });
  };

  return (
    <CardContainer containerClassName="py-0 ">
      <Card className="w-full [transform-style:preserve-3d]">
        <CardHeader className="[transform-style:preserve-3d]">
          <CardItem translateZ="40">
            <img
              src={`${product.images[0]}`}
              alt="Product Image"
              className="object-contain h-[196px] w-[206px] mx-auto"
              ref={productImageRef}
            />
          </CardItem>
        </CardHeader>
        <CardContent className="[transform-style:preserve-3d]">
          <CardItem translateZ="30">
            <div className="flex flex-col gap-2 sm:min-h-[58px] mt-4">
              <h2 className="text-[14px]/[21px]">{product.name}</h2>
              <div className="flex flex-row gap-2 text-2xl"></div>
            </div>
          </CardItem>
          <CardItem translateZ="20">
            <div className="flex gap-2">
              <h2 className="font-bold text-[22px]/[140%]">
                ${product.priceDiscount}
              </h2>
              <h3 className="font-bold text-[22px]/[140%] line-through text-dark">
                ${product.priceRegular}
              </h3>
            </div>
          </CardItem>
          <div className="border-t border-[#3B3E4A] my-2" />
          <CardItem
            translateZ="10"
            className="flex flex-col gap-2 text-xs [transform-style:preserve-3d]"
          >
            <div className="flex justify-between">
              <span className="text-dark">Screen</span>
              <span>
                {product.screen.length > 9
                  ? product.screen.slice(0, 9)
                  : product.screen}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark">Capacity</span>
              <span>{product.capacity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark">RAM</span>
              <span>{product.ram}</span>
            </div>
          </CardItem>
        </CardContent>
        <CardFooter className="[transform-style:preserve-3d]">
          <CardItem
            className="w-full [transform-style:preserve-3d]"
            translateZ="20"
          >
            <div className="flex w-full gap-2 justify-between">
              {currentItem ? (
                <Button
                  asChild
                  className="flex-1 py-5 bg-secondary group"
                  disabled={isCartPending}
                >
                  <Link
                    to="/cart"
                    className="flex items-center justify-center gap-x-1"
                  >
                    Go to cart
                    <div className="w-0 group-hover:w-4 group-hover:opacity-100 opacity-0 transition-all duration-300 overflow-hidden scale-0 group-hover:scale-100">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                </Button>
              ) : (
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 py-5 group"
                  disabled={isCartPending}
                >
                  {isCartPending ? (
                    <Spinner width={20} height={20} />
                  ) : (
                    <>
                      Add to cart
                      <div className="w-0 group-hover:w-4 group-hover:opacity-100 opacity-0 transition-all duration-300 overflow-hidden scale-0 group-hover:scale-100">
                        <ShoppingBasket className="h-4 w-4" />
                      </div>
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={() => handleToggleFavorites(product)}
                variant="secondary"
                className="items-center justify-center py-5 group"
                disabled={isFavoritePending}
              >
                {isFavoritePending ? (
                  <Spinner width={20} height={20} />
                ) : isFavorite ? (
                  <Heart
                    fill="#f53353"
                    color="#f53353"
                    className="transition-all duration-300 group-hover:scale-120"
                  />
                ) : (
                  <Heart className="transition-all duration-300  group-hover:stroke-[#ff3546e4] group-hover:stroke-3 stroke-1" />
                )}
              </Button>
            </div>
          </CardItem>
        </CardFooter>
      </Card>
    </CardContainer>
  );
};
