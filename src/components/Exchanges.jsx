import millify from "millify";

import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";

import { useGetExchangesQuery } from "../services/exchangesApi";

import { Loader } from "./";

const Exchanges = () => {
  const { data: exchanges = [], isFetching: isExchangeFetching } = useGetExchangesQuery();
  let exchangeData = exchanges?.filter((e) => e.adjusted_rank && e.reported_rank)
  exchangeData.sort((a,b) => a.adjusted_rank - b.adjusted_rank);
  exchangeData = exchangeData.slice(0, 100);
  return (
    <>
      <h1 className="text-4xl text-gray-800 font-bold my-8">
        Top Cryptocurrency Spot Exchanges
      </h1>
      {isExchangeFetching ? (
        <Loader />
      ) : (
        <div className="w-full mx-auto bg-white rounded-md overflow-hidden mb-12">
          <div className="w-full flex items-center py-4 font-medium text-left ">
            <span className="flex-none w-16 text-center mr-2 hidden lg:block ">
              Rank
            </span>
            <span className="flex-1 ml-4 lg:ml-0">Exchange</span>
            <span className="flex-1">Volume (24h)</span>
            <span className="flex-1"># Markets</span>
            <span className="flex-1"># Coins</span>
            <span className="flex-none w-5 mr-4"></span>
          </div>
          {exchangeData?.map(({ id, name, description, links, adjusted_rank, currencies, markets, quotes }) => (
            <Disclosure as="div" key={id} className="mb-1">
              {({ open }) => (
                <>
                  <Disclosure.Button className="w-full flex py-4 text-left text-gray-800 bg-slate-100 transition-colors duration-300 hover:bg-slate-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    <span className="flex-none w-16 text-center mr-2 hidden lg:block ">
                      {adjusted_rank}
                    </span>
                    <span className="flex-1 flex items-center font-medium ml-4 lg:ml-0">

                      {name}
                    </span>
                    <span className="flex-1">
                      $
                      {millify(quotes.USD.adjusted_volume_24h, {
                        precision: 5,
                        space: true,
                      })}
                    </span>
                    <span className="flex-1">{markets}</span>
                    <span className="flex-1">{currencies}</span>
                    <span className="flex-none w-5 flex justify-end mr-4">
                      <ChevronUpIcon className={`${ open ? "transform rotate-180" : "" } w-5 h-5 text-gray-800 transition-transform`} />
                    </span>
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-500 ease-in-out"
                    enterFrom="-translate-y-5 opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition duration-500 ease-in-out"
                    leaveFrom="translate-y-0 opacity-100"
                    leaveTo="-translate-y-5 opacity-0"
                  >
                    <Disclosure.Panel className="p-4 pt-6 text-sm text-gray-600">
                      <div className="mb-4">
                        <a href={links.website[0]} target="_blank" rel="noreferrer noopener" className="bg-gray-700 text-white px-3 py-2 mb-2 rounded-md transition-colors duration-300 hover:bg-gray-500">Visit website</a>
                      </div>
                      <h1 className="text-lg md:text-xl font-bold mb-4">Description</h1>
                      <span className="text-sm md:text-base">{description ? description : "Sorry, no description is available." }</span>
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      )}
    </>
  );
};

export default Exchanges;
