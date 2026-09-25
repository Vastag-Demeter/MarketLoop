# MarketLoop

MarketLoop is a full-stack e-commerce simulation. It demonstrates how a webshop can manage products, variants, categories, attributes, vendors, carts, orders, customer profiles, support tickets, staff users, roles, permissions and system email logs in one application.

The project is intended for learning, demonstration and development purposes. It is not a production webshop and should not be used to process real customer data.

## Live demo

The current live version is available at:

**https://market-loop-khaki.vercel.app/**

## Important: simulation and privacy warning

This website is a simulation. Please do **not** submit real personal, financial or other sensitive information.

- Use the demo accounts below when possible.
- Do not use a real password that you use elsewhere.
- Do not enter real names, addresses, phone numbers or order information.
- Do not use real payment-card details.
- An email address is sufficient if the application asks for one in order to send system emails.
- The email addresses shown below are test accounts and should only be used for this demonstration.

The project is currently under development. New features, improvements and bug fixes may be released regularly, and behaviour or data in the live demo may change without notice.

## Demo accounts

The following seeded accounts can be used to explore the different parts of the system:

| Account                 | Password     | Main area                              |
| ----------------------- | ------------ | -------------------------------------- |
| `customer@webshop.hu`   | `customer`   | Customer shopping and profile features |
| `worker@webshop.hu`     | `worker`     | Order management                       |
| `helpdesk@webshop.hu`   | `helpdesk`   | Support ticket management              |
| `admin@webshop.hu`      | `admin`      | Product and catalog administration     |
| `superadmin@webshop.hu` | `superadmin` | User, role and system administration   |

These credentials are intentionally public because this is a demonstration environment. They must not be reused for any real service.

## What the system demonstrates

### Customer shopping flow

- Browse and search products
- View product details, attributes and variants
- Add products to a cart
- Proceed through checkout
- View order status and order history
- Cancel eligible orders
- Manage profile information, addresses and phone numbers
- Open support requests

### Catalog and product administration

Users with the appropriate permissions can manage:

- Products and product status
- Product images
- Product categories
- Product attributes and attribute values
- Product variants, stock and price modifiers
- Vendors
- Payment methods

### Staff and system administration

The application includes separate areas for different staff responsibilities:

- **Worker**: manage and inspect orders
- **Helpdesk**: view and handle support tickets
- **Admin**: manage the product catalog and related commercial data
- **Superadmin**: manage users, roles, permissions, vendors, email types, ticket statuses and email audit logs

Access is based on roles and permissions. The backend applies permission checks to protected API endpoints, while the frontend hides unavailable navigation options and protects protected routes for a better user experience.

## Payment-card data

Payment-card handling is intentionally separated from the main application. Card data is stored and handled by a different service that follows PCI DSS requirements. The MarketLoop application is designed to work with the external payment-card service rather than acting as the card-data storage system itself.

This separation does not make the demo suitable for real payments. Do not enter real card details into the live website. The PCI DSS statement describes the intended architecture of the external service and should not be interpreted as a claim that this demo application itself is PCI DSS certified.

## Technical architecture

The repository contains two main applications:

```text
MarketLoop/
├── frontend/   Next.js application
├── backend/    Express API and Prisma data layer
└── README.md
```

### Frontend

The frontend is built with:

- Next.js App Router
- React
- TypeScript
- Axios for API communication
- Tailwind CSS
- Lucide React icons
- Cypress for end-to-end tests

The frontend contains public shopping pages, authentication, customer profile pages, checkout, staff areas and superadmin pages. The live frontend is deployed at the Vercel URL above.

### Backend

The backend is built with:

- Node.js
- Express
- Prisma
- PostgreSQL
- JSON Web Tokens stored in HTTP cookies
- Role- and permission-based authorization
- Joi request validation
- Email delivery and email-log handling

The backend exposes API routes for authentication, users, profiles, addresses, phone numbers, cards, products, categories, attributes, variants, vendors, carts, transactions, orders, support tickets and administration.

### Data model

The Prisma data model includes entities for, among others:

- Users, roles and permissions
- Products, categories, images, attributes and variants
- Vendors
- Carts and cart items
- Orders and order items
- Payment methods and external card references
- Addresses and phone numbers
- Support tickets and ticket messages
- Email types and email logs

## Authorization model

The application separates:

- **Roles**, which describe a user group such as `CUSTOMER`, `WORKER`, `HELPDESK`, `ADMIN` or `SUPERADMIN`
- **Permissions**, which describe an allowed capability such as product management, user management, role management or email-log access

The backend is the final authority for authorization. A user who manually opens a protected URL may see a frontend redirect, but every protected API operation must still pass the backend authentication and permission checks.

## Running the project locally

### Prerequisites

- Node.js
- npm
- PostgreSQL
- A configured email provider or development mail service
- Environment variables for the backend and frontend

### Install dependencies

From the repository root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Configure environment variables

Create the environment files required by the local deployment. The backend requires, at minimum, configuration for:

- PostgreSQL connection
- JWT signing
- Backend/frontend URLs
- Email delivery
- Any external payment-card integration used by the environment

Keep all secrets local or in the deployment provider's secret manager. Do not commit `.env` files, JWT secrets, database credentials, email-provider keys or payment-provider credentials.

### Prepare the database

From `backend/`, use the Prisma workflow appropriate for your database environment:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

The seed data creates the default roles, permissions, demo users and example webshop data used by the application.

### Start the applications

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The default local frontend address is:

```text
http://localhost:3000
```

The backend listens on the configured `PORT` or `BACKEND_PORT`, falling back to port `4000`.

## Testing and quality checks

The backend test command is:

```bash
cd backend
npm test
```

The frontend lint command is:

```bash
cd frontend
npm run lint
```

End-to-end tests are located in `frontend/test/cypress`. They cover administrative workflows such as user, role and vendor management.

## Email and external services

The backend can send system emails such as verification, support and order-related messages. Email delivery is configured outside the source code through environment variables. Email activity is also represented in the administrative email-log area when the configured data is available.

External services may have their own availability, configuration and compliance requirements. The live demo should therefore be treated as a demonstration of the application flow, not as a guarantee of production service availability.

## Project status

MarketLoop is an active development project. The current implementation is suitable for demonstrating a broad e-commerce and administration workflow, but it is not a finished production product. Expect ongoing changes, including:

- new features;
- user-experience improvements;
- authorization and validation refinements;
- bug fixes;
- changes to demo data and deployment configuration.

## License and usage

Unless a separate license is provided, treat this repository as a project demonstration and do not assume permission to reuse, redistribute or deploy it commercially. Review the repository history and any future license file for the applicable terms.
