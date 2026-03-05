const Home = () => {
  return (
    <div className="text-center">
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
