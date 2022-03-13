import {Component} from 'react';
import DropdownMultiselect from 'react-multiselect-dropdown-bootstrap';

class MultiSelector extends Component {

  // expects 'values', a list of object with 'key' and 'label' fields, 'name', 'onChangeCb'

  render() {
    console.log(this.props.values)
    return <div>
      <DropdownMultiselect options={this.props.values} name={this.props.name} handleOnChange={this.props.onChangeCb}/>
    </div>;
  }
}

export default MultiSelector;