import User from "../user/User";

class Session {
  constructor(
    currentRespondents,
    pendingRespondents,
    admin,
    status,
    currentElementNumber,
    template) {
    this.currentRespondents = currentRespondents || [];
    this.pendingRespondents = pendingRespondents || [];
    this.admin = admin;
    this.status = status;
    this.currentElementNumber = currentElementNumber;
    this.template = template;
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
      (sessionJson.joined_users || []).map(User.fromJson),
      (sessionJson.awaiting_users || []).map(User.fromJson),
      sessionJson.admin ? User.fromJson(sessionJson.admin) : sessionJson.admin,
      sessionJson.status,
      sessionJson.current_element_number,
      sessionJson.template
    );
  }
}

export default Session;