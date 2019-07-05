workflow "build and push to dockerhub" {
  on = "push"
  resolves = ["login", "build", "push", "notify"]
}

action "login" {
  uses = "actions/docker/login@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "build" {
  uses = "actions/docker/cli@master"
  args = "build -t metrue/blog:latest ."
}

action "push" {
  needs = ["build", "login"]
  uses = "actions/docker/cli@master"
  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD"]
  args = "push metrue/blog:latest"
}

action "notify" {
  needs = ["build", "push"]
  uses = "actions/bin/curl@master"
  args = ["https://pubhub.minghe.me/notifications/bkbj5odlrcn8ngmcb1f0/create?body=BlogBuildOk&title=BuilBlog&category=GitHub"]
}
