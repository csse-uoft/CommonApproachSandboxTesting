
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

- `models/`
  - `logging/`: A dedicated subdirectory for storing data models used to log information into MongoDB.
    - `api.js`: A Mongoose model for storing API-related information in a MongoDB database.
    - `errorLogging.js`: A Mongoose model for logging errors, designed to persist error details in MongoDB.

  *(All other files in the models/ directory contain GraphDB utility models. Each file is named according to its primary model and contains that model as well as any closely related, less frequently used models.)*

- `routes/`: Houses server-side route definitions, organizing endpoints that the application exposes.
  - `baseRoute/`
    - `base.js`: Defines fundamental routes that do not require authorization for user access.

  - `general/`: Contains general-purpose route files that may not fit into more specific categories.
    - `dynamicClassInstances.js`: Routes handling dynamic class instance operations.
    - `generalUserRoute.js`: Routes related to general user operations, including generic user management and data retrieval.
    - `index.js`: An index file to import and re-export the routes defined in this folder.
    - `profiles.js`: Routes for managing user profiles including resetting passwords and security questions.
    - `userTypes.js`: Routes for retrieving different user types.
      
  *(All other files at this level define routes for specific data types and functionalities indicated by their filenames. For example:)*
 
  - `characteristic.js` / `characteristics.js`: Routes related to characteristics.
  - `code.js` / `codes.js`: Routes related to codes.
  - `dataDashboard.js`: Routes for data dashboards (aggregated data views).
  - `dataExport.js`: Routes that handle exporting data from the system.
  - `errorReport.js`: Routes for logging issues.
  - `fileUploading.js`: Routes for handling file uploads and related operations.

 - `services/`: Contains end-point functions that perform operations and data manipulation, interacting with models and external sources to implement the application's core functionalities.

  *(Note: Folders named after data types typically contain three or less files following a specific pattern:*
  
  - *`dataType/`*
    - *`dataType.js`: Core logic for handling a single object of that data type.*
    - *`dataTypeBuilder.js`: Utilities for constructing, assembling, and updating data type objects, accessible via the interface API or file uploading API.*
    - *`dataTypes.js`: Functions and operations dealing with multiple objects of that data type.*
     
  *`characteristic/`,  `code/`, `dataset/` and other folders named after data types adhere to this pattern.)*
  
  *Only files that do not follow this pattern are listed below.*
  
  - `address/`: Services related to address data handling.
    - `index.js`: An entry point file that may aggregate and re-export address-related services.
    - `streetDirections.js`: Logic for handling street direction data (e.g., N, S, E, W).
    - `streetTypes.js`: Services defining various street types (e.g., Road, Avenue, Boulevard).
  
  - `dataDashboard/`: Services for data dashboards (aggregated data views).
    - `dataDashboard.js`: Logic for handling data retrieval to create data dashboards.

  - `dataExport/`
    - `dataExport.js`: Core logic and functions to handle data export operations.

  - `errorReport/`
    - `frontendErrorReport.js`: Logic or utilities specifically dealing with front-end error reporting and routing that data for storage.

  - `fileUploading/`: Handles various file uploading functionalities.
    - `configs.js`: Configuration settings and parameters for file uploading, specifying how the sandbox handles files (e.g., issuing warnings or rejecting them) based on missing properties in the file.
    - `fileUploading.js`: Core logic for handling file uploads.
    - `fileUploadingDirectly.js`: Specialized logic for direct file uploads with out any checking.
    - `fileUploadingHander.js`: Handler utility for managing and processing different types of file uploads.
    - `fileUploadingMultiSubArray.js`: Logic for handling file uploads that involve multiple organizations.



