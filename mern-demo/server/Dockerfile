# Cau 32: Node.js Base Image
FROM node:24-alpine

# Cau 33: Thu muc lam viec
WORKDIR /app

# Cau 34: Sao chep package
COPY package*.json ./

# Cau 35: Cai dat dependencies
RUN npm ci --omit=dev

# Cau 36: Sao chep Backend
COPY server/ ./server/

# Cau 37: Khai bao port
EXPOSE 5000

# Cau 38: Khoi dong Backend
CMD ["npm", "start"]
