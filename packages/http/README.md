
# RemoteCall

Each `RemoteCall` is a description object that encapsulates the needed properties
to create an HTTP request. It provides:

* The path to call with the request.
* The HTTP method to use.
* A flag to tell if the credentials have to be sent with CORS.
* The response content that it expects.

Moreover, it provides three methods to configure and return:

* The body of the request. If any.
* The headers of the request. If any.
* The query parameters. If any.

## Use

`RemoteCall`s are used by the client service to creates and dispatch HTTP requests
with the formats and values specified in the object itself. Also, each `RemoteCall`
needs to be related to a specific handler that should parse and return
the expected model or models set contained in the response.

# RemoteCall Handler

A `RemoteCall` handler is an object that, given a request and a response, returns a specific model or
models set as result. It is created specifically for each `RemoteCallInterface` object.
