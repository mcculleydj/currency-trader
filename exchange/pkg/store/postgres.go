package store

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/mcculleydj/currency-trader/exchange/pkg/common"
)

// DropTables removes all tables from the archive DB
func DropTables(db *sql.DB) error {
	for _, currency := range common.Currencies {
		query := fmt.Sprintf("DROP TABLE IF EXISTS %s", currency)
		_, err := db.Exec(query)
		if err != nil {
			return err
		}
	}
	return nil
}

// CreateTables creates a table for each currency in the archive DB
func CreateTables(db *sql.DB) error {
	for _, currency := range common.Currencies {
		query := fmt.Sprintf(
			"CREATE TABLE IF NOT EXISTS %s (effective_date DATE PRIMARY KEY, %s)",
			currency,
			strings.Join(common.Currencies, " DOUBLE PRECISION, ")+" DOUBLE PRECISION",
		)
		_, err := db.Exec(query)
		if err != nil {
			return err
		}
	}
	return nil
}

// InsertRow populates a row in the archive DB
func InsertRow(db *sql.DB, source string, data *common.ResponseBody) error {
	query := fmt.Sprintf(`
	INSERT INTO %s (effective_date, %s)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
	`, source, strings.Join(common.Currencies, ", "))
	values := []interface{}{data.Date}

	for _, currency := range common.Currencies {
		values = append(values, data.Quotes[source+currency])
	}

	_, err := db.Exec(query, values...)
	return err
}
