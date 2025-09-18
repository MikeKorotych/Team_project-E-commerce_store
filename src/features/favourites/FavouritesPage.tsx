import { ProductCard } from "@/components/ProductCard";
import ProductPageNav from "@/components/ProductPageNav";
import { useFavoritesStore } from "@/features/favourites/favoritesStore";

export const FavouritesPage = () => {
  const { favorites } = useFavoritesStore();

  return (
    <>
      <ProductPageNav category="Favourites" />

      <h1 className="page-title">Favourites</h1>
      <span className="text-sm/[21px] text-dark">{favorites.length} items</span>

      <div className="products-table">
        {favorites.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </>
  );
};
