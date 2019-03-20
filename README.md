# Acai Backend
[![GitHub release](https://img.shields.io/github/release/cuappdev/acai-backend.svg)](https://github.com/cuappdev/acai-backend/releases)
[![GitHub contributors](https://img.shields.io/github/contributors/cuappdev/acai-backend.svg)](https://github.com/cuappdev/acai-backend/graphs/contributors)
[![Build Status](https://travis-ci.org/cuappdev/acai-backend.svg?branch=master)](https://travis-ci.org/cuappdev/acai-backend)

A project by [Cornell AppDev](http://cornellappdev.com), a project team at Cornell University.

## Installation
This project uses Node.js [See installation guide](https://nodejs.org/en/download/) and Typescript [See installation guide](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html).

Clone the project with
```
git clone https://github.com/cuappdev/acai-backend.git
```

After cloning the project, `cd` into the new directory and install dependencies with
```
npm install
```

After opening the project in your IDE, you can run it using 
```
npm start run
```

### Setting up database:
Make sure `PostgreSQL` is installed. After installation, start `PostgreSQL` and run the command
```
CREATE DATABASE acai;
```
If you get a database error, upon running `npm start` and you already have the database created try
```
DROP DATABASE acai;
CREATE DATABASE acai;
```
Connect to the database by running
```
psql acai
```

### Environment Variables:
It is recommended to use [`autoenv`](https://github.com/kennethreitz/autoenv). The required environment variables for this API are the following:
```bash
export PORT=8000
export ACCESS_TOKEN=FILL_IN
export DB_USERNAME=FILL_IN
export DB_PASSWORD=FILL_IN
export DB_HOST=localhost
export DB_NAME=acai
export DB_PORT=5432
export NODE_ENV=development
```

## Configuration (optional)
We recommend using TSLint (deprecrated) for linting. If you are using VSCode, it can be downloaded directly through the Extensions panel. 
