#!/usr/bin/env bash
nwb nwbuild -v 0.19.3-sdk -p osx64 --mirror https://npm.taobao.org/mirrors/nwjs/ --output-name webackapp --executable-name wb  --mac-icns ./imgs/icon/webacklogo.icns --with-ffmpeg --production ../build/
