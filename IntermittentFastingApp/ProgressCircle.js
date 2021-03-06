import React from 'react';
import {
    Text,
    View,
    StyleSheet
} from 'react-native';

const ProgressCircle = (props) => {
    const percent = props.percent;
    const circleDiameter = props.circleDiameter;
    const foregroundThickness = props.foregroundThickness;
    const backgroundThickness = props.backgroundThickness;
  
    calculateContainerStyles = () => {
      return {
        height: circleDiameter,
        width: circleDiameter
      }
    }
  
    calculateBackgroundStyles = () => {
      const radius = (circleDiameter - foregroundThickness + backgroundThickness) / 2;
      const margin = (foregroundThickness / 2) - (backgroundThickness / 2);
      return {
        borderRadius: radius,
        borderWidth: backgroundThickness,
        height: 2 * radius,
        left: margin,
        top: margin,
        width: 2 * radius
      }
    }
  
    calculateForegroundStyles = () => {
      return {
        borderRadius: circleDiameter / 2,
        borderWidth: foregroundThickness,
        height: circleDiameter,
        width: circleDiameter
      }
    }

    calculateMaskStyles = () => {
      const baseDegrees = -135;
      let rotateBy = baseDegrees;
      if (percent <= 50) {
        rotateBy = baseDegrees - ((50 - percent) * 180 / 50);
      } 
  
      return {
        transform: [{rotateZ: rotateBy + 'deg'}],
      }
    }
  
    calculateSecondForegroundStyles = () => {
      if (percent <= 50) {
        return {
          display: 'none'
        };
      } 
      
      const baseDegrees = 45;
      let rotateBy = 0;

      if (percent > 50 && percent <= 100) {
        rotateBy = baseDegrees + ((percent - 50) * 180 / 50);
      } else {
        rotateBy = baseDegrees + 180;
      }

      return {
        transform: [{rotateZ: rotateBy + 'deg'}]
      }
    }
  
    calculateStartCapStyles = () => {
      return {
        borderRadius: foregroundThickness / 2,
        height: foregroundThickness,
        left: (circleDiameter / 2) - (foregroundThickness / 2),
        top: 0,
        width: foregroundThickness
      } 
    }
  
    calculateEndCapStyles = () => {
      if (percent >= 100) {
        return calculateStartCapStyles();
      }

      const center = (circleDiameter / 2) - (foregroundThickness / 2);
      const maxDisplacement = (circleDiameter - foregroundThickness) / 2;
      const radians = (2 * Math.PI * percent) / 100;
      const top = -(maxDisplacement * Math.cos(radians)) + center;
      const left = (maxDisplacement * Math.sin(radians)) + center;
  
      return {
        borderRadius: foregroundThickness / 2,
        height: foregroundThickness,
        left: left,
        top: top,
        width: foregroundThickness
      } 
    }
  
    return (
      <View style={ [styles.progressCircleContainer, calculateContainerStyles()] }>
        <View style={ [styles.progressCircleBackground, calculateBackgroundStyles()] }></View>
        <View style={ [styles.progressCircleForeground, calculateForegroundStyles()] }></View>
        <View style={ [styles.progressCircleOuterMask, calculateForegroundStyles(), calculateMaskStyles()] }></View>
        <View style={ [styles.progressCircleInnerMask, calculateBackgroundStyles(), calculateMaskStyles()] }></View>
        <View style={ [styles.progressCircleForeground, calculateForegroundStyles(), calculateSecondForegroundStyles()] }></View>
        <View style={ [styles.progressCircleCap, calculateStartCapStyles()] }></View>
        <View style={ [styles.progressCircleCap, calculateEndCapStyles()] }></View>
        <Text style={ styles.timeHeader }>{ `Elapsed time (${percent}%)` }</Text>
        <Text style={ styles.timeElapsed }>{ props.timeElapsed }</Text>
        <Text style={ styles.timeHeader }>{ `Remaining (${100 - percent}%)` }</Text>
        <Text style={ styles.timeRemaining }>{ props.timeRemaining }</Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    progressCircleBackground: {
      borderColor: 'gray',
      borderRadius: 160,
      position: 'absolute',
    },
    progressCircleCap: {
      backgroundColor: '#4ee7ff',
      position: 'absolute'
    },
    progressCircleContainer: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center'
    },
    progressCircleForeground: {
      borderBottomColor: 'transparent',
      borderLeftColor: 'transparent',
      borderRightColor: '#4ee7ff',
      borderTopColor: '#4ee7ff',
      position: 'absolute',
      transform: [{rotateZ: '45deg'}],
    },
    progressCircleOuterMask: {
      borderBottomColor: 'transparent',
      borderLeftColor: 'transparent',
      borderRightColor: 'white',
      borderTopColor: 'white',
      position: 'absolute',
    },
    progressCircleInnerMask: {
      borderBottomColor: 'transparent',
      borderLeftColor: 'transparent',
      borderRightColor: 'gray',
      borderTopColor: 'gray',
      position: 'absolute'
    },
    timeElapsed: {
      fontSize: 50,
      marginBottom: 10
    },
    timeHeader: {
      color: 'gray'
    },
    timeRemaining: {
      marginTop: 5
    }
  });

export default ProgressCircle;