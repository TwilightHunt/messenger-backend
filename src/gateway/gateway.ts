import { OnModuleInit } from "@nestjs/common";
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway(5001, { cors: true })
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on("connection", (socket) => {
      console.log(socket.id);
      console.log("Connected");
    });
  }

  @SubscribeMessage("send")
  onNewMessage(@MessageBody() body: any) {
    this.server.emit("message", {
      msg: "New message",
      content: body,
    });
  }
}
