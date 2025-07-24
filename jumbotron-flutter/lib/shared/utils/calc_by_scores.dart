import './inverse_lerp.dart';

double calcRatioByScores({
  required int leftScore,
  required int rightScore,
  // 如果是 0 的話希望表示為多少
  double gap = 4,
  // 最多分成幾格
  double limit = 5,
}) {
  double scoreDiff = (leftScore - rightScore).toDouble();
  if (leftScore == 0) {
    scoreDiff = -gap;
  }

  if (rightScore == 0) {
    scoreDiff = gap;
  }

  final ratio = inverseLerpDouble(-limit, limit, scoreDiff);

  return ratio;
}