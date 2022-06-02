import React, {Component} from "react";
import AnswerScale from "./AnswerScale";

class BasicAnswer extends Component {
  // Expects 'respondents', 'answer'

  render() {
    const userName = (this.props.respondents.find(u => u.id === this.props.answer.respondentId) || {name: 'unknown'}).name;
    return <tr>
      <td className='text-center'>
        <h4>{userName}</h4>
      </td>
      <td>
        <AnswerScale answerValue={this.props.answer.value} respondentId={this.props.answer.respondentId}/>
      </td>
      <td>
        {this.props.answer.comment}
      </td>
    </tr>
  }
}

export default BasicAnswer;