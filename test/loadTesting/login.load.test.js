import http from 'k6/http';
import { check } from 'k6';

const baseUrl = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '5s', target: 10 },
    { duration: '20s', target: 30 },
    { duration: '5s', target: 0 }
  ],
  thresholds: {
    http_req_duration: ['p(95)<500']
  }
};

export default function () {
  const response = http.post(
    `${baseUrl}/login`,
    JSON.stringify({
      email: 'alice@example.com',
      password: 'password123'
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  check(response, {
    'login returns 200': (result) => result.status === 200,
    'login returns a token': (result) => Boolean(result.json('token'))
  });
}