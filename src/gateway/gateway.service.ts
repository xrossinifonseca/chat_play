import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

const urlOrigin = process.env.FRONT_URL;

@WebSocketGateway({
  cors: {
    origin: urlOrigin,
  },
})
@Injectable()
export class GatewayService implements OnModuleInit {
  constructor(private authService: AuthService) {}

  @WebSocketServer()
  private server: Server;

  onModuleInit() {
    this.server.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        next(new Error('token invalido'));
      }

      const decodedToken = this.authService.decodeToken(token);

      socket.handshake.auth.customerId = decodedToken.id;
      socket.handshake.auth.customerName = decodedToken.name;

      next();
    });

    this.server.on('connection', (socket) => {
      const customers = [];

      // check users online
      for (const [id, socket] of this.server.of('/').sockets) {
        const { customerId, customerName } = socket.handshake.auth;

        if (!customerId) return;

        const findCustumer = customers.find(
          (item) => item?.customerId === customerId,
        );

        if (!findCustumer) {
          customers.push({
            socketId: id,
            customerId: customerId,
            customerName: customerName,
          });
        }
      }

      // send the client the users online
      this.server.emit('customersOnline', customers);

      socket.on('disconnect', () => {
        const customersOn = customers.filter(
          (customer) => customer.socketId != socket.id,
        );

        this.server.emit('customersDisconnect', customersOn);
      });

      socket.on('newMessage', (message) => {
        this.server.emit('newMessage', {
          content: message.content,
          fromId: message.fromId,
          fromName: message.fromName,
          date: Date.now(),
        });

        socket.broadcast.emit('notification', {
          content: 'new message',
        });
      });
    });
  }
}
