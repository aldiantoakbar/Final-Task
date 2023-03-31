import http from 'k6/http';
import { sleep } from 'k6';
import { group, check } from 'k6';

export default function () {
  const name = 'morpheus'
  const job = 'leader'
  const job2 = 'zion resident'
  const fullUrl = 'https://reqres.in/api/users/2'

  group('API Create', function () {
    const payload = JSON.stringify({
      name: name,
      job: job,
    });
    const headers = { 'Content-Type': 'application/json' };
    const res = http.post(fullUrl, payload, {
      headers,
    });

    check(res, {
      'Post status is 201': (r) => res.status === 201,
      'Post Assert Name ': (r) => res.json()["name"] === name,
      'Post Assert Job ': (r) => res.json()["job"] === job,
    });
  });

  group('API Update', function () {
    const payload = JSON.stringify({
      name: name,
      job: job2,
    });
    const headers = { 'Content-Type': 'application/json' };
    const res = http.put(fullUrl, payload, {
      headers,
    });

    console.log(res.json())

    check(res, {
      'Put status is 200': (r) => res.status === 200,
      'Put Assert Name ': (r) => res.json()["name"] === name,
      'Put Assert Job ': (r) => res.json()["job"] === job2,
    });
  });
}

