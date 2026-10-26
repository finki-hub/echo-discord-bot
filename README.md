# Echo Discord Bot

Echo Discord Bot is a Discord bot that provides FAQ functionality. It's powered by [discord.js](https://github.com/discordjs/discord.js) v14, [Strapi](https://github.com/strapi/strapi) v5 and PostgreSQL v16.

It's recommended to run this application in a Docker environment if you wish to retain your sanity.

## Features

The bot provides a simple & customizable FAQ functionality with user friendly configuration through Strapi. The questions support links (as buttons) and files of different formats.

## Installation

Both subprojects require Node.js 26. Use the version in `.nvmrc` for local development; the Docker images and CI checks use the same major version.

### Installation (Docker)

The project is available as a Docker image on GHCR as `finki-hub/echo-discord-bot` and `finki-hub/echo-strapi`. Beware that there are two (three with PostgreSQL) Docker images which have to be running at the same time.

Using the provided production Docker Compose setup:

1. Download the `compose.prod.yaml` from the repository, put it in a folder and rename it to `compose.yaml`
2. Pull the images: `docker compose pull`

Using the repository:

1. Clone the repository: `git clone git@github.com:finki-hub/echo-discord-bot.git`
2. Build the images: `docker compose build`

Image builds use Docker BuildKit cache mounts (enabled by default in current Docker Desktop). Production images support Linux AMD64 and ARM64, with native dependencies installed for the target architecture and no compiler toolchain in the runtime image.

### Installation (Normal)

1. Clone the repository: `git clone git@github.com:finki-hub/echo-discord-bot.git`
2. Go to the bot subdirectory: `cd bot`
3. Install the Discord bot dependencies: `npm i`
4. Build the project: `npm run build`
5. Go to the Strapi directory: `cd ../api`
6. Install the Strapi dependencies: `npm i`
7. Build the project: `npm run build`

### Checks

From `bot`, run `npm run lint`, `npm test`, and `npm run build`. From `api`, run `npm run build` to compile the server and admin panel.

The bot overrides `@discordjs/builders`' Shapeshift dependency to version 5 for Node 26's `InspectContext` typings. Remove this override once the upstream dependency supports Node 26 without it.

The API also overrides selected Strapi-pinned dependencies with same-major security updates. Review these overrides when upgrading Strapi; incompatible major updates are not forced into its dependency graph.

## Running

### Running (Docker)

Regardless of the Docker steps you have followed above for installation, run `docker compose up -d`, provided that you have a `compose.yaml` file ready.

Both applications run as the non-root `node` user (UID 1000). Any bind-mounted log or upload directories must be writable by that user. The production API image includes a healthcheck against `/_health` on its configured port.

If Docker Desktop does not detect development source edits, set `CHOKIDAR_USEPOLLING=true` and `CHOKIDAR_INTERVAL=1000` in the root `.env`, then recreate the Strapi service with `docker compose up -d --force-recreate strapi`. Polling is opt-in to avoid unnecessary CPU usage where native file events work.

### Running (Normal)

1. Make sure that you have the PostgreSQL instance running (with an empty database if it's your first run)
2. Run the Strapi project: `cd api && npm run start` or `cd api && npm run develop` for development mode
3. Run the Discord bot project: `cd ../bot && npm run start` or `cd ../bot && npm run dev` for development mode

## Configuration

Copy the `.env.example` file in the project root, rename it to `.env` and edit the environment variables inside. Do not reuse the example secrets in a deployed instance.

The bot reads FAQ content without authentication. In Strapi's Users & Permissions settings, enable the `question.find` action for the Public role. Keep question creation, updates, and deletion restricted to authorized users.

## License

This project is licensed under the terms of the MIT license.
