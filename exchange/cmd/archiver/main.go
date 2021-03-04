package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/mcculleydj/currency-trader/exchange/pkg/common"
	"github.com/mcculleydj/currency-trader/exchange/pkg/store"
	flag "github.com/spf13/pflag"
)

func mockGetRates(date, source string) (*common.ResponseBody, error) {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	res := &common.ResponseBody{
		Source:    source,
		Date:      date,
		Timestamp: time.Now().Unix(),
		Quotes: map[string]float64{
			"USDUSD": 1,
			"USDEUR": r.Float64() * 10,
			"USDJPY": r.Float64() * 10,
			"USDGBP": r.Float64() * 10,
			"USDAUD": r.Float64() * 10,
			"USDCAD": r.Float64() * 10,
			"USDCHF": r.Float64() * 10,
			"USDCNY": r.Float64() * 10,
			"USDHKD": r.Float64() * 10,
			"USDNZD": r.Float64() * 10,
		},
	}
	return res, nil
}

// retrieves the rates for a given base currency on a given date
// from Currency Trader API
func getRates(date, source string) (*common.ResponseBody, error) {

	// sources other than USD require a paid plan
	// https requires a paid plan -- access key is sent in the clear
	uri := fmt.Sprintf(
		"http://api.currencylayer.com/historical?date=%s&source=%s&currencies=%s&access_key=%s",
		date,
		source,
		strings.Join(common.Currencies, ","),
		os.Getenv("CURRENCY_LAYER_ACCESS_KEY"),
	)

	res, err := http.Get(uri)
	if err != nil {
		return nil, err
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	data := new(common.ResponseBody)
	err = json.Unmarshal(body, data)

	return data, err
}

func main() {
	var reset *bool = flag.Bool("reset", false, "drop and recreate tables")
	flag.Parse()

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}

	err = store.DBConnect()
	if err != nil {
		log.Fatal(err)
	}
	defer store.DBClose()

	if *reset {
		err = store.DropTables()
		if err != nil {
			log.Fatal(err)
		}

		err = store.CreateTables()
		if err != nil {
			log.Fatal(err)
		}
	}

	// TODO:
	// - populate last 30 days of USD data
	// - write a catch up function that will look at the latest day and populate until yesterday
	// - catch up function could be run as a cron task to keep the archive up to date

	// YYYY-MM-DD date string for yesterday
	// yesterday := time.Now().Add(-24 * time.Hour).Format("2006-01-02")
	// res, err := mockGetRates(yesterday, "USD")
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// err = store.InsertRow("USD", res)
	// if err != nil {
	// 	log.Fatal(err)
	// }
}
