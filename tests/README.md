<p align="center"><img src="./wporgassets/banner-772x250.png" /></p>

<h1 align="center"> Revenue Generator by LaterPay </h1>

### Table of Contents
- [Development / Setup Notes](#development-notes)
- [Folder / File Structure](#folder--file-structure)

## Development Notes

##### Please run following commands from the root directory of this repository.

1. Verify availability of `phpunit` executable in your path, e.g `phpunit --version`.
2. Run `./bin/install-wp-tests.sh revenue_generator_test <db-name> <db-user> <db-pass> <db-host>` to setup testing environment on your machine.
3. Run `phpunit` from repositories root directory to run all test suites.
4. Run `phpunit tests/inc/classes/test-class-plugin.php` from repositories root directory to run test on given class.
5. Add changes or create test classes appropriately based on code.

## Folder / File Structure

```text
tests
├── class-unit-test-bootstrap.php  ( PHPUNIT Test Bootstrap )
├── helpers                        ( Common helper classes )
│   └── class-utility.php
└── inc                            ( Tests for classes in project added in similar folder structure )
    └── classes
        ├── test-class-config.php
        ├── test-class-plugin.php
```
