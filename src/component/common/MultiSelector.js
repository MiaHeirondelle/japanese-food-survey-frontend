import {Component} from 'react';
import Multiselect from 'multiselect-react-dropdown';

class MultiSelector extends Component {

  // expects 'options', a list of object with 'id' and 'name' fields, 'name', 'onChangeCb'
  render() {
    return <div>
      <Multiselect options={this.props.options} displayValue='name' name={this.props.name} onSelect={this.props.onSelectCb}/>
    </div>;
  }
}

export default MultiSelector;