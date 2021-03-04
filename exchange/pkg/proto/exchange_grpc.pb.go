// Code generated by protoc-gen-go-grpc. DO NOT EDIT.

package proto

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// ExchangeClient is the client API for Exchange service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type ExchangeClient interface {
	// current exchange rate given any two supported currencies
	Rate(ctx context.Context, in *CurrencyPair, opts ...grpc.CallOption) (*ExchangeRate, error)
	// list of current exchange rates for base currency
	Rates(ctx context.Context, in *Currency, opts ...grpc.CallOption) (*ExchangeRates, error)
	// will use stream for practice
	HistoricalRates(ctx context.Context, in *Currency, opts ...grpc.CallOption) (Exchange_HistoricalRatesClient, error)
}

type exchangeClient struct {
	cc grpc.ClientConnInterface
}

func NewExchangeClient(cc grpc.ClientConnInterface) ExchangeClient {
	return &exchangeClient{cc}
}

func (c *exchangeClient) Rate(ctx context.Context, in *CurrencyPair, opts ...grpc.CallOption) (*ExchangeRate, error) {
	out := new(ExchangeRate)
	err := c.cc.Invoke(ctx, "/exchange.Exchange/Rate", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *exchangeClient) Rates(ctx context.Context, in *Currency, opts ...grpc.CallOption) (*ExchangeRates, error) {
	out := new(ExchangeRates)
	err := c.cc.Invoke(ctx, "/exchange.Exchange/Rates", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *exchangeClient) HistoricalRates(ctx context.Context, in *Currency, opts ...grpc.CallOption) (Exchange_HistoricalRatesClient, error) {
	stream, err := c.cc.NewStream(ctx, &Exchange_ServiceDesc.Streams[0], "/exchange.Exchange/HistoricalRates", opts...)
	if err != nil {
		return nil, err
	}
	x := &exchangeHistoricalRatesClient{stream}
	if err := x.ClientStream.SendMsg(in); err != nil {
		return nil, err
	}
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	return x, nil
}

type Exchange_HistoricalRatesClient interface {
	Recv() (*ExchangeRates, error)
	grpc.ClientStream
}

type exchangeHistoricalRatesClient struct {
	grpc.ClientStream
}

func (x *exchangeHistoricalRatesClient) Recv() (*ExchangeRates, error) {
	m := new(ExchangeRates)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

// ExchangeServer is the server API for Exchange service.
// All implementations must embed UnimplementedExchangeServer
// for forward compatibility
type ExchangeServer interface {
	// current exchange rate given any two supported currencies
	Rate(context.Context, *CurrencyPair) (*ExchangeRate, error)
	// list of current exchange rates for base currency
	Rates(context.Context, *Currency) (*ExchangeRates, error)
	// will use stream for practice
	HistoricalRates(*Currency, Exchange_HistoricalRatesServer) error
	mustEmbedUnimplementedExchangeServer()
}

// UnimplementedExchangeServer must be embedded to have forward compatible implementations.
type UnimplementedExchangeServer struct {
}

func (UnimplementedExchangeServer) Rate(context.Context, *CurrencyPair) (*ExchangeRate, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Rate not implemented")
}
func (UnimplementedExchangeServer) Rates(context.Context, *Currency) (*ExchangeRates, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Rates not implemented")
}
func (UnimplementedExchangeServer) HistoricalRates(*Currency, Exchange_HistoricalRatesServer) error {
	return status.Errorf(codes.Unimplemented, "method HistoricalRates not implemented")
}
func (UnimplementedExchangeServer) mustEmbedUnimplementedExchangeServer() {}

// UnsafeExchangeServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to ExchangeServer will
// result in compilation errors.
type UnsafeExchangeServer interface {
	mustEmbedUnimplementedExchangeServer()
}

func RegisterExchangeServer(s grpc.ServiceRegistrar, srv ExchangeServer) {
	s.RegisterService(&Exchange_ServiceDesc, srv)
}

func _Exchange_Rate_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CurrencyPair)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ExchangeServer).Rate(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/exchange.Exchange/Rate",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ExchangeServer).Rate(ctx, req.(*CurrencyPair))
	}
	return interceptor(ctx, in, info, handler)
}

func _Exchange_Rates_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Currency)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ExchangeServer).Rates(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/exchange.Exchange/Rates",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ExchangeServer).Rates(ctx, req.(*Currency))
	}
	return interceptor(ctx, in, info, handler)
}

func _Exchange_HistoricalRates_Handler(srv interface{}, stream grpc.ServerStream) error {
	m := new(Currency)
	if err := stream.RecvMsg(m); err != nil {
		return err
	}
	return srv.(ExchangeServer).HistoricalRates(m, &exchangeHistoricalRatesServer{stream})
}

type Exchange_HistoricalRatesServer interface {
	Send(*ExchangeRates) error
	grpc.ServerStream
}

type exchangeHistoricalRatesServer struct {
	grpc.ServerStream
}

func (x *exchangeHistoricalRatesServer) Send(m *ExchangeRates) error {
	return x.ServerStream.SendMsg(m)
}

// Exchange_ServiceDesc is the grpc.ServiceDesc for Exchange service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Exchange_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "exchange.Exchange",
	HandlerType: (*ExchangeServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "Rate",
			Handler:    _Exchange_Rate_Handler,
		},
		{
			MethodName: "Rates",
			Handler:    _Exchange_Rates_Handler,
		},
	},
	Streams: []grpc.StreamDesc{
		{
			StreamName:    "HistoricalRates",
			Handler:       _Exchange_HistoricalRates_Handler,
			ServerStreams: true,
		},
	},
	Metadata: "proto/exchange.proto",
}
