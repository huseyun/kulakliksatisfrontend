# Aşama 1: Bağımlılıkları kur ve projeyi derle (Build)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Sıkı TypeScript denetimini atlayıp doğrudan Vite ile derliyoruz
RUN npx vite build

# Aşama 2: Sadece statik dosyaları hafif bir Nginx ile sun
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]