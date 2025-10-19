const HttpClient = require('../http/HttpClient');
const { expectResponse } = require('../assertions/FluentAssertions');
const PostDTO = require('../dto/PostDTO');

describe('Posts API Tests', () => {
  let httpClient;

  beforeAll(() => {
    httpClient = new HttpClient();
  });

  // GET Tests
  describe('GET /posts', () => {
    test('should get all posts', async () => {
      const response = await httpClient.get('/posts');

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data).toHaveLength(100); // JSONPlaceholder returns 100 posts
    });

    test('should get post by ID', async () => {
      const response = await httpClient.get('/posts/1');

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(typeof response.data).toBe('object');
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('userId');
      expect(response.data).toHaveProperty('title');
      expect(response.data).toHaveProperty('body');

      // Verify the returned post has the correct ID
      expect(response.data.id).toBe(1);
    });

    test('should get posts by user ID using query params', async () => {
      const response = await httpClient.get('/posts?userId=1');

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);

      // All returned posts should belong to user 1
      response.data.forEach(post => {
        expect(post.userId).toBe(1);
      });
    });
  });

  // POST Tests
  describe('POST /posts', () => {
    test('should create new post', async () => {
      const newPost = new PostDTO(null, 1, 'Test Title', 'Test Body');

      const response = await httpClient.post('/posts', newPost.toJson());

      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(typeof response.data).toBe('object');
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('userId');
      expect(response.data).toHaveProperty('title');
      expect(response.data).toHaveProperty('body');

      // Verify the returned data matches what we sent
      expect(response.data.userId).toBe(newPost.userId);
      expect(response.data.title).toBe(newPost.title);
      expect(response.data.body).toBe(newPost.body);
      // JSONPlaceholder assigns an ID (usually 101 for new posts)
      expect(response.data.id).toBeDefined();
    });

    test('should create post with nested data', async () => {
      const postData = {
        userId: 2,
        title: 'Nested Test Post',
        body: 'This is a test post with additional metadata',
        metadata: {
          tags: ['test', 'api'],
          priority: 'high'
        }
      };

      const response = await httpClient.post('/posts', postData);

      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(typeof response.data).toBe('object');

      // JSONPlaceholder may not preserve extra fields, but should return the core fields
      expect(response.data.userId).toBe(postData.userId);
      expect(response.data.title).toBe(postData.title);
      expect(response.data.body).toBe(postData.body);
    });

    test('should create post with custom headers', async () => {
      const newPost = new PostDTO(null, 3, 'Custom Header Post', 'Testing custom headers');

      const response = await httpClient.post('/posts', newPost.toJson(), {
        headers: {
          'X-Custom-Header': 'test-value',
          'X-Request-ID': '12345'
        }
      });

      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();

      // Verify the post was created successfully
      expect(response.data.title).toBe(newPost.title);
    });
  });

  // PUT Tests
  describe('PUT /posts/:id', () => {
    test('should update existing post', async () => {
      const updatedPost = new PostDTO(1, 1, 'Updated Title', 'Updated Body Content');

      const response = await httpClient.put('/posts/1', updatedPost.toJson());

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(typeof response.data).toBe('object');
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('userId');
      expect(response.data).toHaveProperty('title');
      expect(response.data).toHaveProperty('body');

      // Verify the post was updated
      expect(response.data.id).toBe(1);
      expect(response.data.title).toBe(updatedPost.title);
      expect(response.data.body).toBe(updatedPost.body);
    });

    test('should update partial post data', async () => {
      const partialUpdate = {
        title: 'Partially Updated Title'
      };

      const response = await httpClient.put('/posts/2', partialUpdate);

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();

      // JSONPlaceholder preserves the original data and merges updates
      expect(response.data.id).toBe(2);
      expect(response.data.title).toBe(partialUpdate.title);
    });

    test('should update post with different user ID', async () => {
      const updatedPost = new PostDTO(3, 5, 'User Change Test', 'Changing user ID');

      const response = await httpClient.put('/posts/3', updatedPost.toJson());

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();

      expect(response.data.id).toBe(3);
      expect(response.data.userId).toBe(updatedPost.userId);
      expect(response.data.title).toBe(updatedPost.title);
    });
  });

  // DELETE Tests
  describe('DELETE /posts/:id', () => {
    test('should delete existing post', async () => {
      const response = await httpClient.delete('/posts/1');

      // JSONPlaceholder returns 200 for successful deletion
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(typeof response.data).toBe('object');
    });

    test('should delete non-existent post (graceful handling)', async () => {
      // JSONPlaceholder doesn't actually delete posts, but returns success
      const response = await httpClient.delete('/posts/999');

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
    });

    test('should delete post with authentication headers', async () => {
      // Set mock authorization header
      httpClient.setAuthorization('fake-token');

      const response = await httpClient.delete('/posts/4');

      expectResponse(response)
        .toHaveStatus(200);

      // Clear authorization for other tests
      httpClient.clearAuthorization();
    });
  });
});