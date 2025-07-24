double inverseLerpDouble (double a, double b, double value) {
  if (a == b) return 0.0;

  final delta = b -  a;
  final range = value - a;
  return (range / delta).clamp(0.0, 1.0);
}