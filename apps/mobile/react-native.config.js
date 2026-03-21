const path = require('path')

module.exports = {
  dependencies: {
    'react-native-purchases': {
      root: path.resolve(__dirname, 'node_modules/react-native-purchases'),
    },
    'react-native-purchases-ui': {
      root: path.resolve(__dirname, 'node_modules/react-native-purchases-ui'),
    },
  },
}
