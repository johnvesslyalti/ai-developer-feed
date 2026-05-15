import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async upsert(googleProfile: {
    id: string;
    displayName: string;
    emails: { value: string }[];
    photos: { value: string }[];
  }): Promise<User> {
    const email = googleProfile.emails[0]?.value || '';
    const avatar: string | null = googleProfile.photos[0]?.value || null;

    let user = await this.usersRepository.findOne({
      where: { googleId: googleProfile.id },
    });

    if (user) {
      user.email = email;
      user.name = googleProfile.displayName;
      user.avatar = avatar;
      return this.usersRepository.save(user);
    }

    const userData = {
      googleId: googleProfile.id,
      email,
      name: googleProfile.displayName,
      avatar,
    };

    user = this.usersRepository.create(userData);

    return this.usersRepository.save(user);
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { googleId } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
