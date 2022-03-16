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
    return this.pendingRespondents.some((u) => u.id === user.id);
  }

  containsCurrentRespondent(user) {
    return this.currentRespondents.some((u) => u.id === user.id);
  }

  containsRespondent(user) {
    return this.containsPendingRespondent(user) || this.containsCurrentRespondent(user);
  }

  containsAdmin(user) {
    return this.admin.id === user.id;
  }

  containsParticipant(user) {
    return this.containsCurrentRespondent(user) || this.containsAdmin(user);
  }

  static fromJson(sessionJson) {
    return new Session(
      sessionJson.joined_users,
      sessionJson.awaiting_users,
      sessionJson.admin,
      sessionJson.status
    );
  }
}

export default Session;