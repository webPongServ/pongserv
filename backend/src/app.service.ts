import { Injectable, Req } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    console.log("Hello")
    return 'HELLOWORLD';
  }
}
