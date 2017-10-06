import { Platform } from 'react-native';
import {
  LOG_INFO,
  LOG_ERRORS,
  LOG_WARNINGS,
  LOG_VERBOSE,
  LOG_DEBUG,
  LOG_EVENTS,
  LOG_CLOUD,
  LOG_BLE,
  LOG_MESH,
  LOG_STORE,
  LOG_SCHEDULER,
  TESTING_APP,
  RELEASE_MODE_USED,
} from '../ExternalConfig'
import {LogProcessor} from "./LogProcessor";
import {logToFile} from "./LogUtil";
import {LOG_LEVEL} from "./LogLevels";


class Logger {
  level : number;
  
  constructor(level) {
    this.level = level;
  }
  
  info(...any) {
    this._log('------------', LOG_INFO,      LogProcessor.log_info, arguments);
  }

  verbose(...any) {
    this._log('VERBOSE ----', LOG_VERBOSE,   LogProcessor.log_verbose, arguments);
  }

  warn(...any) {
    this._log('WARNING ! --', LOG_WARNINGS,  LogProcessor.log_warnings, arguments);
  }

  event(...any) {
    this._log('EVENT ------', LOG_EVENTS,    LogProcessor.log_events, arguments);
  }

  error(...any) {
    this._log('ERROR !!! --', LOG_ERRORS,    LogProcessor.log_errors, arguments);
  }

  debug(...any) {
    this._log('Debug ------', LOG_DEBUG,     LogProcessor.log_debug, arguments);
  }

  cloud(...any) {
    this._log('Cloud ------', LOG_CLOUD,     LogProcessor.log_cloud, arguments);
  }

  ble(...any) {
    this._log('BLE --------', LOG_BLE,       LogProcessor.log_ble, arguments);
  }

  store(...any) {
    this._log('Store ------', LOG_STORE,     LogProcessor.log_store, arguments);
  }

  scheduler(...any) {
    this._log('Scheduler --', LOG_SCHEDULER, LogProcessor.log_scheduler, arguments);
  }

  mesh(...any) {
    this._log('Mesh -------', LOG_MESH,      LogProcessor.log_mesh, arguments);
  }

  _log(type, globalCheckField, dbCheckField, allArguments) {
    if (Math.min(globalCheckField, dbCheckField) <= this.level) {

      let args = ['LOG ' + type + ' :'];
      for (let i = 0; i < allArguments.length; i++) {
        let arg = allArguments[i];
        if (TESTING_APP) {
          if (typeof arg === 'object') {
            try {
              arg = JSON.stringify(arg, undefined, 2);
            }
            catch(err) {
              // ignore
            }
          }
        }
        args.push(arg);
      }
      logToFile.apply(this, args);

      if (RELEASE_MODE_USED === false || TESTING_APP) {
        console.log.apply(this, args);
      }
    }
  }
}


export const LOGv   = new Logger(LOG_LEVEL.verbose);
export const LOGd   = new Logger(LOG_LEVEL.debug  );
export const LOGi   = new Logger(LOG_LEVEL.info   );
export const LOG    = new Logger(LOG_LEVEL.info   );
export const LOGw   = new Logger(LOG_LEVEL.warning);
export const LOGe   = new Logger(LOG_LEVEL.error  );

