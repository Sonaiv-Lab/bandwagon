import 'dart:io';

T byPlatform<T>({dynamic ios, dynamic android}) {
  return switch (Platform) {
    _ when Platform.isAndroid => android,
    _ when Platform.isIOS => ios,
    _ => FormatException('platform not supported'),
  };
}
