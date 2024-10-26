import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {auth, banking} from '../../actions';
import {Button, Text} from '../../components';
import {colors} from '../../constants';

function BankAccountScreen(props) {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons
                name="bank"
                size={100}
                style={{alignSelf: 'center'}}
                color={colors.darkText}
            />
            <Text style={styles.text}>
                You need to link your bank account to be able to purchase Bitcoin.
            </Text>
            <Button
                text="Link Bank Account"
                onPress={() =>
                    props.linkBankAccount({
                        onSuccess: () => navigation.reset({index: 0, routes: [{name: 'Wallet'}]}),
                    })
                }
            />
        </View>
    );
}

BankAccountScreen.propTypes = {
    linkBankAccount: PropTypes.func,
};

const styles = {
    container: {
        flex: 1,
        marginTop: 20,
    },
    text: {
        marginHorizontal: 20,
        marginVertical: 12,
    },
};

export default connect(null, {...auth, ...banking})(BankAccountScreen);
