import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const cryptoApiHeaders = {
    'x-rapidapi-host': process.env.REACT_APP_CRYPTO_RAPIDAPI_HOST,
    'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY
}

const baseUrl = process.env.REACT_APP_CRYPTO_API_URL

const createRequest = (url, params = {}) => ({ url, params, headers: cryptoApiHeaders })

export const cryptoApi = createApi({
    reducerPath: 'cryptoApi',

    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getAllCryptos: builder.query({
            query: (count=10) => createRequest('/coins', {limit: count})
        }),
        getCrypto: builder.query({
            query: (id) => createRequest(`/coin/${id}`)
        }),
        getCryptoHistory: builder.query({
            query: ({ id, timePeriod }) => createRequest(`/coin/${id}/history`, { timePeriod }),
            refetchOnMountOrArgChange: true,
        })
    })
})

export const {
    useGetAllCryptosQuery,
    useGetCryptoQuery,
    useGetCryptoHistoryQuery
} = cryptoApi; 