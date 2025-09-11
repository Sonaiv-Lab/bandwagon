# --- the stage "base" only set the base setting ---
# use node:20 docker image as base
FROM --platform=linux/amd64 node:22 AS base

# set the environment variable 
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# enable corepack to use pnpm
RUN corepack enable


# --- the stage "build" start build the project ---
FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build

# use pnpm deploy command, to install node_module independently to target dir
# if utils be used in project, it need to be deploy too
RUN pnpm --filter=*piggyback --prod deploy  /piggyback
RUN pnpm --filter=*dugout --prod deploy /dugout
RUN pnpm --filter=*scout --prod deploy /scout

# --- the stage "piggyback" only run the project piggyback
FROM base AS piggyback
# caution!! here only copy the need file, that are in piggyback project directory. 
# Be careful in using outer utility
COPY --from=build /piggyback /piggyback
WORKDIR /piggyback
RUN pnpm pre-playwright
CMD [ "pnpm", "start:docker" ]

FROM base AS dugout
COPY --from=build /scout /scout
WORKDIR /scout
EXPOSE 8080
CMD [ "pnpm", "start:docker:dugout" ]


FROM base AS runner
# caution!! here only copy the need file
COPY --from=build /scout /scout
WORKDIR /scout
RUN pnpm pre-playwright
CMD [ "pnpm", "start:docker:runner" ]

FROM base AS lineup
# caution!! here only copy the need file
COPY --from=build /scout /scout
WORKDIR /scout
CMD [ "pnpm", "start:docker:lineup" ]
