import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto.name, createUserDto.email);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findById(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
} 