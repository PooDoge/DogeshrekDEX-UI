import { Currency, CAVAX, Token } from 'dogeshrek-sdk'

export function currencyId(currency: Currency): string {
  if (currency === CAVAX) return 'WDOGE'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
