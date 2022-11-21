import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDTO } from './dto/createUser.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  public async signUp(createdUserDto: AuthCredentialsDTO): Promise<void> {
    const { username, password } = createdUserDto;

    // hash password & then save
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('salt', salt);
    console.log('hashedPassword', hashedPassword);

    const createdUser = this.authRepository.create({
      username: username,
      password: hashedPassword,
    });

    try {
      await this.authRepository.save(createdUser);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username value
        throw new ConflictException('Username Altready exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  public async signIn(
    loginUser: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const { username, password } = loginUser;

    const user = await this.authRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
