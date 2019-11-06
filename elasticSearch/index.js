import elasticSearch from 'elasticsearch';
import { stackLogger } from 'info-logger';
import dotenv from 'dotenv';
import logger from '../utils/initLogger';
import {
  info, ELASTIC_CLIENT_ALIVE, ELASTIC_CLIENT_RUNNING, BOOKS_INDEX,
  ERROR_CREATING_INDEX, INDEX_CREATED_MESSAGE, PRODUCTION, NO_INDEX, ELASTIC_SEARCH_MAPPING,
  PHRASE_PREFIX, MULTI_MATCH_FIELDS, BOOK_UPDATED_MESSAGE, BOOK_ADDED_MESSAGE,
  INDEX_DELETED_MESSAGE,
  BOOK,
} from '../settings';

dotenv.config();

const host = process.env.NODE_ENV.match(PRODUCTION)
  ? process.env.BONSAI_URL : process.env.ELASTIC_LOCAL;

const elasticClient = new elasticSearch.Client({
  hosts: [host],
  log: info
});

elasticClient.ping({
  requestTimeout: 50000,
}, (error) => {
  if (error) {
    stackLogger(error);
  } else {
    logger.info(ELASTIC_CLIENT_ALIVE);
  }
});

const elasticClientHealthCheck = () => {
  elasticClient.cluster.health({}, (error, resp) => {
    if (error) stackLogger(error);
    logger.info(ELASTIC_CLIENT_RUNNING, resp);
  });
};

const createIndex = () => {
  elasticClient.indices.create({
    index: BOOKS_INDEX
  }, (error, resp, status) => {
    if (error) {
      stackLogger(error);
      logger.info(ERROR_CREATING_INDEX, error);
    } else {
      logger.info(INDEX_CREATED_MESSAGE, resp, status);
    }
  });
};

elasticClient.indices.exists({
  index: BOOKS_INDEX
}, (error, resp) => {
  if (error) logger.info(NO_INDEX, error);
  if (!resp) {
    createIndex();
  }
});

const createMapping = () => elasticClient.indices.putMapping({
  index: BOOKS_INDEX,
  type: BOOK,
  body: ELASTIC_SEARCH_MAPPING,
  include_type_name: true,
});

const getIndexStatus = () => elasticClient.cat.indices({ v: true })
  .then(logger.info('---Received---'))
  .catch(err => logger.error(`Error connecting to the es elasticClient: ${err}`));

const deleteIndex = (index) => {
  elasticClient.indices.delete({ index }, (error, resp, status) => {
    if (error) return stackLogger(error);
    logger.info(INDEX_DELETED_MESSAGE, resp, status);
  });
};

const addDocument = (index, type) => {
  elasticClient.index({
    index: BOOKS_INDEX,
    id: index.id,
    type,
    body: index
  }, (error, resp) => {
    if (error) return stackLogger(error);
    logger.info(BOOK_ADDED_MESSAGE, resp);
  });
};

const retrieveBook = async (id) => {
  const book = await elasticClient.get({
    index: BOOKS_INDEX,
    type: BOOK,
    id,
  }).then(result => result._source) // eslint-disable-line
    .catch((error) => {
      stackLogger(error);
    });

  return book;
};

const updateBook = async (data) => {
  const { id } = data;
  delete (data.id); // eslint-disable-line

  const body = {
    doc: data
  };

  elasticClient.update({
    index: BOOKS_INDEX,
    type: BOOK,
    id,
    body
  }, (error, resp) => {
    if (error) return stackLogger(error);
    logger.info(BOOK_UPDATED_MESSAGE, resp);
  });
};

const deleteBook = (index, id, type) => {
  elasticClient.delete({
    index,
    id,
    type
  }, (error, resp, status) => {
    if (error) return stackLogger(error);
    logger.info('-- Deleted', resp, status);
  });
};

const getSuggestions = (input) => {
  elasticClient.search({
    index: BOOKS_INDEX,
    type: BOOK,
    body: {
      docsuggest: {
        text: input,
        completion: {
          field: 'suggest',
          fuzzy: true
        }
      }
    }
  }, (error, resp) => {
    if (error) return stackLogger(error);
    logger.info(resp);
  });
};

const elasticBulkCreate = (bulk) => {
  const data = [];
  bulk.forEach((item) => {
    data.push({
      index: {
        _index: BOOKS_INDEX,
        _type: BOOK,
        _id: item.id
      }
    });
    data.push(item);
  });

  elasticClient.bulk({ body: data }, (error) => {
    if (error) return stackLogger(error);
    logger.info('Successfully imported %s'.yellow, bulk.length);
  });
};

const elasticItemSearch = async (query, paginateData) => {
  const { from, size } = paginateData;
  const matchAll = {
    match_all: {}
  };

  const multiMatch = {
    multi_match: {
      query,
      type: PHRASE_PREFIX,
      fields: MULTI_MATCH_FIELDS
    }
  };

  const body = {
    size,
    from,
    query: !query || !query.length ? matchAll : multiMatch
  };

  const hits = await elasticClient.search({ index: BOOKS_INDEX, body, type: BOOK })
    .then(results => results.hits.hits.map(result => result._source)) // eslint-disable-line
    .catch((error) => {
      stackLogger(error);
    });

  return hits;
};

export {
  elasticClientHealthCheck,
  createMapping,
  elasticClient,
  deleteBook,
  addDocument,
  deleteIndex,
  getIndexStatus,
  getSuggestions,
  elasticBulkCreate,
  elasticItemSearch,
  updateBook,
  retrieveBook
};
