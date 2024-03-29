# Introduction
HappyKids is a result of the capstone project in our university which general requirement is: create a mobile app to support the parent and teacher in managing kids activities during the day.
The project's owners are also the 3 contributors of this repository.

## Try it now
Download [this apk file](https://expo.dev/artifacts/eas/2sgsskPDz1dUSpeVwwpi6h.apk) to experiment. In the app, users of different roles could have different views, please use below test accounts to experiment.
|Role|Username|Password|
|---|---|---|
|Teacher|bach_teacher1|password123|
|Parent|bach_parent1|password123|

## Video demo
https://github.com/edwardly1002/happy-kids/blob/467de3678b7b9aed370cacb6b93d162ee6741905/demo/demo.webm

# Quick Start

To get it running, follow the steps below:

```
1. Node version
v19.x.x

2. Install dependencies
pnpm i

3. Configure environment variables. There is an `.env.example` in the root directory you can use for reference. Move it to `/nextjs` as well.
cp .env.example .env

4. Start containers
docker-compose up

5. Generate Kysely Models from Mysql
pnpm kysely-codegen

6. Run at the project root folder.
pnpm dev

(Optional) It might be easier to run each app in separate terminal windows so you get the logs from each app separately
pnpm --filter expo dev
pnpm --filter nextjs dev
```

# Deployment

## Expo

### Build
```
cd apps/expo && eas build --profile preview --platform android
```

### Update
```
eas update:configure --platform android
```

Copy lines of code as the output suggests in to `app.config.ts`. Then run the following command.

```
cd apps/expo && eas update --branch preview --message "Updating the app" --platform android
```

## Database
Database is deployed in docker-compose. The schema SQL script need to be run manually. First, you need to copy mysql scripts to container.
```
sudo docker cp mysql happykids_mysql:/
```
Go into the docker container, open mysql shell, then paste the script
to execute.
```
sudo docker exec -it happykids_mysql /bin/sh
mysql -u root --default-character-set=utf8 -p
source mysql/schema.sql
source mysql/seed.sql
```

## Server
**First remember to create a `.env` file inside `app/nextjs`**\
A nodejs docker is deployed to expose API for client to call. Nginx should be the web server.
Should manually install and build nextjs first, then start the service.
```
pnpm install 
sudo pnpm kysely-codegen
pnpm --filter nextjs build
sudo docker-compose start
```
For authentication to work, we need to generate encryption keys:
```
cd apps/nextjs/public/storage/secret/ 
ssh-keygen -t rsa -m PEM -f access.key
openssl rsa -in access.key -pubout -outform PEM -out access.key.pub
```
