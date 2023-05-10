import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TbUa01MEntity } from './entities/tb-ua-01-m.entity';
import { TbUa01LEntity } from './entities/tb-ua-01-l.entity';
import { TbUa02LEntity } from './entities/tb-ua-02-l.entity';
import { TbUa03DEntity } from './entities/tb-ua-03-d.entity';
import { TbUa03MEntity } from './entities/tb-ua-03-m.entity';
import { resourceLimits } from 'worker_threads';

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
        userId: userId,
      },
    });
    return user;
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
    // console.log(`upper userMaster: `);
    // console.log(userMaster);
    // 1-1
    if (userMaster === null) {
      userMaster = this.ua01mRp.create({
        userId: userId,
        nickname: userId,
        twofactor: false,
        imgPath: intraData.intraImagePath,
      });
      // console.log(`userMaster after create: `);
      // console.log(userMaster);
      userMaster = await this.ua01mRp.save(userMaster);
      // console.log(`userMaster after save: `);
      // console.log(userMaster);
    }
    return userMaster;
  }

  async checkUserInDb(userId: string) {
    // console.log('in checkUserInDb', userId);
    const userMaster = await this.ua01mRp.findOne({
      where: {
        userId: userId,
      },
    });
    // console.log(userMaster);
    if (!userMaster) throw new UnauthorizedException();
    else return userMaster.userId;
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
      user.twofactor = false;
      user.twofactorData = secret;
      await this.ua01mRp.save(user);
      console.log('Secret is sucessfuly saved');
    } else {
      throw new BadRequestException('No User available');
    }
  }

  async saveUser(user: TbUa01MEntity) {
    try {
      const result = await this.ua01mRp.save(user);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }

  async changeImagePath(userId: string, imagePath: string) {
    const user = await this.ua01mRp.findOne({
      where: {
        userId: userId,
      },
    });
    if (user) {
      user.imgPath = imagePath;
      await this.ua01mRp.save(user);
      console.log('Image path is sucessfuly saved');
    } else {
      throw new BadRequestException('No User available');
    }
  }

  async activate2fa(userId: string) {
    const user = await this.ua01mRp.findOne({
      where: {
        userId: userId,
      },
    });
    if (user) {
      user.twofactor = true;
      await this.ua01mRp.save(user);
      console.log('2fa is activated');
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
    if (user && user.twofactorData) {
      return user.twofactorData;
    } else {
      throw new BadRequestException('No User or Twofactor not enabled');
    }
  }

  async changeNickname(intraId: string, nickname: string) {
    const isAvailable = await this.ua01mRp.findOne({
      where: {
        nickname: nickname,
      },
    });
    if (isAvailable) {
      throw new BadRequestException('Nickname already exists');
    } else {
      const user = await this.ua01mRp.findOne({
        where: {
          userId: intraId,
        },
      });
      if (user) {
        user.nickname = nickname;
        await this.ua01mRp.save(user);
        console.log('Nickname is sucessfuly changed');
        return { Request: 'Success' };
      } else {
        throw new BadRequestException('No User available');
      }
    }
  }

  async checkNickname(nickname: string) {
    const isAvailable = await this.ua01mRp.findOne({
      where: {
        nickname: nickname,
      },
    });
    return isAvailable;
  }

  async getProfile(userId) {
    const user = await this.ua01mRp.findOne({
      where: {
        userId: userId,
      },
    });
    if (user) {
      const result = {
        userId: user.userId,
        nickname: user.nickname,
        imgPath: user.imgPath,
        // TODO : Change Needed
        total: 99,
        win: 99,
        lose: 0,
        ELO: 9999,
        winRate: 100.0,
      };
      return result;
    } else {
      throw new BadRequestException('No User available');
    }
    // const userGame = await this.ua02lRp.find({
  }

  async getMasterEntity(userId: string) {
    const user = await this.ua01mRp.findOne({
      where: {
        userId: userId,
      },
    });
    if (!user) throw new BadRequestException('No User available');
    else {
      return user;
    }
  }

  async makeFriend(myEntity: TbUa01MEntity, friendEntity: TbUa01MEntity) {
    if (myEntity.id == friendEntity.id)
      throw new BadRequestException('Cannot be friend of myself');

    const friend = await this.ua02lRp.findOne({
      relations: {
        ua01mEntity: true,
        ua01mEntityAsFr: true,
      },
      where: {
        ua01mEntity: {
          id: myEntity.id,
        },
        ua01mEntityAsFr: {
          id: friendEntity.id,
        },
      },
    });
    if (friend && friend.stCd == '01')
      throw new BadRequestException('Already Friend');
    else if (friend && friend.stCd == '02') {
      friend.stCd = '01';
      friend.rsstDttm = new Date();
      await this.ua02lRp.save(friend);
      console.log('Friend is sucessfuly added(change from deleted status');
      return { result: 'Success' };
    } else {
      const friendList = await this.ua02lRp.create({
        ua01mEntity: myEntity,
        ua01mEntityAsFr: friendEntity,
        rsstDttm: new Date(),
        releDttm: new Date(),
        stCd: '01',
        delTf: false,
      });
      await this.ua02lRp.save(friendList);
      console.log('make new friend');
      return { result: 'Success' };
    }
  }

  async deleteFriend(myEntity: TbUa01MEntity, friendEntity: TbUa01MEntity) {
    if (myEntity.id == friendEntity.id)
      throw new BadRequestException('Cannot delete myself');
    const friend = await this.ua02lRp.findOne({
      relations: {
        ua01mEntity: true,
        ua01mEntityAsFr: true,
      },
      where: {
        ua01mEntity: {
          id: myEntity.id,
        },
        ua01mEntityAsFr: {
          id: friendEntity.id,
        },
      },
    });
    if (friend && friend.stCd == '02')
      throw new BadRequestException('Already both are not Friend');
    else if (friend && friend.stCd == '01') {
      friend.stCd = '02';
      friend.rsstDttm = new Date();
      await this.ua02lRp.save(friend);
      console.log('Friend is sucessfuly deleted(change from added status)');
      return { result: 'Success' };
    } else {
      throw new BadRequestException('No Friend available');
    }
  }

  async findUserIdByNickname(nickname: string) {
    const user = await this.ua01mRp.findOne({
      where: {
        nickname: nickname,
      },
    });
    if (user) {
      return user.userId;
    } else {
      throw new BadRequestException('No User available');
    }
  }

  async getRelation(userId: string, friendUserId: string) {
    if (userId == friendUserId) {
      return '00';
    }
    const isFriend = await this.ua02lRp.find({
      relations: {
        ua01mEntity: true,
        ua01mEntityAsFr: true,
      },
      where: {
        ua01mEntity: {
          userId: userId,
        },
        ua01mEntityAsFr: {
          userId: friendUserId,
        },
        stCd: '01',
      },
    });
    console.log('isFriend', isFriend);
    if (isFriend && isFriend.length != 0) {
      // console.log('we are friend');
      return '01';
    } else return '02';
  }

  async getFriendProfile(userId: string, friendNickname: string) {
    const user = await this.ua01mRp.findOne({
      where: {
        nickname: friendNickname,
      },
    });

    if (user) {
      return {
        userId: user.userId,
        nickname: user.nickname,
        imgPath: user.imgPath,
        lastDttm: user.lastDttm,
        //Debug Needed
        total: 99,
        win: 99,
        lose: 0,
        ELO: 9999,
        winRate: 100.0,
        status: await this.getRelation(userId, user.userId),
      };
    } else {
      throw new BadRequestException('No User available');
    }
  }

  async getCurrLoginData(user: TbUa01MEntity) {
    const result = await this.ua01lRp.findOne({
      where: {
        ua01mEntity: user,
        loginTf: true,
      },
    });
    return result;
  }

  async getFriendList(myEntity: TbUa01MEntity) {
    const friendList = await this.ua02lRp.findAndCount({
      relations: {
        ua01mEntity: true,
        ua01mEntityAsFr: true,
      },
      where: {
        ua01mEntity: {
          id: myEntity.id,
        },
        stCd: '01',
      },
    });
    if (!friendList) throw new BadRequestException('No Friend available');
    const friendData = friendList[0].map((friend) => {
      return {
        nickname: friend.ua01mEntityAsFr.nickname,
        imageUrl: friend.ua01mEntityAsFr.imgPath,
      };
    });
    if (friendData) return friendData;
    else throw new BadRequestException('No Friend available');
  }
}
