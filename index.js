/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Text.defaultProps = Text.defaultProps || {}
// Text.defaultProps.allowFontScaling = false
LogBox.ignoreLogs(['Bottom Tab Navigator:']); // Ignore log notification by message
AppRegistry.registerComponent(appName, () => App);