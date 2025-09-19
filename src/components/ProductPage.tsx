import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import type { ProductTypes, Product } from '../types/Product';
import { Heart, ChevronLeft } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router';
import { ModelsRow } from '../components/ModelsRow';
import { useQuery } from '@tanstack/react-query';
import { fetchProductsByType } from '@/utils/helpers';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { ErrorMessage } from '@/components/error-message';
import { Button } from '@/components/ui/button';

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
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedCapacity, setSelectedCapacity] = useState<string>('');
  const [youMayAlsoLike, setYouMayAlsoLike] = useState<Product[]>([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (detailedProduct) {

      if (detailedProduct.images && detailedProduct.images.length > 0) {
        setMainImage(`${detailedProduct.images[0]}`);
      }

      const { capacity: urlCapacity, color: urlColor } = parseProductIdFromUrl(productId || '');

      // Set selected color and capacity based on URL or default to first available
      const selectedProdColor = detailedProduct.colorsAvailable?.find(
        (c: string) => formatStringToUrlParam(c) === formatStringToUrlParam(urlColor)
        );
        if (selectedProdColor) {
          setSelectedColor(formatStringToUrlParam(selectedProdColor));
      } else if (detailedProduct.colorsAvailable && detailedProduct.colorsAvailable.length > 0) {
        setSelectedColor(formatStringToUrlParam(detailedProduct.colorsAvailable[0]));
        }

      const selectedProdCapacity = detailedProduct.capacityAvailable?.find(
        (c: string) => formatStringToUrlParam(c) === formatStringToUrlParam(urlCapacity)
        );
        if (selectedProdCapacity) {
          setSelectedCapacity(formatStringToUrlParam(selectedProdCapacity).toUpperCase());
      } else if (detailedProduct.capacityAvailable && detailedProduct.capacityAvailable.length > 0) {
        setSelectedCapacity(formatStringToUrlParam(detailedProduct.capacityAvailable[0]).toUpperCase());
      }
    }
  }, [detailedProduct, productId, selectedColor, selectedCapacity]);

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
      const newProductId = buildProductIdUrl(namespaceId, selectedCapacity, newColor);
      navigate(`/product/${newProductId}`);
    }
  };

  const handleCapacityChange = (newCapacity: string) => {
    if (productOverview && detailedProduct) {
      const { namespaceId } = parseProductIdFromUrl(detailedProduct.id ?? '');
      const newProductId = buildProductIdUrl(namespaceId, newCapacity, selectedColor);
      navigate(`/product/${newProductId}`);
    }
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

  const renderTechSpecs = (detailedProduct: DetailedProduct) => {
    const specs: { label: string; value: string | undefined }[] = [];

    if ('screen' in detailedProduct && detailedProduct.screen) specs.push({ label: 'Screen', value: detailedProduct.screen });
    if ('resolution' in detailedProduct && detailedProduct.resolution) specs.push({ label: 'Resolution', value: detailedProduct.resolution });
    if ('processor' in detailedProduct && detailedProduct.processor) specs.push({ label: 'Processor', value: detailedProduct.processor });
    if ('ram' in detailedProduct && detailedProduct.ram) specs.push({ label: 'RAM', value: detailedProduct.ram });
      if ('capacity' in detailedProduct && detailedProduct.capacity) specs.push({ label: 'Built in memory', value: detailedProduct.capacity });
    if ('camera' in detailedProduct && detailedProduct.camera) specs.push({ label: 'Camera', value: detailedProduct.camera });
    if ('zoom' in detailedProduct && detailedProduct.zoom) specs.push({ label: 'Zoom', value: detailedProduct.zoom });
    if ('cell' in detailedProduct && detailedProduct.cell) specs.push({ label: 'Cell', value: detailedProduct.cell.join(', ') });

    return (
      <div className="text-sm grid grid-cols-2 gap-y-2 gap-x-4">
        {specs.map((spec, index) => (
          <React.Fragment key={index}>
            <span className="text-gray-400">{spec.label}</span>
            <span className="text-white text-right break-words">{spec.value}</span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderLimitedTechSpecs = (detailedProduct: DetailedProduct) => {
    const specs: { label: string; value: string | undefined }[] = [];

    if ('screen' in detailedProduct && detailedProduct.screen) specs.push({ label: 'Screen', value: detailedProduct.screen });
    if ('resolution' in detailedProduct && detailedProduct.resolution) specs.push({ label: 'Resolution', value: detailedProduct.resolution });
    if ('processor' in detailedProduct && detailedProduct.processor) specs.push({ label: 'Processor', value: detailedProduct.processor });
    if ('ram' in detailedProduct && detailedProduct.ram) specs.push({ label: 'RAM', value: detailedProduct.ram });

    return (
      <div className="text-sm grid grid-cols-2 gap-y-2 gap-x-4">
        {specs.map((spec, index) => (
          <React.Fragment key={index}>
            <span className="text-gray-400">{spec.label}</span>
            <span className="text-white text-right break-words">{spec.value}</span>
          </React.Fragment>
        ))}
      </div>
    );
  };

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
            <img src={mainImage} alt={detailedProduct.name} className="max-h-[300px] md:max-h-full w-auto object-contain rounded-lg" />
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
                  className={`w-8 h-8 rounded-full border-2 ${selectedColor === formatStringToUrlParam(color) ? 'border-blue-500' : 'border-gray-600'} cursor-pointer`}
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
                    className={`px-4 py-2 rounded-md border ${selectedCapacity === formatStringToUrlParam(capacity).toUpperCase() ? 'border-blue-500 bg-gray-700' : 'border-gray-600 bg-gray-800'} text-white hover:bg-gray-700`}
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
            <Button className="flex-grow bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold py-3 px-8 rounded-lg">
              Add to cart
            </Button>
            <button className="p-3 rounded-lg border border-gray-600 hover:bg-gray-700">
              <Heart />
            </button>
          </div>

          {renderLimitedTechSpecs(detailedProduct)}
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
          {renderTechSpecs(detailedProduct)}
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