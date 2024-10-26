import {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants';
import {Button, Text} from '../../components';
import {wallet} from '../../actions';

function WalletScreen(props) {
    const navigation = useNavigation();
    useEffect(() => {
        props.fetchBitcoinPrice();
        props.fetchUserAndBalance();
    }, []);
    const bitcoinUSDValue = props.bitcoinBalance * props.bitcoinPrice;
    return (
        <View style={styles.container}>
            <View style={styles.balanceContainer}>
                <MaterialCommunityIcons name="bitcoin" size={100} color={colors.bitcoin} />
                <Text>
                    Your balance is: {props.bitcoinBalance.toFixed(4)} BTC ($
                    {bitcoinUSDValue.toFixed(2)})
                </Text>
                <View>
                    <Text style={{marginTop: 8}}>Current bitcoin price: ${props.bitcoinPrice}</Text>
                    <Text style={{marginTop: 8}}>
                        Your bitcoin address: {props.user?.bitcoinAddress}
                    </Text>
                </View>
            </View>
            <Button text="Buy Bitcoin" onPress={() => navigation.navigate('Purchase')} />
        </View>
    );
}

WalletScreen.propTypes = {
    banks: PropTypes.object,
    user: PropTypes.object,
    bitcoinBalance: PropTypes.number,
    bitcoinPrice: PropTypes.number,
    fetchBitcoinPrice: PropTypes.func,
    fetchUser: PropTypes.func,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    balanceContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
});

function mapStateToProps(state) {
    return {
        banks: state.banking,
        user: state.auth.user,
        bitcoinBalance: state.wallet[state.auth.user?.bitcoinAddress] || 0,
        bitcoinPrice: state.system.bitcoinPrice,
    };
}

export default connect(mapStateToProps, {...wallet})(WalletScreen);
