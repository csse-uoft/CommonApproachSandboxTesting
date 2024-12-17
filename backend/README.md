
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

- `bin/`: Contains startup scripts that help initialize and run the application.
  - `www`: Typically the main entry point for running the server. This script sets up the server environment and starts the application listening on a specified port.

- `config/`: Houses configuration files and settings.
  - `index.js`: Main configuration file that loads various application settings, database information and external configurations.

- `helpers/`: A collection of utility functions and helper modules used throughout the backend.
  - `dicts.js`: A file that contains dictionaries and mappings used for various lookup operations.
  - `fetchHelper.js`: Functions facilitating data fetching from external APIs or services.
  - `hasAccess.js`: A helper that determines user permissions based on their roles.
  - `index.js`: An index file that may re-export helper functions for simpler imports.
  - `name2Model.js`: A utility to map dataType names to specific GraphDB Utils models, for dynamic model lookup.
  - `phoneNumber.js`: Functions for formatting and parsing phone numbers.
  - `validator.js`: General validation utilities for ensuring data integrity and correctness.

- `loaders/`: Responsible for initializing and configuring various parts of the application.
  - `express.js`: Loader for setting up Express.js, including middleware, routes, and other Express-related configurations.
  - `graphDB.js`: Functions to load and connect to a GraphDB database.
  - `graphdbParameter.js`: A configuration for parameterizing GraphDB queries and connections.
  - `mongoDB.js`: Logic to establish and manage the connection to a MongoDB database.
  - `namespaces.js`: Configuration for managing namespaces, utilized with GraphDB for RDF data.

