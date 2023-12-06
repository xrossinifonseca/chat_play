import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

const urlOrigin = process.env.FRONT_URL

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

      next();
    });

    this.server.on('connection', (socket) => {
      const customers = [];

      const token = socket.handshake.auth.token;

      for (const [id, socket] of this.server.of('/').sockets) {
        if (!token) return;

        const decodedToken = this.authService.decodeToken(
          socket.handshake.auth.token,
        );

        const findCustumer = customers.find(
          (item) => item?.customerId === decodedToken.id,
        );

        if (!findCustumer) {
          customers.push({
            socketId: id,
            customerId: decodedToken.id,
            customerName: decodedToken.name,
          });
        }
      }

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
