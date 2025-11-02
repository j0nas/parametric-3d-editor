import { useTranslations } from "next-intl";

interface Feature {
  titleKey: string;
  descriptionKey: string;
  placeholderType: "sliders" | "viewer" | "browser" | "delivery";
}

export function FeaturesGrid() {
  const t = useTranslations("LandingPage.features");

  const features: Feature[] = [
    {
      titleKey: "parametric.title",
      descriptionKey: "parametric.description",
      placeholderType: "sliders",
    },
    {
      titleKey: "realtime.title",
      descriptionKey: "realtime.description",
      placeholderType: "viewer",
    },
    {
      titleKey: "browserBased.title",
      descriptionKey: "browserBased.description",
      placeholderType: "browser",
    },
    {
      titleKey: "ordering.title",
      descriptionKey: "ordering.description",
      placeholderType: "delivery",
    },
  ];

  const renderPlaceholder = (type: string) => {
    switch (type) {
      case "sliders":
        return (
          <div className="space-y-4 p-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Parameter {i}</span>
                  <span className="text-gray-500">{20 + i * 10}mm</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                    style={{ width: `${40 + i * 15}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        );

      case "viewer":
        return (
          <div className="relative flex items-center justify-center p-8">
            {/* 3D grid */}
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239CA3AF' fill-opacity='0.15'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
            {/* 3D object */}
            <svg className="relative h-40 w-40 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
            {/* Control widget */}
            <div className="absolute bottom-4 right-4 rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur-sm">
              <div className="flex gap-2">
                <div className="h-6 w-6 rounded bg-gray-200"></div>
                <div className="h-6 w-6 rounded bg-gray-200"></div>
                <div className="h-6 w-6 rounded bg-blue-600"></div>
              </div>
            </div>
          </div>
        );

      case "browser":
        return (
          <div className="p-4">
            {/* Browser window */}
            <div className="overflow-hidden rounded-lg border-2 border-gray-300 bg-white shadow-lg">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="ml-4 flex-1 rounded bg-white px-3 py-1 text-xs text-gray-500">
                  localhost:3000
                </div>
              </div>
              {/* Browser content */}
              <div className="space-y-3 p-6">
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="h-20 rounded bg-blue-100"></div>
                  <div className="h-20 rounded bg-purple-100"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case "delivery":
        return (
          <div className="flex items-center justify-center p-8">
            <div className="relative">
              {/* Box icon */}
              <svg className="h-40 w-40 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              {/* Checkmark badge */}
              <div className="absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 shadow-lg">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              {/* Arrow */}
              <svg className="absolute -right-16 top-1/2 h-12 w-12 -translate-y-1/2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-gray-50 to-white py-24 sm:py-32">
      {/* Decorative background elements */}
      <div className="absolute left-0 top-1/4 h-72 w-72 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 h-72 w-72 rounded-full bg-purple-100 opacity-20 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {t("heading")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {t("subheading")}
          </p>
        </div>

        {/* Features grid */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all hover:shadow-2xl hover:border-blue-300"
            >
              {/* Image placeholder */}
              <div className="aspect-[4/3] overflow-hidden border-b border-gray-100 bg-gradient-to-br from-blue-50 to-purple-50">
                {renderPlaceholder(feature.placeholderType)}
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Icon badge */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {t(feature.titleKey)}
                </h3>

                {/* Description */}
                <p className="mt-3 text-base leading-relaxed text-gray-600">
                  {t(feature.descriptionKey)}
                </p>
              </div>

              {/* Hover accent */}
              <div className="absolute bottom-0 left-0 h-1 w-full scale-x-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-transform group-hover:scale-x-100"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
