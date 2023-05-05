import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messagesService: MessagesService
  ) {}

  handleConnection(client: Socket){
    console.log(client, 'Client connected');
    
  }

  handleDisconnect(client: Socket){
    console.log(client, 'Client disconnected');
  }
}
