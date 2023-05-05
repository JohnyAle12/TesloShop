import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io';
import { MessageDto } from './dto/message.dto';

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

  @SubscribeMessage('message-client')
  handleMessage(client: Socket, message: MessageDto){
    //** This way only emit the event to the own client who have emitted the message from input form */
    // client.emit('messages-list', {
    //   name: 'jose',
    //   message: message.message
    // })

    //** This way emit to all users except the own client who has emitted the message from input form */
    // client.broadcast.emit('messages-list', {
    //   name: 'jose',
    //   message: message.message
    // })

    //** All users reieve this message */
    this.wss.emit('messages-list', {
        name: 'jose lola',
        message: message.message
    })
  }
}
