load("@npm//@bazel/typescript:index.bzl", "ts_config", "ts_project")

package(default_visibility = ["//visibility:public"])

type_deps = [
    "@npm//@types/jest",
    "@npm//@types/node",
]

dev_deps = [
    "@npm//jest",
    "@npm//ts-jest",
    "@npm//ts-node",
    "@npm//typescript",
]

deps = [
    "@npm//@cdktf/provider-aws",
    "@npm//cdktf",
    "@npm//constructs",
]

ts_config(
    name = "config",
    src = ":tsconfig.json",
)

ts_project(
    name = "build",
    srcs = glob(
        ["**/*.ts"],
        exclude = [
            "**/*spec.ts",
            "__tests__/**/*.*",
            "node_modules/**/*.*",
        ],
    ),
    declaration = True,
    declaration_map = True,
    extends = "//:tsconfig.json",
    source_map = True,
    tsconfig = ":config",
    deps = deps + type_deps + dev_deps,
)

sh_binary(
    name = "deploy",
    srcs = ["scripts/deploy.sh"],
    data = glob(
        ["**/*.ts"],
        exclude = [
            "__tests__/**/*.*",
            "node_modules/**/*.*",
        ],
    ) + [
        "//:cdktf.json",
    ] + deps,
)

sh_binary(
    name = "destroy",
    srcs = ["scripts/destroy.sh"],
    data = glob(
        ["**/*.ts"],
        exclude = [
            "__tests__/**/*.*",
            "node_modules/**/*.*",
        ],
    ) + [
        "//:cdktf.json",
    ] + deps,
)