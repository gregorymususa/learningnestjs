import { Test } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from 'pactum';
import { AuthDto } from "src/dto";

describe('App (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const dto: AuthDto = {
    email: 'g.mususa@hotmail.com',
    password: 'top-secret-with-id'
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () =>{

    describe('Signup', () => {
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
      it('should throw if user exists', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403);
      });
    });

    describe('Login', () => {
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .stores('access_token', 'access_token');
      });
    });
  });

  describe('User', () =>{
    describe('Get me', () => {
      it('should throw if no access token is provided', () => {
        return pactum
          .spec()
          .get('/users/me')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{access_token}'
          })
          .expectStatus(HttpStatus.OK);
      });
    });
    describe('Edit user', () => {
      it.todo('Should edit user');
    });
  });

  describe('Bookmark', () =>{
    describe('Create bookmark', () => {
      it.todo('Should Create bookmark');
    });
    describe('Get bookmarks', () => {
      it.todo('Should Get bookmarks');
    });
    describe('Get bookmark by id', () => {
      it.todo('Should Get bookmark by id');
    });
    describe('Edit bookmark by id', () => {
      it.todo('Should Edit bookmark by id');
    });
    describe('Delete bookmark by id', () => {
      it.todo('Should Delete bookmark by id');
    });
  });
});
