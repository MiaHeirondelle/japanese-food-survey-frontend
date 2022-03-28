import config from "../config";

const backendUrl = new URL(config['backend']['uri']);
backendUrl.protocol = backendUrl.protocol === 'https:' ? 'wss' : 'ws';
const socketUrl = backendUrl.href;

export function sendBeginSession(socket) {
  const json = {
    'type': 'begin_session'
  }
  socket.send(JSON.stringify(json));
}

export function sendReadyForNextElement(socket) {
  const json = {
    'type': 'ready_for_next_element'
  }
  socket.send(JSON.stringify(json));
}

export function provideQuestionAnswer(socket, questionId, scaleValue, comment) {
  const json = {
    'type': 'provide_answer',
    'question_id': questionId,
    'scale_value': scaleValue,
    'comment': comment
  }
  socket.send(JSON.stringify(json));
}

export async function connectToSession() {
  return await connect('session/connect');
}

async function connect(path) {
  return new WebSocket(`${socketUrl}${path}`);
}