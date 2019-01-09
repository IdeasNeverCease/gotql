"use strict";



//  I M P O R T S

import describe from "ava";
import sinon from "sinon";

//  U T I L

import Logger from "../src/modules/logger";



//  T E S T S

describe("Should print a message when debug is true", assert => {
  const log = new Logger(true);
  const oldcons = process.stdout.write;

  process.stdout.write = sinon.spy();

  log.log("test");
  assert.true(process.stdout.write.called);

  process.stdout.write = oldcons;
});

// ——— //

describe("Should not print a message when debug is false", assert => {
  const log = new Logger(false);
  const oldcons = process.stdout.write;

  process.stdout.write = sinon.spy();

  log.log("test");
  assert.false(process.stdout.write.called);

  process.stdout.write = oldcons;
});
