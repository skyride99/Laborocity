import React, { Component } from 'react';
import { WebView, View, PermissionsAndroid, Button, Platform  } from 'react-native';
import {Text} from 'react-native-elements';

const html = `
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Simple Button</title>
    </head>
    <body>
        <div style="text-align: center; margin-top: 30%">
        <button style="color: red; font-size: 50px;" onclick="myFunction()">Get Location</button>
        </div>
    </body >
    <script>

      function myFunction(){
        window.location.hash = false;
        window.postMessage('Yeah', '*');
      }
    </script>
    </html>
`;

export default class App extends Component {

    state ={
      latitude: '',
      longitude: ''
    }

    componentDidMount(){
      (Platform.OS === 'android') && PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
          .then(grantedPreviously => {

              const rationale = {
                  title: 'Location Access',
                  message: 'Need for detect your location to select location nearby you easily',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK'
              };

              if (!grantedPreviously) {
                  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, rationale)
                      .then(granted => {
                          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                              console.log('permission granted');
                          } else {
                            console.log('permission rejected');
                          }
                      }).catch( e => console.log(e))
              }
          }).catch(e => console.log(e))
    }

    getLocation= event => {
        navigator.geolocation.getCurrentPosition(
         (position) => {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
         },
        (error) => {
          alert(JSON.stringify(error));
          console.log(JSON.stringify(error));
        },
        {enableHighAccuracy: true, timeout: 6000}
       )
    }

    render() {
        return (
            <View style={{flex: 1}}>
              <WebView
                  javaScriptEnabled
                  source={{html, baseUrl: 'Welcome/'}}
                  style={{height: '90%'}}
                  onMessage={(event)=> {
                    console.warn('On Message Tiggered');
                    this.getLocation(event);

                  }}
                  onNavigationStateChange={event =>{
                    console.warn(event);
                    if(!event.loading && Platform.OS !== 'ios') {
                      this.getLocation(event);
                    }
                  }

                  }
              />
            <View style={{height: '10%'}}>
                <Text h4> Longitude: {this.state.longitude}</Text>
                <Text h4> Latitude: {this.state.latitude}</Text>
              </View>
            </View>
        );
    }
}
