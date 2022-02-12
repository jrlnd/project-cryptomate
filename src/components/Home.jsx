import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/solid";

import { useGetAllCryptosQuery } from "../services/cryptoApi";
import { Loader, Currencies, News } from "./";

const classes = {
  sectionTitle: "text-3xl md:text-4xl font-bold mb-4 md:mb-8 mr-2",
  sectionSubTitle: "text-lg font-semibold text-gray-400",
  sectionDescription: "text-3xl text-gray-800 font-bold",
  sectionButton:
    "w-fit md:ml-auto mb-4 md:mb-8 text-lg pl-4 pr-2 py-2 bg-gray-800 text-neutral-50 text-sm md:text-base rounded-lg transition-colors duration-300 hover:bg-gray-600 flex items-center",
  sectionButtonIcon: "w-5 h-5 ml-1",
};

const Home = () => {
  const { data: statsData = {}, isFetching } = useGetAllCryptosQuery();
  const globalStats = statsData?.data?.stats;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-8 mb-16">
        <div className="sm:text-center">
          <h2 className={classes.sectionSubTitle}>Total Cryptocurrencies</h2>
          {isFetching ? (
            <Loader />
          ) : (
            <span className={classes.sectionDescription}>
              {globalStats?.totalCoins.toLocaleString()}
            </span>
          )}
        </div>
        <div className="sm:text-center">
          <h2 className={classes.sectionSubTitle}>Total Markets</h2>
          {isFetching ? (
            <Loader />
          ) : (
            <span className={classes.sectionDescription}>
              {globalStats?.totalMarkets.toLocaleString()}
            </span>
          )}
        </div>
        <div className="sm:text-center">
          <h2 className={classes.sectionSubTitle}>Total Exchanges</h2>
          {isFetching ? (
            <Loader />
          ) : (
            <span className="text-3xl text-gray-800 font-bold">
              {globalStats?.totalExchanges.toLocaleString()}
            </span>
          )}
        </div>
        <div className="sm:text-center">
          <h2 className={classes.sectionSubTitle}>Total Market Cap</h2>
          {isFetching ? (
            <Loader />
          ) : (
            <span className={classes.sectionDescription}>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
                maximumFractionDigits: 4,
              }).format(globalStats?.totalMarketCap)}
            </span>
          )}
        </div>
        <div className="sm:text-center">
          <h2 className={classes.sectionSubTitle}>Total 24h Volume</h2>
          {isFetching ? (
            <Loader />
          ) : (
            <span className={classes.sectionDescription}>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
                maximumFractionDigits: 4,
              }).format(globalStats.total24hVolume)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center">
        <h1 className={classes.sectionTitle}>Top 10 Cryptocurrencies</h1>
        <Link className={classes.sectionButton} to="/currencies">
          Show more <ChevronRightIcon className={classes.sectionButtonIcon} />
        </Link>
      </div>
      <Currencies simplified />

      <div className="flex flex-col md:flex-row md:items-center">
        <h1 className={classes.sectionTitle}>Latest News</h1>
        <Link className={classes.sectionButton} to="/news">
          Show more <ChevronRightIcon className={classes.sectionButtonIcon} />
        </Link>
      </div>
      <News simplified />
    </>
  );
};

export default Home;
