import Link from "next/link";
import { products, bundle } from "@/lib/products";

export default function ProductsPage() {
  return (
    <div className="py-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My Products
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to build, launch, and scale your own AI agent business. 
            Each product is something I actually use myself.
          </p>
          <p className="text-sm text-secondary mt-4">
            💡 Prices are adjusted based on your location. We believe everyone deserves access to these tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {products.map((product) => (
            <div key={product.id} className="card flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <span className="text-5xl">{product.preview}</span>
                {product.popular && (
                  <span className="px-3 py-1 text-xs bg-secondary/20 text-secondary rounded-full">
                    Popular
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-400 mb-4">{product.tagline}</p>

              <div className="flex-1">
                <p className="text-gray-300 mb-6">{product.description}</p>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">What you get:</h3>
                  <ul className="space-y-2">
                    {product.includes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                        <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-card-border pt-6 mt-6">
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-green-500/10 rounded-lg p-2">
                    <span className="text-xs text-green-400 block">🌍 Accessible</span>
                    <span className="text-lg font-bold">${product.price.tier1}</span>
                  </div>
                  <div className="bg-yellow-500/10 rounded-lg p-2">
                    <span className="text-xs text-yellow-400 block">🌎 Regional</span>
                    <span className="text-lg font-bold">${product.price.tier2}</span>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-2">
                    <span className="text-xs text-primary block">🌍 Global</span>
                    <span className="text-lg font-bold">${product.price.tier3}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href={`/products/${product.slug}`} className="btn-primary flex-1 text-center">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bundle Offer */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="gradient-border rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Want Everything?</h3>
            <p className="text-gray-400 mb-6">
              Get all four products and save over 60%. Plus, get exclusive bonus content only available in the bundle.
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-3xl font-bold line-through text-gray-500">$194</span>
              <span className="text-4xl font-bold gradient-text">${bundle.price.tier3}</span>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mb-4">
              <span>🌍 ${bundle.price.tier1}</span>
              <span>🌎 ${bundle.price.tier2}</span>
              <span>🌍 ${bundle.price.tier3}</span>
            </div>
            <Link href="/products/bundle" className="btn-primary text-lg px-8 py-4">
              Get the Complete Bundle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
