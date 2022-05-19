import React, {Component} from "react";
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import * as websocketClient from "../../client/websocket";
import Modal from "react-bootstrap/Modal";

class WaitingToStartSession extends Component {
  // expects 'user', 'session', 'socket', 'onStopSessionCb'
  constructor(props) {
    super(props);
    this.state = {
      showCancelSessionModal: false
    }
  }

  async onBegin() {
    websocketClient.beginSession(this.props.socket);
  }

  render() {
    return (
      <Row>
        <Col>
          <b>ユーザーの参加を待っています</b>
          <br/>
          <Row>
            <Button hidden={!this.isAdminComponent()}
                    disabled={!this.isReadyToStart()}
                    variant='primary'
                    className='mt-2'
                    onClick={this.onBegin.bind(this)}>始める
            </Button>
          </Row>
          {this.renderStopSessionModal()}
          <Row>
            <Button hidden={!this.isAdminComponent()}
                    className='mt-2 btn-danger'
                    onClick={this.onOpenStopSessionModalClick.bind(this)}>
              セッションをキャンセルする
            </Button>
          </Row>

        </Col>
      </Row>
    );
  }

  // https://react-bootstrap.github.io/components/modal/
  renderStopSessionModal() {
    return (
      <Modal show={this.state.showStopSessionModal} onHide={this.onCloseStopSessionModalClick.bind(this)}>
        <Modal.Header closeButton/>
        <Modal.Body>セッションをキャンセルするしますか？</Modal.Body>
        <Modal.Footer>
          <Button className="btn-secondary" onClick={this.onCloseStopSessionModalClick.bind(this)}>閉じる</Button>
          <Button className="btn-danger" onClick={this.onStopSessionClick.bind(this)}>停止</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  onCloseStopSessionModalClick() {
    this.setState((previousState) => {
      return {...previousState, showStopSessionModal: false}
    });
  }

  onOpenStopSessionModalClick() {
    this.setState((previousState) => {
      return {...previousState, showStopSessionModal: true}
    });
  }

  async onStopSessionClick() {
    this.props.onStopSessionCb();
  }


  isAdminComponent() {
    return this.props.session.containsAdmin(this.props.user);
  }

  isReadyToStart() {
    return this.props.session.pendingRespondents.length === 0;
  }
}

export default WaitingToStartSession;