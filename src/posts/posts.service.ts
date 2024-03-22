import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private usersService: UsersService
  ) { }
  async createPost(post: CreatePostDto) {
    const userFound = this.usersService.findOne(post.authorId)

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const newPost = this.postRepository.create(post)
    return await this.postRepository.save(newPost)
  }

  getPost() {
    return this.postRepository.find({
      relations: ['author']
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
