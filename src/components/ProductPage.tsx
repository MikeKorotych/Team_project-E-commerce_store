import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import productsData from '../../api/products.json';
import phonesData from '../../api/phones.json';
import tabletsData from '../../api/tablets.json';
import accessoriesData from '../../api/accessories.json';
import type { Product } from '../types/Product';
import { Heart, ChevronLeft } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router';
import { ModelsRow } from '../components/ModelsRow';

interface ProductOverview {
  id: number;
  category: string;
  itemId: string;
  name: string;
  fullPrice: number;
  price: number;
  screen: string;
  capacity: string;
  color: string;
  ram: string;
  year: number;
  image: string;
}

interface DescriptionBlock {
  title: string;
  text: string[];
}

interface TabletDetails {
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
  description: DescriptionBlock[];
  screen?: string;
  resolution?: string;
  processor?: string;
  ram?: string;
  camera?: string;
  zoom?: string;
  cell?: string[];
}

interface AccessoryDetails {
  id: string;
  namespaceId: string;
  name: string;
  capacityAvailable?: string[];
  capacity?: string;
  priceRegular: number;
  priceDiscount: number;
  colorsAvailable?: string[];
  color?: string;
  images: string[];
  description: DescriptionBlock[];
  screen?: string;
  resolution?: string;
  processor?: string;
  ram?: string;
  camera?: string;
  zoom?: string;
  cell?: string[];
}

type DetailedProduct = Product | TabletDetails | AccessoryDetails;

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [productOverview, setProductOverview] = useState<ProductOverview | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedCapacity, setSelectedCapacity] = useState<string>('');
  const [youMayAlsoLike, setYouMayAlsoLike] = useState<ProductOverview[]>([]);
  const navigate = useNavigate();

  const parseProductIdFromUrl = (fullProductId: string) => {
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
      if (parts.length > 1 && !(/^\d+$/.test(parts[parts.length - 1]) || /^\d+(gb|mm)$/i.test(parts[parts.length - 1]))) {
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

  useEffect(() => {
    const { namespaceId, capacity: urlCapacity, color: urlColor } = parseProductIdFromUrl(productId || '');

    const foundProductOverview = productsData.find(p => {
      const parsedItem = parseProductIdFromUrl(p.itemId);
      const itemNamespaceId = parsedItem.namespaceId;
      const itemCapacity = parsedItem.capacity.toLowerCase();
      const itemColor = parsedItem.color.toLowerCase();

      const namespaceIdMatches = itemNamespaceId.startsWith(namespaceId) || namespaceId.startsWith(itemNamespaceId);

      return namespaceIdMatches &&
             itemCapacity === urlCapacity.toLowerCase() &&
             itemColor === urlColor.toLowerCase();
    });

    if (foundProductOverview) {
      setProductOverview(foundProductOverview);
      let foundDetailedProduct: DetailedProduct | undefined;

      if (foundProductOverview.category === 'phones') {
        foundDetailedProduct = phonesData.find(p => p.id === foundProductOverview.itemId) as Product;
      } else if (foundProductOverview.category === 'tablets') {
        foundDetailedProduct = tabletsData.find(p => p.id === foundProductOverview.itemId) as TabletDetails;
      } else if (foundProductOverview.category === 'accessories') {
        foundDetailedProduct = accessoriesData.find(p => p.id === foundProductOverview.itemId) as AccessoryDetails;
      }

      if (foundDetailedProduct) {
        setProduct(foundDetailedProduct);
        if (foundDetailedProduct.images.length > 0) {
          setMainImage(`/src/${foundDetailedProduct.images[0]}`);
        }

        // Встановлюємо вибраний колір з URL або перший доступний
        const selectedProdColor = foundDetailedProduct.colorsAvailable?.find(
          (c) => formatStringToUrlParam(c) === formatStringToUrlParam(urlColor)
        );
        if (selectedProdColor) {
          setSelectedColor(formatStringToUrlParam(selectedProdColor));
        } else if (foundDetailedProduct.colorsAvailable && foundDetailedProduct.colorsAvailable.length > 0) {
          setSelectedColor(formatStringToUrlParam(foundDetailedProduct.colorsAvailable[0]));
        }

        const selectedProdCapacity = foundDetailedProduct.capacityAvailable?.find(
          (c) => formatStringToUrlParam(c) === formatStringToUrlParam(urlCapacity)
        );
        if (selectedProdCapacity) {
          setSelectedCapacity(formatStringToUrlParam(selectedProdCapacity).toUpperCase());
        } else if (foundDetailedProduct.capacityAvailable && foundDetailedProduct.capacityAvailable.length > 0) {
          setSelectedCapacity(formatStringToUrlParam(foundDetailedProduct.capacityAvailable[0]).toUpperCase());
        }

        const relatedProducts = productsData.filter(
          p => p.category === foundProductOverview.category && p.itemId !== foundProductOverview.itemId
        ).slice(0, 4);
        setYouMayAlsoLike(relatedProducts);
      }
    }
  }, [productId]);

  if (!product || !productOverview) {
    return <div className="text-white text-center py-10">Loading product...</div>;
  }

  const transformProductOverviewToProduct = (overview: ProductOverview): Product => {
    const detailed = product as Product;
    return {
      id: overview.itemId,
      namespaceId: detailed.namespaceId || '',
      name: overview.name,
      capacityAvailable: detailed.capacityAvailable || [],
      capacity: overview.capacity,
      priceRegular: overview.fullPrice,
      priceDiscount: overview.price,
      colorsAvailable: detailed.colorsAvailable || [],
      color: overview.color,
      images: detailed.images.map(img => `/src/${img}`),
      description: detailed.description || [],
      screen: overview.screen || '',
      resolution: detailed.resolution || '',
      processor: detailed.processor || '',
      ram: overview.ram,
      camera: detailed.camera || '',
      zoom: detailed.zoom || '',
      cell: detailed.cell || [],
      itemId: overview.itemId,
    };
  };

  const handleColorChange = (newColor: string) => {
    if (productOverview && product) {
      const { namespaceId } = parseProductIdFromUrl(product.id);
      const newProductId = buildProductIdUrl(namespaceId, selectedCapacity, newColor);
      navigate(`/product/${newProductId}`);
    }
  };

  const handleCapacityChange = (newCapacity: string) => {
    if (productOverview && product) {
      const { namespaceId } = parseProductIdFromUrl(product.id);
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
            <span className="text-white text-right">{spec.value}</span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="font-sans bg-[#1a1a29] text-white min-h-screen p-4 md:p-8">
      <nav className="text-sm mb-4">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
          </li>
          <li className="flex items-center">
            <Link to={`/${productOverview.category}`} className="text-gray-400 hover:text-white">{productOverview.category}</Link>
            <span className="mx-2 text-gray-500">/</span>
          </li>
          <li className="flex items-center">
            <span className="text-white">{productOverview.name}</span>
          </li>
        </ol>
      </nav>

      <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white flex items-center mb-6">
        <ChevronLeft className="mr-2" />
        Back
      </button>

      <h1 className="text-3xl font-bold mb-8">{product.name}</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* зображення */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2">
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={`/src/${image}`}
                alt={`${product.name} thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover border-2 ${mainImage === `/src/${image}` ? 'border-blue-500' : 'border-transparent'} cursor-pointer rounded-md`}
                onClick={() => setMainImage(`/src/${image}`)}
              />
            ))}
          </div>
          <div className="flex-grow">
            <img src={mainImage} alt={product.name} className="w-full h-auto object-contain rounded-lg" />
          </div>
        </div>

        {/* Деталі */}
        <div className="w-full md:w-1/2">
          <div className="flex items-center mb-4">
            <span className="text-gray-500 text-sm">ID: {productOverview.itemId}</span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Available colors</h2>
            <div className="flex gap-2">
              {product.colorsAvailable?.map((color, index) => (
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
            <div className="flex gap-2">
              {product.capacityAvailable?.map((capacity, index) => {
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
            <span className="text-3xl font-bold">${product.priceDiscount}</span>
            <span className="text-xl text-gray-500 line-through">${product.priceRegular}</span>
          </div>

          <div className="flex gap-4 mb-8">
            <button className="flex-grow bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold py-3 px-6 rounded-lg">
              Add to cart
            </button>
            <button className="p-3 rounded-lg border border-gray-600 hover:bg-gray-700">
              <Heart />
            </button>
          </div>

          {renderTechSpecs(product)}
        </div>
      </div>

      <div className="mt-16 border-t border-gray-700 pt-8 flex flex-col md:flex-row gap-8">
        {/* про секція */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">About</h2>
          {product.description.map((section, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
              {section.text.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-gray-300 leading-relaxed mb-2">{paragraph}</p>
              ))}
            </div>
          ))}
        </div>

        {/* для мобілок */}
        <div className="w-full md:w-1/2 md:hidden">
          <h2 className="text-2xl font-bold mb-4">Tech specs</h2>
          {renderTechSpecs(product)}
        </div>
      </div>

      {/* вам також сподобається */}
      <div className="mt-16 border-t border-gray-700 pt-8">
        <h2 className="text-2xl font-bold mb-6">You may also like</h2>
        <ModelsRow product={youMayAlsoLike.map(transformProductOverviewToProduct)} title="" />
      </div>
    </div>
  );
};

export default ProductPage;