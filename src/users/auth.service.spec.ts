import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create a fake copy of the users service
    // fakeUsersService = {
    //   find: () => Promise.resolve([]),
    //   create: (email: string, password: string) =>
    //     Promise.resolve({ id: 1, email, password } as User),
    // };
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a hashed and salted password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  //cannot combine async/await with done
  it('throws error if user signs up with already registered email', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws error if sing in is called with an unused email', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
  });

  // NO FUNCIONA ESTE CON EL DONE, TAMPOCO SIN EL DONE, USAR SOLUCION DE ABAJO
  //   it('throws error if invalid password is provided', async (done) => {
  //     fakeUsersService.find = () =>
  //       Promise.resolve([{ email: 'asdf@asdf.com', password: 'asdf' } as User]);
  //     try {
  //       await service.signin('asdf@asdf.com', 'asdfgdus');
  //     } catch (error) {
  //       done();
  //     }
  //   });
  it('throws error if invalid password is provided', async () => {
    await service.signup('asdf@asdf.com', 'asdfgdus');

    await expect(service.signin('asdf@asdf.com', 'asdfgdu1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       email: 'asdf@asdf.com',
    //       password:
    //         'b4c0e4fcbf11a4ac.e88b4a9dae0d3578e89763b56d6820860e9fe1817a4ea114cca94b0bbfc15f00',
    //     } as User,
    //   ]);
    await service.signup('asdf@asdf.com', 'asdasd');
    const user = await service.signin('asdf@asdf.com', 'asdasd');
    // console.log(user);
    expect(user).toBeDefined();
  });
});
