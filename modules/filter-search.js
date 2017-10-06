const defaultResultLimit = 1000;

const earliestDate = {
  instagram: new Date('2010-10-01 UTC'),
  twitter: new Date('2016-06-25 UTC')
};

module.exports.Condition = class {
  constructor(field, value, option) {
    this.field = field || {};
    this.value = value || {};
    this.option = option || {};
  }

  get queryInstagram() {
    // use dollar sign to indicate that this is unified search to both data sources
    if (/^\$/.test(this.field)) {
      if (this.field === '$keyword') {
        const pattern = this.option.exact ? `\\b${this.value}\\b` : this.value;
        return {'info.caption': new RegExp(pattern, 'i')};

      } else if (this.field === '$hashtag') {
        const pattern = this.option.exact ? `#${this.value}\\b` : `#\\w*${this.value}`;
        return {'info.caption': new RegExp(pattern, 'i')};

      } else if (this.field === '$place') {
        return {$or: [
          {'info.location.title': new RegExp(this.value, 'i')},
          {'info.location.city': new RegExp(this.value, 'i')}
        ]};
      }

    } else {
      return {[this.field]: this.value};
    }
  }

  get queryTwitter() {
    if (/^\$/.test(this.field)) {
      if (this.field === '$keyword'){
        const pattern = this.option.exact ? `\\b${this.value}\\b` : this.value;
        return {'text': new RegExp(pattern, 'i')};   

      } else if (this.field === '$hashtag'){
        const pattern = this.option.exact ? `^${this.value}$` : this.value;
        return {'entities.hashtags.text': new RegExp(pattern, 'i')};

      } else if (this.field === '$place') {
        return {'place.fullname': new RegExp(this.value, 'i')}
      } 

    } else {
      return {[this.field]: this.value};     
    }
  }
};

module.exports.Filter = class {
  constructor(logicalOperator) {
    this.logicalOperator = logicalOperator || {};
    this.conditionList = [];
  }

  addCondition(conditions) {
    if (Array.isArray(conditions)) this.conditionList.concat(conditions);
    else this.conditionList.push(conditions);
  }

  get queryInstagram() {
    return {[this.logicalOperator]: this.conditionList.map(item => item.queryInstagram)};
  }

  get queryTwitter() {
    return {[this.logicalOperator]: this.conditionList.map(item => item.queryTwitter)};
  }
};

module.exports.Query = class {
  constructor (dbs, filter, dateRange) {
    this.dbs = dbs || {};
    this.filter = filter || {};
    this.dateRange = dateRange || {};
  }

  async findInstagram(limit = defaultResultLimit) {
    const dateFrom = this.dateRange.from || earliestDate.instagram;
    const dateTo = this.dateRange.to || new Date();
    const timestampFrom = dateFrom.getTime();
    const timestampTo = dateTo.setDate(dateTo.getDate() + 1);

    // both timestamps in seconds or in milliseconds can be handled
    const dateQuery = { $or: [
        {'info.deviceTimestamp': {$gte: timestampFrom, $lt: timestampTo}},
        {'info.deviceTimestamp': {$gte: timestampFrom / 1000, $lt: timestampTo / 1000}}
    ]};

    console.log(JSON.stringify(dateQuery));

    return await this.dbs.instagram.collection('posts')
      .find({$and: [dateQuery, this.filter.queryInstagram]})
      .limit(limit).toArray();
    
  }

  async findTwitter(limit = defaultResultLimit) {
    let result = [];

    const dateFrom = this.dateRange.from || earliestDate.twitter;
    const dateTo = this.dateRange.to || new Date();

    const collectionList = await this.dbs.twitter.collections();

    for (let d = dateTo; d >= dateFrom; d.setDate(d.getDate() - 1)) {
      const collectionName = `tweets-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      if (!collectionList.map(item => item.s.name).includes(collectionName)) continue;

      const partResult =
        await this.dbs.twitter.collection(collectionName)
          .find(this.filter.queryTwitter)
          .limit(limit).toArray();

      result = result.concat(partResult);

      if(result.length >= limit) {
        result.length = limit;
        break;
      }
    }

    return result;
  }
};