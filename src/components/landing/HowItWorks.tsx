import { useTranslations } from "next-intl";

interface Step {
  number: number;
  titleKey: string;
  descriptionKey: string;
  placeholderType: "configure" | "preview" | "order";
}

export function HowItWorks() {
  const t = useTranslations("LandingPage.howItWorks");

  const steps: Step[] = [
    {
      number: 1,
      titleKey: "step1.title",
      descriptionKey: "step1.description",
      placeholderType: "configure",
    },
    {
      number: 2,
      titleKey: "step2.title",
      descriptionKey: "step2.description",
      placeholderType: "preview",
    },
    {
      number: 3,
      titleKey: "step3.title",
      descriptionKey: "step3.description",
      placeholderType: "order",
    },
  ];

  const renderPlaceholder = (type: string) => {
    switch (type) {
      case "configure":
        return (
          <div className="relative h-full overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-6">
            {/* Mock parameter panel */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">{t("step1.mockup.title")}</h4>
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                </div>
              </div>

              {[
                { labelKey: "step1.mockup.innerDiameter", value: "35mm", width: "60%" },
                { labelKey: "step1.mockup.outerDiameter", value: "50mm", width: "75%" },
                { labelKey: "step1.mockup.length", value: "120mm", width: "85%" },
                { labelKey: "step1.mockup.wallThickness", value: "2.5mm", width: "45%" },
              ].map((param, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{t(param.labelKey)}</span>
                    <span className="tabular-nums text-blue-600">{param.value}</span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                      style={{ width: param.width }}
                    ></div>
                    {/* Thumb */}
                    <div
                      className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-blue-600 shadow-lg"
                      style={{ left: `calc(${param.width} - 8px)` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "preview":
        return (
          <div className="relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800">
            {/* 3D viewport grid */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 0h1v1H0V0zm20 0h1v1h-1V0zm0 20h1v1h-1v-1zM0 20h1v1H0v-1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>

            {/* 3D Object (centered) */}
            <div className="flex h-full items-center justify-center p-12">
              <div className="relative">
                {/* Glowing 3D object */}
                <svg className="h-64 w-64 text-blue-400 drop-shadow-2xl" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
                </svg>
                {/* Glow effect */}
                <div className="absolute inset-0 -z-10 blur-3xl">
                  <div className="h-full w-full rounded-full bg-blue-500 opacity-30"></div>
                </div>
              </div>
            </div>

            {/* Controls overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex gap-2 rounded-lg bg-white/10 p-2 backdrop-blur-sm">
                <button className="rounded bg-white/20 px-3 py-1.5 text-xs text-white hover:bg-white/30">
                  {t("step2.mockup.rotate")}
                </button>
                <button className="rounded bg-white/20 px-3 py-1.5 text-xs text-white hover:bg-white/30">
                  {t("step2.mockup.zoom")}
                </button>
                <button className="rounded bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700">
                  {t("step2.mockup.reset")}
                </button>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-green-500/90 px-3 py-1.5 backdrop-blur-sm">
                <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
                <span className="text-xs font-medium text-white">{t("step2.mockup.modelValid")}</span>
              </div>
            </div>
          </div>
        );

      case "order":
        return (
          <div className="relative h-full overflow-hidden rounded-xl border-2 border-gray-200 bg-white">
            {/* Order form mockup */}
            <div className="space-y-6 p-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h4 className="text-lg font-semibold text-gray-900">{t("step3.mockup.title")}</h4>
                <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  {t("step3.mockup.readyToOrder")}
                </div>
              </div>

              {/* Product preview */}
              <div className="flex gap-4">
                <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 p-3">
                  <svg className="h-full w-full text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1" />
                  </svg>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-medium text-gray-900">{t("step3.mockup.productName")}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>35mm → 50mm</p>
                    <p>{t("step3.mockup.length")}: 120mm</p>
                  </div>
                </div>
              </div>

              {/* Delivery info */}
              <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">{t("step3.mockup.qualityVerified")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">{t("step3.mockup.shipsIn")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">{t("step3.mockup.moneyBack")}</span>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl">
                {t("step3.mockup.placeOrder")}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-white py-24 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50"></div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="text-center">
          <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            {t("badge")}
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {t("heading")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {t("subheading")}
          </p>
        </div>

        {/* Steps */}
        <div className="mt-20 space-y-20">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`grid gap-12 lg:grid-cols-2 lg:gap-16 items-center ${
                index % 2 === 1 ? "lg:grid-flow-dense" : ""
              }`}
            >
              {/* Screenshot placeholder */}
              <div
                className={`relative ${
                  index % 2 === 1 ? "lg:col-start-2" : ""
                }`}
              >
                {/* Screenshot container */}
                <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl transition-transform hover:scale-105">
                  {renderPlaceholder(step.placeholderType)}

                  {/* Screenshot label */}
                  <div className="absolute -bottom-4 -right-4 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-3 shadow-xl">
                    <p className="text-sm font-bold text-white">
                      {t("stepLabel", { number: step.number })}
                    </p>
                  </div>
                </div>

                {/* Decorative elements */}
                {index === 0 && (
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-200 opacity-30 blur-2xl"></div>
                )}
                {index === 1 && (
                  <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-purple-200 opacity-30 blur-2xl"></div>
                )}
                {index === 2 && (
                  <div className="absolute -right-8 top-1/2 h-32 w-32 rounded-full bg-green-200 opacity-30 blur-2xl"></div>
                )}
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                {/* Step number badge */}
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-2xl font-bold text-white shadow-lg">
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {t(step.titleKey)}
                </h3>

                {/* Description */}
                <p className="mt-4 text-lg leading-relaxed text-gray-600">
                  {t(step.descriptionKey)}
                </p>

                {/* Features list */}
                <ul className="mt-8 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">
                        {t(`step${step.number}.feature${i}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
