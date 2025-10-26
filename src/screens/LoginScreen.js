import RoomModals from '../components/LoginScreenComponents/RoomModals'
import { View } from 'react-native'
import LoginImage from '../components/LoginScreenComponents/LoginImage'

const LoginScreen = ({setIsLoggedIn}) => {
return (
    <View style={{ flex: 1, justifyContent: 'center',padding:18,backgroundColor:'#FFFDF7'}}>
        <LoginImage/>
        {/* <InputUsername /> */}
        <RoomModals  setIsLoggedIn={setIsLoggedIn}/>
    </View>
)
}

export default LoginScreen