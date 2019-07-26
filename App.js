/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    ActivityIndicator, Image,
    Platform, StatusBar,
    StyleSheet,
    Text,
    View, WebView, BackHandler, Linking,NetInfo,Alert
} from 'react-native';
import OneSignal from "react-native-onesignal";

export default class App extends Component<{}> {

    state = {webviewLoaded: false, splashed: false, backButtonEnabled: true, html: "",isConnected: true};

    WEBVIEW_REF = "MyWebView";

    siteUrl = "https://chicophicial.com";

    whiteListUrls = [
        "chicophicial.com",
        "www.facebook.com",
        "facebook.com",
        "login.facebook.com",
        "www.login.facebook.com",
        "fbcdn.net",
        "www.fbcdn.net",
        "fbcdn.com",
        "www.fbcdn.com",
        "static.ak.fbcdn.net",
        "static.ak.connect.facebook.com",
        "connect.facebook.net",
        "www.connect.facebook.net",
        "apps.facebook.com"
    ];


    handleFirstConnectivityChange = (connectionInfo)=>this.setState({isConnected:connectionInfo.type !== "none"});

    _onLoadEnd() {
        this.setState({webviewLoaded: true});
    }

    _onLoadStart() {
        this.setState({webviewLoaded: false});
    }

    componentDidMount() {

        NetInfo.addEventListener('connectionChange', this.handleFirstConnectivityChange);
        BackHandler.addEventListener('hardwareBackPress', this.backHandler);
        setTimeout(() => {
            this.setState({
                splashed: true
            })
        }, 5000);
    }


    componentWillMount() {
        OneSignal.init("70383c6d-8853-4fe6-87f6-d9ad3ec0a32c");
        OneSignal.configure();
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        ///  OneSignal.addEventListener('registered', this.onRegistered);
        OneSignal.addEventListener('ids', this.onIds);
    }

    componentWillUnmount() {
        NetInfo.removeEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange,
        );
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        // OneSignal.removeEventListener('registered', this.onRegistered);
        OneSignal.removeEventListener('ids', this.onIds);

        BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
    }

    onReceived(notification) {
        //console.log("Notification received: ", notification);
    }

    onOpened(openResult) {
        /*console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);*/
    }

    onRegistered(notifData) {
        /*console.log("Device had been registered for push notifications!", notifData);*/
    }

    onIds(device) {
        //console.log('Device info: ', device);
    }

    backHandler = () => {
        if (this.state.backButtonEnabled) {
            this.refs[this.WEBVIEW_REF].goBack();
            return true;
        }
    };

    splash() {
        return (
            <View
                style={{position: "absolute", backgroundColor: "#fff", top: 0, left: 0, width: "100%", height: "100%"}}>
                <Image source={require('./src/assets/images/splash.jpg')} style={{width: "100%", height: "100%"}}
                       resizeMode={"cover"}/>
                <Text style={{fontFamily: "Montserrat-Regular", color: "#000", alignSelf: "center", marginTop: 20}}>Your
                    GSM Companion!</Text>
                <View style={{
                    backgroundColor:"rgba(0,0,0,0.7)",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    display: "none"
                }}>
                    <Image source={require('./src/assets/images/logo.png')} resizeMode={"contain"}
                           style={{width: "80%", height: 150}}/>
                </View>
                <ActivityIndicator size={(Platform.OS === "ios" ? 1 : 50)} color={"#fff"}
                                   style={{
                                       flex: 1,
                                       marginBottom: 40,
                                       position: "absolute",
                                       bottom: "17%",
                                       alignSelf: "center"
                                   }}/>
                <Text style={{
                    fontFamily: "Montserrat-Light",
                    color: "#FFF",
                    alignSelf: "center",
                    position: "absolute",
                    bottom: 30
                }}>W W W . C H I C O P H I C I A L . C O M</Text>
            </View>
        )
    }

    loading() {
        return (
            <View style={{
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.5)",
                bottom: 0,
                left: 0,
                width: "100%",
                height: 50,
                alignItems: "center",
                justifyContent: "center"
            }}>
                <View>
                    <View style={{flexDirection: "row", alignSelf: "center"}}>
                        <ActivityIndicator size={(Platform.OS === "ios" ? 1 : 30)} color={"#fff"}/>
                        <Text style={{
                            fontFamily: "Montserrat-Regular",
                            color: "#fff",
                            alignSelf: "center",
                            marginTop: 5,
                            marginLeft: 10
                        }}>Loading...</Text>
                    </View>
                </View>
            </View>
        )
    }

    onNavigationStateChange = (navState) => {
        this.setState({
            backButtonEnabled: navState.canGoBack
        });
        let cango = false;
        for (let ui = 0; ui < this.whiteListUrls.length; ui++) {
            if (navState.url.indexOf(this.whiteListUrls[ui]) >= 0) {
                cango = true;
            }
        }
        if (!cango) {
            Linking.openURL(navState.url);
            this.refs[this.WEBVIEW_REF].stopLoading();
        }
        return cango;
    };


    onShouldStartLoadWithRequest(e) {
        let cango = false;
        for (let ui = 0; ui < this.whiteListUrls.length; ui++) {
            if (e.url.indexOf(this.whiteListUrls[ui]) >= 0) {
                cango = true;
            }
        }
        if (!cango) {
            Linking.openURL(e.url);
            this.refs[this.WEBVIEW_REF].stopLoading();
        }
        return cango;
    }

    noInternetConnection = ()=>(
      <View style={{flex:1,backgroundColor:"#fff",alignItems:"center",justifyContent:"center"}}>
        <View style={{alignItems:"center"}}>
            <Image source={require('./src/assets/images/no-wifi.png')} style={{tintColor:"#5b133c",width:100,height:100}} />
            <Text style={{marginTop:50,fontSize:25,color:"#5b133c"}}>No Internet Connection!</Text>
            <Image source={require('./src/assets/images/logo.png')} style={{width:150,height:100}} resizeMode={"contain"} />
        </View>
      </View>
    );

    render() {
        if(!this.state.isConnected) {
            return this.noInternetConnection();
        }else {
            return (
                <View style={styles.container}>
                    <StatusBar backgroundColor={(this.state.splashed ? "#fff" : "#bda085")} barStyle={"dark-content"}
                               hidden={Platform.OS === "ios"}/>
                    <WebView ref={this.WEBVIEW_REF} onNavigationStateChange={this.onNavigationStateChange}
                             onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                             onLoadEnd={this._onLoadEnd.bind(this)} onLoadStart={this._onLoadStart.bind(this)}
                             source={{uri: this.siteUrl}}
                             style={{width: "100%", height: "100%"}}/>
                    {!this.state.webviewLoaded && this.loading()}
                    {!this.state.splashed && this.splash()}

                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
