import {View, StyleSheet, ActivityIndicator, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {colors} from "../../constants";
import PropTypes from "prop-types";

function Loading(props) {
    const {isLoading} = props;
    return (
        <View style={{
            ...styles.view,
            display: isLoading ? 'flex' : 'none',
            position: isLoading ? 'absolute' : 'relative'
        }}>
            <View style={styles.animationContainer}>
                <ActivityIndicator size='large' color={colors.primary}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99,
    },
    animationContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.25)'
    },
});

const mapStateToProps = (state) => ({
    isLoading: state.system.isLoading,
});

Loading.propTypes = {
    isLoading: PropTypes.bool
};


export default connect(mapStateToProps, null)(Loading);
