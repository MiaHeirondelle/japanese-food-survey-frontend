class Session {
  constructor(
    currentRespondents,
    pendingRespondents,
    admin,
    status) {
    this.currentRespondents = currentRespondents || [];
    this.pendingRespondents = pendingRespondents || [];
    this.admin = admin;
    this.status = status;
  }

  containsPendingRespondent(user) {
    return this.pendingRespondents.includes(user.id);
  }

  containsCurrentRespondent(user) {
    return this.currentRespondents.includes(user.id);
  }

  containsRespondent(user) {
    return this.containsPendingRespondent(user) || this.containsCurrentRespondent(user);
  }

  containsAdmin(user) {
    return this.admin === user.id;
  }

  containsParticipant(user) {
    return this.containsCurrentRespondent(user) || this.containsAdmin(user);
  }
}

export default Session;