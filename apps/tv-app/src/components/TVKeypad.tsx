import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FocusableItem } from './FocusableItem';

interface TVKeypadProps {
  onPressDigit: (digit: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
}

export const TVKeypad: React.FC<TVKeypadProps> = ({ onPressDigit, onDelete, onSubmit }) => {
  const keypadLayout = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['DEL', '0', 'OK'],
  ];

  return (
    <View style={styles.container}>
      {keypadLayout.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((btn) => (
            <FocusableItem
              key={`btn-${btn}`}
              style={styles.keyButton}
              focusedStyle={styles.keyButtonFocused}
              onPress={() => {
                if (btn === 'DEL') onDelete();
                else if (btn === 'OK') onSubmit();
                else onPressDigit(btn);
              }}
            >
              <Text style={styles.keyText}>{btn}</Text>
            </FocusableItem>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
  },
  keyButton: {
    width: 70,
    height: 55,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    borderRadius: 8,
  },
  keyButtonFocused: {
    backgroundColor: '#E50914', // Rojo brillante al enfocar botón del teclado
  },
  keyText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
