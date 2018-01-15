/**
 * ListPopover - Popover rendered with a selectable list.
 */
"use strict";

import React from 'react';
import PropTypes from 'prop-types';
import {
  ListView,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  View
} from 'react-native';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const noop = () => {};
const ds = new ListView.DataSource({rowHasChanged: (r1,r2)=>(r1!==r2)});

class ListPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: ds.cloneWithRows(this.props.list)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.list !== this.props.list) {
      this.setState({dataSource: ds.cloneWithRows(nextProps.list)});
    }
  }

  handleClick(data) {
    this.props.onClick(data);
    this.props.onClose();
  }

  renderRow(rowData) {
    const separatorStyle = this.props.separatorStyle || DefaultStyles.separator;
    const rowTextStyle = this.props.rowText || DefaultStyles.rowText;

    let separator = <View style={separatorStyle}/>;
    if (rowData === this.props.list[0]) {
      separator = null;
    }

    let row = <Text style={rowTextStyle}>{rowData}</Text>
    if (this.props.renderRow) {
      row = this.props.renderRow(rowData);
    }

    return (
      <View>
        {separator}
        <TouchableOpacity onPress={() => this.handleClick(rowData)}>
          {row}
        </TouchableOpacity>
      </View>
    );
  }

  renderList() {
    const styles = this.props.style || DefaultStyles;
    let maxHeight = {};
    if (this.props.list.length > 12) {
      maxHeight = {height: SCREEN_HEIGHT * 3/4};
    }
    return (
      <ListView
        style={maxHeight}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => this.renderRow(rowData)}
      />
    );
  }

  render() {
    const containerStyle = this.props.containerStyle || DefaultStyles.container;
    const popoverStyle = this.props.popoverStyle || DefaultStyles.popover;

    if (this.props.isVisible) {
      return (
        <TouchableOpacity onPress={this.props.onClose} style={containerStyle}>
          <View style={popoverStyle}>
            {this.renderList()}
          </View>
        </TouchableOpacity>
      );
    } else {
      return (<View/>);
    }
  }
}

ListPopover.propTypes = {
  list: PropTypes.array.isRequired,
  isVisible: PropTypes.bool,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
};

ListPopover.defaultProps = {
  list: [""],
  isVisible: false,
  onClick: noop,
  onClose: noop
};

const DefaultStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: 10,
  },
  popover: {
    backgroundColor: '#fff',
    borderRadius: 3,
    padding: 3,
    width: '96%',
  },
  rowText: {
    padding: 10,
  },
  separator: {
    backgroundColor: '#ccc',
    height: 0.5,
    marginLeft: 8,
    marginRight: 8,
  },
});

export default ListPopover;
