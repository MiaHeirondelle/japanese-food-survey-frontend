import QuestionAnswerModel from "../model/question/QuestionAnswerModel";

export function createAnswersList(user, respondents, question, answers) {
  const userAnswerIndex = answers.findIndex(a => a.respondentId === user.id);
  const userAnswer = userAnswerIndex >= 0 ? [answers[userAnswerIndex]] : [];
  const otherAnswers = answers.slice();
  if (userAnswerIndex >= 0) {
    otherAnswers.splice(userAnswerIndex, 1);
  }
  const missingAnswers = respondents
    .filter((r) => answers.findIndex((a) => a.respondentId === r.id) < 0)
    .map((r) => new QuestionAnswerModel(question.id, r.id, null, null));
  otherAnswers.push(...missingAnswers);

  otherAnswers
    .sort((a1, a2) => {
      const u1Name = (respondents.find((r) => r.id === a1.respondentId) || {name: 'undefined'}).name;
      const u2Name = (respondents.find((r) => r.id === a2.respondentId) || {name: 'undefined'}).name;
      return u1Name.localeCompare(u2Name);
    });

  return userAnswer.concat(otherAnswers);
}