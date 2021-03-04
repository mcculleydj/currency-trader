package common

// ResponseBody provides an unmarshal struct
// for requests to the Currency Layer API
type ResponseBody struct {
	Source    string             `json:"source"`
	Date      string             `json:"date"`
	Timestamp int64              `json:"timestamp"`
	Quotes    map[string]float64 `json:"quotes"`
}

func (r *ResponseBody) CastQuotes() map[string]interface{} {
	m := map[string]interface{}{}
	for currency, value := range r.Quotes {
		m[currency] = value
	}
	return m
}