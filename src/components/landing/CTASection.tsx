import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function CTASection() {
  const t = useTranslations("LandingPage.cta");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 text-center sm:py-32">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <span className="text-sm font-medium text-white">{t("badge")}</span>
        </div>

        {/* Heading */}
        <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {t("heading")}
        </h2>

        {/* Subheading */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-blue-100 sm:text-xl">
          {t("subheading")}
        </p>

        {/* CTA buttons */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/products"
            className="group inline-flex items-center justify-center rounded-xl bg-white px-10 py-5 text-lg font-semibold text-blue-700 shadow-2xl transition-all hover:bg-blue-50 hover:shadow-3xl hover:scale-105"
          >
            {t("button")}
            <svg
              className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1"
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
        </div>

        {/* Trust indicators */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3 md:gap-8">
          <div className="flex flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <svg className="h-6 w-6 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-white">{t("trustIndicator1")}</p>
            <p className="mt-1 text-xs text-blue-200">{t("trustIndicator1Sub")}</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <svg className="h-6 w-6 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-white">{t("trustIndicator2")}</p>
            <p className="mt-1 text-xs text-blue-200">{t("trustIndicator2Sub")}</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <svg className="h-6 w-6 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-white">{t("trustIndicator3")}</p>
            <p className="mt-1 text-xs text-blue-200">{t("trustIndicator3Sub")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
