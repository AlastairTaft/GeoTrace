import React, { useState } from "react"
import { Text } from "react-native"

// Ugly workaround (https://stackoverflow.com/questions/48001774/how-to-adjust-font-size-to-fit-view-in-react-native-for-android/58823271#58823271)
// Android doesn't have auto-shrink feature (yet) :-(

export default AdjustableText = ({fontSize, style, numberOfLines, children}) => {
  const [currentFont, setCurrentFont] = useState(fontSize);
  
  return (
    <Text
      numberOfLines={ numberOfLines }
      adjustsFontSizeToFit
      style={ [style, { fontSize: currentFont }] }
      onTextLayout={ (e) => {
        const { lines } = e.nativeEvent;
        if (lines.length > numberOfLines) {
          setCurrentFont(currentFont - 1);
        }
      }}
    >
      {children}
    </Text>
  );
};