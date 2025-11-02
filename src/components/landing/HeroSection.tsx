import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function HeroSection() {
  const t = useTranslations("LandingPage.hero");

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="text-left">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 mb-6">
              <span className="text-sm font-medium text-white">
                {t("badge")}
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-tight">
              {t("title")}
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-blue-100 sm:text-xl">
              {t("subtitle")}
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-xl transition-all hover:bg-blue-50 hover:shadow-2xl hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {t("ctaPrimary")}
                <svg
                  className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>

              <button
                onClick={scrollToHowItWorks}
                className="group inline-flex items-center justify-center rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {t("ctaSecondary")}
                <svg
                  className="ml-2 h-5 w-5 transition-transform group-hover:translate-y-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Trust signals */}
            <div className="mt-12 flex items-center gap-8 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t("trustSignal1")}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t("trustSignal2")}</span>
              </div>
            </div>
          </div>

          {/* Right: Product Visualization Placeholder */}
          <div className="relative lg:h-[600px]">
            {/* Floating card with 3D visualization placeholder */}
            <div className="relative rounded-2xl bg-white p-6 shadow-2xl">
              {/* Placeholder for 3D product viewer */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Grid background */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239CA3AF' fill-opacity='0.2'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>

                {/* 3D wireframe placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-64 w-64 text-blue-600 opacity-80 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    <circle cx="12" cy="12" r="10" strokeWidth={0.5} opacity="0.3" />
                    <path d="M2 12h20M12 2v20" strokeWidth={0.5} opacity="0.2" />
                  </svg>
                </div>

                {/* Label */}
                <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 backdrop-blur-sm px-4 py-2 shadow-lg">
                  <p className="text-sm font-medium text-gray-700">{t("previewLabel")}</p>
                  <p className="text-xs text-gray-500">{t("previewSubLabel")}</p>
                </div>
              </div>

              {/* Parameter controls preview */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{t("parameterExample1")}</span>
                  <span className="text-gray-500">35mm</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{t("parameterExample2")}</span>
                  <span className="text-gray-500">50mm</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                </div>
              </div>

              {/* Update indicator */}
              <div className="mt-4 flex items-center gap-2 text-xs text-green-600">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-medium">{t("updating")}</span>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -right-4 -top-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 px-6 py-3 shadow-xl">
              <p className="text-sm font-bold text-white">{t("liveBadge")}</p>
            </div>

            {/* Decorative blob */}
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
            <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full text-white"
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 48h1440V0s-120 48-360 48S720 0 720 0 480 48 360 48 0 0 0 0v48z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
