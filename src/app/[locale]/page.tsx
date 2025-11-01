import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Catalog");

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default function CatalogPage() {
  const t = useTranslations("Catalog");
  const tProducts = useTranslations("Products");

  const products = [
    {
      id: "hoseAdapter",
      href: "/hose-adapter",
      name: tProducts("hoseAdapter.name"),
      description: tProducts("hoseAdapter.shortDescription"),
    },
    // Add more products here as they are implemented
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-8 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-lg text-gray-600 mt-2">{t("subtitle")}</p>
        </div>
      </header>

      {/* Product Grid */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {t("products")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-gray-300 transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600">{product.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
