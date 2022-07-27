import QuestionAnswerModel from "../model/question/QuestionAnswerModel";

export function createAnswersList(user, respondents, question, answers) {
    return respondents
        .map((r) => {
            const answerIndex = answers.findIndex((a) => a.respondentId === r.id)
            return (answerIndex < 0) ?
                new QuestionAnswerModel(question.id, r.id, null, null) :
                answers[answerIndex]
        });
}