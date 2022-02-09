import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const newsApiHeaders = {
    'x-bingapis-sdk': 'true',
    'x-rapidapi-host': process.env.REACT_APP_NEWS_RAPIDAPI_HOST,
    'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY
}

const baseUrl = process.env.REACT_APP_NEWS_API_URL

const createRequest = (url) => ({ url, headers: newsApiHeaders })

export const newsApi = createApi({
    reducerPath: 'newsApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getNews: builder.query({
            query: ({ newsCategory, count }) => createRequest(`/news/search?q=${newsCategory}&count=${count}&safeSearch=Off&textFormat=Raw&freshness=Day&originalImg=true&sortBy=Date`)
        })
    })
})

export const {
    useGetNewsQuery
} = newsApi; 