package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net"
	"strings"
	"time"

	_ "github.com/lib/pq"

	"github.com/joho/godotenv"
	"github.com/mcculleydj/currency-trader/exchange/pkg/common"
	"github.com/mcculleydj/currency-trader/exchange/pkg/proto"
	"github.com/mcculleydj/currency-trader/exchange/pkg/rates"
	"github.com/mcculleydj/currency-trader/exchange/pkg/store"
	"google.golang.org/grpc"
)

type exchangeServer struct {
	proto.UnimplementedExchangeServer
}

func (s *exchangeServer) GetRate(ctx context.Context, req *proto.RateRequest) (*proto.ExchangeRate, error) {
	ts, rate, err := rates.GetRate(req.Base, req.Quote)
	if err != nil {
		return nil, err
	}
	xr := &proto.ExchangeRate{
		Timestamp: ts,
		Base:      req.Base,
		Quote:     req.Quote,
		Rate:      rate,
	}
	return xr, nil
}

func (s *exchangeServer) GetRates(ctx context.Context, req *proto.RatesRequest) (*proto.ExchangeRates, error) {
	ts, quotes, err := rates.GetRates(req.Currency, 1)
	if err != nil {
		return nil, err
	}
	xrs := []*proto.ExchangeRate{}
	for k, v := range quotes {
		quote := strings.TrimPrefix(k, req.Currency)
		xr := &proto.ExchangeRate{
			Timestamp: ts,
			Base:      req.Currency,
			Quote:     quote,
			Rate:      v,
		}
		xrs = append(xrs, xr)
	}
	date := time.Now().Format("2006-01-02")
	return &proto.ExchangeRates{
		Date:  date,
		Rates: xrs,
	}, nil
}

func (s *exchangeServer) GetHistoricalRates(req *proto.RatesRequest, stream proto.Exchange_GetHistoricalRatesServer) error {
	rows, err := store.GetRows(req.Currency)
	if err != nil {
		return err
	}
	for rows.Next() {
		ar := common.ArchiveRow{}
		err := rows.StructScan(&ar)
		if err != nil {
			return err
		}
		// TODO: maybe storing raw JSON makes more sense?
		xrs := []*proto.ExchangeRate{}
		for _, currency := range common.Currencies {
			rate, err := ar.Get(currency)
			if err != nil {
				return err
			}
			// ts is not meaningful for historical rates
			xr := &proto.ExchangeRate{
				Timestamp: 0,
				Base:      req.Currency,
				Quote:     currency,
				Rate:      rate,
			}
			xrs = append(xrs, xr)
		}
		stream.Send(&proto.ExchangeRates{
			Date:  ar.Date.Format("2006-01-02"),
			Rates: xrs,
		})
	}
	return io.EOF
}

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}

	err = store.RedisConnect()
	if err != nil {
		log.Fatal(err)
	}
	defer store.RedisClose()

	err = store.DBConnect()
	if err != nil {
		log.Fatal(err)
	}
	defer store.DBClose()

	lis, err := net.Listen("tcp", "localhost:4000")
	if err != nil {
		log.Fatal(err)
	}

	grpcServer := grpc.NewServer()
	proto.RegisterExchangeServer(grpcServer, &exchangeServer{})
	fmt.Println("Starting gRPC server on port 4000...")
	grpcServer.Serve(lis)
}
