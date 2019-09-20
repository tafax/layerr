
import { ClassResolverInterface } from '@swiss/core';
import { suite, test, Mock, IMock, Times } from '@swiss/test';
import { of } from 'rxjs';
import {
  MessageBus,
  CollectionHandlerLookup,
  FunctionConstructorMessageTypeExtractor,
  MessageMapper,
  MessageHandlerMiddleware
} from '../../..';
import { CustomError } from '../../fixtures/custom.error';
import { EvilQueryForTest } from '../../fixtures/evil-query-for-test';
import { EvilQueryHandlerForTest } from '../../fixtures/evil-query-handler-for-test';
import { GoodQueryForTest } from '../../fixtures/good-query-for-test';
import { GoodQueryHandlerForTest } from '../../fixtures/good-query-handler-for-test';

//@ts-ignore
@suite class QueryBusIntegrationTests {

  private queryBus: MessageBus<any>;
  private classResolverMock: IMock<ClassResolverInterface>;

  before() {
    this.classResolverMock = Mock.ofType<ClassResolverInterface>();

    const messageHandlingCollection = new CollectionHandlerLookup([
      { message: GoodQueryForTest, handler: GoodQueryHandlerForTest },
      { message: EvilQueryForTest, handler: EvilQueryHandlerForTest }
    ]);

    const functionExtractor = new FunctionConstructorMessageTypeExtractor();

    const classMapHandlerResolver = new MessageMapper(
      messageHandlingCollection,
      functionExtractor,
      this.classResolverMock.object
    );

    this.queryBus = new MessageBus([
      new MessageHandlerMiddleware(classMapHandlerResolver)
    ]);
  }

  @test 'should execute the correct query handler and return the result value'() {

    const query = new GoodQueryForTest();

    this.classResolverMock
      .setup(x => x.resolve(GoodQueryHandlerForTest))
      .returns(() => new GoodQueryHandlerForTest())
      .verifiable(Times.once());

    return this.queryBus.handle(query)
      .subscribe(
        (result: string) => {
          result.should.be.eql([ 'result-value' ]);

          this.classResolverMock.verifyAll();
        },
      );
  }

  @test 'should execute the correct query handler and return the result value without subscribing'() {

    const query = new GoodQueryForTest();

    const queryHandlerMock = Mock.ofType(GoodQueryHandlerForTest);

    queryHandlerMock
      .setup(x => x.handle(query))
      .returns(() => of('result-value'))
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(GoodQueryHandlerForTest))
      .returns(() => queryHandlerMock.object)
      .verifiable(Times.once());

    const execution$ = this.queryBus.handle(query);

    this.classResolverMock.verifyAll();
    queryHandlerMock.verifyAll();

    return execution$
      .subscribe((result: string) => {
        result.should.be.eql([ 'result-value' ]);

        this.classResolverMock.verifyAll();
        queryHandlerMock.verifyAll();
      });
  }

  @test 'should execute the correct command handler and reject'() {

    const query = new EvilQueryForTest();

    this.classResolverMock
      .setup(x => x.resolve(EvilQueryHandlerForTest))
      .returns(() => new EvilQueryHandlerForTest())
      .verifiable(Times.once());

    return this.queryBus.handle(query)
      .subscribe(
        () => { throw new Error('should-not-be-called'); },
        (error: Error) => {
          error.should.be.instanceof(CustomError);

          this.classResolverMock.verifyAll();
        }
      );
  }
}


