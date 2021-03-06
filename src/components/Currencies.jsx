import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { SearchIcon } from "@heroicons/react/solid";

import { useGetAllCryptosQuery } from "../services/cryptoApi";
import { Loader } from "./";

const Currencies = ({ simplified }) => {
  const count = simplified ? 10 : 100;
  const { data: cryptosList, isFetching } = useGetAllCryptosQuery(count);
  const [cryptos, setCryptos] = useState(cryptosList?.data.coins);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filteredData = cryptosList?.data?.coins?.filter((coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setCryptos(filteredData);
  }, [cryptosList, searchTerm]);

  return (
    <>
      {!simplified && (
        <>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-8 text-gray-800">
            Global Top 100 Cryptocurrencies
          </h1>
          <div className="relative w-full lg:max-w-sm mb-8 md:mb-12 flex items-center">
            <input
              type="text"
              className="w-full px-6 pl-10 py-4 outline-none rounded-md border-transparent transition duration300 hover:shadow-md hover:border-gray-400 focus:shadow-lg focus:ring-0 focus:border-gray-800"
              placeholder="Search for a Cryptocurrency"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3">
              <SearchIcon className="w-5 h-5" />
            </span>
          </div>
        </>
      )}
      {isFetching ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 mb-16">
          {cryptos?.map((currency, i) => (
            <div
              key={i}
              className="bg-white rounded-md transition duration-300 hover:shadow-lg hover:-translate-y-2"
            >
              <Link
                to={`/currencies/${currency.symbol}`}
                state={{ uuid: currency.uuid }}
              >
                <div className="flex flex-row items-center p-4 border-b-2 border-slate-200">
                  <div>
                    <span className="text-xl font-semibold">
                      {currency.rank}. {currency.name}
                    </span>
                  </div>
                  <div className="ml-auto">
                    <img
                      className="h-10"
                      src={currency.iconUrl}
                      alt={currency.symbol}
                    />
                  </div>
                </div>
                <div className="mx-4 my-6">
                  <p className="my-2">
                    <span className="font-medium">Price: </span>
                    <span>
                      {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: currency.price < 100 ? 5 : 2,
                          }).format(currency.price)}
                    </span>
                  </p>
                  <p className="my-2 hover:cursor-pointer">
                    <span className="font-medium">Market Cap: </span>
                    <span>
                      {new Intl.NumberFormat(
                        "en-US", {
                          style: "currency",
                          currency: "USD",
                          notation: "compact",
                          maximumFractionDigits: 3,
                        }).format(currency.marketCap)}
                    </span>
                  </p>
                  <p className="my-2">
                    <span className="font-medium">Daily Change: </span>
                    <span
                      className={`font-semibold ${
                        currency.change > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {new Intl.NumberFormat("en-US", {style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(currency.change/100)}
                    </span>
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Currencies;
