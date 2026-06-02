import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FakeAuthGuard } from '../auth/fake-auth/fake-auth.guard';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';

@Controller('posts')
@UseGuards(FakeAuthGuard, RolesGuard)
export class PostsController {
  @Get()
  getPosts() {
    return 'Lista post pubblica';
  }

  @Roles(Role.Admin)
  @Post('admin')
  getAdminPosts(@Body() body: any) {
    return {
      message: 'Post visibili solo agli admin',
      body,
    };
  }

  @Roles(Role.User)
  @Post('user')
  getUserPosts(@Body() body: any) {
    return {
      message: 'Post visibili solo agli user',
      body,
    };
  }
}