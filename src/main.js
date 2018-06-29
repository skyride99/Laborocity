import React from 'react';
import {Button} from 'react-native';
import { createStackNavigator, createBottomTabNavigator} from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Home from './screens/home';
import Login from './screens/login';
import { Auth } from 'aws-amplify';
import Amplify from 'aws-amplify-react-native';
import aws_exports from './aws';

Amplify.configure(aws_exports);

const HomeStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: () => ({
     title: 'WELCOME'
   })
  },

  Home: {
    screen: Home,
    navigationOptions: ({navigation}) => ({
     title: 'Device Info',
     headerRight: (
       <Button
         onPress={() => {
           Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log(err));
            navigation.popToTop();
          }}
         title='Logout'
       />
     ),
   })
  }
});

const initialState = {
  email: '',
  password: ''
};

function reducer(state = initialState, action) {
  switch(action.type) {
    case 'SET_EMAIL':
      return {
        ...state,
        email: action.email
      };
    case 'SET_PASSWORD':
      return {
        ...state,
        password: action.password
      };
    default:
      return state;
  }
}

const store = createStore(reducer);


export default class Main extends React.Component {
  render(){
    return(
      <Provider store={store}>
          <HomeStack />
      </Provider>
    );
  }
}
