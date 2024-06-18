# server/api

* trpc/[trpc] - 由 ***trpc*** 解析，请求使用 `/api/trpc/{a}.{b}` 这样的路由
* [...trpc] - 由 ***trpc-openapi*** 解析，请求使用 `/api/{a}/{b}` 这样的路由
  * 在定义接口时，需要同时定义 input 和 output 的校验，并且使用 ***zod*** ，假如输入为空需要使用 `z.void()`
* openapi.json - 由 ***trpc-openapi*** 解析，用于输出接口的 OpenAPI
