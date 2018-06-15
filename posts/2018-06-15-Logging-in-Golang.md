日志对于 Web 服务来说是不可或缺的部分，正因为如此，这个领域也催生出了很多产品，比如日志分析的统治级占领者 Splunk, 对应国内有日志易。当然开源产品方面也层出不穷，广为使用的是 [Elasticsearch](https://github.com/elastic/elasticsearch)。良好稳定的日志系统不仅在问题查询方面让工程师事半功倍，结构化的日志数据也为产品开发和增长提供一定的数据根据.

在 Golang 开发的服务中. 如何实现结构化的日志呢，有的同学喜欢 [zap](https://github.com/uber-go/zap), Uber 开源的一个结构化日志工具, 我目前使用的是[logrus](https://github.com/sirupsen/logrus). 两者很类似。如果对性能需要很高的化，在选择之前可以做一个简单的 benchmark, 而对于小型的 Web 服务来说，选择其一应该都没有什么问题。

* 替换掉 Go 自带的 log

无论是用 zap 还是 logrus, 我们都可以不再使用 Golang 自带的 [log](https://golang.org/pkg/log) 了。用更加结构化的 logging 来代替。

```
package main

import (
  "os"
  log "github.com/sirupsen/logrus"
)

func init() {
  log.SetFormatter(&log.JSONFormatter{})
  log.SetOutput(os.Stdout)
  log.SetLevel(log.WarnLevel)
}

func main() {
  log.Info("Hello")
  log.Warn("Oh")
  log.Fatal("Oops")
}
```

你可以看到你可以设置不同日志输入的格式，级别等, 基本上和 log 的使用差不多。

* Logging with Fields

为了日志的更可用，一般我们都会给日志携带相关的信息.

```
  log.WithFields(log.Fields{
    "name": "john",
    "age": 12,
  }).Info("hello")
```

对于很多的应用，在服务工作的不同阶段，都需要输入相关的日志信息，但是其实这些日志信息都需要输出类似的信息，这个时候我们可以使用置默认的 Fields

```
fields := log.Fields{"request_id": request_id, "user_ip": user_ip}
reqLogger:= log.WithFields(fields)
reqLogger.Info("Hello")
```

* 给你的 Context 添加 Logger

我自己认为的最佳实践是在 per-request 的 context 添加一个 Logger，然后在这个 request 的生命周期内来使用。

```
logger := &logrus.Logger{
  Out: os.Stderr,
  // Formatter: new(logrus.JSONFormatter),
  Formatter: new(logrus.TextFormatter),
  Hooks:     make(logrus.LevelHooks),
  Level:     logrus.InfoLevel,
}
ctx.Logger = logger.WithFields(logrus.Fields{
  "request": map[string]string{
    "method":     r.Method,
    "user-agent": r.UserAgent(),
    "request":    r.RequestURI,
    ...
  },
})

handle(ctx)
```

这样就可以在 handle 中方便的使用 Logger 来记录日志了.
