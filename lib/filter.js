'use strict';

const earliestDate = {
  instagram: new Date('2010-10-05 UTC'),
  twitter: new Date('2016-06-27 UTC')
};

class _Condition {
  constructor(prop, value, option) {
    this._prop = prop || {};
    this._value = value || {};
    this._option = option || {};
  }

  get queryInstagram() {
    // use dollar sign to indicate that this is unified search to both data sources
    if (/^\$/.test(this._prop)) {
      if (this._prop === '$keyword') {
        const pattern = this._option === 'exact' ? `\\b${this._value}\\b` : this._value;
        return {'info.caption': new RegExp(pattern, 'i')};

      } else if (this._prop === '$hashtag') {
        const pattern = this._option === 'exact' ? `#${this._value}\\b` : `#\\B*${this._value}`;
        return {'info.caption': new RegExp(patter, 'i')};

      } else if (this._prop === '$place') {
        return {$or: [
          {'info.location.title': new RegExp(this._value, 'i')},
          {'info.location.city': new RegExp(this._value, 'i')}
        ]};
      }

    } else {
      return {[this._prop]: this._value};
    }
  }

  get queryTwitter() {
    if (/^\$/.test(this._prop)) {
      if (this._prop === '$keyword'){
        const pattern = this._option === 'exact' ? `\\b${this._value}\\b` : this._value;
        return {'text': new RegExp(pattern, 'i')};   

      } else if (this._prop === '$hashtag'){
        const pattern = this._option === 'exact' ? `^${this._value}$` : this._value;
        return {'entities.hashtags.text': new RegExp(pattern, 'i')};

      } else if (this._prop === '$place') {
        return {'place.full_name': new RegExp(this._value, 'i')}
      } 

    } else {
      return {[this._prop]: this._value};     
    }
  }
}

class _Filter {
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

class _Query {
  constructor (dbs, filter, dateRange) {
    this._dbs = dbs || {};
    this._filter = filter || {};
    this._dateRange = dateRange || {};
  }

  async findInstagram(limit) {
    const dateFrom = this._dateRange.from || earliestDate.instagram;
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

    const dateFrom = this._dateRange.from || earliestDate.twitter;
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
  Condition: _Condition,
  Filter: _Filter,
  Query: _Query
};