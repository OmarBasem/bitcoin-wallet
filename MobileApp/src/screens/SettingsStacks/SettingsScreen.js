import {View, SectionList, Alert, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {auth, banking} from '../../actions';
import {BankAccount, Button, Text} from '../../components';
import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';

function transformToSectionListData(data) {
    return Object.values(data).map((institutionData) => {
        const {institution, accounts} = institutionData.metadata;
        return {
            title: institution.name,
            data: accounts,
        };
    });
}

function SettingsScreen(props) {
    const bankAccounts = transformToSectionListData(props.institutions);
    const renderItem = ({item, index}) => {
        const isSelected = item.id === props.selectedBankAccountId;
        const updateSelectedAccount = () => {
            props.updateSelectedAccount({accountId: item.id});
        };
        return (
            <BankAccount
                account={item}
                isSelected={isSelected}
                updateSelectedAccount={updateSelectedAccount}
            />
        );
    };
    const navigation = useNavigation();
    const logOut = async () => {
        await navigation.navigate('LogIn');
        await navigation.reset({index: 0, routes: [{name: 'LogIn'}]});
        props.logOut();
    };

    const alertLogout = () => {
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
            {text: 'Cancel', style: 'cancel'},
            {
                text: 'Log Out',
                style: 'destructive',
                onPress: logOut,
            },
        ]);
    };
    const sectionHeader = ({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>;
    const ListFooterComponent = () => {
        return (
            <>
                <Button text="Get account balances" onPress={() => props.fetchBankBalances()} />
                <View style={styles.line} />
                <Button text="Log out" isOutline onPress={alertLogout} />
            </>
        );
    };
    const ListHeaderComponent = () => {
        return (
            <View style={styles.infoContainer}>
                <Text>Name: {props.user?.name}</Text>
                <Text>Email: {props.user?.email}</Text>
            </View>
        );
    };
    return (
        <SectionList
            sections={bankAccounts}
            renderSectionHeader={sectionHeader}
            renderItem={renderItem}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={ListFooterComponent}
        />
    );
}

SettingsScreen.propTypes = {
    logOut: PropTypes.func,
    fetchBankBalances: PropTypes.func,
    updateSelectedAccount: PropTypes.func,
    selectedBankAccountId: PropTypes.string,
    user: PropTypes.object,
    institutions: PropTypes.object,
};

const styles = StyleSheet.create({
    infoContainer: {
        padding: 10,
    },
    sectionHeader: {
        fontWeight: 'bold',
        backgroundColor: '#ffffff',
        padding: 10,
        fontSize: 18,
    },
    line: {
        height: 0.5,
        backgroundColor: 'lightgrey',
        marginVertical: 10,
    },
});

function mapStateToProps(state) {
    return {
        institutions: state.banking.institutions,
        selectedBankAccountId: state.banking.selectedBankAccountId,
        user: state.auth.user,
    };
}

export default connect(mapStateToProps, {...banking, ...auth})(SettingsScreen);
