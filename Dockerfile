FROM  --platform=linux/amd64 node:18.10.0-alpine AS build_image
EXPOSE 4001

WORKDIR /app
COPY . .
RUN npm install
RUN  npx prisma generate
RUN npx prisma db push
RUN npx prisma db seed
RUN npm run build
COPY package-lock.json ./
COPY ./prisma ./prisma

FROM build_image
WORKDIR /app
# copy from build image
COPY --from=build_image /app/dist ./dist

CMD ["npm", "run", "prod"]
