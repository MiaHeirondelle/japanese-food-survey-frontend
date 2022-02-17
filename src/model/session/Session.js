class Session {
  constructor(
    currentParticipants,
    pendingParticipants,
    admin,
    status) {
    this.currentParticipants = currentParticipants;
    this.pendingParticipants = pendingParticipants;
    this.admin = admin;
    this.status = status;
  }
}

export default Session;