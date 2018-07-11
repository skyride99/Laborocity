import React, { Component } from 'react';
import { WebView, View, PermissionsAndroid, Button  } from 'react-native';
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
      }
    </script>
    </html>
`;

export default class App extends Component {

    state ={
      latitude: '',
      longitude: ''
    }

    render() {
        return (
            <View style={{flex: 1}}>
              <WebView
                  javaScriptEnabled
                  source={{html, baseUrl: 'Welcome/'}}
                  style={{height: '90%'}}
                  onMessage={(m)=> {
                    console.warn('On Message Tiggered');
                  }}
                  onNavigationStateChange={event =>{
                    console.warn(event);
                    if(!event.loading) {
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
