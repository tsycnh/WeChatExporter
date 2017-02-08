#!/usr/bin/env bash
nwb nwbuild -v 0.19.3-sdk -p osx64 --mirror https://npm.taobao.org/mirrors/nwjs/ --output-name 小美微信备份Release --executable-name 小美微信备份  --mac-icns ./imgs/icon/webacklogo.icns --with-ffmpeg --production ../build/
