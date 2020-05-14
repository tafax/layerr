
import { suite, test, Mock, Times } from '@layerr/test';
import { PaginatedResult } from '../../../src/pagination/paginated-result';
import { PaginationInterface } from '../../../src/pagination/pagination.interface';

@suite class PaginatedResultUnitTests {

  @test 'should return default values'() {

    const entityMock = Mock.ofType<any>();

    const paginatedResult = new PaginatedResult([ entityMock.object ], <PaginationInterface>{});

    paginatedResult.data.should.have.length(1);
    paginatedResult.total.should.be.eql(0);
    paginatedResult.perPage.should.be.eql(0);
    paginatedResult.currentPage.should.be.eql(0);
    paginatedResult.lastPage.should.be.eql(0);
    paginatedResult.isLast().should.be.true;
  }

  @test 'should parse the pagination data'() {

    const paginationMock = Mock.ofType<PaginationInterface>();

    paginationMock
      .setup(x => x.total)
      .returns(() => 100)
      .verifiable(Times.once());

    paginationMock
      .setup(x => x.lastPage)
      .returns(() => 10)
      .verifiable(Times.once());

    paginationMock
      .setup(x => x.itemsPerPage)
      .returns(() => 10)
      .verifiable(Times.once());

    paginationMock
      .setup(x => x.currentPage)
      .returns(() => 1)
      .verifiable(Times.once());

    const entityMock = Mock.ofType<any>();

    const paginatedResult = new PaginatedResult([ entityMock.object ], paginationMock.object);

    paginatedResult.data.should.have.length(1);
    paginatedResult.total.should.be.eql(100);
    paginatedResult.perPage.should.be.eql(10);
    paginatedResult.currentPage.should.be.eql(1);
    paginatedResult.lastPage.should.be.eql(10);
    paginatedResult.isLast().should.be.false;
  }

  @test 'should return true if it is the last page'() {

    const paginationMock = Mock.ofType<PaginationInterface>();

    paginationMock
      .setup(x => x.total)
      .returns(() => 100)
      .verifiable(Times.once());

    paginationMock
      .setup(x => x.lastPage)
      .returns(() => 10)
      .verifiable(Times.once());

    paginationMock
      .setup(x => x.itemsPerPage)
      .returns(() => 10)
      .verifiable(Times.once());

    paginationMock
      .setup(x => x.currentPage)
      .returns(() => 10)
      .verifiable(Times.once());

    const entityMock = Mock.ofType<any>();

    const paginatedResult = new PaginatedResult([ entityMock.object ], paginationMock.object);

    paginatedResult.data.should.have.length(1);
    paginatedResult.total.should.be.eql(100);
    paginatedResult.perPage.should.be.eql(10);
    paginatedResult.currentPage.should.be.eql(10);
    paginatedResult.lastPage.should.be.eql(10);
    paginatedResult.isLast().should.be.true;
  }

}
