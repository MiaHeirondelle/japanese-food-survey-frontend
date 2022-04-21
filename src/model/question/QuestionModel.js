class QuestionModel {

  constructor(
    id,
    text,
    scaleTextLeft,
    scaleTextRight) {
    this.id = id;
    this.text = text;
    this.scaleTextLeft = scaleTextLeft;
    this.scaleTextRight = scaleTextRight;
  }

  static fromJson(basicQuestionJson) {
    return new QuestionModel(
      basicQuestionJson.id,
      basicQuestionJson.text,
      basicQuestionJson.scale_text.min_bound_caption,
      basicQuestionJson.scale_text.max_bound_caption,
    )
  }
}

export default QuestionModel;