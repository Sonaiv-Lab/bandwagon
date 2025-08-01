import 'package:flutter_inappwebview/flutter_inappwebview.dart' as webview;

class InAppBrowser {
  InAppBrowser();

  final webview.InAppBrowser browser = webview.InAppBrowser();
  final settings = webview.InAppBrowserClassSettings(
    browserSettings: webview.InAppBrowserSettings(
      hideDefaultMenuItems: true,
    ),
  );

  openUrl(String url) {
    browser.openUrlRequest(
      urlRequest: webview.URLRequest(url: webview.WebUri(url)),
      settings: settings,
    );
  }
}
