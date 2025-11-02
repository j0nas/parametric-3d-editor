import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getAllProducts } from "@/products/registry";

export function ProductShowcase() {
  const t = useTranslations("LandingPage.productShowcase");
  const products = getAllProducts();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-24 sm:py-32">
      {/* Decorative background */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-purple-100 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="text-center">
          <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
            {t("badge")}
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {t("heading")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {t("subheading")}
          </p>
        </div>

        {/* Products grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {products.map((product, index) => {
            const productT = useTranslations(`Products.${product.id}` as any);

            return (
              <Link
                key={product.id}
                href={`/${product.slug}`}
                className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-lg transition-all hover:shadow-2xl hover:border-blue-400"
              >
                {/* Large image placeholder */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
                  {/* Grid background */}
                  <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239CA3AF' fill-opacity='0.3'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}></div>

                  {/* 3D Product visualization placeholder */}
                  <div className="flex h-full items-center justify-center p-12">
                    <div className="relative">
                      <svg className="h-48 w-48 text-blue-600 transition-transform group-hover:scale-110 group-hover:rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                      </svg>
                      {/* Glow effect */}
                      <div className="absolute inset-0 -z-10 blur-2xl">
                        <div className="h-full w-full rounded-full bg-blue-400 opacity-20"></div>
                      </div>
                    </div>
                  </div>

                  {/* "Customize" badge */}
                  <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-4 py-2 backdrop-blur-sm shadow-lg">
                    <p className="text-xs font-semibold text-blue-600">{t("customizeBadge")}</p>
                  </div>

                  {/* Popular badge (for first product) */}
                  {index === 0 && (
                    <div className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-1 shadow-lg">
                      <p className="text-xs font-bold text-white">POPULAR</p>
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {productT("name")}
                  </h3>

                  <p className="mt-3 text-base leading-relaxed text-gray-600">
                    {productT("shortDescription")}
                  </p>

                  {/* Features/specs */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {t("customizable")}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {t("instant3d")}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                      <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {t("readyToPrint")}
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="mt-8 flex items-center justify-between">
                    <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                      {t("customize")}
                      <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Hover accent bar */}
                <div className="absolute bottom-0 left-0 h-1.5 w-full scale-x-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-transform group-hover:scale-x-100"></div>
              </Link>
            );
          })}
        </div>

        {/* View all products CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:shadow-2xl hover:scale-105"
          >
            {t("viewAllProducts")}
            <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
