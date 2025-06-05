import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import { StyleSheet } from "react-native";

import type { BottomSheetMethods } from "@gorhom/bottom-sheet/src/types";
import type { BottomSheetProps } from "@gorhom/bottom-sheet";

const DynamicBottomSheet = ({
  bottomSheetRef,
  onChange,
  children,
  maxDynamicContentSize,
}: {
  bottomSheetRef: React.Ref<BottomSheetMethods>;
  onChange?: BottomSheetProps["onChange"];
  children: React.ReactNode;
  maxDynamicContentSize?: number;
}) => {
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={false}
      maxDynamicContentSize={maxDynamicContentSize}
      onChange={onChange}
      index={-1}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.contentContainerStyle}
        enableFooterMarginAdjustment={true}
      >
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
  contentContainerStyle: {
    // paddingVertical: 12,
    // paddingHorizontal: 24,
    backgroundColor: "white",
  },
  message: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
    color: "black",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 24,
  },
  footerButton: {
    flex: 1,
  },
});

export { DynamicBottomSheet };

export type { BottomSheetMethods };
