import config from "../config";
import Session from "../model/session/Session";
import User from "../model/user/User";

export async function joinSession() {
  return sendRequest('POST', 'session/join');
}

export async function beginSession() {
  return sendRequest('POST', 'session/begin');
}

export async function getSession() {
  const response = await sendRequest('GET', 'session');
  const sessionJson = await response.json();
  return new Session(
    sessionJson.joined_users,
    sessionJson.awaiting_users,
    sessionJson.admin,
    sessionJson.status
  );
}

export async function createSession(respondentIds) {
  return sendJsonRequest('POST', 'session/create', { respondents: respondentIds });
}

export async function login(formData) {
  const response = await sendRequest('POST', 'auth/login', formData);
  const userJson = await response.json();
  return new User(userJson.id, userJson.name, userJson.role);
}

export async function authCheck() {
  return sendRequest('GET', 'auth/check');
}

export async function getAllRespondents() {
  const response = await sendRequest('GET', 'user/respondent/get/all');
  if (response.ok) {
    const usersJson = await response.json();
    return usersJson.users.map(u => new User(u.id, u.name, u.role));
  } else {
    return [];
  }
}

async function sendRequest(method, path, body) {
  return fetch(`${config['backend']['uri']}/${path}`, {
    method: method,
    credentials: 'include',
    body: body
  });
}

async function sendJsonRequest(method, path, body) {
  return fetch(`${config['backend']['uri']}/${path}`, {
    method: method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}