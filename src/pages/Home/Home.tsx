const Home = () => {
  return (
    <div className="overflow-hidden text-center flex-1">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden -z-1"
        aria-hidden="true"
      >
        <div className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-primary/8" />
        <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-cyan/8" />
        <div className="absolute top-1/2 right-10 h-24 w-24 rounded-full bg-yellow/10" />
      </div>

      <div className="py-5 md:py-10">
        <img
          className="block m-auto w-50"
          src="/icons/pollkydoky.png"
          alt="Pollky Doky Icon"
        />
      </div>
      <h1 className="text-balance text-3xl md:text-6xl font-bold text-foreground">
        Crea encuestas en vivo
        <span className="mt-2 block text-primary"> que la gente disfruta</span>
      </h1>
      <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">
        PollkyDoky hace ridiculamente fácil el crear y compartir encuestas en
        tiempo real
      </p>
    </div>
  );
};

export default Home;
