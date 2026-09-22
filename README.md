# SW2026 E-commerce REST API

## Description

In-memory e-commerce REST API built with JavaScript and Express. Consumers can register, log in to receive a JWT, and complete a checkout. Users and products live in memory for the lifetime of the process. There is no database.

## Installation

1. Install [Node.js](https://nodejs.org/) 18 or later.
2. Clone this repository and install dependencies:

```bash
git clone <repository-url>
cd sw2026
npm install
```

## How to Run

```bash
npm start
```

The server listens on `http://localhost:3000` by default. Override the port with `PORT`.

Swagger UI is available at `http://localhost:3000/api-docs`.

For local development with auto-restart:

```bash
npm run dev
```

## Rules

- Checkout accepts only `cash` or `credit_card`.
- Paying with cash applies a 10% discount on the subtotal.
- Only authenticated users can checkout. Send `Authorization: Bearer <token>` after login or register.
- Data is stored in memory. Restarting the process resets users and products to the seed data.

## Existent Data

The API starts with 3 users and 3 products.

### Users

All seed users share the password `password123`.

| ID | Name          | Email              |
| -- | ------------- | ------------------ |
| 1  | Alice Johnson | alice@example.com  |
| 2  | Bob Smith     | bob@example.com    |
| 3  | Carol Davis   | carol@example.com  |

### Products

| ID | Name           | Price |
| -- | -------------- | ----- |
| 1  | Laptop         | 1000  |
| 2  | Headphones     | 200   |
| 3  | Wireless Mouse | 50    |

## How to Use the Rest API

Interactive documentation: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

The OpenAPI file is `swagger.yaml` in the project root.

### Healthcheck

```bash
curl http://localhost:3000/healthcheck
```

### Register

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Dana Lee\",\"email\":\"dana@example.com\",\"password\":\"password123\"}"
```

### Login

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"alice@example.com\",\"password\":\"password123\"}"
```

Save the returned `token` for checkout.

### Checkout

Cash checkout applies a 10% discount. Example: a laptop (1000) and two mice (50 each) have a subtotal of 1100 and a cash total of 990.

```bash
curl -X POST http://localhost:3000/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d "{\"paymentMethod\":\"cash\",\"items\":[{\"productId\":1,\"quantity\":1},{\"productId\":3,\"quantity\":2}]}"
```

Credit card checkout charges the full subtotal:

```bash
curl -X POST http://localhost:3000/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d "{\"paymentMethod\":\"credit_card\",\"items\":[{\"productId\":2,\"quantity\":1}]}"
```
