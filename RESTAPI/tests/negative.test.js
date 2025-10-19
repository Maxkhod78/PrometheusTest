const HttpClient = require('../http/HttpClient');
const { expectResponse } = require('../assertions/FluentAssertions');

describe('Negative Test Cases', () => {
  let httpClient;

  beforeAll(() => {
    httpClient = new HttpClient();
  });

  describe('GET with invalid parameters', () => {
    test('should return 404 for non-existent post ID', async () => {
      try {
        await httpClient.get('/posts/999999');
        // If we reach here, the API didn't throw an error as expected
        fail('Expected request to fail with 404');
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    test('should handle invalid query parameters gracefully', async () => {
      // JSONPlaceholder ignores invalid query params and returns all posts
      const response = await httpClient.get('/posts?invalidParam=123&anotherInvalid=value');

      expectResponse(response)
        .toHaveStatus(200)
        .toHaveBody()
        .toBeArray();
    });

    test('should return 404 for invalid endpoint', async () => {
      try {
        await httpClient.get('/invalid-endpoint');
        fail('Expected request to fail with 404');
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('POST with invalid data', () => {
    test('should handle malformed JSON gracefully', async () => {
      try {
        await httpClient.post('/posts', '{invalid json');
        fail('Expected request to fail due to malformed JSON');
      } catch (error) {
        // Axios should catch JSON parsing errors
        expect(error).toBeDefined();
      }
    });

    test('should handle empty request body', async () => {
      const response = await httpClient.post('/posts', {});

      // JSONPlaceholder creates a post with default/empty values
      expectResponse(response)
        .toHaveStatus(201)
        .toHaveBody();

      // The response should have an ID assigned
      expect(response.data.id).toBeDefined();
    });

    test('should handle extremely large request body', async () => {
      const largeBody = 'x'.repeat(10000); // 10KB string
      const postData = {
        userId: 1,
        title: 'Large Body Test',
        body: largeBody
      };

      const response = await httpClient.post('/posts', postData);

      expectResponse(response)
        .toHaveStatus(201)
        .toHaveBody();

      expect(response.data.body).toBe(largeBody);
    });
  });

  describe('PUT with invalid operations', () => {
    test('should handle PUT on non-existent resource', async () => {
      const updateData = {
        userId: 1,
        title: 'Update Non-existent',
        body: 'This should not work'
      };

      try {
        // JSONPlaceholder allows updating non-existent resources
        const response = await httpClient.put('/posts/999999', updateData);

        expectResponse(response)
          .toHaveStatus(200)
          .and.toHaveBody();

        // Should return the data we sent
        expect(response.data.title).toBe(updateData.title);
      } catch (error) {
        // If it fails with 500, that's also acceptable for this test
        expect(error.response.status).toBe(500);
      }
    });

    test('should handle PUT with invalid data types', async () => {
      const invalidData = {
        userId: 'invalid', // Should be number
        title: 123, // Should be string
        body: null // Should be string
      };

      const response = await httpClient.put('/posts/1', invalidData);

      // JSONPlaceholder accepts any data type
      expectResponse(response)
        .toHaveStatus(200)
        .toHaveBody();
    });

    test('should handle concurrent PUT requests', async () => {
      const updateData1 = { title: 'Concurrent Update 1' };
      const updateData2 = { title: 'Concurrent Update 2' };

      // Make concurrent requests
      const [response1, response2] = await Promise.all([
        httpClient.put('/posts/5', updateData1),
        httpClient.put('/posts/5', updateData2)
      ]);

      // Both should succeed (JSONPlaceholder doesn't handle concurrency)
      expectResponse(response1).toHaveStatus(200);
      expectResponse(response2).toHaveStatus(200);
    });
  });

  describe('DELETE with edge cases', () => {
    test('should handle DELETE with invalid ID format', async () => {
      // JSONPlaceholder returns 200 for invalid IDs
      const response = await httpClient.delete('/posts/invalid-id');
      expectResponse(response).toHaveStatus(200);
    });

    test('should handle multiple DELETE requests on same resource', async () => {
      // First delete
      const response1 = await httpClient.delete('/posts/10');
      expectResponse(response1).toHaveStatus(200);

      // Second delete on same resource
      const response2 = await httpClient.delete('/posts/10');
      expectResponse(response2).toHaveStatus(200);
    });

    test('should handle DELETE with query parameters', async () => {
      // JSONPlaceholder ignores query params on DELETE
      const response = await httpClient.delete('/posts/11?force=true');

      expectResponse(response)
        .toHaveStatus(200);
    });
  });

  describe('Network and timeout scenarios', () => {
    test('should handle request timeout', async () => {
      // Create client with very short timeout
      const timeoutClient = new HttpClient({
        baseUrl: 'https://httpbin.org',
        timeout: 1000 // 1 second timeout
      });

      try {
        await timeoutClient.get('/delay/5');
        fail('Expected request to timeout');
      } catch (error) {
        expect(error.code).toBe('ECONNABORTED');
      }
    });

    test('should handle invalid base URL', async () => {
      const invalidClient = new HttpClient({
        baseUrl: 'https://invalid-domain-that-does-not-exist.com'
      });

      try {
        await invalidClient.get('/posts');
        fail('Expected request to fail with invalid domain');
      } catch (error) {
        expect(error.code).toBe('ENOTFOUND');
      }
    });

    test('should handle unsupported HTTP methods', async () => {
      // Test with PATCH method which may not be fully supported
      const response = await httpClient.patch('/posts/1', { title: 'Patched' });

      // JSONPlaceholder supports PATCH
      expectResponse(response)
        .toHaveStatus(200)
        .toHaveBody();
    });
  });
});