import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() private wss: Server

  constructor(
    private readonly messagesService: MessagesService
  ) {}

  handleConnection(client: Socket){
    this.messagesService.registerClient(client)
    this.wss.emit('updated-clients', this.messagesService.getConnectedClients())
    console.log('clientes conectados', this.messagesService.getConnectedClients().length);
  }

  handleDisconnect(client: Socket){
    this.messagesService.removeClient(client.id)
    this.wss.emit('updated-clients', this.messagesService.getConnectedClients())
  }
}
