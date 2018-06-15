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

* Logging
