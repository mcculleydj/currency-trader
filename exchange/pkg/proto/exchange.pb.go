// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.25.0
// 	protoc        v3.14.0
// source: proto/exchange.proto

package proto

import (
	proto "github.com/golang/protobuf/proto"
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

// This is a compile-time assertion that a sufficiently up-to-date version
// of the legacy proto package is being used.
const _ = proto.ProtoPackageIsVersion4

type Currency struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Currency string `protobuf:"bytes,1,opt,name=currency,proto3" json:"currency,omitempty"`
}

func (x *Currency) Reset() {
	*x = Currency{}
	if protoimpl.UnsafeEnabled {
		mi := &file_proto_exchange_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Currency) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Currency) ProtoMessage() {}

func (x *Currency) ProtoReflect() protoreflect.Message {
	mi := &file_proto_exchange_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Currency.ProtoReflect.Descriptor instead.
func (*Currency) Descriptor() ([]byte, []int) {
	return file_proto_exchange_proto_rawDescGZIP(), []int{0}
}

func (x *Currency) GetCurrency() string {
	if x != nil {
		return x.Currency
	}
	return ""
}

type CurrencyPair struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// base currency
	Base string `protobuf:"bytes,1,opt,name=base,proto3" json:"base,omitempty"`
	// quote currency
	Quote string `protobuf:"bytes,2,opt,name=quote,proto3" json:"quote,omitempty"`
}

func (x *CurrencyPair) Reset() {
	*x = CurrencyPair{}
	if protoimpl.UnsafeEnabled {
		mi := &file_proto_exchange_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *CurrencyPair) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*CurrencyPair) ProtoMessage() {}

func (x *CurrencyPair) ProtoReflect() protoreflect.Message {
	mi := &file_proto_exchange_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use CurrencyPair.ProtoReflect.Descriptor instead.
func (*CurrencyPair) Descriptor() ([]byte, []int) {
	return file_proto_exchange_proto_rawDescGZIP(), []int{1}
}

func (x *CurrencyPair) GetBase() string {
	if x != nil {
		return x.Base
	}
	return ""
}

func (x *CurrencyPair) GetQuote() string {
	if x != nil {
		return x.Quote
	}
	return ""
}

type ExchangeRate struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// timestamp this rate was fetched
	Timestamp int64 `protobuf:"varint,1,opt,name=timestamp,proto3" json:"timestamp,omitempty"`
	// base and quote pair described
	Pair *CurrencyPair `protobuf:"bytes,2,opt,name=pair,proto3" json:"pair,omitempty"`
	// quote currency necessary to purchase one unit of base currency
	Rate float64 `protobuf:"fixed64,3,opt,name=rate,proto3" json:"rate,omitempty"`
}

func (x *ExchangeRate) Reset() {
	*x = ExchangeRate{}
	if protoimpl.UnsafeEnabled {
		mi := &file_proto_exchange_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ExchangeRate) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ExchangeRate) ProtoMessage() {}

func (x *ExchangeRate) ProtoReflect() protoreflect.Message {
	mi := &file_proto_exchange_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ExchangeRate.ProtoReflect.Descriptor instead.
func (*ExchangeRate) Descriptor() ([]byte, []int) {
	return file_proto_exchange_proto_rawDescGZIP(), []int{2}
}

func (x *ExchangeRate) GetTimestamp() int64 {
	if x != nil {
		return x.Timestamp
	}
	return 0
}

func (x *ExchangeRate) GetPair() *CurrencyPair {
	if x != nil {
		return x.Pair
	}
	return nil
}

func (x *ExchangeRate) GetRate() float64 {
	if x != nil {
		return x.Rate
	}
	return 0
}

type ExchangeRates struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// effective date
	Date string `protobuf:"bytes,1,opt,name=date,proto3" json:"date,omitempty"`
	// list of rates
	Rates []*ExchangeRate `protobuf:"bytes,2,rep,name=rates,proto3" json:"rates,omitempty"`
}

func (x *ExchangeRates) Reset() {
	*x = ExchangeRates{}
	if protoimpl.UnsafeEnabled {
		mi := &file_proto_exchange_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ExchangeRates) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ExchangeRates) ProtoMessage() {}

func (x *ExchangeRates) ProtoReflect() protoreflect.Message {
	mi := &file_proto_exchange_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ExchangeRates.ProtoReflect.Descriptor instead.
func (*ExchangeRates) Descriptor() ([]byte, []int) {
	return file_proto_exchange_proto_rawDescGZIP(), []int{3}
}

func (x *ExchangeRates) GetDate() string {
	if x != nil {
		return x.Date
	}
	return ""
}

func (x *ExchangeRates) GetRates() []*ExchangeRate {
	if x != nil {
		return x.Rates
	}
	return nil
}

var File_proto_exchange_proto protoreflect.FileDescriptor

var file_proto_exchange_proto_rawDesc = []byte{
	0x0a, 0x14, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x2f, 0x65, 0x78, 0x63, 0x68, 0x61, 0x6e, 0x67, 0x65,
	0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x08, 0x65, 0x78, 0x63, 0x68, 0x61, 0x6e, 0x67, 0x65,
	0x22, 0x26, 0x0a, 0x08, 0x43, 0x75, 0x72, 0x72, 0x65, 0x6e, 0x63, 0x79, 0x12, 0x1a, 0x0a, 0x08,
	0x63, 0x75, 0x72, 0x72, 0x65, 0x6e, 0x63, 0x79, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08,
	0x63, 0x75, 0x72, 0x72, 0x65, 0x6e, 0x63, 0x79, 0x22, 0x38, 0x0a, 0x0c, 0x43, 0x75, 0x72, 0x72,
	0x65, 0x6e, 0x63, 0x79, 0x50, 0x61, 0x69, 0x72, 0x12, 0x12, 0x0a, 0x04, 0x62, 0x61, 0x73, 0x65,
	0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x62, 0x61, 0x73, 0x65, 0x12, 0x14, 0x0a, 0x05,
	0x71, 0x75, 0x6f, 0x74, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x05, 0x71, 0x75, 0x6f,
	0x74, 0x65, 0x22, 0x6c, 0x0a, 0x0c, 0x45, 0x78, 0x63, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x52, 0x61,
	0x74, 0x65, 0x12, 0x1c, 0x0a, 0x09, 0x74, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x03, 0x52, 0x09, 0x74, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70,
	0x12, 0x2a, 0x0a, 0x04, 0x70, 0x61, 0x69, 0x72, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x16,
	0x2e, 0x65, 0x78, 0x63, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x2e, 0x43, 0x75, 0x72, 0x72, 0x65, 0x6e,
	0x63, 0x79, 0x50, 0x61, 0x69, 0x72, 0x52, 0x04, 0x70, 0x61, 0x69, 0x72, 0x12, 0x12, 0x0a, 0x04,
	0x72, 0x61, 0x74, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x01, 0x52, 0x04, 0x72, 0x61, 0x74, 0x65,
	0x22, 0x51, 0x0a, 0x0d, 0x45, 0x78, 0x63, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x52, 0x61, 0x74, 0x65,
	0x73, 0x12, 0x12, 0x0a, 0x04, 0x64, 0x61, 0x74, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52,
	0x04, 0x64, 0x61, 0x74, 0x65, 0x12, 0x2c, 0x0a, 0x05, 0x72, 0x61, 0x74, 0x65, 0x73, 0x18, 0x02,
	0x20, 0x03, 0x28, 0x0b, 0x32, 0x16, 0x2e, 0x65, 0x78, 0x63, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x2e,
	0x45, 0x78, 0x63, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x52, 0x61, 0x74, 0x65, 0x52, 0x05, 0x72, 0x61,
	0x74, 0x65, 0x73, 0x32, 0xc3, 0x01, 0x0a, 0x08, 0x45, 0x78, 0x63, 0x68, 0x61, 0x6e, 0x67, 0x65,
	0x12, 0x39, 0x0a, 0x07, 0x47, 0x65, 0x74, 0x52, 0x61, 0x74, 0x65, 0x12, 0x16, 0x2e, 0x65, 0x78,
	0x63, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x2e, 0x43, 0x75, 0x72, 0x72, 0x65, 0x6e, 0x63, 0x79, 0x50,
	0x61, 0x69, 0x72, 0x1a, 0x16, 0x2e, 0x65, 0x78, 0x63, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x2e, 0x45,
	0x78, 0x63, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x52, 0x61, 0x74, 0x65, 0x12, 0x37, 0x0a, 0x08, 0x47,
	0x65, 0x74, 0x52, 0x61, 0x74, 0x65, 0x73, 0x12, 0x12, 0x2e, 0x65, 0x78, 0x63, 0x68, 0x61, 0x6e,
	0x67, 0x65, 0x2e, 0x43, 0x75, 0x72, 0x72, 0x65, 0x6e, 0x63, 0x79, 0x1a, 0x17, 0x2e, 0x65, 0x78,
	0x63, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x2e, 0x45, 0x78, 0x63, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x52,
	0x61, 0x74, 0x65, 0x73, 0x12, 0x43, 0x0a, 0x12, 0x47, 0x65, 0x74, 0x48, 0x69, 0x73, 0x74, 0x6f,
	0x72, 0x69, 0x63, 0x61, 0x6c, 0x52, 0x61, 0x74, 0x65, 0x73, 0x12, 0x12, 0x2e, 0x65, 0x78, 0x63,
	0x68, 0x61, 0x6e, 0x67, 0x65, 0x2e, 0x43, 0x75, 0x72, 0x72, 0x65, 0x6e, 0x63, 0x79, 0x1a, 0x17,
	0x2e, 0x65, 0x78, 0x63, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x2e, 0x45, 0x78, 0x63, 0x68, 0x61, 0x6e,
	0x67, 0x65, 0x52, 0x61, 0x74, 0x65, 0x73, 0x30, 0x01, 0x42, 0x3a, 0x5a, 0x38, 0x67, 0x69, 0x74,
	0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x6d, 0x63, 0x63, 0x75, 0x6c, 0x6c, 0x65, 0x79,
	0x64, 0x6a, 0x2f, 0x63, 0x75, 0x72, 0x72, 0x65, 0x6e, 0x63, 0x79, 0x2d, 0x74, 0x72, 0x61, 0x64,
	0x65, 0x72, 0x2f, 0x65, 0x78, 0x63, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x2f, 0x70, 0x6b, 0x67, 0x2f,
	0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_proto_exchange_proto_rawDescOnce sync.Once
	file_proto_exchange_proto_rawDescData = file_proto_exchange_proto_rawDesc
)

func file_proto_exchange_proto_rawDescGZIP() []byte {
	file_proto_exchange_proto_rawDescOnce.Do(func() {
		file_proto_exchange_proto_rawDescData = protoimpl.X.CompressGZIP(file_proto_exchange_proto_rawDescData)
	})
	return file_proto_exchange_proto_rawDescData
}

var file_proto_exchange_proto_msgTypes = make([]protoimpl.MessageInfo, 4)
var file_proto_exchange_proto_goTypes = []interface{}{
	(*Currency)(nil),      // 0: exchange.Currency
	(*CurrencyPair)(nil),  // 1: exchange.CurrencyPair
	(*ExchangeRate)(nil),  // 2: exchange.ExchangeRate
	(*ExchangeRates)(nil), // 3: exchange.ExchangeRates
}
var file_proto_exchange_proto_depIdxs = []int32{
	1, // 0: exchange.ExchangeRate.pair:type_name -> exchange.CurrencyPair
	2, // 1: exchange.ExchangeRates.rates:type_name -> exchange.ExchangeRate
	1, // 2: exchange.Exchange.GetRate:input_type -> exchange.CurrencyPair
	0, // 3: exchange.Exchange.GetRates:input_type -> exchange.Currency
	0, // 4: exchange.Exchange.GetHistoricalRates:input_type -> exchange.Currency
	2, // 5: exchange.Exchange.GetRate:output_type -> exchange.ExchangeRate
	3, // 6: exchange.Exchange.GetRates:output_type -> exchange.ExchangeRates
	3, // 7: exchange.Exchange.GetHistoricalRates:output_type -> exchange.ExchangeRates
	5, // [5:8] is the sub-list for method output_type
	2, // [2:5] is the sub-list for method input_type
	2, // [2:2] is the sub-list for extension type_name
	2, // [2:2] is the sub-list for extension extendee
	0, // [0:2] is the sub-list for field type_name
}

func init() { file_proto_exchange_proto_init() }
func file_proto_exchange_proto_init() {
	if File_proto_exchange_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_proto_exchange_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Currency); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_proto_exchange_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*CurrencyPair); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_proto_exchange_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ExchangeRate); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_proto_exchange_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ExchangeRates); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_proto_exchange_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   4,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_proto_exchange_proto_goTypes,
		DependencyIndexes: file_proto_exchange_proto_depIdxs,
		MessageInfos:      file_proto_exchange_proto_msgTypes,
	}.Build()
	File_proto_exchange_proto = out.File
	file_proto_exchange_proto_rawDesc = nil
	file_proto_exchange_proto_goTypes = nil
	file_proto_exchange_proto_depIdxs = nil
}
