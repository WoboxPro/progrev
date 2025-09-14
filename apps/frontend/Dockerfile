FROM node:22-alpine

WORKDIR /app

# Speed up installs by copying only package files first
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

RUN if [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
    elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm i; fi

# Copy the rest
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]


