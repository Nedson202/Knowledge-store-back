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

class ElasticSearch {
  constructor() {
    this.elasticClient = {};

    this.init();
  }

  /**
   *
   * Creates elastic search client, index, mapping
   * @memberof ElasticSearch
   */
  init() {
    this.createClient();
    this.initIndex();
    this.elasticClientHealthCheck();
    this.createMapping();
  }

  /**
   *
   *
   * @memberof ElasticSearch
   */
  initIndex() {
    this.elasticClient.indices.exists({
      index: BOOKS_INDEX
    }, (error, resp) => {
      if (error) logger.info(NO_INDEX, error);

      if (!resp) {
        this.createIndex();
      }
    });
  }

  /**
   *
   *
   * @returns host
   * @memberof ElasticSearch
   */
  getHost() {
    return process.env.NODE_ENV.match(PRODUCTION)
      ? process.env.BONSAI_URL : process.env.ELASTIC_LOCAL;
  }

  /**
   *
   * Creates elastic search client
   * @memberof ElasticSearch
   */
  createClient() {
    const elasticClient = new elasticSearch.Client({
      hosts: [this.getHost()],
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

    this.elasticClient = elasticClient;
  }

  /**
   *
   * handles cluster health check
   * @memberof ElasticSearch
   */
  elasticClientHealthCheck = () => {
    this.elasticClient.cluster.health({}, (error, resp) => {
      if (error) stackLogger(error);
      logger.info(ELASTIC_CLIENT_RUNNING, resp);
    });
  };

  /**
   *
   * Creates specified index
   * @memberof ElasticSearch
   */
  createIndex = () => {
    this.elasticClient.indices.create({
      index: BOOKS_INDEX,
      include_type_name: true,
    }, (error, resp, status) => {
      if (error) {
        stackLogger(error);
        logger.info(ERROR_CREATING_INDEX, error);
      } else {
        logger.info(INDEX_CREATED_MESSAGE, resp, status);
      }
    });
  };

  /**
   *
   *
   * @memberof ElasticSearch
   */
  createMapping = () => this.elasticClient.indices.putMapping({
    index: BOOKS_INDEX,
    type: BOOK,
    body: ELASTIC_SEARCH_MAPPING,
    include_type_name: true,
  });

  /**
   *
   *
   * @param {*} index
   * @memberof ElasticSearch
   */
  deleteIndex = (index) => {
    this.elasticClient.indices.delete({ index }, (error, resp, status) => {
      if (error) return stackLogger(error);

      logger.info(INDEX_DELETED_MESSAGE, resp, status);
    });
  };

  /**
   *
   *
   * @param {*} index
   * @param {*} type
   * @memberof ElasticSearch
   */
  addDocument = (index, type) => {
    this.elasticClient.index({
      index: BOOKS_INDEX,
      id: index.id,
      type,
      body: index
    }, (error, resp) => {
      if (error) return stackLogger(error);

      logger.info(BOOK_ADDED_MESSAGE, resp);
    });
  };

  /**
   *
   *
   * @param {*} id
   * @returns
   * @memberof ElasticSearch
   */
  retrieveBook = async (id) => {
    const book = await this.elasticClient.get({
      index: BOOKS_INDEX,
      type: BOOK,
      id,
    }).then(result => result._source) // eslint-disable-line
      .catch((error) => {
        stackLogger(error);
      });

    return book;
  };

  /**
   *
   *
   * @param {*} data
   * @memberof ElasticSearch
   */
  updateBook = async (data) => {
    const { id } = data;
    delete (data.id); // eslint-disable-line

    const body = {
      doc: data
    };

    this.elasticClient.update({
      index: BOOKS_INDEX,
      type: BOOK,
      id,
      body
    }, (error, resp) => {
      if (error) return stackLogger(error);
      logger.info(BOOK_UPDATED_MESSAGE, resp);
    });
  };

  /**
   *
   *
   * @param {*} index
   * @param {*} id
   * @param {*} type
   * @memberof ElasticSearch
   */
  deleteBook = (index, id, type) => {
    this.elasticClient.delete({
      index,
      id,
      type
    }, (error, resp, status) => {
      if (error) return stackLogger(error);
      logger.info('-- Deleted', resp, status);
    });
  };

  /**
   *
   *
   * @param {*} bulk
   * @memberof ElasticSearch
   */
  elasticBulkCreate = (bulkData) => {
    const data = [];

    bulkData.forEach((item) => {
      data.push({
        index: {
          _index: BOOKS_INDEX,
          _type: BOOK,
          _id: item.id
        }
      });
      data.push(item);
    });

    this.elasticClient.bulk({
      body: data
    }, (error) => {
      if (error) return stackLogger(error);

      logger.info('Successfully imported %s'.yellow, bulkData.length);
    });
  };

  /**
   *
   *
   * @param {*} query
   * @param {*} paginateData
   * @returns hits
   * @memberof ElasticSearch
   */
  search = async (query, paginateData) => {
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

    const hits = await this.elasticClient.search({
      index: BOOKS_INDEX,
      body,
      type: BOOK
    })
      .then(results => results.hits.hits.map(result => result._source)) // eslint-disable-line
      .catch((error) => {
        stackLogger(error);
      });

    return hits;
  };
}

export default ElasticSearch;
