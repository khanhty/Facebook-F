FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY apps ./apps
COPY prisma ./prisma
COPY samples ./samples
COPY scripts ./scripts
COPY README.md ./README.md
RUN npm install --omit=dev
EXPOSE 3000
CMD ["node", "apps/api/src/server.js"]
