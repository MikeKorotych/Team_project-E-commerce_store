import { useEffect, useState, useRef } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { supabase } from "@/utils/supabase";
import { useNavigate } from "react-router";

type Product = {
  id: string | number;
  name: string;
};

export function SearchDropdown() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      setLoading(false);
      if (error) {
        console.error("Error fetching products:", error.message);
        return;
      }
      if (mounted) setProducts(data || []);
    };
    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter locally
  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      return;
    }
    const q = query.toLowerCase();
    setFiltered(
      products.filter((p) => p.name?.toLowerCase().includes(q)).slice(0, 5)
    );
  }, [query, products]);

  const navigate = useNavigate();
  const handleSelect = (item: Product) => {
    console.log("Selected product:", item);
    navigate(`/product/${item.id}`);
    setQuery("");
  };

  return (
    <div ref={wrapperRef} className="hidden lg:block w-[320px] relative">
      <Command className="w-full  bg-black/20">
        <div
          className={`
            rounded-2xl
            border border-white/20
            bg-black/20
            backdrop-blur-md
            shadow-lg
            ring-0
            overflow-hidden
          `}
        >
          <CommandInput
            placeholder="Search products..."
            value={query}
            onValueChange={setQuery}
            className="
              bg-transparent
              border-0
              outline-none
              ring-0
              focus:ring-0
              placeholder:text-gray-400
              text-sm
              px-4 py-2
              w-full
            "
          />
        </div>
        {query && (
          <CommandList
            className={`
              absolute left-0 right-0 top-full mt-2
              rounded-2xl
              border border-white/20
              bg-black/80
              backdrop-blur-xl
              shadow-2xl
              ring-0
              overflow-hidden
              z-50
              max-h-60
            `}
          >
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-300">Loading...</div>
            ) : filtered.length > 0 ? (
              <CommandGroup heading="Results">
                {filtered.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => handleSelect(item)}
                    className="
                      rounded-md
                      px-3 py-2
                      hover:bg-white/10
                      dark:hover:bg-white/5
                      transition
                      cursor-pointer
                    "
                  >
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty className="px-3 py-2 text-gray-300">
                No products found
              </CommandEmpty>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
