import millify from "millify";

import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";

import { useGetExchanges3Query } from "../services/exchanges3Api";

import { Loader } from "./";

const Exchanges2 = () => {
  
const { data: data1 = {}, error, isFetching: isExchange1Fetching } = useGetExchanges3Query();
console.log(data1, error);

  return (
    <>
        Hello
    </>
  );
};

export default Exchanges2;
