package store

import (
	"strconv"
	"time"

	"github.com/go-redis/redis"
	"github.com/mcculleydj/currency-trader/exchange/pkg/common"
)

var client *redis.Client

// RedisConnect provides an interface to Redis
func RedisConnect() error {
	client = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})
	_, err := client.Ping().Result()
	return err
}

// RedisClose terminates the connection to Redis
func RedisClose() error {
	return client.Close()
}

// Refresh sets the live key with the latest timestamp
// and populates the hash map with the latest data
func Refresh(res *common.ResponseBody) error {
	// Currency Layer refereshes every 60 seconds
	// however, cannot afford to make that many API calls
	// so expiry is set for 1h
	expiry := time.Duration(1 * time.Hour)
	err := client.Set(res.Source+"_live", res.Timestamp, expiry).Err()
	if err != nil {
		return err
	}
	return client.HMSet(res.Source, res.CastQuotes()).Err()
}

// Fetch gets the timestamp and exchange rates from Redis
func Fetch(currency string) (int64, map[string]float64, error) {
	timestamp, err := client.Get(currency + "_live").Result()
	if err != nil {
		return 0, nil, err
	}
	ts, err := strconv.ParseInt(timestamp, 10, 64)
	if err != nil {
		return 0, nil, err
	}
	quotes, err := client.HGetAll(currency).Result()
	if err != nil {
		return 0, nil, err
	}
	m := map[string]float64{}
	for k, v := range quotes {
		f, err := strconv.ParseFloat(v, 64)
		if err != nil {
			return 0, nil, err
		}
		m[k] = f
	}
	return ts, m, nil
}
