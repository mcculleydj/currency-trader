package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/mcculleydj/currency-trader/exchange/pkg/common"
	"github.com/mcculleydj/currency-trader/exchange/pkg/store"
)

func mockGetRates(date, source string) (*common.ResponseBody, error) {
	res := &common.ResponseBody{
		Source:    source,
		Date:      date,
		Timestamp: time.Now().Unix(),
		Quotes: map[string]float64{
			"USDUSD": 1,
			"USDEUR": 1,
			"USDJPY": 1,
			"USDGBP": 1,
			"USDAUD": 1,
			"USDCAD": 1,
			"USDCHF": 1,
			"USDCNY": 1,
			"USDHKD": 1,
			"USDNZD": 1,
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
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}

	uri := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/archive?sslmode=disable",
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_PORT"),
	)
	db, err := sql.Open("postgres", uri)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// TODO:
	// - wrap these in a reset cmd line flag

	err = store.DropTables(db)
	if err != nil {
		log.Fatal(err)
	}

	err = store.CreateTables(db)
	if err != nil {
		log.Fatal(err)
	}

	// TODO:
	// - populate last 30 days of USD data
	// - write a catch up function that will look at the latest day and populate until yesterday
	// - catch up function could be run as a cron task to keep the archive up to date

	// YYYY-MM-DD date string for yesterday
	yesterday := time.Now().Add(-24 * time.Hour).Format("2006-01-02")
	res, err := mockGetRates(yesterday, "USD")
	if err != nil {
		log.Fatal(err)
	}

	err = store.InsertRow(db, "USD", res)
	if err != nil {
		log.Fatal(err)
	}
}
