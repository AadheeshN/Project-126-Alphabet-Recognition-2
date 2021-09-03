import * as React from 'react';
import { View, TouchableOpacity, Image, Button, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class Camera extends React.Component {
    state = {
        image: null
    }

    pickImage = async() => {
        try {
        var result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
      
          if (!result.cancelled) {
            this.setState({image : result.data})
            this.uploadImage(result.uri);
          }
        }
        catch(e) {
            console.log(e)
        }
        };

    uploadImage = async(uri)=>{
        const data = new FormData();
        let filename = uri.split("/")[uri.split("/").length - 1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const fileToUpload = {
            uri: uri,
            name: filename,
            type: type
        }
        data.append("digit", fileToUpload);
        fetch("http://3ce1-142-126-218-125.ngrok.io /predict-alphabet", {
            method: "POST",
            body: data,
            headers:{
                "content-type":"multipart/form-data"
            }
        })
        .then(response => response.json())
        .then(result => {
            console.log("Success: ", result)
        })
        .catch(error => {
            console.log("Error : ", error);
        })
    }
    
    componentDidMount() {
        this.getPermissionAsync()
    }

    getPermissionAsync = async() => {
        //if (Platform.OS !== 'web') {
            const {status} = await Permissions.askAsync(Permissions.CAMERA)
            if (status !== 'granted') {
                alert("Sorry, we don't have the necessary camera permissions")
            }
        //}
    }

    render() {
        let {image} = this.state;

        return(
            <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Button title = 'Pick an Image' onPress = {() => this.pickImage}/>
            </View>
        )
    }
}