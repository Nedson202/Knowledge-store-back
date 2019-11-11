# The Knowledge store server
The knowledge store is a book archive project leveraging the Google Books API to introduce you to thousands of books. On this platform, you can search and filter books using full text search, bookmark books, make your book visible, leave reviews etc.

# Table of Contents
* [Features](https://github.com/Nedson202/Knowledge-store-back#features)
* [Technologies](https://github.com/Nedson202/Knowledge-store-back#technologies)
* [Installation Setup](https://github.com/Nedson202/Knowledge-store-back#installation-setup)
* [Usage](https://github.com/Nedson202/Knowledge-store-back#usage)
* [Language](https://github.com/Nedson202/Knowledge-store-back#language)
* [Dependencies](https://github.com/Nedson202/Knowledge-store-back#dependencies)
* [License](https://github.com/Nedson202/Knowledge-store-back#license)

## Features
* Login
* Sign up
* Social authentication(facebook, google)
* View book catalog and book profiles
* Add and remove reviews and replies
* Get similar book(s) recommendation
* Like reviews
* Add books
* Mark books as favorites
* Remove book and multiple books from favorites
* View your books and those marked as favorites
* Update profile information
* Reset password
* Signup and password reset verification support
* Get a list of genres(mobile support)
* One time password verification(mobile support)

## Technologies
* Node.js
* Express-graphql
* Elasticsearch
* Redis
* Google Books API
* PostgreSQL
* SendGrid

## Installation Setup
Breakdown of environment variables for .env
```
NODE_ENV - development, production, test, etc.
```

```
DB_USERNAME - Postgres database user
DB_PASSWORD - Postgres database password
DB_NAME - Postgres database name
FAKE_PASSWORD - This value is hashed and is used to seed the user table with active user information and hashed password
DATABASE_URL - Remote postgres database environment
```

```
SECRET - JWT secret
EXPIRES_IN - Expiration time for generated JWT tokens. e.g 1h
```

```
SENDGRID_API_KEY - Developer API key from sendgrid, API Keys - https://sendgrid.com/docs/API_Reference/Web_API_v3/API_Keys/index.html
SENDER - Email host - e.g Lorester Bookstore. All emails have this as its recipient
```

```
FACEBOOK_APPID=
FACEBOOK_APPSECRET=
FACEBOOK_CALLBACKURL=
GOOGLE_CALLBACKURL=
GOOGLE_CLIENTID=
GOOGLE_CLIENTSECRET=
```

```
SUPER_ADMIN - To experiment with super admin features you need to check out the mutation schema in the grapqhl editor. This field only has support for array of emails in the database which you want to grant super admin permission e.g [email@example.com]
```

```
PROD_SERVER - Hosted environment for this project
```

```
GOOGLE_BOOKS_KEY - Google Books API key https://developers.google.com/books/docs/v1/using
```

```
BONSAI_URL - Remote elasticsearch host, uses Bonsai Heroku addon
ELASTIC_LOCAL - Local elasticsearch host
```

```
REDIS_URL - Remote redis host
REDIS_LOCAL - Development redis host. This can be a local redis installation or an online host
```

* **Clone repo:**

  Open **CMD(command prompt)** for windows users, or any other terminal you use.

  ```
    git clone https://github.com/Nedson202/Knowledge-store-back.git
  ```

* **Start app:**

  * Create a .env file in the root directory of the codebase
  * Copy the content of the .env.sample file and add their corresponding values appropriately.

  ```
    Change directory to cloned repo (Knowledge-store-back)

    $ cd Knowledge-store-back

    Trigger postgres db tables migration

    $ yarn trigger:migration

    Run development server

    $ yarn start:dev
  ```


## Usage
You can access the graphQL API editor via http://localhost:4000/graphql

The right pane of the editor holds the schema of all queries and mutations that exists on the server

<p>
  <img align="center" src="./.github/assets/gql-editor.gif">
</p>

<br>

Below is the guide for social auth as it exists on REST

| HTTP VERB | Description | Endpoints |
| --- | --- | --- |
| `GET` | Google authentication handler with PassportJs | /auth/google |
| `GET` | Facebook authentication handler with PassportJs | /auth/facebook |

#### Book Search fields
* id, name, description, authors, genres, year, userId

## Language
* Javascript

## Dependencies
> Click [here](https://github.com/Nedson202/Knowledge-store-back/blob/develop/package.json) to view all dependencies.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please endeavour to update tests as appropriate.

## License

> You can check out the full license [here](https://github.com/Nedson202/Knowledge-store-back/blob/develop/LICENSE)

This project is licensed under the terms of the MIT license.

