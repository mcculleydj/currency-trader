package rates

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/go-redis/redis"
	"github.com/mcculleydj/currency-trader/exchange/pkg/common"
	"github.com/mcculleydj/currency-trader/exchange/pkg/store"
)

var lock chan struct{}

func init() {
	// normally would have a lock per currency
	// single channel, since USD is the only supported source
	// lock prevents multiple clients from triggering simultaneous
	// Currency Layer API requests to refresh Redis data
	lock = make(chan struct{}, 1)
	lock <- struct{}{}
}

// mockFetch simulates an API call to the live endpoint
func mockFetch(source string) (*common.ResponseBody, error) {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	res := &common.ResponseBody{
		Source:    source,
		Timestamp: time.Now().Unix(),
		Quotes: map[string]float64{
			source + "USD": 1,
			source + "EUR": r.Float64() * 10,
			source + "JPY": r.Float64() * 10,
			source + "GBP": r.Float64() * 10,
			source + "AUD": r.Float64() * 10,
			source + "CAD": r.Float64() * 10,
			source + "CHF": r.Float64() * 10,
			source + "CNY": r.Float64() * 10,
			source + "HKD": r.Float64() * 10,
			source + "NZD": r.Float64() * 10,
		},
	}
	return res, nil
}

// TODO: http.Client aligning timeout with sleep
// fetch makes an API call to the live endpoint
// to fetch  latest data for source currency
func fetch(source string) (*common.ResponseBody, error) {
	// sources other than USD require a paid plan
	// https requires a paid plan -- access key is sent in the clear
	uri := fmt.Sprintf(
		"http://api.currencylayer.com/live?source=%s&currencies=%s&access_key=%s",
		source,
		strings.Join(common.Currencies, ","),
		os.Getenv("CURRENCY_LAYER_ACCESS_KEY"),
	)

	res, err := http.Get(uri)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	data := new(common.ResponseBody)
	err = json.Unmarshal(body, data)

	return data, err
}

// use USD as an intermediary because source switching is not
// supported by free tier of Currency Trader
// note that this is not a true exchange rate
// nor is this function necessary once source switching is supported
func convert(baseCurrency, quoteCurrency string, quotes map[string]float64) float64 {
	return quotes["USD"+quoteCurrency] / quotes["USD"+baseCurrency]
}

// see convert comments above
func convertMap(source string, quotes map[string]float64) map[string]float64 {
	m := map[string]float64{}
	baseValue := quotes["USD"+source]
	for k, v := range quotes {
		quoteCurrency := strings.TrimPrefix(k, "USD")
		m[source+quoteCurrency] = v / baseValue
	}
	return m
}

// GetRate returns the timestamp and exchange rate
// given a base and quote currency pair
func GetRate(baseCurrency, quoteCurrency string) (int64, float64, error) {
	ts, quotes, err := GetRates(baseCurrency, 1)
	if err != nil {
		return 0, 0, err
	}
	// not a necessary step if source switching is supported
	if baseCurrency != "USD" {
		return ts, convert(baseCurrency, quoteCurrency, quotes), nil
	}
	return ts, quotes[baseCurrency+quoteCurrency], nil
}

// GetRates returns the timestamp and all exchange rates
// for a given a source currency (only USD supported by free tier)
func GetRates(source string, attempt int) (int64, map[string]float64, error) {
	// only wait on Redis refresh for 3 recursive calls (1.5 s)
	if attempt >= 3 {
		return 0, nil, errors.New("max retries")
	}
	// would normally pass source
	// but only USD supported in free tier
	// all exchange rates will be faked using USD as an intermediary
	ts, quotes, err := store.Fetch("USD")
	if err == redis.Nil {
		select {
		// ensures only one API request in flight at a time
		// all other threads will sleep and retry
		case <-lock:
			defer func() {
				lock <- struct{}{}
			}()
			// would normally pass baseCurrency
			// but only USD supported in free tier
			res, err := mockFetch("USD")

			// uncomment to make an actual API request
			// res, err := fetch("USD")

			if err != nil {
				return 0, nil, err
			}
			err = store.Refresh(res)
			if err != nil {
				return 0, nil, err
			}
			ts = res.Timestamp
			quotes = res.Quotes
		default:
			time.Sleep(500 * time.Millisecond)
			return GetRates(source, attempt+1)
		}
	} else if err != nil {
		// non-nil Redis error
		return 0, nil, err
	}

	// not a necessary step if source switching is supported
	if source != "USD" {
		return ts, convertMap(source, quotes), nil
	}

	return ts, quotes, nil
}
