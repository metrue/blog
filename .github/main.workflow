workflow "Build Docker Image" {
  on = "push"
  resolves = ["GitHub Action for Docker"]
}

action "GitHub Action for Docker" {
  uses = "actions/docker/login@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  env = {
    DOCKER_USERNAME = "***REMOVED***"
    DOCKER_PASSWORD = "***REMOVED***"
  }
}
