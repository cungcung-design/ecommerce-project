function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gray-100 px-6 py-16 text-center">
        <h1 className="text-4xl font-bold">
          Welcome to Our Store
        </h1>

        <p className="mt-4 text-gray-600">
          Find the products you love.
        </p>

        <button className="mt-6 rounded-lg bg-black px-6 py-3 text-white">
          Shop Now
        </button>
      </section>
    </div>
  );
}

export default Home;