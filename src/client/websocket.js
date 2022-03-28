import config from "../config";

const backendUrl = new URL(config['backend']['uri']);
backendUrl.protocol = backendUrl.protocol === 'https:' ? 'wss' : 'ws';
const socketUrl = backendUrl.href;

export function sendBeginSession(socket) {
  const json = {
    'type': 'begin_session'
  }
  sendMessage(socket, JSON.stringify(json));
}

export function sendReadyForNextElement(socket) {
  const json = {
    'type': 'ready_for_next_element'
  }
  sendMessage(socket, JSON.stringify(json));
}

export function provideQuestionAnswer(socket, questionId, scaleValue, comment) {
  const json = {
    'type': 'provide_answer',
    'question_id': questionId,
    'scale_value': scaleValue,
    'comment': comment
  }
  sendMessage(socket, JSON.stringify(json));
}

export async function connectToSession() {
  return await connect('session/connect');
}

async function connect(path) {
  return new WebSocket(`${socketUrl}${path}`);
}

function sendMessage(socket, message) {
  waitForConnection(socket, () => socket.send(message), 1000);
}

function waitForConnection(socket, callback, interval) {
  if (socket.readyState === 1) {
    callback();
  } else {
    setTimeout(() => waitForConnection(socket, callback, interval), interval);
  }
}