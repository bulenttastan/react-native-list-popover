/**
 * ListPopover - Popover rendered with a selectable list.
 */
"use strict";

var React = require('react-native');
var {
  ListView,
  PropTypes,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  View
} = React;
var SCREEN_HEIGHT = Dimensions.get('window').height;
var noop = () => {};
var ds = new ListView.DataSource({rowHasChanged: (r1,r2)=>(r1!==r2)});


var ListPopover = React.createClass({
  propTypes: {
    list: PropTypes.array.isRequired,
    isVisible: PropTypes.bool,
    onClick: PropTypes.func,
    onClose: PropTypes.func,
  },
  getDefaultProps: function() {
    return {
      list: [""],
      isVisible: false,
      onClick: noop,
      onClose: noop
    };
  },
  getInitialState: function() {
    return {
      dataSource: ds.cloneWithRows(this.props.list)
    };
  },
  componentWillReceiveProps: function(nextProps:any) {
    if (nextProps.list !== this.props.list) {
      this.setState({dataSource: ds.cloneWithRows(nextProps.list)});
    }
  },
  handleClick: function(data) {
    this.props.onClick(data);
    this.props.onClose();
  },
  renderRow: function(rowData) {
    var separatorStyle = this.props.separatorStyle || DefaultStyles.separator;
    var rowTextStyle = this.props.rowText || DefaultStyles.rowText;

    var separator = <View style={separatorStyle}/>;
    if (rowData === this.props.list[0]) {
      separator = null;
    }

    var row = <Text style={rowTextStyle}>{rowData}</Text>
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
  },
  renderList: function() {
    var styles = this.props.style || DefaultStyles;
    var maxHeight = {};
    if (this.props.list.length > 12) {
      maxHeight = {height: SCREEN_HEIGHT * 3/4};
    }
    return (
      <ListView
        style={maxHeight}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => this.renderRow(rowData)}
        automaticallyAdjustContentInsets={false}
      />
    );
  },
  render: function() {
    var containerStyle = this.props.containerStyle || DefaultStyles.container;
    var popoverStyle = this.props.popoverStyle || DefaultStyles.popover;

    if (this.props.isVisible) {
      return (
        <TouchableOpacity onPress={this.props.onClose}>
          <View style={containerStyle}>
            <View style={popoverStyle}>
              {this.renderList()}
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (<View/>);
    }
  }
});


var DefaultStyles = StyleSheet.create({
  container: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  popover: {
    margin: 10,
    borderRadius: 3,
    padding: 3,
    backgroundColor: '#ffffff',
  },
  rowText: {
    padding: 10,
  },
  separator: {
    height: 0.5,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: '#CCC',
  },
});

module.exports = ListPopover;
