import React from 'react';
import {Text as RNText} from 'react-native';
import {colors} from '../../constants';

const Text = (props) => {
    return (
        <RNText {...props} style={[s.defaultStyle, props.style]}>
            {props.children}
        </RNText>
    );
};

const s = {
    defaultStyle: {
        color: colors.darkText,
        fontSize: 15,
    },
};

export default Text;
