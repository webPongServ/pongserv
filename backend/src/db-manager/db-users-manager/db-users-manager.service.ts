import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
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

  logger = new Logger('DbUsersManagerService');

  async getUserByUserId(userId: string) {
    try {
      return await this.ua01mRp.findOne({
        where: {
          userId: userId,
        },
      });
    } catch (e) {
      return null;
    }
  }

  async getUserByNickname(nickname: string) {
    const user = await this.ua01mRp.findOne({
      where: {
        nickname: nickname,
      },
    });
    return user;
  }

  // TODO: move to UsersModule
  // TODO: modify
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
    let isMember = false;
    if (userMaster === null) {
      isMember = true;
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
    return isMember;
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
      this.logger.log('Secret is sucessfuly saved');
    } else {
      // throw new BadRequestException('No User available');
    }
  }

  async saveUser(user: TbUa01MEntity) {
    try {
      const result = await this.ua01mRp.save(user);
      // console.log(result);
    } catch (e) {
      this.logger.log(e);
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
      // console.log('Image path is sucessfuly saved');
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
      where: [{ nickname: nickname }, { userId: nickname }],
    });
    return isAvailable !== null;
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
        isTwofactor: user.twofactor,
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
  async getFriendProfile(userId: string, friendId: string) {
    const user = await this.ua01mRp.findOne({
      where: {
        userId: friendId,
      },
    });

    if (user) {
      const userData = {
        userId: user.userId,
        nickname: user.nickname,
        imgPath: user.imgPath,
        lastDttm: user.lastDttm,
        isTwofactor: user.twofactor,
        //Debug Needed
        total: 0,
        win: 0,
        lose: 0,
        ELO: 1000,
        winRate: 0,
        status: await this.getRelation(userId, user.userId),
        isblocked: false,
      };
      return userData;
    } else {
      throw new BadRequestException('No User available');
    }
  }

  async getMasterEntity(userId: string) {
    try {
      return await this.ua01mRp.findOne({
        where: {
          userId: userId,
        },
      });
    } catch (e) {
      throw new BadRequestException('No User available');
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
      // console.log('make new friend');
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
    if (!nickname) throw new BadRequestException('No nickname arg');
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
  async findNicknameByUserId(userId: string) {
    const user = await this.ua01mRp.findOne({
      where: {
        userId: userId,
      },
    });
    if (user) {
      return user.nickname;
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
    if (isFriend && isFriend.length != 0) {
      return '01';
    } else return '02';
  }

  async getCurrLoginData(user: TbUa01MEntity) {
    const result = await this.ua01lRp.findOne({
      where: {
        ua01mEntity: {
          id: user.id,
        },
        loginTf: true,
      },
    });
    return result;
  }

  async getFriendList(myEntity: TbUa01MEntity) {
    // if (!myEntity) return [];
    const friendDatas = await this.ua02lRp.find({
      relations: {
        ua01mEntityAsFr: true,
      },
      where: {
        ua01mEntity: {
          id: myEntity.id,
        },
        stCd: '01',
        delTf: false,
      },
    });
    return friendDatas;
    // const friendList = friendsData.map((friend) => {
    //   return {
    //     userId: friend.ua01mEntityAsFr.userId,
    //     nickname: friend.ua01mEntityAsFr.nickname,
    //     imageUrl: friend.ua01mEntityAsFr.imgPath,
    //   };
    // });
    // if (friendList) return friendList;
    // else throw new BadRequestException('No Friend available'); // REVIEW: Is no friend error?
  }

  async getUserList(startswith: string) {
    const users = await this.ua01mRp.find({
      where: {
        nickname: Like(startswith),
      },
    });
    if (users.length == 0) {
      return [];
    }
    const result = users.map(({ nickname, imgPath }) => ({
      nickname,
      imgPath: imgPath ?? '', // imgPath가 null일 경우 빈 문자열("")을 할당
    }));
    // console.log(result);

    return result;
  }

  async addLoginData(user: TbUa01MEntity) {
    const newLoginData: TbUa01LEntity = this.ua01lRp.create({
      ua01mEntity: user,
      connDttm: new Date(),
      stsCd: '01',
      loginTf: true,
    });
    return await this.ua01lRp.save(newLoginData);
  }

  async setLoginFinsh(user: TbUa01MEntity) {
    const currLoginData: TbUa01LEntity = await this.ua01lRp.findOne({
      where: {
        ua01mEntity: {
          id: user.id,
        },
        loginTf: true,
      },
    });
    if (!currLoginData)
      throw new NotFoundException(`not existed login data when logout`);
    currLoginData.logoutDttm = new Date();
    currLoginData.loginTf = false;
    return await this.ua01lRp.save(currLoginData);
  }
}
