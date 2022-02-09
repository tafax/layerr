
# BUS

**BusLayerr** is a library to create an in-memory message bus layer in your application. It is
completely configurable using middlewares. Just imagine your next message :bus:

It uses [RxJS](https://github.com/ReactiveX/RxJS) as internal engine. If you are not
comfortable with it, don't worry, you can use promise-like async code.

## Installation

Use [npm](https://www.npmjs.com/) package manager to install it.

```bash
npm install @layerr/core @layerr/bus rxjs reflect-metadata
```

Use [yarn](https://yarnpkg.com/) package manager to install it.
```bash
yarn add @layerr/core @layerr/bus rxjs reflect-metadata
```

## Documentation

[Documentation](https://tafax.gitbook.io/layerr/bus/getting-started)

## Quick usage

**BusLayerr** allows to create a generic bus to send any type of message
and handling them with functions.

```typescript
const mapping = [
  { 
    message: 'message1', 
    handler: (message: string) => {
      // message === 'message1'
    } 
  },
  { 
    message: 'message2', 
    handler: (message: string) => {
      // message === 'message2'
    } 
  },
];

const messageBus = GeneralPurposeBusFactory.Create(mapping);
```

Handle a message by calling the method to send over the bus:
```typescript
messageBus.handle('message1');

// It will call the handler for message1.

...

messageBus.handle('message2');

// It will call the handler for message2.
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
