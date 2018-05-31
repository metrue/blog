## 闲话测试
测试让我们写更好的代码，在经历的公司中，Synopsys 和 Splunk 对于测试的要求都很高，核心产品的测试覆盖非常全, 每一个 release 都有超级详细的测试报告。公司内部都有相应的团队 (QA 或者 Integration Team)来负责软件质量, 当然对于不同的产品测试的要求也不太一样，内部的工具其实对于测试就没有太高的要求。但也有例外，当时在 Second Spetrum 的时候，团队的工程师对于测试的要求较高，只服务公司内部的产品也要求比较全面的测试，团队中一些资深的工程师辅导新人的时候，有的甚至是从如何写好一个测试开始的。

来到 Udacity 之后，我对自己的要求是，每一个 feature 都必须配备对应的单元测试，对于对外的服务必须有集成测试。做 Code Review 的时候，如果没有对应的测试代码，也不会想拿到 approve.   每一个工程师都应该认识到测试的重要性， 写测试不仅可以保证了我们功能的正常运行，也让我们思考如何模块化我们的代码，思考业务场景的覆盖。而且其实测试节省我们大量的时间，在设计家工作的时候，没有任何的单元测试，你可以想象没有任何单元测试，对于开发一个重数据模型，基于事件的重交互型的 Web 应用是多么的痛苦吗，我们花了大量的时间在重复的修复同一个 bug, 印象最深的是有一个同事负责一个在不同的场景下自动生成台面的功能，由于没有测试代码，每一次为了修复一个场景的产生问题，都会导致无数的问题。最后那段代码变成一个时常堵塞的下水道，谁都不想碰，但是又总出现问题，只能硬着头皮捏着鼻子去打开修复。

## Test in Golang
Go 有内置的测试命令 `go test`，它提供了基本的测试体验。而且也天然支持 `-cover`自动产生测试覆盖率，可以看到 Go 开发者对于测试的重视。

### Unit Test

假设我们有这样的代码: hello.go
```
package hello

import (
	"fmt"
)

func Hello(name string) string {
	return fmt.Sprintf("Hello %s", name)
}

```

大致上我们的单元测试代码会是这样: hello_test.go

```
package hello

import "testing"

func TestHello(t *testing.T) {
	name := "Tom"
	msg := Hello(name)
	expect := "Hello Tom"
	if msg != expect {
		t.Errorf("%s != %s", msg, expect)
	}
}
```

你可以看到，我们的文件名遵循这样的规则: 功能代码文件 <some name>.go, 测试代码的文件名会是 <some name>_test.go.  我们可以直接运行测试获得测试结果:

```
$ go test
PASS
ok  	github.com/udacity/go-play-arround	0.007s
```
当然我们可以直接获取覆盖率:
```
$ go test --cover
PASS
coverage: 100.0% of statements
ok  	github.com/udacity/go-play-arround	0.008s
```
如果不喜欢自己写断言，你可以使用 [stretchr/testify](https://github.com/stretchr/testify)这个第三库，写起来会更舒服一些。而且支持 Mocking 和 Test suite。

### Integration Test
* 基本方法
集成测试是从一个外观者的角度去测试我们系统是否正常服务的保证, 这就意味着我们要保证各个组件（或者服务) 正常启动了去运行我们的集成测试.  这时候 `TestMain` 就派上用场了。

```
package main

import (
	"fmt"
	"os"
	"testing"
)

func setup() {
	fmt.Println("this is setup step")
	fmt.Println("starting up a service")
	fmt.Println("starting up b service")
}

func teardown() {
	fmt.Println("this is teardown step")
	fmt.Println("stop a service")
	fmt.Println("stop b service")
}

func TestA(t *testing.T) {
	fmt.Println("A")
}

func TestB(t *testing.T) {
	fmt.Println("B")
}

func TestMain(m *testing.M) {
	setup()

	ret := m.Run()

	teardown()

	os.Exit(ret)
}
```

`TestMain` 会在 `go test`运行的时候被调用。所以我们可以在 `setup()`中做一些测试准备工作，然后在 `teardown`中做清理工作.

显然这样做似乎会一些问题: 因为每次运行 `go test` 都会 `TestMain`，而我们并不是每次都要运行集成测试，因为集成测试很多时候会涉及数据库的启动，网络服务的请求等，会花很多时间，更多的时候，我们的改动只需要运行一下单元来简单测试即可。那么怎么才能够避免每次都运行集成测试呢？

* testing.Short()

 `testing.Short()` 会返回当我们在运行测试的时候是否指定了 `-short` flag。 所以通过检查 `testing.Short()` 可以来决定我们是否需要运行集成测试. 所以我们可以这样写我们的测试.

``` 
package main

import (
  "flag"
  "fmt"
  "os"
  "testing"
)

func setup() {
  fmt.Println("this is setup step")
  fmt.Println("starting up a service")
  fmt.Println("starting up b service")
}

func teardown() {
  fmt.Println("this is teardown step")
  fmt.Println("stop a service")
  fmt.Println("stop b service")
}

func TestA(t *testing.T) {
  if testing.Short() {
    t.Skip()
  }
}

func TestB(t *testing.T) {
  if testing.Short() {
    t.Skip()
  }
}

func TestMain(m *testing.M) {
  flag.Parse()

  if !testing.Short() {
    setup()
  }

  ret := m.Run()

  if !testing.Short() {
    teardown()
  }

  os.Exit(ret)
}
```

那么能不能在进一步呢，通过检查 `testing.Short()`我们决定我们是否需要启动相关服务已经运行集成测试，但是在测试代码中重复的添加 `testing.Short()`显然是难看的，拓展性不好。如何能够更 Scale 呢?
