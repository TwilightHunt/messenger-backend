import { NestFactory } from "@nestjs/core";
import { DocumentBuilder } from "@nestjs/swagger";
import { SwaggerModule } from "@nestjs/swagger/dist";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

async function start() {
  const PORT = 5000;

  const cors = {
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: process.env.ORIGIN_URL,
    credentials: true,
    "Access-Control-Allow-Headers": "Authorization, OPTIONS",
  };

  const app = await NestFactory.create(AppModule, { cors });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle("Messenger backend")
    .setDescription("Description")
    .setVersion("2.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs/", app, document);

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

start();
