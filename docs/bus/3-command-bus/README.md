
The classes and interfaces from this package can be used to set up a 
command bus. The characteristics of a command bus are:

* It handles commands, i.e. imperative messages.
* Commands are handled by exactly one command handler.
* The behavior of the command bus is extensible: middlewares are allowed to do things before or after handling a command.

# Setting up a Command Bus

At least we need an instance of MessageHandlerMiddleware:

```TypeScript
import { MessageHandlerMiddleware } from '@layerr/bus';

const middleware = new MessageHandlerMiddleware(messageMapper);
```

# Defining a message mapper for the middleware

The message handler middleware needs an instance of a message 
mapper that allows to retrieve a handler for a given message (in this case commands).


To create it we need some other objects that are dependencies of the mapper.


## Creating the collection to defined the command handler map

We want commands to be handled by exactly one command handler 
(which can be functions or classes). We first need to define 
the collection of handlers and commands pair that are available 
in the application. We should make this command handler map 
lazy-loading, or every command handler will be fully loaded, 
even though it is not going to be used:

```TypeScript
import { CollectionHandlerLookup } from '@layerr/bus';

const collection = new CollectionHandlerLookup([ 
  { message: ..., handler: ... }
]);
```

Each of the provided handler can be one of the following things:

* A function.
* An array of functions.
* A service id (string or class) which the resolver (see below) 
can resolve to a valid object that has a method named `handle()`.

```TypeScript
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

// Use string and classes to define commands and handlers.
const collection = new CollectionHandlerLookup([ 
  { message: 'login-command', handler: LoginCommandHandler },
  { message: 'logout-command', handler: LogoutCommandHandler }
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

## Creating the resolver to instantiate handlers

If you don't use functions as handlers, you will need to create a resolver. 
It should provide an instance of the handler when the bus needs it to 
handle a command.

**@layerr/bus** doesn't provide a default resolver since it strictly 
depends on your application setup. For example, if you use Angular, 
your resolver will be the Injector which is the service container 
used by the Angular DI to create the services. If your framework 
doesn't support a DI or you simply don't use it you can use the 
resolver to import the needed class.

If you use a framework dependency manager the resolve will be 
something similar to:

```TypeScript
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

```TypeScript
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

## Resolving the command handler for a command

First we need a way to resolve the name of a command. You can use 
the constructor function of a command object as its name:

```TypeScript
import { FunctionConstructorMessageTypeExtractor } from '@layerr/bus';

const extractor = new FunctionConstructorMessageTypeExtractor();
```

If you use this extract you have to define class as commands in the collection.

Alternatively, you can define a public `name` property in the command and
use a specific extractor:

```TypeScript
import { NameMessageTypeExtractor } from '@layerr/bus';

const extractor = new NameMessageTypeExtractor();
```

with this one, you have to use strings as commands in the collection.

If you don't use classes, but strings, you have to use 
another extractor:

```TypeScript
import { IdentityMessageTypeExtractor } from '@layerr/bus';

const extractor = new IdentityMessageTypeExtractor();
```

and make sure to you strings as commands as well.

# Allow the handler to map and resolve the command and command handler

Finally, the message mapper can be created by combining the previous 
components. It is used by the handler middleware to resolve and get 
the specific handler for a message (i.e. command).

```TypeScript
import { MessageMapper } from '@layerr/bus';

const messageMapper = new MessageMapper(
  collection,
  extractor,
  resolver
);
```

## Use the command bus

Consider the following command:

```TypeScript
export class RegisterUserCommand {

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

This command communicates the intention to “register a new user”. 
The message data consists of an email address and a password in 
plain text. This information is required to execute the desired 
behavior.

The handler for this command looks like this:

```TypeScript
export class RegisterUserCommandHandler {

    ...

    handle(command: RegisterUserCommand) {
    
        const user = User.Register(
            $command->emailAddress(),
            $command->plainTextPassword()
        );

        this.userRepository.add(user);
    }
}
```

We should [register this handler as a service](https://app.gitbook.com/@tafax/s/layerr/bus/command-bus#creating-the-resolver-to-instantiate-handlers) 
and add the service id to the [command handler map](https://app.gitbook.com/@tafax/s/layerr/bus/command-bus#creating-the-collection-to-defined-the-command-handler-map). 
Since we have already fully configured the command bus, we can 
just start creating a new command object and 
let the command bus handle it. Eventually the command will be passed 
as a message to the `RegisterUserCommandHandler`:

```TypeScript
import { RegisterUser } from 'path/to/register-user.command';

const command = new RegisterUserCommand(
    'matthiasnoback@gmail.com',
    's3cr3t'
);

commandBus.handle(command);

// RegisterUserCommandHandler.handle is invoked under the hood
```

By design, the command handler shouldn't return anything. It is 
void method. Anyway, in most cases, we have interested to understand 
if the command was executed correctly or not since we want to adapt 
our application to successful or failure.

**Observers**

To do that, just subscribe to the handle:

```TypeScript
commandBus.handle(command)
    .subscribe(
        () => {}, // Next
        (error: Error) => {}, // Error
        () => {} // Complete
    );
```

**The bus handles the command by calling the command handler even if 
you don't subscribe to the observer returned by handle method.**

**Promises**


If you want to use promises instead of observers just call the `toPromise` method:

```TypeScript
commandBus.handle(command)
    .toPromise()
    .then(() => {})
    .catch((error: Error) => {});
```
