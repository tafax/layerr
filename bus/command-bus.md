---
description: How to set up a command bus using Layerr as core library
---

# Command Bus

The classes and interfaces from this package can be used to set up a command bus. The characteristics of a command bus are:

* It handles _commands_, i.e. imperative messages.
* Commands are handled by exactly one _command handler._
* The behavior of the command bus is extensible: _middlewares_ are allowed to do things before or after handling a command.

## Setting up a Command Bus

At least we need an instance of `MessageHandlerMiddleware`:

```typescript
import { MessageHandlerMiddleware } from '@layerr/bus';

const middleware = new MessageHandlerMiddleware(messageMapper)
```

## Defining a message mapper for the middleware

The message handler middleware needs an instance of a message mapper that allows to retrieve a handler for a given message \(in this case commands\).

To create it we need some other objects that are dependencies of the mapper.

### Creating the collection to defined the command handler map

We want commands to be handled by exactly one command handler \(which can be functions or classes\). We first need to define the collection of handlers and commands pair that are available in the application. We should make this _command handler map_ lazy-loading, or every command handler will be fully loaded, even though it is not going to be used:

```typescript
import { CollectionHandlerLookup } from '@layerr/bus';

const collection = new CollectionHandlerLookup([ 
  { message: ..., handler: ... }
]);
```

Each of the provided handler can be one of the following things:

* A function.
* An array of functions.
* A service id \(string or class\) which the resolver \(see below\) can resolve to a valid object that has a method named `handle()`.

```typescript
import { CollectionHandlerLookup } from '@layerr/bus';

// Use classes to define commands and handlers.
const collection = new CollectionHandlerLookup([ 
  { message: LoginCommand, handler: LoginCommandHandler },
  { message: LogoutCommand, handler: LogoutCommandHandler }
]);

// Use string to define commands and handlers.
const collection = new CollectionHandlerLookup([ 
  { message: 'login-command', handler: 'login-handler' },
  { message: 'logout-command', handler: 'logout-handler' }
]);

// Use a functions to define handlers.
const collection = new CollectionHandlerLookup([ 
  { 
    message: 'login-command', 
    handler: (command: string) => {
      // command === 'login-command'
    }
  },
  { 
    message: 'logout-command', 
    handler: [
      (command: string) => {
        // command === 'logout-command'
      },
      (command: string) => {
        // command === 'logout-command'
      },
      ...
    ]
  }
]);
```

### Creating the resolver to instantiate handlers

If you don't use functions as handlers, you will need to create a resolver. It should provide an instance of the handler when the bus needs it to handle a command.

**@layerr/bus** doesn't provide a default resolver since it strictly depends on your application setup. For example, if you use Angular, your resolver will be the _Injector_ which is the service container used by the Angular DI to create the services. If your framework doesn't support a DI or you simply don't use it you can use the resolver to import the needed class.

If you use a framework dependency manager the resolve will be something similar to:

```typescript
import { ClassResolverInterface } from '@layerr/bus';

export class MyAdapterResolver implements ClassResolverInterface {

    constructor(private dependencyManager: MyFrameworkDependencyManager) {}

    resolve<T>(classType: ClassType<T>): T {
        // Creates a handler using the class type.
        return this.dependencyManager.create(classType);
    }
}
```

If you don't use the DI maybe you will use strings instead of classes:

```typescript
import { ClassResolverInterface } from '@layerr/bus';

import MyHandler from './my-handler';

export class MyAdapterResolver implements ClassResolverInterface {

    resolve<T>(classType: string): T {
        // Creates a handler using the class type.
        switch(classType) {
            case 'myHandler': return new MyHandler();
            default: throw new Error('No handler found.');
        }
    }
}
```

### Resolving the command handler for a command

First we need a way to resolve the name of a command. You can use the constructor function of a command object as its name:

```typescript
import { FunctionConstructorMessageTypeExtractor } from '@layerr/bus';

const extractor = new FunctionConstructorMessageTypeExtractor();
```

If you don't use classes, but strings or numbers, you have to use another extractor:

```typescript
import { IdentityMessageTypeExtractor } from '@layerr/bus';

const extractor = new IdentityMessageTypeExtractor();
```

### Allow the handler to map and resolve the command and command handler

Finally, the message mapper can be created by combining the previous components. It is used by the handler middleware to resolve and get the specific handler for a message \(i.e. command\).

```typescript
import { MessageMapper } from '@layerr/bus';

const messageMapper = new MessageMapper(
  collection,
  extractor,
  resolver
);
```

### Use the command bus

Consider the following command:

```typescript
export class RegisterUser {

    private emailAddress;
    private plainTextPassword;

    constructor(emailAddress: string, plainTextPassword: string) {
        this.emailAddress = emailAddress;
        this.plainTextPassword = plainTextPassword;
    }
    
    get emailAddress(): string {
        return this.emailAddress;
    }
    
    get plainTextPassword(): string {
        return this.plainTextPassword;
    }
}
```

This command communicates the intention to “register a new user”. The message data consists of an email address and a password in plain text. This information is required to execute the desired behavior.

The handler for this command looks like this:

```typescript
export class RegisterUserCommandHandler {

    ...

    handle(command: RegisterUser) {
    
        const user = User::register(
            $command->emailAddress(),
            $command->plainTextPassword()
        );

        this.userRepository.add(user);
    }
}
```

We should [register this handler as a service](command-bus.md#creating-the-resolver-to-instantiate-handlers) and add the service id to the [command handler map](command-bus.md#creating-the-collection-to-defined-the-command-handler-map). Since we have already fully configured the command bus, we can just start creating a new command object and let the command bus handle it. Eventually the command will be passed as a message to the `RegisterUserCommandHandler`:

```typescript
import { RegisterUser } from 'path/to/RegisterUser';

const command = new RegisterUser(
    'matthiasnoback@gmail.com',
    's3cr3t'
);

commandBus.handle(command);

// RegisterUserCommandHandler.handle is invoked under the hood
```

By design, the command handler shouldn't return anything. It is void method. Anyway, in most cases, we have interested to understand if the command was executed correctly or not since we want to adapt our application to successful or failure.

**Observers**

To do that, just subscribe to the handle:

```typescript
commandBus.handle(command)
    .subscribe(
        () => {}, // Next
        (error: Error) => {}, // Error
        () => {} // Complete
    );
```

**The bus handles the command by calling the command handler even if you don't subscribe to the observer returned by handle method.**

**Promises**

If you want to use **promises** instead of **observers** just call the **toPromise** method:

```typescript
commandBus.handle(command)
    .toPromise()
    .then(() => {})
    .catch((error: Error) => {});
```

