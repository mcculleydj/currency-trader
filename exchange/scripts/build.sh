#!/bin/bash

PREFIX=github.com/mcculleydj/currency-trader/exchange/pkg
BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

PROTO_DEST=./pkg
mkdir -p ${PROTO_DEST}

protoc \
  --go_out=${PROTO_DEST} \
  --go-grpc_out=${PROTO_DEST} \
  --go_opt=module=${PREFIX} \
  --go-grpc_opt=module=${PREFIX} \
  proto/exchange.proto