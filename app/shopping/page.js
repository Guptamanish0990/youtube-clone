// ==================== app/shopping/page.js ====================
"use client";

export default function ShoppingPage() {
  const products = Array(12).fill(null).map((_, i) => ({
    id: i,
    name: `Product ${i + 1}`,
    price: `₹${Math.floor(Math.random() * 10000) + 500}`,
    rating: (Math.random() * 2 + 3).toFixed(1)
  }));

  return (
    <div className="w-full">
      <div className="p-6 border-b border-[#272727]">
        <h1 className="text-2xl font-bold">Shopping</h1>
        <p className="text-gray-400 mt-2">Discover and shop products</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <div key={product.id} className="cursor-pointer group">
              <div className="relative bg-[#272727] rounded-xl overflow-hidden aspect-square mb-3 hover:scale-105 transition-transform">
                <div className="absolute inset-0 flex items-center justify-center text-4xl">🛍️</div>
              </div>
              <h3 className="text-sm font-medium line-clamp-2 mb-1">{product.name}</h3>
              <p className="text-sm font-bold text-green-500">{product.price}</p>
              <p className="text-xs text-gray-400">⭐ {product.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
