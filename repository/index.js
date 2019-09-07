import { dbQuery } from '../driver';

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const values = [];

    let insertStmt = `
      INSERT INTO "${this.model}" (
    `;

    let valueStmt = `
      VALUES (
    `;

    const dataKeys = Object.keys(data);
    Object.entries(data).forEach(([key, value], index) => {
      if (!dataKeys[index + 1]) {
        insertStmt = `${insertStmt}"${key}"`;
        valueStmt = `${valueStmt}$${index + 1}`;
      } else {
        insertStmt = `${insertStmt}"${key}", `;
        valueStmt = `${valueStmt}$${index + 1}, `;
      }

      values.push(value);
    });

    const query = `
      ${insertStmt})
      ${valueStmt})
      RETURNING *;
    `;

    const queryConfig = {
      text: query,
      values,
    };

    try {
      const result = await dbQuery(queryConfig);
      return result.rows[0];
    } catch (error) {
      return error;
    }
  }

  async findOne(findQuery) {
    const fields = Object.keys(findQuery);
    const values = Object.values(findQuery);

    let query = `
      SELECT *
      FROM "${this.model}"
      WHERE "deletedAt" IS NULL
    `;

    fields.forEach((field, index) => {
      query = `${query} AND "${field}" = $${index + 1}`;
    });

    query = `${query} LIMIT 1;`;

    const queryConfig = {
      text: query,
      values,
    };

    try {
      const result = await dbQuery(queryConfig);
      const data = result.rows[0];
      return data;
    } catch (error) {
      return error;
    }
  }

  async findAll(findQuery) {
    const fields = Object.keys(findQuery);
    const values = Object.values(findQuery);

    let query = `
      SELECT *
      FROM "${this.model}"
      WHERE "deletedAt" IS NULL
    `;

    fields.forEach((field, index) => {
      query = `${query} AND "${field}" = $${index + 1}`;
    });

    const queryConfig = {
      text: query,
      values,
    };

    try {
      const result = await dbQuery(queryConfig);
      const data = result.rows;
      return data;
    } catch (error) {
      return error;
    }
  }

  async findOrCreate(findQuery, dataToAdd) {
    try {
      let data = await this.findOne(findQuery);

      if (!data) {
        data = await this.create(dataToAdd);
      }

      return data;
    } catch (error) {
      return error;
    }
  }

  async updateOne(updateQuery, updateObject) {
    const values = [];

    let query = `
      UPDATE "${this.model}"
      SET
    `;

    const updateObjectKeys = Object.keys(updateObject);

    Object.entries(updateObject).forEach(([key, value], index) => {
      if (!updateObjectKeys[index + 1]) {
        query = `${query} "${key}" = $${index + 1}`;
      } else {
        query = `${query} "${key}" = $${index + 1},`;
      }

      values.push(value);
    });

    query = `
      ${query}
      WHERE "${this.model}"."deletedAt" IS NULL
    `;

    Object.entries(updateQuery).forEach(([key, value], index) => {
      const queryValueIndex = updateObjectKeys.length + index + 1;
      query = `${query} AND "${this.model}"."${key}" = $${queryValueIndex}`;

      values.push(value);
    });

    query = `
      ${query}
      RETURNING *;
    `;

    const queryConfig = {
      text: query,
      values,
    };

    try {
      const result = await dbQuery(queryConfig);

      return result.rows[0];
    } catch (error) {
      return error;
    }
  }

  async deleteOne(deleteQuery) {
    const fields = Object.keys(deleteQuery);
    const values = Object.values(deleteQuery);

    let query = `
      UPDATE "${this.model}"
      SET "deletedAt" = CURRENT_TIMESTAMP
      WHERE "deletedAt" IS NULL
    `;

    fields.forEach((field, index) => {
      query = `${query} AND "${field}" = $${index + 1}`;
    });

    query = `${query} RETURNING *;`;

    const queryConfig = {
      text: query,
      values,
    };

    try {
      const result = await dbQuery(queryConfig);

      return result.rowCount;
    } catch (error) {
      return error;
    }
  }

  async deleteMany(deleteQuery, collection) {
    const fields = Object.keys(deleteQuery);
    const values = Object.values(deleteQuery);

    let query = `
      UPDATE "${this.model}"
      SET "deletedAt" = CURRENT_TIMESTAMP
      WHERE "deletedAt" IS NULL
    `;

    fields.forEach((field, index) => {
      query = `${query} AND "${field}" = $${index + 1}`;
    });

    const collectionKey = Object.keys(collection);
    const collectionValues = Object.values(collection)[0];

    query = `${query} AND "${collectionKey}" IN (`;

    collectionValues.forEach((value, index) => {
      if (!collectionValues[index + 1]) {
        query = `${query} '${value}')`;
      } else {
        query = `${query} '${value}',`;
      }
    });

    const queryConfig = {
      text: query,
      values,
    };

    try {
      const result = await dbQuery(queryConfig);
      return result.rowCount;
    } catch (error) {
      return error;
    }
  }
}

export default BaseRepository;
