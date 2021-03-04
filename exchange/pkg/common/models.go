package common

import (
	"errors"
	"time"
)

// ResponseBody provides an unmarshal struct
// for requests to the Currency Layer API
type ResponseBody struct {
	Source    string             `json:"source"`
	Date      string             `json:"date"`
	Timestamp int64              `json:"timestamp"`
	Quotes    map[string]float64 `json:"quotes"`
}

// CastQuotes converts a map[string]float64
// to a map[string]interface{} for storage in Redis
func (r *ResponseBody) CastQuotes() map[string]interface{} {
	m := map[string]interface{}{}
	for currency, value := range r.Quotes {
		m[currency] = value
	}
	return m
}

// ArchiveRow provides an unmarshal struct
// for data stored in the archive DB
type ArchiveRow struct {
	Date time.Time `db:"effective_date"`
	USD  float64   `db:"usd"`
	EUR  float64   `db:"eur"`
	JPY  float64   `db:"jpy"`
	GBP  float64   `db:"gbp"`
	AUD  float64   `db:"aud"`
	CAD  float64   `db:"cad"`
	CHF  float64   `db:"chf"`
	CNY  float64   `db:"cny"`
	HKD  float64   `db:"hkd"`
	NZD  float64   `db:"nzd"`
}

// Get provides a map-like accessor to ArchiveRow struct data
func (ar *ArchiveRow) Get(currency string) (float64, error) {
	switch currency {
	case "USD":
		return ar.USD, nil
	case "EUR":
		return ar.EUR, nil
	case "JPY":
		return ar.JPY, nil
	case "GBP":
		return ar.GBP, nil
	case "AUD":
		return ar.AUD, nil
	case "CAD":
		return ar.CAD, nil
	case "CHF":
		return ar.CHF, nil
	case "CNY":
		return ar.CNY, nil
	case "HKD":
		return ar.HKD, nil
	case "NZD":
		return ar.NZD, nil
	default:
		return 0, errors.New("invalid currency")
	}
}
