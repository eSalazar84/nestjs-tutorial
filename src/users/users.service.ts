import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>) { }

  async createUser(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username
      }
    });

    if (userFound) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT)
    }

    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  getAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id
      },
      relations: ['post']
    });

    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    return userFound;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        id
      }
    });

    if (!userFound) {
      throw new HttpException('User not Found', HttpStatus.NOT_FOUND)
    }

    const updateUser = Object.assign(userFound, updateUserDto)
    return this.userRepository.save(updateUser)
  }

  async removeUser(id: number) {
    const result = await this.userRepository.delete({ id });

    if (result.affected === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    return result;
  }

  async createProfile(id: number, profile: CreateProfileDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        id
      }
    })

    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const newProfile = this.profileRepository.create(profile)

    const savedProfile = await this.profileRepository.save(newProfile)

    return this.userRepository.save(userFound);
  }
}
