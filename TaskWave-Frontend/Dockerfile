# Use the official Node.js image as the base image
FROM node:22-alpine AS buildstage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=https://taskwave-api.jhubafrica.com/

# ARG VITE_BACKEND_URL
# ENV VITE_BACKEND_URL=http://localhost:8000

RUN npm run build


FROM nginx:latest AS productionstage

COPY --from=buildstage /app/dist /usr/share/nginx/html

COPY --from=buildstage /app/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 81

CMD ["nginx", "-g", "daemon off;"]

