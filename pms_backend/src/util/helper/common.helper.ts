import { Op } from 'sequelize';

const parseJSON = (data: string | undefined) => {
  try {
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

const sortingOrder = (
  sortQuery: string | undefined,
  allowField: Array<string>,
  modelName?: string | undefined,
) => {
  if (parseJSON(sortQuery)) {
    const sort: any = Object.entries(parseJSON(sortQuery))[0];
    if (
      allowField.includes(sort[0]) &&
      ['ASC', 'DESC', 'asc', 'desc'].includes(sort[1])
    ) {
      if (sort[0].split('.').length === 1) {
        if (modelName) {
          sort.unshift(modelName);
        }
        return [sort];
      } else {
        return [[...sort[0].split('.'), sort[1]]];
      }
    }
  }
  return [];
};

const getPagination = (page: number, limit: number) => {
  const pagination = {
    count: 0,
    page: page,
    limit: limit,
    offset: 0,
  };
  pagination.offset = (pagination.page - 1) * pagination.limit;

  return pagination;
};

const getSearchField: any = (allowField: Array<string>, searchText: string) => {
  const searchFields: Array<object> = [];
  allowField.forEach((item) => {
    const searchFieldName = item.includes('.') ? `$${item}$` : item;

    searchFields.push({
      [searchFieldName]: { [Op.like as symbol]: `%${searchText}%` },
    });
  });

  return { [Op.or]: searchFields };
};

const getSearchQuery: any = (
  allowField: Array<string>,
  searchQuery: string,
) => {
  if (parseJSON(searchQuery)) {
    const searchFields: Array<object> = [];
    Object.entries(parseJSON(searchQuery)).forEach((item) => {
      if (allowField.includes(item[0])) {
        searchFields.push({
          [`$${item[0]}$`]: { [Op.like as symbol]: `%${item[1]}%` },
        });
      }
    });

    return { [Op.and]: searchFields };
  }
  return {};
};

export {
  parseJSON,
  sortingOrder,
  getPagination,
  getSearchField,
  getSearchQuery,
};
