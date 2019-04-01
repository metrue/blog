workflow "build and push to dockerhub" {
  on = "push"
  resolves = ["login", "build", "push"]
}

action "login" {
  uses = "actions/docker/login@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  env = {
    DOCKER_USERNAME = "***REMOVED***"
    DOCKER_PASSWORD = "***REMOVED***"
  }
}

action "build" {
  uses = "actions/docker/cli@master"
  args = "build -t ***REMOVED***/blog:latest -f devops/dockerfile ."
}

action "push" {
  needs = ["build", "login"]
  uses = "actions/docker/cli@master"
  args = "push ***REMOVED***/blog:latest"
}
