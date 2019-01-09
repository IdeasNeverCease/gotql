"use strict";



/**
 * Logger to debug information
 * @class Logger
 * @public
 *
 */
class Logger {
  /**
   * Constructs Logger
   * @param {boolean} debug If true, will log
   */
  constructor(debug) {
    this._debug = debug || false;
  }

  /**
   * Logs a message if Debug is true
   * @param {string} message Message to be logged
   */
  log(message) {
    if (this._debug)
      process.stdout.write(message);
  }
}



//  E X P O R T

module.exports = exports = Logger;
