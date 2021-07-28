import { suite, test } from '@testdeck/jest';
import { mock, instance, when } from 'ts-mockito';
import { PaginatedResult } from '../../../src/lib/pagination/paginated-result';
import { PaginationInterface } from '../../../src/lib/pagination/pagination.interface';

@suite
class PaginatedResultUnitTest {
  @test
  givenDataAndEmptyPagination_whenConstruct_thenReturnDefaultValues() {
    const pagination = mock<PaginationInterface>();
    when(pagination.total).thenReturn(undefined);
    when(pagination.lastPage).thenReturn(undefined);
    when(pagination.itemsPerPage).thenReturn(undefined);
    when(pagination.currentPage).thenReturn(undefined);

    const paginatedResult = new PaginatedResult(
      [ {} ],
      instance(pagination),
    );

    expect(paginatedResult.data).toHaveLength(1);
    expect(paginatedResult.total).toStrictEqual(0);
    expect(paginatedResult.perPage).toStrictEqual(0);
    expect(paginatedResult.currentPage).toStrictEqual(0);
    expect(paginatedResult.lastPage).toStrictEqual(0);
    expect(paginatedResult.isLast()).toBeTruthy();
  }

  @test
  givenDataAndPagination_whenConstruct_thenReturnPaginationValues() {
    const pagination = mock<PaginationInterface>();
    when(pagination.total).thenReturn(100);
    when(pagination.lastPage).thenReturn(10);
    when(pagination.itemsPerPage).thenReturn(10);
    when(pagination.currentPage).thenReturn(1);

    const paginatedResult = new PaginatedResult(
      [ {} ],
      instance(pagination),
    );

    expect(paginatedResult.data).toHaveLength(1);
    expect(paginatedResult.total).toStrictEqual(100);
    expect(paginatedResult.perPage).toStrictEqual(10);
    expect(paginatedResult.currentPage).toStrictEqual(1);
    expect(paginatedResult.lastPage).toStrictEqual(10);
  }

  @test
  givenDataAndPagination_whenIsLast_thenReturnFalse() {
    const pagination = mock<PaginationInterface>();
    when(pagination.total).thenReturn(100);
    when(pagination.lastPage).thenReturn(10);
    when(pagination.itemsPerPage).thenReturn(10);
    when(pagination.currentPage).thenReturn(1);

    const paginatedResult = new PaginatedResult(
      [ {} ],
      instance(pagination),
    );

    expect(paginatedResult.isLast()).toBeFalsy();
  }

  @test
  givenDataAndPaginationForLastPage_whenIsLast_thenReturnTrue() {
    const pagination = mock<PaginationInterface>();
    when(pagination.total).thenReturn(100);
    when(pagination.lastPage).thenReturn(10);
    when(pagination.itemsPerPage).thenReturn(10);
    when(pagination.currentPage).thenReturn(10);

    const paginatedResult = new PaginatedResult(
      [ {} ],
      instance(pagination),
    );

    expect(paginatedResult.isLast()).toBeTruthy();
  }
}
