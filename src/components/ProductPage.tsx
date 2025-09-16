import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productsData from '../../api/products.json';
import phonesData from '../../api/phones.json';
import tabletsData from '../../api/tablets.json';
import accessoriesData from '../../api/accessories.json';
import type { Product } from '../types/Product';
import { Heart, ChevronLeft } from 'lucide-react';
import React from 'react';

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

  useEffect(() => {
    const foundProduct = productsData.find(p => p.id === Number(productId));

    if (foundProduct) {
      setProductOverview(foundProduct);
      let foundDetailedProduct: DetailedProduct | undefined;

      if (foundProduct.category === 'phones') {
        foundDetailedProduct = phonesData.find(p => p.id === foundProduct.itemId) as Product;
      } else if (foundProduct.category === 'tablets') {
        foundDetailedProduct = tabletsData.find(p => p.id === foundProduct.itemId) as TabletDetails;
      } else if (foundProduct.category === 'accessories') {
        foundDetailedProduct = accessoriesData.find(p => p.id === foundProduct.itemId) as AccessoryDetails;
      }

      if (foundDetailedProduct) {
        setProduct(foundDetailedProduct);
        if (foundDetailedProduct.images.length > 0) {
          setMainImage(foundDetailedProduct.images[0]);
        }
        if (foundDetailedProduct.colorsAvailable && foundDetailedProduct.colorsAvailable.length > 0) {
          setSelectedColor(foundDetailedProduct.colorsAvailable[0]);
        }
        if (foundDetailedProduct.capacityAvailable && foundDetailedProduct.capacityAvailable.length > 0) {
          setSelectedCapacity(foundDetailedProduct.capacityAvailable[0]);
        }

        const relatedProducts = productsData.filter(
          p => p.category === foundProduct.category && p.id !== foundProduct.id
        ).slice(0, 4);
        setYouMayAlsoLike(relatedProducts);
      }
    }
  }, [productId]);

  if (!product || !productOverview) {
    return <div className="text-white text-center py-10">Loading product...</div>;
  }

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
    };
    return colorMap[color.toLowerCase()] || color;
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
            <a href="/" className="text-gray-400 hover:text-white">Home</a>
            <span className="mx-2 text-gray-500">/</span>
          </li>
          <li className="flex items-center">
            <a href={`/${productOverview.category}`} className="text-gray-400 hover:text-white">{productOverview.category}</a>
            <span className="mx-2 text-gray-500">/</span>
          </li>
          <li className="flex items-center">
            <span className="text-white">{productOverview.name}</span>
          </li>
        </ol>
      </nav>

      <button className="text-gray-400 hover:text-white flex items-center mb-6">
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
                className={`w-20 h-20 object-cover border-2 ${mainImage === image ? 'border-blue-500' : 'border-transparent'} cursor-pointer rounded-md`}
                onClick={() => setMainImage(image)}
              />
            ))}
          </div>
          <div className="flex-grow">
            <img src={`/src/${mainImage}`} alt={product.name} className="w-full h-auto object-contain rounded-lg" />
          </div>
        </div>

        {/* Деталі */}
        <div className="w-full md:w-1/2">
          <div className="flex items-center mb-4">
            <span className="text-gray-500 text-sm">ID: {productOverview.id}</span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Available colors</h2>
            <div className="flex gap-2">
              {product.colorsAvailable?.map((color, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-blue-500' : 'border-gray-600'} cursor-pointer`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  title={getColorName(color)}
                ></div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Select capacity</h2>
            <div className="flex gap-2">
              {product.capacityAvailable?.map((capacity, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-md border ${selectedCapacity === capacity ? 'border-blue-500 bg-gray-700' : 'border-gray-600 bg-gray-800'} text-white hover:bg-gray-700`}
                  onClick={() => setSelectedCapacity(capacity)}
                >
                  {capacity}
                </button>
              ))}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {youMayAlsoLike.map((item) => (
            <div key={item.id} className="bg-[#2a2a3e] rounded-lg p-4 flex flex-col items-center text-center">
              <a href={`/product/${item.id}`}>
                <img src={`/src/${item.image}`} alt={item.name} className="w-32 h-32 object-contain mb-4" />
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-bold">${item.price}</span>
                  <span className="text-md text-gray-500 line-through">${item.fullPrice}</span>
                </div>
                <div className="text-sm text-gray-400 mb-4">
                  <p>Screen: {item.screen}</p>
                  <p>Capacity: {item.capacity}</p>
                  <p>RAM: {item.ram}</p>
                </div>
              </a>
              <div className="flex gap-2 w-full">
                <button className="flex-grow bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold py-2 px-4 rounded-lg text-sm">
                  Add to cart
                </button>
                <button className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700">
                  <Heart />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;