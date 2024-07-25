import { Repository, SelectQueryBuilder } from 'typeorm';
import { constants } from '../../app/constants/common.constant';
import { CommonHelper } from "../../app/helpers/common.helper";

export class BaseService {
  protected commonHelper: CommonHelper;
  constructor() {
    this.commonHelper = CommonHelper.getInstance();
  }

  responseOk(data: any = undefined, msg: string = null): any {
    let response = {
      statusCode: 200,
      message: msg,
      data: data,
    };
    if (data === undefined) {
      delete response.data;
    }
    if (!msg) {
      delete response.message;
    }
    if (data?.statusCode && !data?.data) {
      response = data;
    }
    return response;
  }

  async customPaginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    page: number = constants.PAGINATION.PAGE_DEFAULT,
    limit: number = constants.PAGINATION.LIMIT_DEFAULT,
  ) {
    page = +page;
    limit = +limit;
    const start = (page - 1) * limit;
    const result = await queryBuilder.skip(start).take(limit).getManyAndCount();
    const items = result[0];
    const totalItems = result[1];
    const totalPage = limit > 0 ? Math.ceil(totalItems / limit) : 1;

    return {
      items: items,
      meta: {
        totalItems: totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: totalPage,
        currentPage: page,
      },
    };
  }

  async customPaginateGetRawMany<T>(
    repository: Repository<T>,
    queryBuilder: SelectQueryBuilder<T>,
    page: number = constants.PAGINATION.PAGE_DEFAULT,
    limit: number = constants.PAGINATION.LIMIT_DEFAULT,
  ) {
    page = +page;
    limit = +limit;
    const start = (page - 1) * limit;
    const [subQuery, subQueryParams] = queryBuilder.getQueryAndParameters();
    const countQuery = `
      WITH subquery AS (
        ${subQuery}
      )
      SELECT
        COUNT(*) AS cnt
      FROM
        subquery
    `;

    const count = await repository.query(countQuery, subQueryParams);
    const result = await queryBuilder.offset(start).limit(limit).getRawMany();
    const items = result;
    const totalItems = Number(count[0].cnt);
    const totalPage = limit > 0 ? Math.ceil(totalItems / limit) : 1;

    return {
      items: items,
      meta: {
        totalItems: totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: totalPage,
        currentPage: page,
      },
    };
  }
}
