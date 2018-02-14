#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const colors = require('colors');

const rootpath = process.cwd();

const fileName = process.argv[2];

// if (!process.env.SERVER_HOST) {
//   console.log(
//     colors.red.bold('Error: '),
//     colors.red(
//       "Pass the this server's host as SERVER_HOST environment variable along with protocol to use. Eg: http://localhost:3002",
//     ),
//   );
//   process.exit(1);
// }

if (!fileName) {
  console.log(colors.red.bold('Error: '), colors.red('Pass the file name as the first argument'));
  process.exit(1);
}

const filePath = path.join(rootpath, fileName);

if (!fs.existsSync(filePath)) {
  console.log(colors.red.bold('Error: ENOENT: '), colors.red(`File ${filePath} not found`));
  process.exit(1);
}

if (path.extname(filePath) !== '.json') {
  console.log(
    colors.red.bold('Error: '),
    colors.red(`File ${filePath} is not a JSON file. We support only .json files for now.`),
  );
  process.exit(1);
}

// const splits = process.env.SERVER_HOST.split('://');
// const scheme = splits[0];
// const host = splits[1];

// if (!['http', 'https'].includes(scheme)) {
//   console.log(
//     colors.red.bold('Erorr:'),
//     colors.red("API protocol should be one of ['http', 'https']"),
//   );
//   process.exit(1);
// }

const originalContent = require(filePath);

const { paths } = originalContent;

const fixedObject = JSON.parse(JSON.stringify(originalContent));

fixedObject.schemes = ["https", "http"];
// fixedObject.host = host;

Object.keys(paths).forEach(_path => {
  const methods = Object.keys(paths[_path]);
  methods.forEach(method => {
    const verb = method;
    const obj = paths[_path][verb];
    const { tags, summary, operationId, parameters, responses, deprecated } = obj;
    const modelName = tags[0];
    const newOperationId = operationId.replace(`${modelName}.`, '');
    obj.operationId = newOperationId;
  });
});

fixedObject.paths = paths;

fs.writeFileSync(filePath, JSON.stringify(fixedObject, null, 2));

console.log(colors.green('Finished'));

process.exit(0);
