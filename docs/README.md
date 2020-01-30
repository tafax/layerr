
# What is Layerr?

Layerr is a set of useful libraries built as a framework agnostic toolset. 
It is designed to be as simple as possible and to be extended as needed. 
It allows to create these **layers** in your application:

* **@layerr/bus**: use it to decouple your application parts and improving the robustness of your design. Make your application business logic independent from the presentation layer.
* **TBD - @layerr/client**: create powerful HTTP clients services based on a message-handler approach. It allows to design easy-to-extend service forgetting the single-service-with-many-methods approach.
* **TBD - @layerr/parser**: parse JSON into models. It is integrated with @layerr/client to provide the ability to create models from JSON responses.
* **TBD - @layerr/logger**: a well-defined logger to log in console and/or to remote services. Add as many channels as you want to provide different behaviors to register your logs.
* **TBD - @layerr/error**: design a lifesaver error handling system integrated with the rest of the libraries.
