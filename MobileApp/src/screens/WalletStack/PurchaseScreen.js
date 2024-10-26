import {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Button, Input} from '../../components';
import {wallet, auth} from '../../actions';
import {useNavigation} from '@react-navigation/native';

function PurchaseScreen(props) {
    const [amount, setAmount] = useState('');
    const navigation = useNavigation();
    const amountCost = parseFloat(amount || 1) * props.bitcoinPrice;
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bitcoin amount:</Text>
            <Input
                placeholder="0.05"
                keyboardType="numeric"
                onChangeText={(text) => setAmount(text)}
            />
            <Text style={styles.costText}>
                {amount || 1} bitcoin costs ${amountCost.toFixed(2)}
            </Text>
            <Button
                text="Purchase!"
                onPress={() =>
                    props.purchaseBitcoin({
                        amount,
                        selectedBankAccountId: props.selectedBankAccountId,
                        onSuccess: () => navigation.goBack(),
                    })
                }
            />
        </View>
    );
}

PurchaseScreen.propTypes = {
    purchaseBitcoin: PropTypes.func,
    selectedBankAccountId: PropTypes.string,
    bitcoinPrice: PropTypes.number,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    balanceContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    text: {paddingHorizontal: 32, paddingTop: 20},
    costText: {paddingHorizontal: 20},
});

function mapStateToProps(state) {
    return {
        user: state.auth.user,
        selectedBankAccountId: state.banking.selectedBankAccountId,
        bitcoinPrice: state.system.bitcoinPrice,
    };
}

export default connect(mapStateToProps, {...wallet, ...auth})(PurchaseScreen);
