import 'dart:math' as math;

import 'package:flutter/material.dart';

double exponentialClamp(double value, double strength) {
  final sign = value.sign;
  final v = value.abs();
  // 調整 decay 強度，值越大 decay 越快
  return sign * (1 - math.exp(-v / strength)) * strength;
}

class CustomRefreshWrapper extends StatefulWidget {
  final Widget child;
  final Future<void> Function() onRefresh;

  const CustomRefreshWrapper({
    super.key,
    required this.child,
    required this.onRefresh,
  });

  @override
  State<CustomRefreshWrapper> createState() => _CustomRefreshWrapperState();
}

// TODO: 這裡的整個 code 可能都要再理解一下，沒有到非常懂
class _CustomRefreshWrapperState extends State<CustomRefreshWrapper>
    with TickerProviderStateMixin {
  double dragOffset = 0.0;
  bool isRefreshing = false;
  final double thresholdHeight = 250;
  final double indicatorTop = 100;
  final int maxLoadingDuration = 5000;
  final int animationDurationMax = 300;
  final int animationDurationMin = 50;

  late AnimationController _resetController;
  // 這個 controller 會持續跑，逐漸減少
  late AnimationController _decayController;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();

    _resetController = AnimationController(vsync: this);

    _decayController =
        AnimationController(
          vsync: this,
          duration: Duration(milliseconds: maxLoadingDuration),
        )..addListener(() {
          setState(() {
            dragOffset *= 0.997;
          });
        });
  }

  void _startDecayAnimation() {
    _decayController.forward(from: 0);
  }

  void _resetOffsetToZero() {
    final durationMs = (dragOffset.abs() * 5)
        .clamp(animationDurationMin, animationDurationMax)
        .toInt();

    _resetController.duration = Duration(milliseconds: durationMs);

    _animation =
        // 從當下的 dragOffset 回到 0
        Tween<double>(begin: dragOffset, end: 0).animate(
          CurvedAnimation(parent: _resetController, curve: Curves.easeInOut),
        )..addListener(() {
          setState(() {
            dragOffset = _animation.value;

            if (dragOffset < 0) {
              _resetController.stop();          
            }
          });
        });

    _resetController.forward(from: 0);
  }

  @override
  void dispose() {
    super.dispose();
    _resetController.dispose();
    _decayController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onVerticalDragUpdate: (details) {
        setState(() {
          if (isRefreshing) return;
          dragOffset += details.delta.dy;
          // 需要設定最大拉的距離嗎？但這個不會反應在高度上
          // 想一下這個 thresholdHeight + 50 的意義是啥，靠直覺寫的
          dragOffset = dragOffset.clamp(0, thresholdHeight + 50);
        });
      },
      onVerticalDragEnd: (details) async {
        if (dragOffset > thresholdHeight) {
          setState(() => isRefreshing = true);
          _startDecayAnimation();
          await widget.onRefresh();
          _decayController.stop();
        }

        setState(() => isRefreshing = false);
        _resetOffsetToZero();
      },
      child: Stack(
        children: [
          widget.child,
          Positioned(
            // 這裡的 exponentialClamp 要再想想，有點靠直覺
            top: exponentialClamp(dragOffset, indicatorTop) - 50,
            left: 0,
            right: 0,
            child: Align(
              alignment: Alignment.center,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.amber,
                  borderRadius: BorderRadius.all(Radius.circular(9999)),
                ),
                child: CircularProgressIndicator(
                  constraints: BoxConstraints(minWidth: 20, minHeight: 20),
                  padding: EdgeInsets.all(6),
                  color: Colors.white,
                  backgroundColor: Colors.transparent,
                  strokeWidth: 3.5,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
