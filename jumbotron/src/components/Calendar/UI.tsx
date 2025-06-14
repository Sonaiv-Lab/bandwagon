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

const CellHeader = ({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) => {
  return (
    <View style={concatStyle(styles.cell as ViewStyle, style)}>
      <Text style={styles.cellText}>{children}</Text>
    </View>
  );
};

export const Label = ({children}: {children: string}) => (
  <Text style={{textAlign: 'left', marginBottom: 4}}>{children}</Text>
);

export const CellBody = ({
  label,
  children,
  style,
}: {
  label: ReactNode;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={concatStyle(styles.cell as ViewStyle, style)}>
      <View>{label}</View>

      {children}
    </View>
  );
};

export const RowBody = ({
  row,
}: {
  row: ReactNode[];
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={concatStyle(styles.row as ViewStyle, styles.rowContent)}>
      {row}
    </View>
  );
};

export const Header = () => {
  return (
    <View style={[styles.row, styles.rowHeader]}>
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
    borderColor: 'grey',
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
    // height: 30,
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
    borderColor: 'grey',
  },
});
