class APIFeatures {
  constructor(dbQuery, queryString) {
    this.dbQuery = dbQuery; // Model.find()
    this.queryString = queryString; // from req.query
  }

  filter() {
    const queryObject = { ...this.queryString };
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, (match) => `$${match}`); //searh for gte and replace with $gte

    this.dbQuery = this.dbQuery.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.dbQuery = this.dbQuery.sort(this.queryString.sort);
    } else {
      this.dbQuery = this.dbQuery.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.feilds) {
      const fields = this.queryString.feilds.split(',').join(' ');
      this.dbQuery = this.dbQuery.select(fields);
    } else {
      this.dbQuery = this.dbQuery.select('--v'); // exclude -v
    }
    return this;
  }

  paginate() {
    const n = 100;
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || n; // number of results
    const skip = (page - 1) * limit;
    this.dbQuery = this.dbQuery.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
