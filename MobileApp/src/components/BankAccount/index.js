import {View, StyleSheet, Switch} from 'react-native';
import PropTypes from 'prop-types';
import Text from '../Text';

function BankAccount({account, isSelected, updateSelectedAccount}) {
    return (
        <View style={styles.container}>
            <Text style={styles.name}>{account.name}</Text>
            <Text style={styles.subText}>Account Number: ****{account.mask}</Text>
            {account.balances && (
                <Text style={styles.subText}>Available Balance: ${account.balances.available}</Text>
            )}
            <Text style={styles.subText}>Account Type: {account.subtype}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text>Selected for payment: </Text>
                <Switch value={isSelected} onChange={() => updateSelectedAccount()} />
            </View>
        </View>
    );
}

BankAccount.propTypes = {
    account: PropTypes.object,
    isSelected: PropTypes.bool,
    updateSelectedAccount: PropTypes.func,
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginVertical: 10,
        backgroundColor: '#f8f8f8',
        borderColor: 'lightgrey',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subText: {
        color: '#333',
        marginBottom: 10,
    },
});

export default BankAccount;
