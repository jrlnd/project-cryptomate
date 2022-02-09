import { configureStore } from "@reduxjs/toolkit";

import { cryptoApi } from "../services/cryptoApi";
import { newsApi } from "../services/newsApi";
import { exchangesApi } from "../services/exchangesApi";

const store = configureStore({
  reducer: {
    [cryptoApi.reducerPath]: cryptoApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [exchangesApi.reducerPath]: exchangesApi.reducer,
  }
});

export default store;