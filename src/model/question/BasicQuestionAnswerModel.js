class BasicQuestionAnswerModel {
  constructor(
    questionId,
    respondentId,
    value,
    comment) {
    this.questionId = questionId;
    this.respondentId = respondentId;
    this.value = value;
    this.comment = comment;
  }

  static fromJson(basicAnswerJson) {
    return new BasicQuestionAnswerModel(
      basicAnswerJson.question_id,
      basicAnswerJson.respondent_id,
      basicAnswerJson.value,
      basicAnswerJson.comment
    )
  }
}

export default BasicQuestionAnswerModel;