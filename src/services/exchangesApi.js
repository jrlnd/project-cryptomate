import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const exchangesApiHeaders = {
    'x-rapidapi-host': process.env.REACT_APP_EXCHANGES_RAPIDAPI_HOST,
    'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY
}

const baseUrl = process.env.REACT_APP_EXCHANGES_API_URL

const createRequest = (url) => ({ url, headers: exchangesApiHeaders })

export const exchangesApi = createApi({
    reducerPath: 'exchangesApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getExchanges: builder.query({
            query: () => createRequest('/exchanges')
        })
    })
})

export const {
    useGetExchangesQuery
} = exchangesApi; 