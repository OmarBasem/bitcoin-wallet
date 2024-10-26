import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {Button, Input} from '../../components';
import {auth} from '../../actions';
import PropTypes from 'prop-types';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

function SignUpScreen(props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    return (
        <View>
            <Input placeholder="Full Name" onChangeText={(text) => setName(text)} />
            <Input
                placeholder="Email"
                keyboardType="email"
                onChangeText={(text) => setEmail(text)}
            />
            <Input
                placeholder="Password"
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
            />
            <Button
                text="Sign Up"
                onPress={() =>
                    props.signUp({
                        name,
                        email,
                        password,
                        onSuccess: () =>
                            navigation.reset({index: 0, routes: [{name: 'BankAccount'}]}),
                    })
                }
            />
        </View>
    );
}

SignUpScreen.propTypes = {
    signUp: PropTypes.func,
};

export default connect(null, {...auth})(SignUpScreen);
