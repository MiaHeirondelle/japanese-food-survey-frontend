class BasicQuestionModel {

  constructor(
    questionId,
    questionNumber,
    questionText,
    scaleTextLeft,
    scaleTextRight) {
    this.questionId = questionId;
    this.questionNumber = questionNumber;
    this.questionText = questionText;
    this.scaleTextLeft = scaleTextLeft;
    this.scaleTextRight = scaleTextRight;
  }
}

export default BasicQuestionModel;