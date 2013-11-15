# Overview of Tests

Tests are built using Isaac node-tap and are simple assertions

## Setting up Test

There is a chance you may need to do some additional work to get the tests to run

First you may need to create logfile in each mongodb path

    touch mongod-confs/mongo_test_single_a_db/logfile
    touch mongod-confs/mongo_test_single_b_db/logfile

## Running Tests

### Run the mongodb test dbs

There are several `conf` files in the `test/mongod-confs/` folder.  First there are two stand alone single mongod nodes and then a replica-set.

Most of the tests are written for the stand alone single mongod nodes and those are the ones you will need in order to run the test suite.

    # run the single mongod servers
    mongod -f mongod-confs/mongoose-fixture-single-a-conf
    mongod -f mongod-confs/mongoose-fixture-single-b-conf

    # run the replica set servers
    mongod -f mongoose-fixture-replica-a-conf
    mongod -f mongoose-fixture-replica-b-conf
    mongod -f mongoose-fixture-replica-c-conf

The single node mongod run as forked instances on port 27999 and 27998 respectively.  To shut down once started you need to connect with `mongo`
and issue a shutdown using `db.shutdownServer()`

### Run the tests

The tap cli is linked to the npm package.json

    npm test

Or you can run the command which will execute all tests in the directory

    tap ./test

### Misc Notes

It is helpful to write tests and then use them for development of new features.  An example is the creation of the `--remove` error handler.  Wrote the test first then using the testing framework I'd run

   mongoose-fixture --configFile='mongoose-fixture-config-mock.js' --fixture='brokenRemove' --reset
