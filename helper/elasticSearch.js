import elasticSearch from 'elasticsearch';
import { logger } from './logger';
import stackTracer from './stackTracer';

const host = process.env.NODE_ENV.match('production')
  ? process.env.BONSAI_URL : process.env.ELASTIC_LOCAL;
const elasticClient = new elasticSearch.Client({
  hosts: [host],
  log: 'info'
});

elasticClient.ping({
  requestTimeout: 30000,
}, (error) => {
  if (error) {
    stackTracer(error);
  } else {
    logger.info('-- Elastic client is still alive --');
  }
});

const checkHealthStatus = () => {
  elasticClient.cluster.health({}, (error, resp) => {
    if (error) stackTracer(error);
    logger.info('-- Elastic client is up and running --', resp);
  });
};

const createIndex = () => {
  elasticClient.indices.create({
    index: 'books'
  }, (error, resp, status) => {
    if (error) {
      stackTracer(error);
      logger.info('-- An Error Occurred creating index', error);
    } else {
      logger.info('-- Index successfully created', resp, status);
    }
  });
};

elasticClient.indices.exists({
  index: 'books'
}, (error, resp) => {
  if (error) logger.info('-- An Error Occurred in indexExists', error);
  if (!resp) {
    createIndex();
  }
});

const createMapping = () => elasticClient.indices.putMapping({
  index: 'books',
  type: 'book',
  body: {
    properties: {
      title: { type: 'text' },
      content: { type: 'text' },
      suggest: {
        type: 'completion',
        analyzer: 'simple',
        search_analyzer: 'standard',
      }
    }
  }
});

const getIndexStatus = () => elasticClient.cat.indices({ v: true })
  .then(logger.info('---Received---'))
  .catch(err => logger.error(`Error connecting to the es elasticClient: ${err}`));

const deleteIndex = (index) => {
  elasticClient.indices.delete({ index }, (error, resp, status) => {
    if (error) return stackTracer(error);
    logger.info('-- Index successfully deleted', resp, status);
  });
};

const addDocument = (index, type) => {
  elasticClient.index({
    index: 'books',
    id: index.id,
    type,
    body: index
  }, (error, resp) => {
    if (error) return stackTracer(error);
    logger.info('---Book added successfully---', resp);
  });
};

const retrieveBook = async (id) => {
  const book = await elasticClient.get({
    index: 'books',
    type: 'book',
    id,
    // body
  }).then(result => result._source) // eslint-disable-line
    .catch((error) => {
      stackTracer(error);
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
    index: 'books',
    type: 'book',
    id,
    body
  }, (error, resp) => {
    if (error) return stackTracer(error);
    logger.info('---Book updated successfully---', resp);
  });
};

const deleteBook = (index, id, type) => {
  elasticClient.delete({
    index,
    id,
    type
  }, (error, resp, status) => {
    if (error) return stackTracer(error);
    logger.info('-- Deleted', resp, status);
  });
};

const getSuggestions = (input) => {
  elasticClient.search({
    index: 'books',
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
    if (error) return stackTracer(error);
    logger.info(resp);
  });
};

const elasticBulkCreate = (bulk) => {
  const data = [];
  bulk.forEach((city) => {
    data.push({
      index: {
        _index: 'books',
        _type: 'book',
        _id: city.id
      }
    });
    data.push(city);
  });

  elasticClient.bulk({ body: data }, (error) => {
    if (error) return stackTracer(error);
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
      type: 'phrase_prefix',
      fields: ['id', 'name', 'description', 'authors', 'genres', 'year', 'userId']
    }
  };

  const body = {
    size,
    from,
    query: !query || !query.length ? matchAll : multiMatch
  };

  const hits = await elasticClient.search({ index: 'books', body, type: 'book' })
    .then(results => results.hits.hits.map(result => result._source)) // eslint-disable-line
    .catch((error) => {
      stackTracer(error);
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
