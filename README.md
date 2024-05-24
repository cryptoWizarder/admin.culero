# Culero Backend

## Run the project

Prerequisites:

- [NodeJS](https://nodejs.org/en/)

Steps:

- Install NodeJS dependencies: `npm i`
- Create files named `.common.env`
- The `.common.env` file should contain this line:

## Usefull commands

- Start server with development mode:

```bash
npm run dev
```

- Start server with production mode:

```bash
npm run start
```

## Generators

- Generate `JWT` certificates:

```bash
npm run generate:certs
```

This will generate two file: **es512-private.pem** and **es512-public.pem**. Make sure you have already installed [openssl](https://www.openssl.org/)

- Generate a new schema:

```bash
npm run generate:schema
```

## VSCode snippets

- To initiate a `routes file` use the snippet `routes`
- To add a new route to an existing `routes file` use the snippet `routes:add`
- To add a new method to an existing `route` use the snippet `routes:method`
