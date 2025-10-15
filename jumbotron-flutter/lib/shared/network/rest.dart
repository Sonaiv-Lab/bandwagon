import 'package:dio/dio.dart';


const baseUrl = 'https://dugout-dev-152580130681.asia-east1.run.app';

// for connect local server
// const baseUrl = 'http://192.168.0.166:8088';
  const connectTimeout = Duration(seconds: 5);
  const receiveTimeout = Duration(seconds: 5);


Dio restClientFactory() {
  final dio = Dio(
    BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: connectTimeout,
      receiveTimeout: receiveTimeout,
    ),
  ); // With default `Options`.
  return dio;
}


Dio rest = restClientFactory();