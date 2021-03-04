package main

import (
	"context"
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/mcculleydj/currency-trader/exchange/pkg/proto"
	"github.com/mcculleydj/currency-trader/exchange/pkg/rates"
	"github.com/mcculleydj/currency-trader/exchange/pkg/store"
)

type exchangeServer struct {
	proto.UnimplementedExchangeServer
}

func (s *exchangeServer) GetRate(ctx context.Context, pair *proto.CurrencyPair) (*proto.ExchangeRate, error) {
	ts, rate, err := rates.GetRate(pair.Base, pair.Quote, 1)
	if err != nil {
		return nil, err
	}
	xr := &proto.ExchangeRate{
		Timestamp: ts,
		Pair:      pair,
		Rate:      rate,
	}
	return xr, nil
}

// TODO
func (s *exchangeServer) GetRates(ctx context.Context, currency *proto.Currency) (*proto.ExchangeRates, error) {
	return nil, nil
}

// TODO
func (s *exchangeServer) GetHistoricalRates(currency *proto.Currency, stream proto.Exchange_GetHistoricalRatesServer) error {
	return nil
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

	fmt.Println(rates.GetRate("USD", "JPY", 1))
}
