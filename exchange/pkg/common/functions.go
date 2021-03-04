package common

// ValidateCurrency ensures that client supplied
// value for currency matches the supported list
// primarily, this is to avoid SQL injection
// since Go's sql pkg does not support variable table names
func ValidateCurrency(currency string) bool {
	for _, c := range Currencies {
		if currency == c {
			return true
		}
	}
	return false
}
