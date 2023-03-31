import http from 'k6/http';
import { sleep } from 'k6';
import { group, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export function handleSummary(data) {
  return {
    "result.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

export const options = 
{
  thresholds: {
    http_req_failed: ['rate<0.01'], 
    http_req_duration: ['p(95)<200'], 
  },
    vus: 1000,
    iterations: 3500,
    duration : '30s'
}

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

    check(res, {
      'Put status is 200': (r) => res.status === 200,
      'Put Assert Name ': (r) => res.json()["name"] === name,
      'Put Assert Job ': (r) => res.json()["job"] === job2,
    });
  });
}

