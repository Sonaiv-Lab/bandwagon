import {StyleProp} from 'react-native';
import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';

export const concatStyle = <T>(...styles: StyleProp<T>[]) => {
  return pipe(
    styles,
    A.chain((style) => {
      if (style === undefined || style === null ) {
        return [];
      }

      return Array.isArray(style) ? style : A.of(style);
    })
    
  );
};
