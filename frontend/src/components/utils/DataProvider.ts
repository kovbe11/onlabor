import axios from 'axios'
import useSWR, { cache } from 'swr'

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

interface Paging {
  size: number
  page: number
}

interface Sorting<T> {
  sortParam: keyof T
  order: 'asc' | 'desc'
}

async function fetcher(url: string) {
  return api.get(url).then((res) => {
    console.log('fetched!')
    return res.data
  })
}

export function useItems(key: string) {
  const revalidationOptions = {
    revalidateOnMount: !cache.has(key), //here we refer to the SWR cache
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  }

  const { data, error, mutate } = useSWR(key, fetcher, revalidationOptions)

  return {
    items: data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  }
}

interface ParentFilter {
  paramName: 'date' | 'beforeDate' | 'afterDate' | ''
  paramValue: Date
}

interface QueryStringParameters<T> {
  paging: Paging
  sorting?: Sorting<T>
  filtering?: ParentFilter
}

export function createParentQueryString<T>(params: QueryStringParameters<T>) {
  const { paging, sorting, filtering } = params
  const sorterString =
    sorting && sorting.sortParam && sorting.order
      ? `&sortParam=${sorting.sortParam}&sortOrder=${sorting.order}`
      : ''
  const filterString =
    filtering && filtering.paramName && filtering.paramValue
      ? `&${filtering.paramName}=${filtering.paramValue}`
      : ''
  return `?page=${paging.page}&pageSize=${paging.size}${sorterString}${filterString}`
}

//TODO: ez egy hook, nem 2 semmi értelme ennek

export function useOrders(queryString: string) {
  const { data, error, mutate } = useSWR('/orders' + queryString, fetcher)

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  }
}

export function useSales(queryString: string) {
  const { data, error, mutate } = useSWR('/sales' + queryString, fetcher)

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  }
}
