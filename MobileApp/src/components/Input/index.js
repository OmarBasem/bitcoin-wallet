import {StyleSheet, TextInput} from "react-native";
import PropTypes from "prop-types";
import Button from "../Button";

function Input(props) {
    return <TextInput {...props}  style={styles.input} />;
}

const styles = StyleSheet.create({
    input: {
        fontSize: 15,
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 40,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginHorizontal: 20,
        marginVertical: 8
    },
})

export default Input;
