import 'dart:io';

T byPlatform<T extends dynamic>({required T ios, required T android}) {
  if (Platform.isAndroid) return android;
  if (Platform.isIOS) return ios;

  throw FormatException('platform not supported');
}
