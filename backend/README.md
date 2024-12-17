
# Common Approach Sandbox Backend
---
## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Structure](#structure)
---
## Introduction
The backend is built using a robust combination of JavaScript, Express.js, and Node.js

---

## Installation
#### Install dependencies
```shell
npm install -g yarn
yarn install
```

#### Copy `.env` to `./backend/.env`
> `.env` includes credentials for mailing server.

#### Start GraphDB
```shell
 docker run -p 7200:7200 -d --name graphdb --restart unless-stopped -t ontotext/graphdb:10.0.2 --GDB_HEAP_SIZE=6G -Dgraphdb.workbench.maxUploadSize=2097152000
```

#### Start MongoDB
```shell
docker run --name mongo -p 27017:27017 --restart unless-stopped -d mongo:latest
```

#### Start Backend
```shell
yarn start
```
---

## Structure

- `bin/`
  - `www/`: 
