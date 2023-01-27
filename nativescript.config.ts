import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'com.lofi.loficlick',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
  },
} as NativeScriptConfig;
