class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Search by keyword
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // Filter by price, category, or other fields
  filter() {
    const queryObj = { ...this.queryStr };
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach(f => delete queryObj[f]);

    const finalQuery = {};

    // Loop over each key
    Object.keys(queryObj).forEach(key => {
      if (key.includes("[")) {
        // For price[gte], price[lte], etc.
        const field = key.split("[")[0];           // e.g., "price"
        const operator = key.split("[")[1].replace("]", ""); // e.g., "gte"
        if (!finalQuery[field]) finalQuery[field] = {};
        finalQuery[field]["$" + operator] = Number(queryObj[key]);
      } else if (queryObj[key] !== null && queryObj[key] !== "") {
        // Only add normal fields if not null or empty
        finalQuery[key] = queryObj[key];
      }
    });

    this.query = this.query.find(finalQuery);

    console.log("Final MONGO FILTER:", finalQuery);

    return this;
  }

  // Pagination
  paginate(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
