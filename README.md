# 🚚 Package Tracking System for RRG Freight Services

![Screenshot of the home page](https://raw.githubusercontent.com/arvl130/rrg-freight-services-web/master/preview-1.png)
![Screenshot of the Admin dashboard page](https://raw.githubusercontent.com/arvl130/rrg-freight-services-web/master/preview-2.png)

This is the package tracking system for
[RRG Freight Services](https://www.rrgfreight.services)—a logistics company
from North Fairview, Quezon City.

This project is developed as a capstone project, in compliance with the requirements
of CAP101 and CAP102 subject of the Bachelor of Science in Information Technology
program of [Quezon City University](https://qcu.edu.ph).

The driver app is available [here](https://github.com/arvl130/rrg-freight-services-mobile).

## Features

- GPS-based location tracking and route optimization
- Delivery time estimation and precise location search
- Automatic load planning for delivery vehicles
- Optimized batching and dispatch of packages
- Capacity planning and monitoring for warehouses
- Automated status updates and reminders
- Secure sign in with biometrics and FIDO2 security keys

## Tech Stack

- [React](https://react.dev) and [Next.js](https://nextjs.org) with [tRPC](https://trpc.io) for frontend and backend
- [Tailwind CSS](tailwindcss.com) for styling
- [Lucia Auth](https://lucia-auth.com) for authentication
- [Firebase](https://firebase.google.com) for object storage
- [PostgreSQL](https://www.postgresql.org) for the database
- [Tanstack Query](https://tanstack.com/query/latest) for caching
- [Resend](https://resend.dev) for email
- [Web SMS Sender](https://websmssender.vercel.app) for SMS
- [AWS SQS](https://aws.amazon.com/sqs) and [AWS Lambda](https://aws.amazon.com/lambda) for queueing
- [Google Maps API](https://developers.google.com/maps) for location search and estimations

## Setup

This project requires at least Node.js v20 to be installed and uses `pnpm` for package management.

You will need a running PostgreSQL database and a Firebase project with Cloud Storage configured for object storage.

Take the following steps to setup this project:

1. Clone this repository.

```sh
$ git clone https://github.com/arvl130/rrg-freight-services-web.git
```

2. Install the project dependencies.

```sh
$ cd rrg-freight-services-web
$ pnpm install
```

3. Setup the API keys and database secrets.

```sh
$ cp .env.template .env
$ vi .env # type :wq! to exit
```

4. Obtain a copy of the seed script and save it as `db-seed.ts` in the `scripts` folder.

5. Push the schema to the database and run the seeder.

```sh
$ pnpm db:push
```

This command may fail if your database has existing tables.

6. Run the project.

```sh
$ pnpm dev
```

7. Build for production. (optional)

```sh
$ pnpm build
```

## License

This project is licensed under the MIT License.

Copyright © 2023 Angelo Geulin, Wally Boy Gaynor, Arlene Joy Nacion, Florence Gobilab, Rommel Rivera
