import { Fragment, useState } from "react";
import { formatDistanceToNow } from "date-fns";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import { useGetNewsQuery } from "../services/newsApi";
import { useGetAllCryptosQuery } from "../services/cryptoApi";
import { Loader } from "./";

const News = ({ simplified }) => {
  const count = simplified ? 8 : 24;
  const [newsCategory, setNewsCategory] = useState("All Cryptocurrencies");
  const { data: newsData, isFetching: isNewsFetching } = useGetNewsQuery({
    newsCategory:
      newsCategory === "All Cryptocurrencies" ? "Cryptocurrency" : newsCategory,
    count,
  });
  const { data: cryptoData, isFetching: isCryptoFetching } =
    useGetAllCryptosQuery(100);
  const cryptos = cryptoData?.data.coins;
  const news = newsData?.value;

  return (
    <>
      {!simplified && (
        <h1 className="text-4xl font-bold my-8 text-gray-800">
          Latest Cryptocurrency News
        </h1>
      )}
      {isNewsFetching && isCryptoFetching && <Loader />}
      {!simplified && (
        <div className="w-full mb-8 flex items-center">
          <span className="text-sm md:text-base font-bold">Get news for:</span>
          <Listbox value={newsCategory} onChange={setNewsCategory}>
            <div className="relative w-1/2 lg:max-w-sm ml-2 lg:ml-4 mt-1">
              <Listbox.Button className="relative w-full p-4 text-left bg-neutral-50 outline-none rounded-md cursor-pointer transition duration300 hover:shadow-md focus:shadow-lg focus:ring-0 text-sm sm:text-base">
                <span className="block truncate">{newsCategory}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <SelectorIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-sm bg-neutral-50 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-base z-10">
                  <Listbox.Option
                    className={({ active }) =>
                      `${
                        active ? "bg-slate-200" : "text-gray-800"
                      } cursor-default select-none relative py-2 pl-10 pr-4`
                    }
                    value="All Cryptocurrencies"
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`${
                            selected ? "font-medium" : "font-normal"
                          } block truncate`}
                        >
                          All Cryptocurrencies
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                  {cryptos?.map((crypto, i) => (
                    <Listbox.Option
                      key={i}
                      className={({ active }) =>
                        `${
                          active ? "bg-slate-200" : "text-gray-900"
                        } cursor-default select-none relative py-2 pl-10 pr-4`
                      }
                      value={crypto.name}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`${
                              selected ? "font-medium" : "font-normal"
                            } block truncate`}
                          >
                            {" "}
                            {crypto.name}{" "}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <CheckIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
        {news?.map((article, i) => (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            key={i}
            className="rounded-md bg-white overflow-hidden flex flex-col justify-between transition duration-300 hover:shadow-lg hover:-translate-y-2"
          >
            <div
              className="bg-center bg-cover"
              style={{ backgroundImage: `url(${article.image?.contentUrl})` }}
            >
              <div className="backdrop-blur-sm bg-gradient-to-b from-white/75 to-white p-4 flex items-center">
                <span className="text-2xl font-semibold mr-4">
                  {article.name}
                </span>
                {article.image && (
                  <img
                    className="w-20 h-20 rounded-full float-right ml-auto"
                    src={article.image?.thumbnail.contentUrl}
                    alt={article.name}
                  />
                )}
              </div>
            </div>
            <div className="md-4 p-4">
              <p>{article.description}</p>
            </div>
            <div className="p-4 flex flex-end items-center text-sm">
              <span
                className={`${
                  article.provider[0].image && "flex items-center "
                } italic mr-4`}
              >
                {article.provider[0].image ? (
                  <img
                    className="w-5 h-5 mr-2"
                    src={article.provider[0].image?.thumbnail.contentUrl}
                    alt={article.provider[0].name}
                  />
                ) : (
                  <span>Source: </span>
                )}
                <span>{decodeURIComponent(article.provider[0].name)}</span>
              </span>
              <span className="ml-auto">
                {formatDistanceToNow(new Date(article.datePublished), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </a>
        ))}
      </div>
    </>
  );
};

export default News;
