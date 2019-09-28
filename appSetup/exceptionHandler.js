import { stackLogger } from 'info-logger';
import {
  UNHANDLED_EXCEPTION,
  UNCAUGHT_EXCEPTION, SIGTERM
} from '../settings/default';

process.on(UNHANDLED_EXCEPTION, (reason) => {
  stackLogger(reason);
});

process.on(UNCAUGHT_EXCEPTION, (reason) => {
  stackLogger(reason);
  process.exit(0);
});

process.on(SIGTERM, () => {
  process.exit(0);
});
