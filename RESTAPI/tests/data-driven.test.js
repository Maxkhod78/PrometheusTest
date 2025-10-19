const HttpClient = require('../http/HttpClient');
const { expectResponse } = require('../assertions/FluentAssertions');
const fs = require('fs');
const path = require('path');

describe('Data-Driven Tests', () => {
  let httpClient;
  let testData;

  beforeAll(() => {
    httpClient = new HttpClient();

    // Load test data from JSON file
    const testDataPath = path.join(__dirname, '../data/test-data.json');
    const rawData = fs.readFileSync(testDataPath, 'utf8');
    testData = JSON.parse(rawData);
  });

  // Skip this test suite if testData is not loaded properly
  if (!testData || !Array.isArray(testData)) {
    test.skip('Test data not loaded properly', () => {});
    return;
  }

  describe('POST /posts - Data-driven creation tests', () => {
    test.each(testData.map(item => [
      item.testName,
      item.userId,
      item.title,
      item.body,
      item.expectedStatus
    ]))(
      'should create post: %s',
      async (testName, userId, title, body, expectedStatus) => {
        const postData = {
          userId,
          title,
          body
        };

        const response = await httpClient.post('/posts', postData);

        expectResponse(response)
          .toHaveStatus(expectedStatus)
          .and.toHaveBody()
          .and.toBeObject()
          .and.toHaveProperties(['id', 'userId', 'title', 'body']);

        // Verify the returned data matches what we sent
        expect(response.data.userId).toBe(userId);
        expect(response.data.title).toBe(title);
        expect(response.data.body).toBe(body);
        expect(response.data.id).toBeDefined();
      }
    );
  });

  describe('GET /posts - Data-driven retrieval tests', () => {
    // Create test data first, then retrieve it
    let createdPostIds = [];

    beforeAll(async () => {
      // Create posts using the test data
      for (const testItem of testData.slice(0, 3)) { // Use first 3 items to avoid too many requests
        const response = await httpClient.post('/posts', {
          userId: testItem.userId,
          title: testItem.title,
          body: testItem.body
        });
        createdPostIds.push(response.data.id);
      }
    });

    test.each(createdPostIds.map((id, index) => [
      id,
      testData[index].title,
      testData[index].userId
    ]))(
      'should retrieve post with ID %i',
      async (postId, expectedTitle, expectedUserId) => {
        const response = await httpClient.get(`/posts/${postId}`);

        expectResponse(response)
          .toHaveStatus(200)
          .and.toHaveBody()
          .and.toBeObject()
          .and.toHaveProperties(['id', 'userId', 'title', 'body']);

        expect(response.data.id).toBe(postId);
        expect(response.data.title).toBe(expectedTitle);
        expect(response.data.userId).toBe(expectedUserId);
      }
    );
  });

  describe('PUT /posts - Data-driven update tests', () => {
    test.each([
      [1, 'Updated Title 1', 'Updated Body 1'],
      [2, 'Updated Title 2', 'Updated Body 2'],
      [3, 'Updated Title 3', 'Updated Body 3']
    ])(
      'should update post %i with new content',
      async (postId, newTitle, newBody) => {
        const updateData = {
          userId: 1,
          title: newTitle,
          body: newBody
        };

        const response = await httpClient.put(`/posts/${postId}`, updateData);

        expectResponse(response)
          .toHaveStatus(200)
          .and.toHaveBody()
          .and.toBeObject();

        expect(response.data.id).toBe(postId);
        expect(response.data.title).toBe(newTitle);
        expect(response.data.body).toBe(newBody);
      }
    );
  });

  describe('DELETE /posts - Data-driven deletion tests', () => {
    test.each([
      [101, 'Delete test post 1'],
      [102, 'Delete test post 2'],
      [103, 'Delete test post 3']
    ])(
      'should delete post %i: %s',
      async (postId, description) => {
        const response = await httpClient.delete(`/posts/${postId}`);

        // JSONPlaceholder returns 200 for successful deletion
        expectResponse(response)
          .toHaveStatus(200);
      }
    );
  });

  describe('Query parameter tests', () => {
    test.each([
      [1, 10], // userId, expected count
      [2, 10],
      [3, 10]
    ])(
      'should filter posts by userId %i and return approximately %i posts',
      async (userId, expectedCount) => {
        const response = await httpClient.get(`/posts?userId=${userId}`);

        expectResponse(response)
          .toHaveStatus(200)
          .and.toHaveBody()
          .and.toBeArray();

        // All returned posts should belong to the specified user
        response.data.forEach(post => {
          expect(post.userId).toBe(userId);
        });

        // JSONPlaceholder returns 10 posts per user
        expect(response.data.length).toBe(expectedCount);
      }
    );
  });

  describe('Edge case data-driven tests', () => {
    test.each([
      ['', '', 201], // Empty strings
      ['   ', '   ', 201], // Whitespace only
      ['Title with "quotes"', 'Body with \'single quotes\'', 201], // Quotes
      ['Title with newlines\nand tabs\t', 'Body with newlines\nand tabs\t', 201] // Newlines and tabs
    ])(
      'should handle special characters in post creation',
      async (title, body, expectedStatus) => {
        const postData = {
          userId: 1,
          title,
          body
        };

        const response = await httpClient.post('/posts', postData);

        expectResponse(response)
          .toHaveStatus(expectedStatus)
          .and.toHaveBody();

        expect(response.data.title).toBe(title);
        expect(response.data.body).toBe(body);
      }
    );
  });
});