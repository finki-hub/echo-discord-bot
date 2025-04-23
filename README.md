# Echo Discord Bot

Echo Discord Bot is a Discord bot that provides FAQ functionality. It's powered by [discord.js](https://github.com/discordjs/discord.js) v14, [Strapi](https://github.com/strapi/strapi) v5 and PostgreSQL v16.

It's recommended to run this application in a Docker environment if you wish to retain your sanity.

## Features

The bot provides a simple & customizable FAQ functionality with user friendly configuration through Strapi. The questions support links (as buttons) and files of different formats.

## Installation

For development purposes, be sure to run `npm run prepare` to install the Git pre-commit hooks.

### Installation (Docker)

The project is available as a Docker image on GHCR as `finki-hub/echo-discord-bot` and `finki-hub/echo-strapi`. Beware that there are two (three with PostgreSQL) Docker images which have to be running at the same time.

Using the provided production Docker Compose setup:

1. Download the `compose.prod.yaml` from the repository, put it in a folder and rename it to `compose.yaml`
2. Pull the images: `docker compose pull`

Using the repository:

1. Clone the repository: `git clone git@github.com:finki-hub/echo-discord-bot.git`
2. Build the images: `docker compose build`

### Installation (Normal)

1. Clone the repository: `git clone git@github.com:finki-hub/echo-discord-bot.git`
2. Go to the bot subdirectory: `cd bot`
3. Install the Discord bot dependencies: `npm i`
4. Build the project: `npm run build`
5. Go to the Strapi directory: `cd ../api`
6. Install the Strapi dependencies: `npm i`
7. Build the project: `npm run build`

## Running

### Running (Docker)

Regardless of the Docker steps you have followed above for installation, run `docker compose up -d`, provided that you have a `compose.yaml` file ready.

### Running (Normal)

1. Make sure that you have the PostgreSQL instance running (with an empty database if it's your first run)
2. Run the Strapi project: `cd api && npm run start` or `cd api && npm run develop` for development mode
3. Run the Discord bot project: `cd ../bot && npm run start` or `cd ../bot && npm run dev` for development mode

## Configuration

Copy the `env.example` file in the project root, rename it to `.env` and edit the environment variables inside.

## License

This project is licensed under the terms of the MIT license.
