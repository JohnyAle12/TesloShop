import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messagesService: MessagesService
  ) {}

  handleConnection(client: Socket){
    this.messagesService.registerClient(client)
    console.log('clientes conectados', this.messagesService.getConnectedClients());
  }

  handleDisconnect(client: Socket){
    this.messagesService.removeClient(client.id)
  }
}
