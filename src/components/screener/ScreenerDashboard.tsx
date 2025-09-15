import React from "react";
import { SCREEN_CATEGORIES } from "@/lib/constants";
import { useNavigate } from "react-router";

const ScreenerIndexPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRunScreen = (title: string) => {
    navigate(`/screener/stratagy/${encodeURIComponent(title)}`);
  };

  return (
    <main className="col-span-9 space-y-8 scrollbar-cyan scroll-auto">
      {SCREEN_CATEGORIES.map((category) => (
        <section
          key={category.title}
          className="bg-brand-container rounded-xl"
        >
          <h2 className="text-xl font-bold text-brand-text-primary mb-4">
            {category.title}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {category.screens.map((screen) => (
              <article
                key={screen.title}
                className="bg-brand-muted border border-brand-border rounded-xl p-4 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-brand-text-primary">
                    {screen.title}
                  </h3>
                  <p className="text-sm text-brand-text-secondary mt-1">
                    {screen.description}
                  </p>
                </div>

                {/* Run Screener Button */}
                <button
                  onClick={() => handleRunScreen(screen.title)}
                  className="mt-4 px-4 py-2 text-sm font-medium rounded-lg bg-cyan-500 text-white shadow-md hover:bg-cyan-600 active:scale-[0.98] transition-all duration-200"
                >
                  Run Screen
                </button>
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
};

export default ScreenerIndexPage;
