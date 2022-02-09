import { useState } from "react";
import parse, { attributesToProps, domToReact } from "html-react-parser";
import { useLocation } from "react-router-dom";
import millify from "millify";

import {
  CurrencyDollarIcon,
  HashtagIcon,
  LightningBoltIcon,
  TrendingUpIcon,
  StarIcon,
  ChartBarIcon,
  SwitchHorizontalIcon,
  InformationCircleIcon,
  InboxIcon,
  InboxInIcon,
} from "@heroicons/react/solid";
import { CheckIcon, XIcon } from "@heroicons/react/outline";

import {
  useGetCryptoHistoryQuery,
  useGetCryptoQuery,
} from "../services/cryptoApi";
import { Loader, Chart } from "./";

const Details = () => {
  const { uuid } = useLocation().state;
  const { data: cryptoData = {}, isFetching: isCryptoDataFetching } =
    useGetCryptoQuery(uuid);

  const times = [
    { name: "3 hours", value: "3h" },
    { name: "24 hours", value: "24h" },
    { name: "7 days", value: "7d" },
    { name: "30 days", value: "30d" },
    { name: "1 year", value: "1y" },
    { name: "3 years", value: "3y" },
    { name: "5 years", value: "5y" },
  ];
  const [timePeriod, setTimePeriod] = useState(times[2].value);
  const { data: cryptoHistory = {}, isFetching: isCryptoHistoryFetching } =
    useGetCryptoHistoryQuery({ id: uuid, timePeriod });

  const details = cryptoData?.data?.coin;
  const history = cryptoHistory?.data?.history;

  const titleIconClass = "w-6 h-6 xl:w-8 xl:h-8 mr-2 xl:mr-4";
  const valueIconClass = "w-6 h-6 xl:w-8 xl:h-8";

  const stats = [
    {
      title: "Price to USD",
      value: `$${details?.price && millify(details?.price, { precision: 5 })}`,
      icon: (
        <CurrencyDollarIcon
          className={titleIconClass}
          style={{ color: details?.color }}
        />
      ),
    },
    {
      title: "Rank",
      value: details?.rank,
      icon: (
        <HashtagIcon
          className={titleIconClass}
          style={{ color: details?.color }}
        />
      ),
    },
    {
      title: "24h Volume",
      value: `$${details && millify(details["24hVolume"], { precision: 3 })}`,
      icon: (
        <LightningBoltIcon
          className={titleIconClass}
          style={{ color: details?.color }}
        />
      ),
    },
    {
      title: "Market Cap",
      value: `$${
        details?.marketCap && millify(details?.marketCap, { precision: 3 })
      }`,
      icon: (
        <TrendingUpIcon
          className={titleIconClass}
          style={{ color: details?.color }}
        />
      ),
    },
    {
      title: "All-time high",
      value: `$${
        details?.allTimeHigh?.price &&
        millify(details?.allTimeHigh?.price, { precision: 5 })
      }`,
      icon: (
        <StarIcon
          className={titleIconClass}
          style={{ color: details?.color }}
        />
      ),
    },
  ];

  const globalStats = [
    {
      title: "Number Of Markets",
      value: details?.numberOfMarkets,
      icon: (
        <ChartBarIcon
          className={titleIconClass}
          style={{ color: details?.color }}
        />
      ),
    },
    {
      title: "Number Of Exchanges",
      value: details?.numberOfExchanges,
      icon: (
        <SwitchHorizontalIcon
          className={titleIconClass}
          style={{ color: details?.color }}
        />
      ),
    },
    {
      title: "Approved Supply",
      value: details?.supply?.confirmed ? (
        <CheckIcon className={valueIconClass} />
      ) : (
        <XIcon className={valueIconClass} />
      ),
      icon: (
        <InformationCircleIcon
          className={titleIconClass}
          style={{ color: details?.color }}
        />
      ),
    },
    {
      title: "Total Supply",
      value: `$ ${
        details?.supply?.total &&
        millify(details?.supply?.total, { precision: 3 })
      }`,
      icon: (
        <InboxIcon
          className={titleIconClass}
          style={{ color: details?.color }}
        />
      ),
    },
    {
      title: "Circulating Supply",
      value: `$ ${
        details?.supply?.circulating &&
        millify(details?.supply?.circulating, { precision: 3 })
      }`,
      icon: (
        <InboxInIcon
          className={titleIconClass}
          style={{ color: details?.color }}
        />
      ),
    },
  ];

  const parseOptions = {
    replace: ({ attribs, name, children }) => {
      if (attribs && name === "p")
        attribs.class =
          "text-gray-700 text-sm md:text-base mb-2 xl:mb-4 transition duration-300";
      if (attribs && (name === "h3" || name === "strong"))
        attribs.class =
          "text-base md:text-2xl text-gray-700 font-bold my-4 xl:mt-8 xl:mb-4 transition duration-300";
      if (attribs && name === "a") {
        const props = attributesToProps(attribs);
        return (
          <a
            {...props}
            className="font-medium hover:underline"
            style={{ color: details?.color }}
          >
            {domToReact(children, parseOptions)}
          </a>
        );
      }
    },
  };

  if (isCryptoDataFetching) return <Loader />;

  return (
    <>
      <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 flex items-center justify-center">
        <span className="mr-4">
          <img
            className="h-10 w-10"
            src={details?.iconUrl}
            alt={details?.name}
          />
        </span>
        <span className="text-gray-800" style={{ color: details?.color }}>
          {details?.name} ({details?.symbol}) Details
        </span>
      </h1>
      <h2 className="text-xl text-center font-medium text-gray-800 mb-12">
        {details?.name} live price in $USD. View value statistics, market cap
        and supply.
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-12">
        <div className="flex flex-col bg-neutral-100 p-6 rounded-lg">
          <h3 className="text-xl xl:text-3xl text-gray-700 text-center font-bold mb-2 xl:mb-4">
            {details?.name} Value Statistics
          </h3>
          <div className="divide-y divide-gray-300 text-gray-700">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex items-center p-4 text-md xl:text-2xl transition-color duration-300 hover:bg-neutral-200"
              >
                <div className="flex items-center">
                  <span>{stat.icon}</span>
                  <span>{stat.title}</span>
                </div>
                <span className="ml-auto font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-neutral-100 p-6 rounded-lg">
          <h3 className="text-xl xl:text-3xl text-gray-700 text-center font-bold mb-2 xl:mb-4">
            {details?.name} Market Statistics
          </h3>
          <div className="divide-y divide-gray-300 text-gray-700">
            {globalStats.map((stat, i) => (
              <div
                key={i}
                className="flex items-center p-4 text-md xl:text-2xl transition-color duration-300 hover:bg-neutral-200"
              >
                <div className="flex items-center">
                  <span>{stat.icon}</span>
                  <span>{stat.title}</span>
                </div>
                <span className="ml-auto font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row items-center mb-4">
        <h3 className="text-2xl lg:text-4xl text-gray-700 font-bold mb-2 xl:mb-4">
          {details?.name} Price Chart
        </h3>
        <div className="lg:ml-auto flex items-center">
          <span className="text-md lg:text-lg font-bold">Get data from:</span>
          <select
            className="w-36 ml-2 px-2 py-1 lg:px-3 lg:py-2 outline-none rounded-md bg-neutral-50 border-transparent transition duration300 hover:shadow-md hover:border-gray-400 focus:shadow-lg focus:ring-0 focus:border-gray-800"
            placeholder="Select a Time Period"
            defaultValue={2}
            onChange={(e) => setTimePeriod(times[e.target.value].value)}
          >
            {times.map((time, i) => (
              <option value={i} key={i}>
                {time.name} ago
              </option>
            ))}
          </select>
        </div>
      </div>

      {isCryptoHistoryFetching ? (
        <Loader />
      ) : (
        <Chart
          coinHistory={history}
          period={timePeriod}
          color={details?.color}
        />
      )}

      <div className="flex flex-col lg:flex-row mb-8 items-start">
        <div className="grow lg:basis-3/4">
          <h3 className="text-lg md:text-2xl text-gray-700 font-bold mb-2 xl:mb-4">
            What is {details?.name}?
          </h3>
          {parse(details?.description || "", parseOptions)}
        </div>
        <div className="w-full lg:basis-1/4 bg-neutral-100 mt-8 lg:mt-0 lg:ml-16 p-6 rounded-lg">
          <h3 className="text-xl xl:text-3xl text-gray-700 font-bold mb-2 xl:mb-4">
            {details?.name} Links
          </h3>
          <div className="divide-y divide-gray-300 text-gray-700 ">
            {details?.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className="p-4 transition-color duration-300 hover:bg-neutral-200 block"
              >
                <div className="flex items-center font-bold text-base xl:text-lg">
                  <span className="mr-4 ">{link.type}</span>
                  <span
                    className={`ml-auto font-semibold details?.color`}
                    style={{ color: details?.color }}
                  >
                    {link.name}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
