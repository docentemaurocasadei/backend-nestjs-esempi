import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

const uid = Date.now();

describe('Auth + RBAC (e2e)', () => {
  let app: INestApplication<App>;
  let userToken: string;
  let adminToken: string;
  let createdPostId: number;
  let createdCategoryId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login come user
    const userRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'user', password: 'Password1!' });
    userToken = userRes.body.access_token;

    // Login come admin
    const adminRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'Password1!' });
    adminToken = adminRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── AUTH ────────────────────────────────────────────────────────────────────

  describe('POST /auth/login', () => {
    it('restituisce access_token con credenziali corrette', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'admin', password: 'Password1!' })
        .expect(201);

      expect(res.body).toHaveProperty('access_token');
      expect(typeof res.body.access_token).toBe('string');
    });

    it('restituisce 401 con password errata', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'admin', password: 'sbagliata' })
        .expect(401);
    });

    it('restituisce 401 con username inesistente', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'nessuno', password: 'qualsiasi' })
        .expect(401);
    });
  });

  // ─── CATEGORIES ──────────────────────────────────────────────────────────────

  describe('Categories', () => {
    describe('GET /categories', () => {
      it('200 senza token (pubblico)', () => {
        return request(app.getHttpServer()).get('/categories').expect(200);
      });
    });

    describe('GET /categories/:id', () => {
      it('200 senza token (pubblico)', () => {
        return request(app.getHttpServer()).get('/categories/1').expect(200);
      });
    });

    describe('POST /categories', () => {
      it('401 senza token', () => {
        return request(app.getHttpServer())
          .post('/categories')
          .send({ name: 'Test', description: 'desc' })
          .expect(401);
      });

      it('201 con token user', async () => {
        const res = await request(app.getHttpServer())
          .post('/categories')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ name: `Categoria E2E ${uid}`, description: 'creata dal test' })
          .expect(201);

        expect(res.body).toHaveProperty('id');
        createdCategoryId = res.body.id;
      });

      it('201 con token admin', () => {
        return request(app.getHttpServer())
          .post('/categories')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ name: `Categoria Admin E2E ${uid}`, description: 'creata da admin' })
          .expect(201);
      });
    });

    describe('PATCH /categories/:id', () => {
      it('401 senza token', () => {
        return request(app.getHttpServer())
          .patch('/categories/1')
          .send({ name: 'Modificata' })
          .expect(401);
      });

      it('200 con token user', () => {
        return request(app.getHttpServer())
          .patch(`/categories/${createdCategoryId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ name: 'Categoria E2E modificata' })
          .expect(200);
      });

      it('200 con token admin', () => {
        return request(app.getHttpServer())
          .patch(`/categories/${createdCategoryId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ name: 'Categoria E2E modificata da admin' })
          .expect(200);
      });
    });

    describe('DELETE /categories/:id', () => {
      it('401 senza token', () => {
        return request(app.getHttpServer())
          .delete(`/categories/${createdCategoryId}`)
          .expect(401);
      });

      it('403 con token user (non autorizzato)', () => {
        return request(app.getHttpServer())
          .delete(`/categories/${createdCategoryId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(403);
      });

      it('200 con token admin', () => {
        return request(app.getHttpServer())
          .delete(`/categories/${createdCategoryId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);
      });
    });
  });

  // ─── POSTS ───────────────────────────────────────────────────────────────────

  describe('Posts', () => {
    describe('GET /posts', () => {
      it('200 senza token (pubblico)', () => {
        return request(app.getHttpServer()).get('/posts').expect(200);
      });
    });

    describe('GET /posts/:id', () => {
      it('200 senza token (pubblico)', () => {
        return request(app.getHttpServer()).get('/posts/1').expect(200);
      });

      it('404 per id inesistente', () => {
        return request(app.getHttpServer()).get('/posts/99999').expect(404);
      });
    });

    describe('POST /posts', () => {
      it('401 senza token', () => {
        return request(app.getHttpServer())
          .post('/posts')
          .send({ title: 'Test', slug: `test-no-auth-${uid}`, content: 'c', category_id: 1 })
          .expect(401);
      });

      it('201 con token user', async () => {
        const res = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ title: `Post E2E user ${uid}`, slug: `post-e2e-user-${uid}`, content: 'contenuto', category_id: 1 })
          .expect(201);

        expect(res.body).toHaveProperty('id');
        createdPostId = res.body.id;
      });

      it('201 con token admin', () => {
        return request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ title: `Post E2E admin ${uid}`, slug: `post-e2e-admin-${uid}`, content: 'contenuto admin', category_id: 1 })
          .expect(201);
      });
    });

    describe('PATCH /posts/:id', () => {
      it('401 senza token', () => {
        return request(app.getHttpServer())
          .patch(`/posts/${createdPostId}`)
          .send({ title: 'Modificato' })
          .expect(401);
      });

      it('200 con token user', () => {
        return request(app.getHttpServer())
          .patch(`/posts/${createdPostId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ title: 'Post E2E user modificato' })
          .expect(200);
      });

      it('200 con token admin', () => {
        return request(app.getHttpServer())
          .patch(`/posts/${createdPostId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ title: 'Post E2E modificato da admin' })
          .expect(200);
      });
    });

    describe('DELETE /posts/:id', () => {
      it('401 senza token', () => {
        return request(app.getHttpServer())
          .delete(`/posts/${createdPostId}`)
          .expect(401);
      });

      it('403 con token user (non autorizzato)', () => {
        return request(app.getHttpServer())
          .delete(`/posts/${createdPostId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(403);
      });

      it('200 con token admin', () => {
        return request(app.getHttpServer())
          .delete(`/posts/${createdPostId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);
      });
    });
  });
});
