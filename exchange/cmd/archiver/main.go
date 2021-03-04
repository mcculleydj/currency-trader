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

// get the latest date stored
// and make API requests to populate
// all days up to yesterday
func catchUp(source string) error {
	latest, err := store.GetLatest("USD")
	if err != nil {
		return err
	}
	dayBeforeYesterday := time.Now().Add(-48 * time.Hour)
	// TODO: could be a DST bug in this
	// easy enough to avoid by running catchUp at noon
	for latest.Before(dayBeforeYesterday) {
		latest = latest.Add(24 * time.Hour)
		date := latest.Format("2006-01-02")
		// replace with getRates to make actual API calls
		// paid plan allows you to make a single request
		// to get all rates in a certain date range
		res, err := mockGetRates(date, source)
		if err != nil {
			return err
		}
		err = store.InsertRow(source, res)
		if err != nil {
			return err
		}
	}
	return nil
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

		// YYYY-MM-DD date string for 30 days ago
		date := time.Now().Add(-1 * 24 * 30 * time.Hour).Format("2006-01-02")

		// seed DB with an initial row to test catchUp
		res, err := mockGetRates(date, "USD")
		if err != nil {
			log.Fatal(err)
		}

		err = store.InsertRow("USD", res)
		if err != nil {
			log.Fatal(err)
		}
	}

	err = catchUp("USD")
	if err != nil {
		log.Fatal(err)
	}
}
