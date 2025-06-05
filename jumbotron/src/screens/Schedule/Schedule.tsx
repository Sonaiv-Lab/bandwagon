import React, {ReactNode, useRef} from 'react';
import {
  SafeAreaView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Pressable,
} from 'react-native';
import Icon from '@react-native-vector-icons/material-design-icons';
import {Text} from 'react-native-paper';
import Svg, {Path} from 'react-native-svg';
import {DynamicBottomSheet, BottomSheetMethods} from './DynamicBottomSheet';
import { useNavigation } from '@react-navigation/native';

const BigGame = () => {
  const navigation = useNavigation()
  return (
    <Pressable
      style={{
        flexDirection: 'column',
        gap: 6,
        borderBottomColor: '#DEDEDE',
        borderBottomWidth: 1,
        paddingHorizontal: 24,
        paddingVertical: 12,
        paddingBottom: 18,
      }}
      onPress={() => navigation.navigate('Game')}
      >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 16}}>No.102</Text>
        <Text style={{fontSize: 16, flexGrow: 1, textAlign: 'center'}}>
          台中洲際棒球場 14:30
        </Text>
        <Icon name="chevron-right" size={24} style={{paddingTop: 0, paddingLeft: 20}} />
      </View>
      <View>
        <Svg width="362" height="44" viewBox="0 0 362 44">
          <Path
            d="M355.983 0.347229C359.306 0.347233 362 3.03724 362 6.35554V37.3985C362 40.7168 359.306 43.4068 355.983 43.4068H182.698L176.627 24.8812H194.676L186.637 0.347229H355.983Z"
            fill="#FB9611"
          />
          <Path
            d="M186.376 18.8729H168.326L176.366 43.4068H6.01662C2.69374 43.4068 1.61516e-07 40.7168 0 37.3985V6.35554C1.61515e-07 3.03724 2.69373 0.347229 6.01662 0.347229H180.305L186.376 18.8729Z"
            fill="#FECF11"
          />
        </Svg>
        <Text style={{fontSize: 23, left: 10, top: 4, position: 'absolute'}}>
          中信兄弟
        </Text>
        <Text
          style={{
            fontSize: 24,
            right: 10,
            top: 4,
            textAlign: 'right',
            position: 'absolute',
          }}>
          統一獅
        </Text>
      </View>
    </Pressable>
  );
};

const Game = ({colorL, colorR}: {colorL: string; colorR: string}) => {
  return (
    <View style={[{alignItems: 'center', justifyContent: 'center'}]}>
      <Svg height="12" width="55" viewBox="0 0 55 12">
        <Path
          d="M52.4286 0C53.5331 0 54.4286 0.895431 54.4286 2V10C54.4285 11.1045 53.5331 12 52.4286 12H25.5L31.2495 6L36.999 0H52.4286Z"
          fill={colorL}
        />
        <Path
          d="M20.0195 12H2.42856C1.32401 12 0.428591 11.1045 0.428558 10V2C0.428558 0.895431 1.32399 1.61069e-08 2.42856 0H31.5195L25.7695 6L20.0195 12Z"
          fill={colorR}
        />
      </Svg>
    </View>
  );
};

/**
 * TODO: 後續再作類似 google calendar 可以透過拖曳看前後個月
 */
export const Schedule = () => {
  const bottomSheetModalRef = useRef<BottomSheetMethods>(null);

  return (
    <>
      <SafeAreaView style={{flexDirection: 'column', flex: 1}}>
        <View style={[styles.row, styles.rowHeader]}>
          <CellHeader>S</CellHeader>
          <CellHeader>M</CellHeader>
          <CellHeader>T</CellHeader>
          <CellHeader>W</CellHeader>
          <CellHeader>T</CellHeader>
          <CellHeader>F</CellHeader>
          <CellHeader style={{borderRightWidth: 0}}>S</CellHeader>
        </View>
        {Array.from(new Array(6), () => (
          <View style={[styles.row, styles.rowContent]}>
            <CellContent dateText="1">
              <Pressable
                onPress={() => {
                  bottomSheetModalRef.current?.expand();
                }}>
                <View
                  style={{overflow: 'hidden', flexDirection: 'column', gap: 5}}>
                  <Game colorL="#2286DD" colorR="#0F7A26" />
                  <Game colorL="#FECF11" colorR="#FB9611" />
                  <Game colorL="#FF393C" colorR="#9B123D" />
                </View>
              </Pressable>
            </CellContent>
            <CellContent dateText="1"></CellContent>
            <CellContent dateText="1"></CellContent>
            <CellContent dateText="1"></CellContent>
            <CellContent dateText="1"></CellContent>
            <CellContent dateText="1"></CellContent>
            <CellContent
              dateText="1"
              style={{borderRightWidth: 0}}></CellContent>
          </View>
        ))}
      </SafeAreaView>
      <DynamicBottomSheet bottomSheetRef={bottomSheetModalRef}>
        <Text
          style={{
            borderBottomColor: '#DEDEDE',
            borderBottomWidth: 1,
            textAlign: 'center',
            paddingTop: 0,
            paddingBottom: 10,
            fontSize: 16,
          }}>
          2025/5/25 星期日
        </Text>
        <BigGame />
        <BigGame />
        <BigGame />
      </DynamicBottomSheet>
    </>
  );
};

const CellHeader = ({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) => {
  return (
    <View style={[styles.cell, Array.isArray(style) ? [...style] : style]}>
      <Text style={styles.cellText}>{children}</Text>
    </View>
  );
};

const CellContent = ({
  dateText,
  children,
  style,
}: {
  dateText: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={[styles.cell, Array.isArray(style) ? [...style] : style]}>
      <Text style={{textAlign: 'left', marginBottom: 4}}>{dateText}</Text>
      {children}
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
