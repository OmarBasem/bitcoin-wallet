import {View, StyleSheet} from 'react-native';
import {Button, Input, Text} from '../../components';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {connect} from 'react-redux';
import {auth} from '../../actions';
import PropTypes from 'prop-types';

function LogInScreen(props) {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
        <View style={{flex: 1}}>
            <Text style={styles.title}>WalletApp</Text>
            <Input
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                keyboardType="email"
            />
            <Input
                placeholder="Password"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
            />
            <Button
                text="Log In"
                onPress={() =>
                    props.logIn({
                        email,
                        password,
                        onSuccess: () =>
                            navigation.reset({index: 0, routes: [{name: 'BankAccount'}]}),
                    })
                }
            />
            <Button text="Sign Up" isOutline onPress={() => navigation.navigate('SignUp')} />
        </View>
    );
}

LogInScreen.propTypes = {
    logIn: PropTypes.func,
};

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 12,
        fontSize: 24,
    },
});

export default connect(null, {...auth})(LogInScreen);
