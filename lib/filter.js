'use strict';

const startDate = new Date('2005-01-01');

class Condition {
  constructor(field, value, operator) {
    this._field = field || {};
    this._value = value || {};
    this._operator = operator || {};
  }

  get queryInstagram() {
    if (this._field === 'keyword')
      return {'info.caption': {$regex: this._value}};
    else if (this._field === 'hashtag')
      return {'info.caption': {$regex: `#${this._value}\\b`}};
  }

  get queryTwitter() {
    if (this._field === 'keyword')
      return {'text': {$regex: this._value}};
    else if (this._field === 'hashtag')
      return {'entities.hashtags': {$in: [this._value]}};
  }
}

class Filter {
  constructor(logicalOperator) {
    this._logicalOperator = logicalOperator || {};
    this._conditionList = [];
  }

  addCondition(conditions) {
    if (Array.isArray(conditions)) this._conditionList.concat(conditions);
    else this._conditionList.push(conditions);
  }

  get queryInstagram() {
    return {[this._logicalOperator]: this._conditionList.map(item => item.queryInstagram)};
  }

  get queryTwitter() {
    return {[this._logicalOperator]: this._conditionList.map(item => item.queryTwitter)};
  }
}

class Query {
  constructor (dbs, filter, dateRange) {
    this._dbs = dbs || {};
    this._filter = filter || {};
    this._dateRange = dateRange || {};
  }

  async findInstagram(limit) {
    const dateFrom = this._dateRange.from || startDate;
    const dateTo = this._dateRange.to || new Date();
    const timestampFrom = dateFrom.getTime();
    const timestampTo = dateTo.setDate(dateTo.getDate() + 1);

    // both timestamps in seconds or in milliseconds can be handled
    const dateQuery = { $or: [
        {'info.deviceTimestamp': {$gte: timestampFrom, $lt: timestampTo}},
        {'info.deviceTimestamp': {$gte: timestampFrom / 1000, $lt: timestampTo / 1000}}
    ]};

    const result = 
      await this._dbs.instagram.collection('posts')
        .find({$and: [dateQuery, this._filter.queryInstagram]})
        .limit(limit).toArray();

    return result;
  }

  async findTwitter(limit) {
    let result = [];

    const dateFrom = this._dateRange.from || startDate;
    const dateTo = this._dateRange.to || new Date();

    const collectionList = await this._dbs.twitter.collections();

    for (let d = dateTo; d >= dateFrom; d.setDate(d.getDate() - 1)) {
      const collectionName = `tweets-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      if (!collectionList.map(item => item.s.name).includes(collectionName)) continue;

      const partResult =
        await this._dbs.twitter.collection(collectionName)
          .find(this._filter.queryTwitter)
          .limit(limit).toArray();

      result = result.concat(partResult);

      if(result.length >= limit) {
        result.length = limit;
        break;
      }
    }

    return result;
  }
}

module.exports = {
  Condition: Condition,
  Filter: Filter,
  Query: Query
}