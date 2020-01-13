
# BusLayerr :bus:

**BusLayerr** is a library to create a message bus layer in your application. It is
completely configurable using middlewares. Just imagine your next message :bus:

It uses [RxJS](https://github.com/ReactiveX/RxJS) as internal engine. If you are not
comfortable with it, don't worry, you can use promise-like async code.

## Installation

Use [npm](https://www.npmjs.com/) package manager to install it.

```bash
npm install @layerr/bus
```

Use [yarn](https://yarnpkg.com/) package manager to install it.
```bash
yarn add @layerr/bus
```

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

## Advanced usage

**BusLayerr** can be used to create a more sophisticate message bus.

### MessageBus

To create a message bus we can use `MessageBus` class.
For this example, we're going to create a message bus to handle messages as commands:
```typescript
const commandBus = new MessageBus([
  new MessageHandlerMiddleware(messageMapper)
]);
```
This represents a command bus, it is just a convenient way to call a message bus
that executes a specific handler that changes the app state when a message is sent to the bus itself.
`MessageBus` accepts an array of middlewares conform to `MessageBusMiddlewareInterface`. We used `MessageHandlerMiddleware` that allows to execute one or more handlers when a specific
message is sent over the bus.
Since we are creating a command bus, a `message` is a **command** that specifies an action
to execute.

### Message/Command

We can use a `string`, a `class`, an `object` etc... as message. Whatever you want is fine.
Let's say we want to create a command to sign in a user that fills a form in a client. We will create a `login-command.ts` with the following code:
```typescript
export class LoginCommand {
  
  constructor(public username: string, public password: string) {}
  
}
```
This represents the action to sign in user. Username and password are
the required information you need to now to sign in the user. In this case, using a
class as command is very helpful to associate username and password to
the command we want to execute.

### Handler

The handler can be a `class` or a `function`. It physically executes the command.
We will create `login.command-handler.ts` with the following code:
```typescript
export class LoginCommandHandler {
  
  handle(command: LoginCommand) {
    
    // Perform the request to the API to authenticate the user
    
    // Change the state of the app if the authentication goes successful
    // ...this depends on your application...
    
  }
}
```
This wraps the code to sign in the user when the login command is requested. By design,
the command handler doesn't return anything. It should just change the application state and
this depends on how the state is handled.

### Collection

A collection is a class of `CollectionHandlerLookup`. It allows to pair a message with
a handler.
```typescript
const collection = new CollectionHandlerLookup([ 
  { message: LoginCommand, handler: LoginCommandHandler } 
]);
```
The collection accepts an array of pair objects where we specify the message
and the handler to use. **A message can be associated to a single handler and a handle can be used with a single message.**

### Extractor

The extractor is used to represent a message in a different way. The collection will use the new representation to figure out the handler corresponding to the message. Since we used the class (`LoginCommand`) to represent a message in the collection, we're going to use the `FunctionConstructorMessageTypeExtractor` that will extract the class from an incoming message.
```typescript
const extractor = new FunctionConstructorMessageTypeExtractor();
```

### Resolver

The resolver creates the handler when the bus get an incoming message and the collection returns the handler class. It just needs to be compliant to the `ClassResolverInterface`.

For example, if you use a dependency manager you can use it directly or by creating an adapter.
```typescript
export class MyAdapterResolver implements ClassResolverInterface {

    constructor(private dependencyManager: MyFrameworkDependencyManager) {}

    resolve<T>(classType: ClassType<T>): T {
        // Creates a handler using the class type.
        return this.dependencyManager.create(classType);
    }
}
```
If you don't you can create a custom resolver to instantiate the handler or to provide an instance:
```typescript
export class MyCustomResolver implements ClassResolverInterface {
    resolve<T>(classType: ClassType<T>): T {
        // Creates a new handler each time an incoming message is handled.
        return new classType();
    }
}
```
Since the resolver depends on your framework the handler class can contain any type of dependency as a normal service/class in your application. So, with the login example, we can refine the handler by adding some depdencies:
```typescript
export class LoginCommandHandler {
  
  constructor(private apiClient: MyApiClientService) {}
  
  handle(command: LoginCommand) {
    
    // Perform the request to the API to authenticate the user
    
    // Change the state of the app if the authentication goes successful
    // ...this depends on your application...
    
  }
}
```
In this case, the resolver should be able to inject the `MyApiClientService`.

### MessageMapper

Finally, the message mapper can be created by combining the previous components. It is used by the handler middleware to resolve and get the specific handler for a message (i.e. command).
```typescript
const messageMapper = new MessageMapper(
  collection,
  extractor,
  resolver
);
```

### Using a message/command

Now, we have a command bus to use.
```typescript
const login = new LoginCommand('username', 'password');
commandBus.handle(login);

// LoginHandler.handle is invoked under the hood
```

By design, the command handler shouldn't return anything. It is void method.
Anyway, in most cases, we have interested to understand if the command was
executed correctly or not since we want to adapt our application
to successful or failure.

#### Observers

To do that, just subscribe to the handle:
```typescript
commandBus.handle(login)
    .subscribe(
        () => {}, // Next
        (error: Error) => {}, // Error
        () => {} // Complete
    );
```
**The bus handles the message by calling the handler even if you don't subscribe to the obeserver returned by handle method.**

#### Promises

If you want to use **promises** instead of **observers** just call the **toPromise** method:
```typescript
commandBus.handle(login)
    .toPromise()
    .then(() => {})
    .catch((error: Error) => {});
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
