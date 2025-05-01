# --- the stage "base" only set the base setting ---
# use node:20 docker image as base
FROM --platform=linux/amd64 node:20 AS base

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
RUN pnpm deploy --filter=*piggyback --prod /piggyback
RUN pnpm --filter "*piggyback" run build
# RUN pnpm deploy --filter=app2 --prod /prod/app2


# --- the stage "piggyback" only run the project piggyback
FROM base AS piggyback
# caution!! here only copy the need file, that are in piggyback project directory. 
# Be careful in using outer utility
COPY --from=build /piggyback /piggyback
WORKDIR /piggyback
# CMD [ "tail", "-f", "/dev/null" ]
# CMD [ "pnpm", "scripts:secret" ]
CMD [ "pnpm", "start:docker" ]

# FROM base AS app2
# COPY --from=build /prod/app2 /prod/app2
# WORKDIR /prod/app2
# EXPOSE 8001
# CMD [ "pnpm", "start" ]


