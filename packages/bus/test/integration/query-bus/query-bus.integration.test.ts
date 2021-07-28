import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { of } from 'rxjs';
import { mock, instance, when, verify } from 'ts-mockito';
import { resolvableInstance } from '../../../../../tests/index';
import { ClassResolverInterface } from '../../../../core/src/lib/resolvers/class-resolver.interface';
import { MessageBus } from '../../../src/lib/bus/message-bus';
import { FunctionConstructorMessageTypeExtractor } from '../../../src/lib/message-handler/extractor/function-constructor.message-type-extractor';
import { CollectionHandlerLookup } from '../../../src/lib/message-handler/handler-lookup/collection/collection.handler-lookup';
import { MessageHandlerMiddleware } from '../../../src/lib/message-handler/message-handler.middleware';
import { MessageMapper } from '../../../src/lib/message-handler/message-mapper/message.mapper';
import { EvilQueryHandlerForTest } from '../../fixtures/class-handlers/evil-query-handler-for-test';
import { GoodQueryHandlerForTest } from '../../fixtures/class-handlers/good-query-handler-for-test';
import { CustomError } from '../../fixtures/custom.error';
import { EvilQueryForTest } from '../../fixtures/evil-query-for-test';
import { GoodQueryForTest } from '../../fixtures/good-query-for-test';

@suite
class QueryBusIntegrationTest {

  private SUT: MessageBus<unknown>;
  private classResolver: ClassResolverInterface;

  before() {
    this.classResolver = mock<ClassResolverInterface>();

    const messageHandlingCollection = new CollectionHandlerLookup([
      { message: GoodQueryForTest, handler: GoodQueryHandlerForTest },
      { message: EvilQueryForTest, handler: EvilQueryHandlerForTest },
    ]);

    this.SUT = new MessageBus([
      new MessageHandlerMiddleware(
        new MessageMapper(
          messageHandlingCollection,
          new FunctionConstructorMessageTypeExtractor(),
          instance(this.classResolver),
        ),
      ),
    ]);
  }

  @test
  givenQuery_whenHandle_thenReturnValue() {
    const query = new GoodQueryForTest();

    when(this.classResolver.resolve(GoodQueryHandlerForTest)).thenReturn(new GoodQueryHandlerForTest());

    const observable = subscribeSpyTo(this.SUT.handle(query));
    expect(observable.receivedNext()).toBeTruthy();
    expect(observable.receivedComplete()).toBeTruthy();
    expect(observable.getLastValue()).toStrictEqual(['result-value']);

    verify(this.classResolver.resolve(GoodQueryHandlerForTest)).once();
  }

  @test
  givenQuery_whenHandle_thenReturnValueWithoutSubscribing() {
    const query = new GoodQueryForTest();

    const queryHandler = mock<GoodQueryHandlerForTest>();
    when(queryHandler.handle(query)).thenReturn(of('result-value'));

    when(this.classResolver.resolve(GoodQueryHandlerForTest)).thenReturn(resolvableInstance(queryHandler));

    const execution$ = this.SUT.handle(query);

    verify(this.classResolver.resolve(GoodQueryHandlerForTest)).once();
    verify(queryHandler.handle(query)).once();

    const observable = subscribeSpyTo(execution$);
    expect(observable.receivedNext()).toBeTruthy();
    expect(observable.receivedComplete()).toBeTruthy();
    expect(observable.getLastValue()).toStrictEqual(['result-value']);
  }

  @test
  givenQuery_whenHandle_thenThrowError() {
    const query = new EvilQueryForTest();

    when(this.classResolver.resolve(EvilQueryHandlerForTest)).thenReturn(new EvilQueryHandlerForTest());

    const observable = subscribeSpyTo(this.SUT.handle(query), { expectErrors: true });
    expect(observable.receivedNext()).toBeFalsy();
    expect(observable.receivedComplete()).toBeFalsy();
    expect(observable.getError()).toBeInstanceOf(CustomError);

    verify(this.classResolver.resolve(EvilQueryHandlerForTest)).once();
  }
}


