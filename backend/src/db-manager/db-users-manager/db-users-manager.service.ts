import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TbUa01MEntity } from './entities/tb-ua-01-m.entity';
import { TbUa01LEntity } from './entities/tb-ua-01-l.entity';
import { TbUa02LEntity } from './entities/tb-ua-02-l.entity';
import { TbUa03DEntity } from './entities/tb-ua-03-d.entity';
import { TbUa03MEntity } from './entities/tb-ua-03-m.entity';

@Injectable()
export class DbUsersManagerService {
  constructor(
    @InjectRepository(TbUa01MEntity) private ua01mRp: Repository<TbUa01MEntity>,
    @InjectRepository(TbUa01LEntity) private ua01lRp: Repository<TbUa01LEntity>,
    @InjectRepository(TbUa02LEntity) private ua02lRp: Repository<TbUa02LEntity>,
    @InjectRepository(TbUa03MEntity) private ua03mRp: Repository<TbUa03MEntity>,
    @InjectRepository(TbUa03DEntity) private ua03dRp: Repository<TbUa03DEntity>,
  ) {}

  async getUserByUserId(userId: string) {
    const user = await this.ua01mRp.findOne({
      where: {
        nickname: userId,
      },
    });
    return user;
  }

  setUser() {
    const test = this.ua01mRp.create();
    console.log(test);
    console.log(`in DbManagerService.serUser`);
  }

  // TODO: move to UsersModule
  async checkinUser(intraData: { intraId: string; intraImagePath: string }) {
    /*!SECTION
      1. 인자로 들어온 nickname을 가진 유저가 user master table(ua01mRp)에 있는지 확인한다. (회원가입 유무 확인)
        1-1. 만약 회원가입이 되어 있지 않다면, DB에 저장한다. (자동 회원가입)
      2. user login table에 유저 데이터 row를 추가한다. (로그인 세션 저장)
    */
    // 1
    const userId = intraData.intraId;
    let userMaster = await this.ua01mRp.findOne({
      where: {
        userId: userId,
      },
    });
    // 1-1
    if (!userMaster) {
      userMaster = await this.ua01mRp.save(
        this.ua01mRp.create({
          userId: userId, // userID string...
          nickname: userId,
          twofactor: false,
          twofactorData: '',
          imgPath: intraData.intraImagePath,
          delTf: false,
        }),
      );
    }
    // console.log(userMaster);
    // 2
    const result = await this.ua01lRp.save(
      this.ua01lRp.create({
        ua01mEntity: userMaster,
        chtTf: false,
        gmTf: false,
        refreshTkn: 'null', // TODO: set as refresh token
        loginTf: true,
        delTf: false,
      }),
    );
    // console.log('Second ', result);
  }

  async checkUserInDb(userId: string) {
    const userMaster = await this.ua01mRp.findOne({
      where: {
        userId: userId,
      },
    });
    if (!userMaster) return null;
    return userId;
  }
  async checkOauth(intraId: string) {
    const isOauthNeeded = await this.ua01mRp.findOne({
      where: {
        userId: intraId,
        twofactor: true,
      },
    });
    // console.log(isOauthNeeded);
    if (isOauthNeeded === null) return false;
    else return true;
  }

  async applyTwofactor(userId: string, secret: string) {
    const user = await this.ua01mRp.findOne({
      where: {
        userId: userId,
      },
    });
    if (user) {
      user.twofactor = true;
      user.twofactorData = secret;
      await this.ua01mRp.save(user);
      console.log('Secret is sucessfuly saved');
      console.log(secret);
    } else {
      throw new BadRequestException('No User available');
    }
  }

  async findSecret(userId: string) {
    const user = await this.ua01mRp.findOne({
      where: {
        userId: userId,
      },
    });
    if (user && user.twofactor == true) {
      return user.twofactorData;
    } else {
      throw new BadRequestException('No User or Twofactor not enabled');
    }
  }
}
