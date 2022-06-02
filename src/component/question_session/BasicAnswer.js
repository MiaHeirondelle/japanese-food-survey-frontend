import React, {Component} from "react";
import AnswerScale from "./AnswerScale";
import Image from "react-bootstrap/Image"

class BasicAnswer extends Component {
  // Expects 'index', 'respondents', 'answer'

  render() {
    const userName = (this.props.respondents.find(u => u.id === this.props.answer.respondentId) || {name: 'unknown'}).name;
    return <tr>
      <td className='text-center'>
        <Image className='Avatar' src={`images/avatars/${this.props.index + 1}.png`} fluid={true}/>
        <h4 className='d-inline ms-4'>{userName}</h4>
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