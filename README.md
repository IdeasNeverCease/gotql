# @inc/gotql

> Write GraphQL queries as objects instead of strings

*Forked from [khaosdoctor/gotql](https://github.com/khaosdoctor/gotql) because I did not feel like waiting nearly four months for [my PR](https://github.com/khaosdoctor/gotql/pull/5) to be accepted and I had things to do.*

[![Vulnerabilities in this package](https://snyk.io/test/npm/@inc/gotql/badge.svg?style=flat-square)](https://snyk.io/test/npm/@inc/gotql)

<!--/ Gitea does not display SVGs...STILL
  ![GotQL logo](https://git.inc.sh/IdeasNeverCease/gotql/raw/branch/master/media/gotql.svg)
/-->

<br/>

This is a better implementation of the [GraphQL](https://github.com/facebook/graphql) query API via NodeJS, created as a wrapper of [Got](http://github.com/sindresorhus/got). It works like a transpiler, with a built in HTTPRequest Client (Got), allowing you to write your GraphQL queries as Javascript Objects instead of strings.

Built because manipulating strings is a real pain.

# Table of Contents

<!-- TOC -->

- [Table of Contents](#table-of-contents)
  - [Install](#install)
  - [Basic Usage](#basic-usage)
  - [What is it?](#what-is-it)
    - [Motivation](#motivation)
  - [API](#api)
    - [Returns](#returns)
  - [The JSON query format](#the-json-query-format)
    - [Description](#description)
    - [Examples](#examples)
      - [Simple query](#simple-query)
      - [Named query](#named-query)
      - [Query with simple args](#query-with-simple-args)
      - [Query with variables](#query-with-variables)
      - [Nested fields](#nested-fields)
      - [Enum args](#enum-args)
  - [Contributing to this project](#contributing-to-this-project)

<!-- /TOC -->

## Install

```sh
$ npm i @inc/gotql
```

## Basic Usage

```js
import gotQl from "gotql";

const query = {
  operation: {
    name: "users",
    fields: [
      "age",
      "id",
      "name"
    ]
  }
};

const options = {
  debug: false,
  headers: {
    "Authorization": "Bearer <token>"
  }
};

gotQL.query("mygraphqlendpoint.com.br/api", query, options)
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

## What is it?

GotQL is a better interface for GraphQL queries. It provides a way for developers to run queries using JSON instead of strings. Which is a way more usable data format than the string itself.

### Motivation

Manipulating strings is very smelly, even on dynamically typed languages. So, in order to avoid things such as this:

![](https://git.inc.sh/IdeasNeverCease/gotql/raw/branch/master/media/motivation.png)

Which can be translated to something more readable in a JSON format like this:

```js
const mutation = {
  operation: {
    name: "addLog",
    args: {
      fromState: variables.fromState,
      idCampaign: variables.idCampaign,
      idUser: variables.idUser,
      logType: {
        escape: false,
        value: "status_change"
      }, // Enum Value
      owner: {
        id: variables.id,
        name: variables.name,
        ownerType: variables.ownerType,
        picture: variables.picture,
        username: variables.username
      },
      toState: variables.toState
    },
    fields: [
      "uuid"
    ]
  }
};
```

This is why GotQL was created.

## API

```js
gotQl.query(graphQLEndpoint, query, [options]);
```

- **Description**: Performs a graphQL query

**GraphQLEndpoint**

- Type: `string`
- Description: The GraphQL endpoint to query on

**query**

- Type: `object`
- Description: The JSON-typed query following the [json-query format](#the-json-query-format)

**options**

- Type: `object`
- Description: The option object with the following properties.
  - _debug_: Activates debug logging
    - Type: `boolean`
  - _errorStatusCode_: Default HTTP status code to be returned on error
    - Type: `number`
  - _headers_: Additional headers to be sent
    - Type: `object`, in the form of `[headerName: string]: headerValue: string`

---

```js
gotQl.mutation(graphQLEndpoint, query, [options]);
```

- **Description**: Performs a graphQL mutation

**GraphQLEndpoint**

- Type: `string`
- Description: The GraphQL endpoint to query on

**query**

- Type: `object`
- Description: The JSON-typed query following the [json-query format](#the-json-query-format)

**options**

- Type: `object`
- Description: The option object with the following properties.
  - _debug_: Activates debug logging
    - Type: `boolean`
  - _errorStatusCode_: Default HTTP status code to be returned on error
    - Type: `number`
  - _headers_: Additional headers to be sent
    - Type: `object`, in the form of `[headerName: string]: headerValue: string`

---

```js
gotQl.parser(query, type);
```

- **Description**: Parses a JSON-Like query and returns the query"s string

**query**

- Type: `object`
- Description: The JSON-typed query following the [json-query format](#the-json-query-format)

**type**

- Type: `string`
- Description: Must be either `"query"` or `"mutation"`

### Returns

All methods return a `string` like this:

```js
const response = "query { test { name args } }";
```

## The JSON query format

The JSON format gotQL uses is a simple and intuitive description based on the [anatomy of a GraphQL query](https://dev-blog.apollodata.com/the-anatomy-of-a-graphql-query-6dffa9e9e747) blog post.

This is a generic model of a JSONLike query:

```js
const query = {
  name?: string;
  operation: {
    name: string;
    alias?: string;
    args?: {
      [argName: string]: any;
    } | {
      [argName: string]: {
        escape: boolean;
        value: string;
      };
    };
    fields: (string | {
      [fieldName: string]: [{
        fields?: (string | {
          [fieldName: string]: [any];
        })[];
      }];
    })[];
  };
  variables?: {
    [varName: string]: {
      type: string;
      value: string;
    };
  };
};
```

### Description

- Query:
  - Type: `object`
  - Description: The full query object
  - Properties:
    - _name_: [optional]: Query name
      - Type: `string`
    - _variables_: [optional] Query variable declaration
      - Type: `object` with signature like `[varName: string]: { type: string, value: string }`
      - Properties:
        - _varName_: Variable name
          - Type: `string`
        - _type_: Variable type. Can be a GraphQL definition of type (i.e: `string!`)
          - Type: `string`
        - _value_: Variable value
          - Type: `any`
    - _operation_: The query operation (action that will be executed)
      - Type: `object`
      - Properties:
        - _name_: The operation name
          - Type: `string`
        - _alias_: [optional] An alias to give the operation
          - Type: `string`
        - _args_: [optional] The operation args
          - Type: `[argName: string]: any` or a detailed arg object
            - **_Simple args_**: An `object` where the key is the argument name and its value. Accepts variables in the format of `argName: "$value"`
              - Example: `args { name: "myName" }`
            - **_Detailed args_**: An object with two properties. This will give more control over escaping (mostly to use enums). Argument name should be the key
              - Type: `object`
              - Properties:
                - _value_: The argument value
                  - Type: `any`
                - _escape_: Whether the argument should be escaped or not (escaped means surrounded with double quotes `"argValue"`)
                  - Type: `boolean`
              - Examples: `args: { status: { value: "an_enum", escape: false } }` should output `operation (status: an_enum)...`
        - _fields_: The field list to get back from the operation
          - Type: An `array` of `object` (to use nested fields) or `string`, or both.
          - Properties (for nested fields):
            - Type: `object` where the field name is the key
            - _fields_: Recursive definition, accepts another array just like the _fields_ above.

### Examples

#### Simple query

```js
const query = {
  operation: {
    name: "users",
    fields: [
      "age",
      "name"
    ]
  }
};
```

Outputs:

```js
query { users { name age }}
```

#### Named query

```js
const query = {
  name: "myQuery",
  operation: {
    name: "users",
    fields: [
      "age",
      "name"
    ]
  }
};
```

Outputs:

```js
query myQuery { users { name age }}
```

#### Query with simple args

```js
const query = {
  operation: {
    name: "user",
    args: {
      name: "T'Challa"
    },
    fields: [
      "age",
      "name"
    ]
  }
};
```

Outputs:

```js
query { user(name: "T'Challa") { name age }}
```

#### Query with variables

```js
const query = {
  operation: {
    name: "user",
    args: {
      name: "$name"
    },
    fields: [
      "age",
      "name"
    ]
  },
  variables: {
    name: {
      type: "string!",
      value: "T'Challa"
    }
  }
};
```

Outputs:

```js
query ($name: string!) { users(name: $name) { name age }}
```

Variables are sent on a separate object to graphQL.

```json
{
  "variables": {
    "name": "T'Challa"
  }
}
```

#### Nested fields

```js
const query = {
  operation: {
    name: "users",
    fields: [
      "age",
      "name",
      {
        friends: {
          fields: [
            "age",
            "name"
          ]
        }
      }
    ]
  }
};
```

Outputs:

```js
query { users { name age friends { name age }}}
```

Recursive fields can go forever.

#### Enum args

```js
const query = {
  operation: {
    name: "user",
    args: {
      type: {
        escape: false,
        value: "internal"
      }
    },
    fields: [
      "age",
      "name"
    ]
  }
};
```

Outputs:

```js
query { users(type: internal) { name age }}
```

If `escape` is set to `true`, the output would be:

```js
query { users(type: "internal") { name age }}
```

> **Note:** Variables such as described [here](#query-with-variables) _will **not**_ be recognized. If the arg object is not an `[argName]: value`, variables will not pass through the definition check (GotQL warns if a variable is not declared but used on operation).
