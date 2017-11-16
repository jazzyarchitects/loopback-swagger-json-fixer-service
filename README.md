# Loopback Swagger Json Fixer

The swagger spec generator provided by ``` slc ``` creates a json object which does not work properly with **loopback-connector-swagger**.  

Running index.js of this module will fix the corresponding swagger spec.

## Pre-requisites
1. Swagger spec should be in JSON format only. It should have .json extension

## What it does?

The problem with the loopback swagger generator is that the operationId inside each path is given as ``` ModelName.functionName ``` whereas the loopback-connector-swagger requires the operationId in the form of ``` functionName ```. This script fixes this mismatch.

## How to install

```shell
  $ yarn add loopback-swagger-json-fixer-service
```

## Example

First you need to create a swagger api spec using the slc swagger functinoality:
```shell
  $ slc loopback:export-api-def --o swagger.json
```

The run the following module on the produced json file
```shell
  $ node node_modules/loopback-swagger-json-fixer-service/index.js swagger.json
```

This will fix and replace the swagger.json file.

The file path is relative to process.cwd()
