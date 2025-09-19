import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import type { ProductTypes, Product } from '../types/Product';
import { Heart, ChevronLeft, ShoppingBasket, ArrowRight } from 'lucide-react';
import React, { useContext, useRef, useTransition } from 'react';
import { Link, useNavigate } from 'react-router';
import { ModelsRow } from '../components/ModelsRow';
import { useQuery } from '@tanstack/react-query';
import { fetchProductsByType } from '@/utils/helpers';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { ErrorMessage } from '@/components/error-message';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/features/cart/cartStore';
import { useFavoritesStore } from '@/features/favourites/favoritesStore';
import { toast } from 'sonner';
import { AnimationContext } from '../context/AnimationContext';

interface ProductOverview {
  id: string;
  namespaceId: string;
  name: string;
  capacityAvailable: string[];
  capacity: string;
  priceRegular: number;
  priceDiscount: number;
  colorsAvailable: string[];
  color: string;
  images: string[];
  description: { title: string; text: string[]; }[];
  screen: string;
  resolution: string;
  processor: string;
  ram: string;
  camera: string;
  zoom: string;
  cell: string[];
  itemId: string;
  image: string;
  fullPrice: number;
  category: string;
}

interface DetailedProduct {
  id: string;
  namespaceId: string;
  name: string;
  capacityAvailable: string[];
  capacity: string;
  priceRegular: number;
  priceDiscount: number;
  colorsAvailable: string[];
  color: string;
  images: string[];
  description: {
    title: string;
    text: string[];
  }[];
  screen: string;
  resolution: string;
  processor: string;
  ram: string;
  camera: string;
  zoom: string;
  cell: string[];
  itemId: string;
}

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [mainImage, setMainImage] = useState<string>('');
  const [youMayAlsoLike, setYouMayAlsoLike] = useState<Product[]>([]);
  const navigate = useNavigate();
  const [isCartPending, startCartTransition] = useTransition();
  const [isFavoritePending, startFavoriteTransition] = useTransition();
  const { addToCart, items } = useCartStore();
  const { toggleFavorites, favorites } = useFavoritesStore();
  const cartIconRef = useContext(AnimationContext)?.cartIconRef;
  const mainImageRef = useRef<HTMLImageElement>(null);

  const parseProductIdFromUrl = (fullProductId: string) => {
    if (!fullProductId) {
      return { namespaceId: '', capacity: '', color: '' };
    }
    const parts = fullProductId.split('-');
    let namespaceId = '';
    let capacity = '';
    let color = '';

    // Знаходимо індекс частини з об'ємом
    let potentialCapacityIndex = -1;
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];
      if (/^\d+(gb|mm|tb)$/i.test(part) || (/^\d+$/.test(part) && i > 0 && parts[i - 1].toLowerCase() !== 'series')) {
        potentialCapacityIndex = i;
        break;
      }
    }

    // Розділяємо на назву, об'єм та колір
    if (potentialCapacityIndex !== -1) {
      capacity = parts[potentialCapacityIndex];
      namespaceId = parts.slice(0, potentialCapacityIndex).join('-');
      color = parts.slice(potentialCapacityIndex + 1).join('-');
    } else {
      if (parts.length > 1 && !(/^\d+$/.test(parts[parts.length - 1]) || /^\d+(gb|mm|tb)$/i.test(parts[parts.length - 1]))) {
        color = parts[parts.length - 1];
        namespaceId = parts.slice(0, parts.length - 1).join('-');
      } else {
        namespaceId = fullProductId;
      }
    }

    return { namespaceId, capacity, color };
  };

   // Конвертує рядок у формат URL (малі літери, пробіли → дефіси
  const formatStringToUrlParam = (value: string) => {
    return value.toLowerCase().replace(/\s/g, '-');
  };

  //Створює ID продукту для URL з нових параметрів
  const buildProductIdUrl = (namespaceId: string, newCapacity: string, newColor: string) => {
    const base = formatStringToUrlParam(namespaceId);
    const capacityPart = newCapacity ? `-${formatStringToUrlParam(newCapacity)}` : '';
    const colorPart = newColor ? `-${formatStringToUrlParam(newColor)}` : '';
    return `${base}${capacityPart}${colorPart}`;
  };

  const transformProductOverview = (overview: ProductOverview): ProductOverview => {
    return {
      id: overview.id,
      namespaceId: (overview.id ?? '').split('-').slice(0, -2).join('-'),
      name: overview.name,
      capacityAvailable: [],
      capacity: overview.capacity,
      priceRegular: overview.fullPrice,
      priceDiscount: overview.priceDiscount,
      colorsAvailable: [],
      color: overview.color,
      images: overview.images,
      description: [],
      screen: overview.screen || '',
      resolution: '',
      processor: '',
      ram: overview.ram,
      camera: '',
      zoom: '',
      cell: [],
      itemId: overview.id, 
      image: overview.image,
      fullPrice: overview.fullPrice,
      category: overview.category,
    };
  };

  const getSimplifiedProductId = (fullId: string): string => {
    const match = fullId.match(/(\d+)(gb|mm|tb)?$/i);
    if (match && match[0]) {
      return match[1] + (match[2] ? match[2].toUpperCase() : '');
    }
    return fullId;
  };

  const { data: productOverview, isLoading: isOverviewLoading, isError: isOverviewError, error: overviewError } = useQuery<ProductOverview | undefined>(
    {
      queryKey: ['products', productId],
      queryFn: async () => {
        const phonesData = await fetchProductsByType('phones');
        const tabletsData = await fetchProductsByType('tablets');
        const accessoriesData = await fetchProductsByType('accessories');
        const allProducts = [...(phonesData || []), ...(tabletsData || []), ...(accessoriesData || [])];
        const found = allProducts?.find((p: ProductOverview) => String(p.id) === productId);
        return found as ProductOverview | undefined;
      },
      enabled: !!productId,
      staleTime: 3000,
    }
  );

  const { data: detailedProduct, isLoading: isDetailedLoading, isError: isDetailedError, error: detailedError } = useQuery<DetailedProduct | undefined>(
    {
      queryKey: [productOverview?.category, productOverview?.id],
      queryFn: async () => {
        if (!productOverview?.category || !productOverview?.id) {
          return undefined;
        }
        const data = await fetchProductsByType(productOverview.category as ProductTypes);
        const found = data?.find((p: DetailedProduct) => p.id === productOverview.id);
        return found as DetailedProduct | undefined;
      },
      enabled: !!productOverview?.category && !!productOverview?.id,
      staleTime: 3000,
    }
  );

  const { data: relatedProductsData, isLoading: isRelatedLoading, isError: isRelatedError, error: relatedError } = useQuery<Product[] | undefined>(
    {
      queryKey: ['relatedProducts', productOverview?.category, productOverview?.id],
      queryFn: async () => {
        if (!productOverview?.category || !productOverview?.id) {
          return undefined;
        }
        const data = await fetchProductsByType(productOverview.category as ProductTypes);
        return data ? (data as ProductOverview[]).filter(
          (p: ProductOverview) => {
            return p.category === productOverview.category &&
                 parseProductIdFromUrl(p.id ?? '').namespaceId !== parseProductIdFromUrl(productOverview.id ?? '').namespaceId;
          }
        ).slice(0, 4).map(transformProductOverview) : undefined;
      },
      enabled: !!productOverview?.category && !!productOverview?.id,
      staleTime: 3000,
    }
  );

  // Main image defaults to the first product image
  useEffect(() => {
    if (detailedProduct?.images?.length) {
      setMainImage(`${detailedProduct.images[0]}`);
    }
  }, [detailedProduct]);

  // Derive selected color/capacity from URL, fallback to first available
  const { capacity: urlCapacity, color: urlColor } = useMemo(() => (
    parseProductIdFromUrl(productId || '')
  ), [productId]);

  const activeColor = useMemo(() => {
    const match = detailedProduct?.colorsAvailable?.find(
      (c: string) => formatStringToUrlParam(c) === formatStringToUrlParam(urlColor)
    );
    const chosen = match ?? detailedProduct?.colorsAvailable?.[0] ?? '';
    return formatStringToUrlParam(chosen);
  }, [detailedProduct, urlColor]);

  const activeCapacity = useMemo(() => {
    const match = detailedProduct?.capacityAvailable?.find(
      (c: string) => formatStringToUrlParam(c) === formatStringToUrlParam(urlCapacity)
    );
    const chosen = match ?? detailedProduct?.capacityAvailable?.[0] ?? '';
    return formatStringToUrlParam(chosen).toUpperCase();
  }, [detailedProduct, urlCapacity]);

  useEffect(() => {
    if (relatedProductsData) {
      setYouMayAlsoLike(relatedProductsData);
    }
  }, [relatedProductsData]);

  if (isOverviewLoading || isDetailedLoading || isRelatedLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (isOverviewError || isDetailedError || isRelatedError) {
    return (
      <ErrorMessage
        message={overviewError?.message || detailedError?.message || relatedError?.message || 'Failed to load product.'}
        onRetry={() => {}}
      />
    );
  }

  if (!productOverview || !detailedProduct) {
    return <div className="text-white text-center py-10">Product not found.</div>;
  }

  const handleColorChange = (newColor: string) => {
    if (productOverview && detailedProduct) {
      const { namespaceId } = parseProductIdFromUrl(detailedProduct.id ?? '');
      const newProductId = buildProductIdUrl(namespaceId, activeCapacity, newColor);
      navigate(`/product/${newProductId}`);
    }
  };

  const handleCapacityChange = (newCapacity: string) => {
    if (productOverview && detailedProduct) {
      const { namespaceId } = parseProductIdFromUrl(detailedProduct.id ?? '');
      const newProductId = buildProductIdUrl(namespaceId, newCapacity, activeColor);
      navigate(`/product/${newProductId}`);
    }
  };

  const currentItem = items.find((item) => item.product.id === detailedProduct.id);
  const isFavorite = favorites.some((item) => item.id === detailedProduct.id);

  const handleAddToCart = (product: Product) => {
    if (!mainImageRef.current || !cartIconRef?.current) {
      startCartTransition(async () => {
        await addToCart(product);
        toast.success('Item added to cart');
      });
      return;
    }

    const productImageRect = mainImageRef.current.getBoundingClientRect();
    const cartIconRect = cartIconRef.current.getBoundingClientRect();

    const flyingImage = document.createElement('img');
    flyingImage.src = mainImageRef.current.src;
    flyingImage.style.position = 'fixed';
    flyingImage.style.left = `${productImageRect.left}px`;
    flyingImage.style.top = `${productImageRect.top}px`;
    flyingImage.style.width = `${productImageRect.width}px`;
    flyingImage.style.height = `${productImageRect.height}px`;
    flyingImage.style.objectFit = 'contain';
    flyingImage.style.zIndex = '1000';
    flyingImage.style.borderRadius = '0.5rem';
    flyingImage.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
    flyingImage.style.transform = 'translate(0, 0) scale(1)';
    flyingImage.style.opacity = '1';

    document.body.appendChild(flyingImage);

    const deltaX =
      cartIconRect.left -
      productImageRect.left +
      (cartIconRect.width - productImageRect.width) / 2;
    const deltaY =
      cartIconRect.top -
      productImageRect.top +
      (cartIconRect.height - productImageRect.height) / 2;

    requestAnimationFrame(() => {
      flyingImage.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0)`;
      flyingImage.style.opacity = '0.5';
    });

    startCartTransition(async () => {
      await addToCart(product);
      toast.success('Item added to cart');
      setTimeout(() => {
        if (document.body.contains(flyingImage)) {
          document.body.removeChild(flyingImage);
        }
      }, 1000);
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

  const getColorName = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'black': 'Black',
      'spacegray': 'Space Gray',
      'silver': 'Silver',
      'gold': 'Gold',
      'rose gold': 'Rose Gold',
      'midnight green': 'Midnight Green',
      'green': 'Green',
      'yellow': 'Yellow',
      'white': 'White',
      'purple': 'Purple',
      'red': 'Red',
      'gray': 'Gray',
      'starlight': 'Starlight',
      'pink': 'Pink',
      'sky-blue': 'Sky Blue',
      'spaceblack': 'Space Black',
      'sierrablue': 'Sierra Blue',
      'graphite': 'Graphite',
      'midnight': 'Midnight',
    };
    return colorMap[formatStringToUrlParam(color)] || color;
  };

  const collectTechSpecs = (product: DetailedProduct) => {
    const specs: { label: string; value: string | undefined }[] = [];
    if (product.screen) specs.push({ label: 'Screen', value: product.screen });
    if (product.resolution) specs.push({ label: 'Resolution', value: product.resolution });
    if (product.processor) specs.push({ label: 'Processor', value: product.processor });
    if (product.ram) specs.push({ label: 'RAM', value: product.ram });
    if (product.capacity) specs.push({ label: 'Built in memory', value: product.capacity });
    if (product.camera) specs.push({ label: 'Camera', value: product.camera });
    if (product.zoom) specs.push({ label: 'Zoom', value: product.zoom });
    if (product.cell) specs.push({ label: 'Cell', value: product.cell.join(', ') });
    return specs;
  };

  const renderSpecs = (specs: { label: string; value: string | undefined }[]) => (
    <div className="text-sm grid grid-cols-2 gap-y-2 gap-x-4">
      {specs.map((spec, index) => (
        <React.Fragment key={index}>
          <span className="text-gray-400">{spec.label}</span>
          <span className="text-white text-right break-words">{spec.value}</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="font-sans bg-[#1a1a29] text-white min-h-screen p-4 md:p-8">
      <nav className="text-sm mb-4">
        <ol className="list-none p-0 flex w-full flex-wrap">
          <li className="flex items-center flex-shrink-0">
            <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
          </li>
          <li className="flex items-center flex-shrink-0">
            <Link to={`/${productOverview.category}`} className="text-gray-400 hover:text-white">{productOverview.category}</Link>
            <span className="mx-2 text-gray-500">/</span>
          </li>
          <li className="flex items-center min-w-0 flex-grow">
            <span className="text-white truncate">
              {productOverview.name}
            </span>
          </li>
        </ol>
      </nav>

      <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white flex items-center mb-6">
        <ChevronLeft className="mr-2" />
        Back
      </button>

      <h1 className="text-3xl font-bold mb-8">{detailedProduct.name}</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* зображення */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2 mb-8 md:mb-0">
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible p-2">
            {detailedProduct.images.map((image: string, index: number) => (
              <img
                key={index}
                src={`${image}`}
                alt={`${detailedProduct.name} thumbnail ${index + 1}`}
                className={`w-20 h-20 object-contain border-2 ${mainImage === `${image}` ? 'border-blue-500' : 'border-transparent'} cursor-pointer rounded-md flex-shrink-0`}
                onClick={() => setMainImage(`${image}`)}
              />
            ))}
          </div>
          <div className="flex-grow flex justify-center items-center p-2">
            <img ref={mainImageRef} src={mainImage} alt={detailedProduct.name} className="max-h-[300px] md:max-h-full w-auto object-contain rounded-lg" />
          </div>
        </div>

        {/* Деталі */}
        <div className="w-full md:w-1/2">
          <div className="flex items-center mb-4">
            <span className="text-gray-500 text-sm">ID: {getSimplifiedProductId(productOverview.id)}</span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Available colors</h2>
            <div className="flex gap-2">
              {detailedProduct.colorsAvailable?.map((color: string, index: number) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full border-2 ${activeColor === formatStringToUrlParam(color) ? 'border-blue-500' : 'border-gray-600'} cursor-pointer`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  title={getColorName(color)}
                ></div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Select capacity</h2>
            <div className="flex gap-2 flex-wrap">
              {detailedProduct.capacityAvailable?.map((capacity: string, index: number) => {
                return (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-md border ${activeCapacity === formatStringToUrlParam(capacity).toUpperCase() ? 'border-blue-500 bg-gray-700' : 'border-gray-600 bg-gray-800'} text-white hover:bg-gray-700`}
                    onClick={() => handleCapacityChange(capacity)}
                  >
                    {capacity}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-3xl font-bold">${detailedProduct.priceDiscount}</span>
            <span className="text-xl text-gray-500 line-through">${detailedProduct.priceRegular}</span>
          </div>

          <div className="flex gap-4 mb-8">
            {currentItem ? (
              <Button asChild className="flex-grow bg-secondary group" disabled={isCartPending}>
                <Link to="/cart" className="flex items-center justify-center gap-x-1 py-3">
                  Go to cart
                  <div className="w-0 group-hover:w-4 group-hover:opacity-100 opacity-0 transition-all duration-300 overflow-hidden scale-0 group-hover:scale-100">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </Button>
            ) : (
              <Button
                onClick={() => handleAddToCart(detailedProduct as unknown as Product)}
                className="flex-grow group"
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
              onClick={() => handleToggleFavorites(detailedProduct as unknown as Product)}
              variant="secondary"
              className="items-center justify-center py-3 group"
              disabled={isFavoritePending}
            >
              {isFavoritePending ? (
                <Spinner width={20} height={20} />
              ) : isFavorite ? (
                <Heart fill="#f53353" color="#f53353" className="transition-all duration-300 group-hover:scale-120" />
              ) : (
                <Heart className="transition-all duration-300 group-hover:stroke-[#ff3546e4] group-hover:stroke-3 stroke-1" />
              )}
            </Button>
          </div>

          {renderSpecs(collectTechSpecs(detailedProduct).filter(s => ['Screen','Resolution','Processor','RAM'].includes(s.label)))}
        </div>
      </div>

      <div className="mt-16 border-t border-gray-700 pt-8 flex flex-col md:flex-row gap-8">
        {/* про секція */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">About</h2>
          {detailedProduct.description.map((section: { title: string; text: string[]; }, index: number) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
              {section.text.map((paragraph: string, pIndex: number) => (
                <p key={pIndex} className="text-gray-300 leading-relaxed mb-2">{paragraph}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Tech specs */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Tech specs</h2>
          {renderSpecs(collectTechSpecs(detailedProduct))}
        </div>
      </div>

      {/* вам також сподобається */}
      <div className="mt-16 border-t border-gray-700 pt-8">
        <h2 className="text-2xl font-bold mb-6">You may also like</h2>
        <ModelsRow product={youMayAlsoLike} title="" />
      </div>
    </div>
  );
};

export default ProductPage;