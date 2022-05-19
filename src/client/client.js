import config from "../config";
import Session from "../model/session/Session";
import User from "../model/user/User";

const backendUrl = config['backend']['uri'];

export async function joinSession() {
  const response = await sendRequest('POST', 'session/join');
  const sessionJson = await response.json();
  return Session.fromJson(sessionJson);
}

export async function stopSession() {
  await sendRequest('POST', 'session/stop');
}

export async function getActiveSession() {
  const response = await sendRequest('GET', 'session/active');
  const sessionJson = await response.json();
  return Session.fromJson(sessionJson);
}

export async function createSession(respondentIds) {
  const response = await sendJsonRequest('POST', 'session/create', { respondents: respondentIds });
  const sessionJson = await response.json();
  return Session.fromJson(sessionJson);
}

export async function login(formData) {
  const response = await sendRequest('POST', 'auth/login', formData);
  const userJson = await response.json();
  return User.fromJson(userJson);
}

export async function logout() {
  await sendRequest('POST', 'auth/logout');
}

export async function submitRespondentData(formData) {
  await sendRequest('PUT', 'user/respondent/data', formData);
}

export async function authCheck() {
  const response = await sendRequest('GET', 'auth/check');
  if (response.ok) {
    const userJson = await response.json();
    return User.fromJson(userJson);
  } else {
    return null;
  }
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
  return fetch(`${backendUrl}/${path}`, {
    method: method,
    credentials: 'include',
    body: body
  });
}

async function sendJsonRequest(method, path, body) {
  return fetch(`${backendUrl}/${path}`, {
    method: method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}