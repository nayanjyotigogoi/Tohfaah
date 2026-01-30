"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { FloatingElements } from "@/components/floating-elements";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star, Filter } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Heart Pendant Necklace",
    description: "Sterling silver necklace with a delicate heart charm",
    price: 49.99,
    rating: 4.8,
    reviews: 124,
    category: "jewelry",
    color: "from-rose-100 to-pink-100",
  },
  {
    id: 2,
    name: "Love Letter Kit",
    description: "Premium stationery set with envelopes and wax seal",
    price: 29.99,
    rating: 4.9,
    reviews: 89,
    category: "stationery",
    color: "from-amber-50 to-orange-50",
  },
  {
    id: 3,
    name: "Memory Scrapbook",
    description: "Beautiful scrapbook for preserving your favorite moments",
    price: 34.99,
    rating: 4.7,
    reviews: 156,
    category: "keepsakes",
    color: "from-pink-100 to-rose-50",
  },
  {
    id: 4,
    name: "Rose Gold Bracelet",
    description: "Elegant rose gold bracelet with heart links",
    price: 59.99,
    rating: 4.9,
    reviews: 78,
    category: "jewelry",
    color: "from-rose-100 to-pink-100",
  },
  {
    id: 5,
    name: "Couple's Photo Frame",
    description: "Double photo frame for your favorite memories together",
    price: 24.99,
    rating: 4.6,
    reviews: 203,
    category: "keepsakes",
    color: "from-purple-50 to-pink-50",
  },
  {
    id: 6,
    name: "Love Coupon Book",
    description: "Customizable coupon book for special date ideas",
    price: 19.99,
    rating: 4.8,
    reviews: 312,
    category: "stationery",
    color: "from-red-50 to-rose-100",
  },
  {
    id: 7,
    name: "Heart-Shaped Candle Set",
    description: "Scented candles for romantic evenings",
    price: 27.99,
    rating: 4.7,
    reviews: 167,
    category: "home",
    color: "from-amber-100 to-rose-100",
  },
  {
    id: 8,
    name: "Matching Keychains",
    description: "Set of two interlocking heart keychains",
    price: 14.99,
    rating: 4.5,
    reviews: 245,
    category: "accessories",
    color: "from-pink-50 to-rose-100",
  },
];

const categories = ["all", "jewelry", "stationery", "keepsakes", "home", "accessories"];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<number[]>([]);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const addToCart = (productId: number) => {
    setCart([...cart, productId]);
  };

  return (
    <main className="relative min-h-screen bg-background">
      <FloatingElements density="low" />
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <ShoppingBag className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-light text-foreground mb-6">
              The <span className="italic text-primary">Gift Shop</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              Curated physical gifts to complement your digital experiences. 
              Every item chosen for its romantic touch.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shop Content */}
      <section className="py-12 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Filter className="w-5 h-5 text-muted-foreground" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-colors capitalize ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Cart Info */}
          {cart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-primary/10 rounded-xl flex items-center justify-between"
            >
              <p className="text-foreground">
                <ShoppingBag className="w-5 h-5 inline mr-2" />
                {cart.length} item{cart.length > 1 ? "s" : ""} in cart
              </p>
              <Button className="bg-primary text-primary-foreground">
                Checkout
              </Button>
            </motion.div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <motion.div
                  className="bg-card border border-border rounded-2xl overflow-hidden group"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Product Image Placeholder */}
                  <div
                    className={`aspect-square bg-gradient-to-br ${product.color} flex items-center justify-center relative overflow-hidden`}
                  >
                    <Heart className="w-16 h-16 text-primary/30" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-foreground font-medium mb-1">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm text-foreground">
                        {product.rating}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Price & Button */}
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-medium text-foreground">
                        ${product.price}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => addToCart(product.id)}
                        disabled={cart.includes(product.id)}
                        className={
                          cart.includes(product.id)
                            ? "bg-secondary text-muted-foreground"
                            : "bg-primary text-primary-foreground"
                        }
                      >
                        {cart.includes(product.id) ? "Added" : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No products found in this category
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
