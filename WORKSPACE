workspace(
    name = "serverless-graphql",
    managed_directories = {"@npm": ["npm/node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "e79c08a488cc5ac40981987d862c7320cee8741122a2649e9b08e850b6f20442",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/3.8.0/rules_nodejs-3.8.0.tar.gz"],
)

http_archive(
    name = "io_bazel_rules_docker",
    sha256 = "5d31ad261b9582515ff52126bf53b954526547a3e26f6c25a9d64c48a31e45ac",
    strip_prefix = "rules_docker-0.18.0",
    urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.18.0/rules_docker-v0.18.0.tar.gz"],
)

load(
    "@io_bazel_rules_docker//toolchains/docker:toolchain.bzl",
    docker_toolchain_configure = "toolchain_configure",
)

docker_toolchain_configure(
    name = "docker_config",
    client_config = "~/.docker",
)

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

container_repositories()

load("@io_bazel_rules_docker//repositories:deps.bzl", container_deps = "deps")

container_deps()

load(
    "@io_bazel_rules_docker//container:container.bzl",
    "container_pull",
)

container_pull(
    name = "base_node",
    registry = "docker.io",
    repository = "amazon/aws-lambda-nodejs",
    tag = "14.2022.03.23.16",
)

http_archive(
    name = "bazel_skylib",
    sha256 = "1c531376ac7e5a180e0237938a2536de0c54d93f5c278634818e0efc952dd56c",
    urls = [
        "https://github.com/bazelbuild/bazel-skylib/releases/download/1.0.3/bazel-skylib-1.0.3.tar.gz",
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/releases/download/1.0.3/bazel-skylib-1.0.3.tar.gz",
    ],
)

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "npm_install")

npm_install(
    name = "npm",
    package_json = "//:package.json",
    package_lock_json = "//:package-lock.json",
)

node_repositories(
    node_version = "14.17.0",
    package_json = ["//:package.json"],
)

new_local_repository(
    name = "gen",
    build_file = "infra/vpc/BUILD",
    path = ".gen",
)
