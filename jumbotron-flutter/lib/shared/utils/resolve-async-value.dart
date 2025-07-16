import 'package:hooks_riverpod/hooks_riverpod.dart';

enum QueryStatus { loading, error, success }

typedef QueryTuple<T> = (QueryStatus, T? data, Object? error);

QueryTuple<T> resolveAsyncValue<T>(AsyncValue<T> asyncValue) {
  return switch (asyncValue) {
    AsyncData<T>(:final value) => (QueryStatus.success, value, null),
    AsyncError<T>(:Object error) => (QueryStatus.error, null, error),
    _ => (QueryStatus.loading, null, null),
  };
}
