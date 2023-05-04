import { Injectable, Req } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return 'HELLOWORLD';
  }
}
