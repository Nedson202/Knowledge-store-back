import elasticSearch from 'elasticsearch';
import { stackLogger } from 'info-logger';
import logger from '../utils/initLogger';
import {
  info, elasticClientAlive, elasticClientRunning, booksIndex,
  errorCreatingIndex, indexCreated, production, noIndex, elasticMapping,
  phrasePrefix, multimatchFields, bookUpdatedMessage, bookAddedMessage,
  indexDeleted,
} from '../utils/default';

const host = process.env.NODE_ENV.match(production)
  ? process.env.BONSAI_URL : process.env.ELASTIC_LOCAL;
const elasticClient = new elasticSearch.Client({
  hosts: [host],
  log: info
});

elasticClient.ping({
  requestTimeout: 30000,
}, (error) => {
  if (error) {
    stackLogger(error);
  } else {
    logger.info(elasticClientAlive);
  }
});

const checkHealthStatus = () => {
  elasticClient.cluster.health({}, (error, resp) => {
    if (error) stackLogger(error);
    logger.info(elasticClientRunning, resp);
  });
};

const createIndex = () => {
  elasticClient.indices.create({
    index: booksIndex
  }, (error, resp, status) => {
    if (error) {
      stackLogger(error);
      logger.info(errorCreatingIndex, error);
    } else {
      logger.info(indexCreated, resp, status);
    }
  });
};

elasticClient.indices.exists({
  index: booksIndex
}, (error, resp) => {
  if (error) logger.info(noIndex, error);
  if (!resp) {
    createIndex();
  }
});

const createMapping = () => elasticClient.indices.putMapping({
  index: booksIndex,
  type: 'book',
  body: elasticMapping
});

const getIndexStatus = () => elasticClient.cat.indices({ v: true })
  .then(logger.info('---Received---'))
  .catch(err => logger.error(`Error connecting to the es elasticClient: ${err}`));

const deleteIndex = (index) => {
  elasticClient.indices.delete({ index }, (error, resp, status) => {
    if (error) return stackLogger(error);
    logger.info(indexDeleted, resp, status);
  });
};

const addDocument = (index, type) => {
  elasticClient.index({
    index: booksIndex,
    id: index.id,
    type,
    body: index
  }, (error, resp) => {
    if (error) return stackLogger(error);
    logger.info(bookAddedMessage, resp);
  });
};

const retrieveBook = async (id) => {
  const book = await elasticClient.get({
    index: booksIndex,
    type: 'book',
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
    index: booksIndex,
    type: 'book',
    id,
    body
  }, (error, resp) => {
    if (error) return stackLogger(error);
    logger.info(bookUpdatedMessage, resp);
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
    index: booksIndex,
    type: 'book',
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
        _index: booksIndex,
        _type: 'book',
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
      type: phrasePrefix,
      fields: multimatchFields
    }
  };

  const body = {
    size,
    from,
    query: !query || !query.length ? matchAll : multiMatch
  };

  const hits = await elasticClient.search({ index: booksIndex, body, type: 'book' })
    .then(results => results.hits.hits.map(result => result._source)) // eslint-disable-line
    .catch((error) => {
      stackLogger(error);
    });

  return hits;
};

export {
  checkHealthStatus,
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
