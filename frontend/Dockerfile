# Build Stage
FROM node:20-alpine AS build
WORKDIR /app

# Kopiere Root package.json und lock file für Workspace-Setup
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY packages/ui/package.json ./packages/ui/

# Installiere Dependencies (nur frontend + ui)
RUN npm ci --workspace=frontend --workspace=packages/ui

# Kopiere den Rest des Frontend-Codes
COPY frontend/ ./frontend/
COPY packages/ui/ ./packages/ui/

# Baue das Frontend
WORKDIR /app/frontend
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production Stage (Nginx)
FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
