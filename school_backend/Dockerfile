FROM node:20-alpine

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Ensure uploads directory exists
RUN mkdir -p /app/uploads

EXPOSE 5000

CMD ["node", "server.js"]
