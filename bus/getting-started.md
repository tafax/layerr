# Getting Started

## What is @layerr/bus?

**@layerr/bus** is a library to create a message bus layer in your application. It is completely configurable using middleware. Just imagine your next message 🚌

{% hint style="info" %}
It uses [RxJS](https://github.com/ReactiveX/RxJS) as internal engine. If you are not comfortable with it, don't worry, you can use promise-like async code too.
{% endhint %}

## Why should I use @layerr/bus?

Using **@layerr/bus** you can create a _command bus_, a _query bus_ or a _generic message bus_. Use it if:

* you're using the **CQRS** pattern. Read the Martin Flower's [blog article](https://www.martinfowler.com/bliki/CQRS.html).
* you simply want to introduce a separation layer between business login and presentation in your application.
* you need a powerful design to extend a set of classes that represents an action.



