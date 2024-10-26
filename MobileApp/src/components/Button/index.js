import {Pressable, Text, StyleSheet} from 'react-native';
import {colors} from "../../constants";
import PropTypes from "prop-types";

function Button(props) {
    const backgroundColor = props.isOutline ? '#ffffff' : colors.primary;
    const textColor = props.isOutline ? colors.primary : '#ffffff';
    return (
        <Pressable style={{...styles.container, backgroundColor}} onPress={props.onPress}>
            <Text style={{...styles.text, color: textColor}}>{props.text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 40,
        marginHorizontal: 20,
        marginVertical: 8,
        paddingVertical: 8,
        borderColor:  colors.primary,
        borderWidth: 1
    },
    text: {
        textAlign: 'center',
        color: '#fff',
    },
});

Button.propTypes = {
    text: PropTypes.string.isRequired,
    isOutline: PropTypes.bool,
    onPress: PropTypes.func.isRequired
};

export default Button;
