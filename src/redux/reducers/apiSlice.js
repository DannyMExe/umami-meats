import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: 
    "https://umami-meats.vercel.app",
      // baseUrl: process.env.BASE_URL || "http://localhost:3000",
  }),
  tagTypes: [
    "users",
    "user",
    "sushis",
    "sushi",
    "steaks",
    "steak",
    "orders",
    "order",
    "products",
    "product",
    "tags",
    "lineItems",
  ],
  endpoints: (builder) => ({
    // users
    getUsers: builder.query({
      query: () => "/api/users",
      providesTags: ["users"],
    }),
    getSingleUser: builder.query({
      query: (id) => `/api/users/${id}`,
      providesTags: ["user"],
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: "/api/users",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    updateUser: builder.mutation({
      query: (payload) => {
        return {
          url: `/api/users/${payload.id}`,
          method: "PUT",
          body: payload.data,
        };
      },
      invalidatesTags: ["user"],
    }),

    // products
    getProducts: builder.query({
      query: () => "/api/products",
      providesTags: ["products"],
    }),
    createProduct: builder.mutation({
      query: (payload) => ({
        url: "/api/products",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["products", "steaks", "sushis"],
    }),

    // orders query
    getOrders: builder.query({
      query: () => `/api/orders`,
      providesTags: ["orders"],
    }),
    getSingleOrder: builder.query({
      query: (id) => `/api/orders/${id}`,
      providesTags: ["order"],
    }),
    updateOrder: builder.mutation({
      query: (payload) => ({
        url: `/api/orders/${payload.id}`,
        method: "PUT",
        body: payload.data,
      }),
      invalidatesTags: ["sushi"],
    }),
    createOrder: builder.mutation({
      query: (payload) => ({
        url: "/api/orders",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["orders"],
    }),

    // sushi query
    getSushi: builder.query({
      query: () => "/api/sushi",
      providesTags: ["sushis"],
    }),
    getSingleSushi: builder.query({
      query: (id) => `/api/sushi/${id}`,
      providesTags: ["sushi"],
    }),
    updateSushi: builder.mutation({
      query: (payload) => ({
        url: `/api/sushi/${payload.id}`,
        method: "PUT",
        body: payload.data,
      }),
      invalidatesTags: ["sushi"],
    }),
    deleteSushi: builder.mutation({
      query: (id) => ({
        url: `/api/sushi/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["sushis"],
    }),

    //  steaks query
    getSteaks: builder.query({
      query: () => "/api/steaks",
      providesTags: ["steaks"],
    }),
    getSingleSteak: builder.query({
      query: (id) => `/api/steaks/${id}`,
      providesTags: ["steak"],
    }),
    updateSteak: builder.mutation({
      query: (payload) => ({
        url: `/api/steaks/${payload.id}`,
        method: "PUT",
        body: payload.data,
      }),
      invalidatesTags: ["steak"],
    }),
    deleteSteak: builder.mutation({
      query: (id) => ({
        url: `/api/steaks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["steaks"],
    }),
    getTags: builder.query({
      query: () => "/api/tags",
      providesTags: ["tags"],
    }),
    //lINE ITEMS
    getLineItems: builder.query({
      query: () => "/lineitems",
      providesTags: ["lineItems"],
    }),
    createLineItem: builder.mutation({
      query: (payload) => ({
        url: "/api/lineitems",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["lineItems"],
    }),
    updateLineItem: builder.mutation({
      query: (payload) => ({
        url: `/api/lineItems/${payload.data.id}`,
        method: "PUT",
        body: payload.data,
      }),
      invalidatesTags: ["lineItems"],
    }),
    deleteLineItem: builder.mutation({
      query: (payload) => ({
        url: `/api/lineItems/${payload}`,
        method: "DELETE",
      }),
      invalidatesTags: ["lineItems"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetSingleUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetOrdersQuery,
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
  useCreateOrderMutation,
  useGetSteaksQuery,
  useGetSingleSteakQuery,
  useUpdateSteakMutation,
  useDeleteSteakMutation,
  useGetSushiQuery,
  useGetSingleSushiQuery,
  useUpdateSushiMutation,
  useDeleteSushiMutation,
  useGetTagsQuery,
  useGetLineItemsQuery,
  useCreateLineItemMutation,
  useUpdateLineItemMutation,
  useDeleteLineItemMutation,
} = apiSlice;
