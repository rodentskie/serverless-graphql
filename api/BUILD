load("@build_bazel_rules_nodejs//:index.bzl", "js_library", "npm_package_bin")
load("@npm//@bazel/typescript:index.bzl", "ts_config", "ts_project")

package(default_visibility = ["//visibility:public"])

deps = [
    "@npm//apollo-server-core",
    "@npm//apollo-server-errors",
    "@npm//apollo-server-lambda",
    "@npm//async-exit-hook",
    "@npm//bcrypt",
    "@npm//dotenv",
    "@npm//express",
    "@npm//graphql",
    "@npm//jsonwebtoken",
    "@npm//mongoose",
]

type_deps = [
    "@npm//@types/async-exit-hook",
    "@npm//@types/bcrypt",
    "@npm//@types/chai",
    "@npm//@types/faker",
    "@npm//@types/jest",
    "@npm//@types/jsonwebtoken",
    "@npm//@types/koa",
    "@npm//@types/mocha",
    "@npm//@types/node",
    "@npm//@types/ramda",
    "@npm//@types/supertest",
]

dev_deps = [
    "@npm//@bazel/typescript",
    "@npm//@commitlint/cli",
    "@npm//@commitlint/config-conventional",
    "@npm//@typescript-eslint/eslint-plugin",
    "@npm//@typescript-eslint/parser",
    "@npm//eslint",
    "@npm//eslint-config-airbnb-typescript",
    "@npm//eslint-config-prettier",
    "@npm//eslint-plugin-import",
    "@npm//eslint-plugin-prettier",
    "@npm//husky",
    "@npm//prettier",
    "@npm//ts-node",
    "@npm//typescript",
    "@npm//serverless-offline",
    "@npm//serverless-plugin-typescript",
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
            "tests/**/*.*",
        ],
    ),
    declaration = True,
    declaration_map = True,
    extends = "//:tsconfig.json",
    source_map = True,
    tsconfig = ":config",
    deps = deps + type_deps + dev_deps,
)

npm_package_bin(
    name = "lint",
    args = [
        ".",
        "--ext .ts",
    ],
    data = glob(["**/*.ts"]) + deps + type_deps + dev_deps + [
        "//:package.json",
        "//:tsconfig.json",
        "//:.eslintrc",
        "//:.eslintignore",
    ],
    output_dir = True,
    tool = "@npm//eslint/bin:eslint",
)
