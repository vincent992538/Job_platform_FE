# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


## Environment Variables
Create a `.env` file in the root of your project and define the `API_BASE_URL` to point to your backend server.
```env
API_BASE_URL=http://localhost:8000/api
```

## About
A job platform built with Nuxt.js, providing features for job postings and user permission access. Users can create, update, and view job listings.

## Features

- **Job Listings**: Users can browse and view job postings.
- **Create/Edit Job**: Users can create and update job listings.
- **Authentication**: Secure login and logout functionality with token-based authentication.
    > 🛂 **Note:** To log in, please use a **username** and **password** created from the backend Django admin panel.

## Tech Stack

- **Frontend**: Nuxt.js (Vue 3)
- **State Management**: Pinia (Vuex alternative)
- **Styling**: Tailwind CSS

## Project Structure

- **pages/**: Vue components for different pages (e.g., job listings, job detail).
- **composables/**: Reusable fetch request (e.g., header, job cards).
- **store/**: Pinia state management for frontend state.


## Assumptions and Design Decisions
This was my first time working with the Nuxt framework, so the development process took longer than expected. Given the minimal scope of the project, I chose not to implement full user management (e.g., registration, profile editing). Instead, I focused solely on basic `JWT` authentication with login, logout, and token refresh logic.

The UI/UX was designed from the perspective of an internal platform administrator, so I used `/dashboard` as the main route instead of `/jobs`. The dashboard directly displays the job table, which serves as the primary management interface. Due to limited development time, I opted for a simple layout without breaking components into reusable modules. The priority was to showcase the backend features, not frontend architecture.

For the search functionality, I initially considered using multi-select inputs for `status`, `related_skills`, and `location`. However, implementing that would have required additional API endpoints to fetch the full list of available filter values, which felt out of scope for a project of this scale—so I chose not to pursue it.

As the task instructed that the `company_name` field should not be editable during job updates, I removed that field from the update payload entirely. I also added client-side validation for date logic, ensuring `posting_date` < `expiration_date`. The validation deliberately allows past expiration dates, as this can be intentional in real-world business cases (e.g., backdating or archiving logic).

The `salary_range` field does not include any validation either, since in real job platforms the formatting is highly varied—some may input ranges, others might list single values or notes like "negotiable". For this reason, filtering is implemented as simple text search only.

Finally, I had planned to use `@nuxtjs/i18n` to support multilingual interface switching between Chinese and English. However, I realized that only translating static platform text without translating job content would feel incomplete. Implementing full content-level `i18n` would have significantly increased the development time, so I decided not to move forward with it for this version.