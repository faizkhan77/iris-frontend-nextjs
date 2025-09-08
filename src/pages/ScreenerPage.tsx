import ScreenerHeader from "@/components/screener/ScreenerHeader";

const ScreenerPage = () => {
  return (
    <main className="">
      <ScreenerHeader />
      <section className="flex">
        <aside className="w-80 border-r">side</aside>
        <aside className="w-full m-4">
          <section className="px-4 py-3 rounded-xl border">
            <h3>Timeframe</h3>
          </section>
          <section>
            <h3>Profit Gainers </h3>
            <div>
              <div>
                <h3></h3>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minima, est hic odio reiciendis numquam suscipit</p>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
};

export default ScreenerPage;
