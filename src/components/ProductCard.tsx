import type { Product } from '@/types/Product';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Heart, ShoppingBasket } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import { useTransition } from 'react';
import { Spinner } from './ui/shadcn-io/spinner';
import { useFavoritesStore } from '@/features/favourites/favoritesStore';
import { toast } from 'sonner';
import { Link } from 'react-router';

// import QuantityController from './QuantityController';

type Props = {
  product: Product;
};

export const ProductCard: React.FC<Props> = ({ product }) => {
  // Separate transitions for cart and favorites to handle loading states independently
  const [isCartPending, startCartTransition] = useTransition();
  const [isFavoritePending, startFavoriteTransition] = useTransition();

  const { addToCart, items } = useCartStore();
  const { toggleFavorites, favorites } = useFavoritesStore();

  const currentItem = items.find((item) => item.product.id === product.id);
  const isFavorite = favorites.some((item) => item.id === product.id);

  const handleAddToCart = (product: Product) => {
    startCartTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await addToCart(product);
      toast.success('Item added to cart');
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
    <Card className="w-full">
      <CardHeader>
        <img
          src={`${product.images[0]}`}
          alt="Product Image"
          className="object-contain h-[196px] w-[206px] mx-auto"
        />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 sm:min-h-[58px] mt-4">
          <h2 className="text-[14px]/[21px]">{product.name}</h2>
          <div className="flex flex-row gap-2 text-2xl"></div>
        </div>
        <div className="flex gap-2">
          <h2 className="font-bold text-[22px]/[140%]">
            ${product.priceDiscount}
          </h2>
          <h3 className="font-bold text-[22px]/[140%] line-through text-dark">
            ${product.priceRegular}
          </h3>
        </div>
        <div className="border-t border-[#3B3E4A] my-2" />
        <div className="flex flex-col gap-2 text-xs">
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
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2 justify-between">
          {/* //? varian 1 with qty controller 🎛️*/}
          {/* {currentItem ? (
            <QuantityController
              currentItem={currentItem}
              quantity={currentItem.quantity}
            />
          ) : (
            <Button
              onClick={() => handleAddToCart(product)}
              className="flex-1 py-5"
              disabled={isCartPending} // Disable only this button
            >
              {isCartPending ? (
                <Spinner width={20} height={20} />
              ) : (
                'Add to cart'
              )}
            </Button>
          )} */}

          {/* //? varian 2 3 go to the cart 🛒 */}
          {currentItem ? (
            <Button
              asChild
              className="flex-1 py-5 bg-secondary"
              disabled={isCartPending} // Disable only this button
            >
              <Link to="/cart">
                {' '}
                Go to cart
                <ShoppingBasket className="!w-4 !h-4" />
              </Link>
            </Button>
          ) : (
            <Button
              onClick={() => handleAddToCart(product)}
              className="flex-1 py-5"
              disabled={isCartPending} // Disable only this button
            >
              {isCartPending ? (
                <Spinner width={20} height={20} />
              ) : (
                'Add to cart'
              )}
            </Button>
          )}

          {/* //? varian leave the same button */}
          {/* <Button
            onClick={() => handleAddToCart(product)}
            className="flex-1 py-5"
            disabled={isCartPending} // Disable only this button
          >
            {isCartPending ? <Spinner width={20} height={20} /> : 'Add to cart'}
          </Button> */}

          <Button
            onClick={() => handleToggleFavorites(product)}
            variant="secondary"
            className="items-center justify-center py-5"
            disabled={isFavoritePending} // Disable only this button
          >
            {isFavoritePending ? (
              <Spinner width={20} height={20} />
            ) : isFavorite ? (
              <Heart fill="#f53353" color="#f53353" />
            ) : (
              <Heart />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
