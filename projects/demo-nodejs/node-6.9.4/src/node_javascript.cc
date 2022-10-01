#include "node.h"
#include "node_natives.h"  // 这个头文件会在 Node.js 编译前完成，这样编译到本文件时他就已经存在了
#include "v8.h"
#include "env.h"
#include "env-inl.h"

namespace node {

using v8::HandleScope;
using v8::Local;
using v8::NewStringType;
using v8::Object;
using v8::String;

Local<String> MainSource(Environment* env) {
  return String::NewFromUtf8(
      env->isolate(),
      reinterpret_cast<const char*>(internal_bootstrap_node_native),
      NewStringType::kNormal,
      sizeof(internal_bootstrap_node_native)).ToLocalChecked();
}

void DefineJavaScript(Environment* env, Local<Object> target) {
  HandleScope scope(env->isolate());

  // 遍历一遍 natives 数组里的内容，并将其一一加入要返回的对象中 
  // natives 包含了所有 Node.js 内置模块，这一步是在编译时做的。
  for (auto native : natives) {
    if (native.source != internal_bootstrap_node_native) {
      // 对象的键名为源码文件名标识
      Local<String> name = String::NewFromUtf8(env->isolate(), native.name);
      // 键值是源码本体的字符串
      Local<String> source =
          String::NewFromUtf8(
              env->isolate(), reinterpret_cast<const char*>(native.source),
              NewStringType::kNormal, native.source_len).ToLocalChecked();
      target->Set(name, source);
    }
  }
}

}  // namespace node
