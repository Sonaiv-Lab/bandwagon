import React, {ReactNode, useRef} from 'react';
import {
  SafeAreaView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Pressable,
  compose,
} from 'react-native';
import {Text} from 'react-native-paper';
import * as A from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';
import {concatStyle} from '#/utils/concatStyle';
import {useTheme} from '@react-navigation/native';

const CellHeader = ({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) => {
  const theme = useTheme();
  return (
    <View style={[styles.cell, {borderColor: theme.colors.border}, style]}>
      <Text style={[styles.cellText, {color: theme.colors.text}]}>
        {children}
      </Text>
    </View>
  );
};

export const Label = ({children}: {children: string}) => {
  const theme = useTheme();
  return <Text style={{ textAlign: 'left', marginBottom: 4, color: theme.colors.text }}>{children}</Text>;
};

export const CellBody = ({
  label,
  children,
  style,
}: {
  label: ReactNode;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  const theme = useTheme();
  return (
    <View
      style={concatStyle(
        styles.cell as ViewStyle,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.background,
        },
        style,
      )}>
      <View>{label}</View>

      {children}
    </View>
  );
};

export const RowBody = ({
  row,
  style,
}: {
  row: ReactNode[];
  style?: StyleProp<ViewStyle>;
}) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.row as ViewStyle,
        styles.rowContent,
        {borderColor: theme.colors.border},
        style,
      ]}>
      {row}
    </View>
  );
};

export const Header = () => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.row,
        styles.rowHeader,
        {borderColor: theme.colors.border},
      ]}>
      <CellHeader>S</CellHeader>
      <CellHeader>M</CellHeader>
      <CellHeader>T</CellHeader>
      <CellHeader>W</CellHeader>
      <CellHeader>T</CellHeader>
      <CellHeader>F</CellHeader>
      <CellHeader style={{borderRightWidth: 0}}>S</CellHeader>
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: '12.28%',
    borderRightWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 2,
    flex: 1,
    flexDirection: 'column',
  },
  cellText: {
    textAlign: 'center',
  },
  rowHeader: {
    flexGrow: 0,
  },
  rowContent: {
    flexGrow: 1,
    flexShrink: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
});
